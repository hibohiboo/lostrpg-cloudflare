import { zValidator } from '@hono/zod-validator';
import { createBossSchema, getBossSchema, updateBossSchema } from '@lostrpg/schemas';
import bcrypt from 'bcryptjs';
import { and, desc, eq, ilike, sql } from 'drizzle-orm';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';
import { getDb } from '../lib/db/connection';
import { bosses } from '../lib/db/schema';
import { validateImageFile, uploadImageToR2 } from '../lib/r2/image-upload';
import { requirePasswordAuth } from '../middleware/auth';
import type { Env } from '../types/cloudflare';

const listBossesQuerySchema = z.object({
  offset: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  name: z.string().trim().optional(),
});

export const bossesRouter = new Hono<{ Bindings: Env }>()
  // Get bosses (paginated, optionally filtered by name)
  .get('/', zValidator('query', listBossesQuerySchema), async (c) => {
    const { offset, limit, name } = c.req.valid('query');

    const bossList = await getDb()
      .select({
        id: bosses.id,
        name: bosses.name,
        createdAt: bosses.createdAt,
        updatedAt: bosses.updatedAt,
        imageUrl: sql<string | null>`${bosses.data}->>'imageUrl'`,
      })
      .from(bosses)
      .where(
        and(
          name ? ilike(bosses.name, `%${name}%`) : undefined,
          // 「一覧に表示しない」がONのヌシは一覧から除外する（詳細への直接リンクは可）
          sql`COALESCE((${bosses.data}->>'hideFromList')::boolean, false) = false`,
        ),
      )
      .orderBy(desc(bosses.updatedAt))
      .limit(limit + 1)
      .offset(offset);

    const hasMore = bossList.length > limit;
    const data = bossList.slice(0, limit).map((boss) => ({
      id: boss.id,
      name: boss.name,
      createdAt: boss.createdAt,
      updatedAt: boss.updatedAt,
      imageUrl: boss.imageUrl ?? undefined,
    }));

    return c.json({ data, hasMore });
  })
  // Create new boss
  .post('/', zValidator('json', createBossSchema), async (c) => {
    const bossData = c.req.valid('json');

    // パスワードハッシュ化
    let passwordHash: string | undefined;
    if (bossData.password) {
      passwordHash = await bcrypt.hash(bossData.password, 12);
    }

    // パスワードを除いたデータを準備
    // eslint-disable-next-line sonarjs/no-unused-vars
    const { password: _password, ...dataWithoutPassword } = bossData;

    // データベースに保存
    const [newBoss] = await getDb()
      .insert(bosses)
      .values({
        name: bossData.name,
        data: dataWithoutPassword,
        passwordHash,
      })
      .returning();

    const url = `/boss/${newBoss.id}`;

    return c.json({ id: newBoss.id, url }, 201);
  })

  // Get boss by ID
  .get(
    '/:id',
    zValidator(
      'param',
      z.object({
        id: z.uuid('Invalid ID format'),
      }),
    ),
    async (c) => {
      const { id } = c.req.valid('param');

      const [boss] = await getDb().select().from(bosses).where(eq(bosses.id, id));

      if (!boss) {
        throw new HTTPException(404, { message: 'Boss not found' });
      }

      const data = getBossSchema.parse(boss.data);

      return c.json({
        id: boss.id,
        name: boss.name,
        createdAt: boss.createdAt,
        updatedAt: boss.updatedAt,
        isPasswordProtected: !!boss.passwordHash,
        data,
      });
    },
  )

  // Update boss
  .put(
    '/:id',
    zValidator(
      'param',
      z.object({
        id: z.string(),
      }),
    ),
    zValidator('json', updateBossSchema),
    async (c) => {
      const { id } = c.req.valid('param');
      const requestBody = c.req.valid('json');

      const [boss] = await getDb().select().from(bosses).where(eq(bosses.id, id));

      if (!boss) {
        throw new HTTPException(404, { message: 'Boss not found' });
      }

      // パスワード認証
      await requirePasswordAuth(boss, requestBody.password);

      // パスワードを除いたデータを準備
      // eslint-disable-next-line sonarjs/no-unused-vars
      const { password: _password, ...dataWithoutPassword } = requestBody;

      // 更新データの構築
      const updateData: {
        data: object;
        name: string;
        updatedAt: Date;
        passwordHash?: string;
      } = {
        data: dataWithoutPassword,
        name: requestBody.name || boss.name,
        updatedAt: new Date(),
      };

      // パスワードが未設定で、新しくパスワードを設定する場合のみハッシュ化
      if (!boss.passwordHash && requestBody.password) {
        updateData.passwordHash = await bcrypt.hash(requestBody.password, 12);
      }
      // 既にパスワードが設定されている場合は、passwordHashは更新しない

      // データベースを更新
      const [updatedBoss] = await getDb()
        .update(bosses)
        .set(updateData)
        .where(eq(bosses.id, id))
        .returning();

      return c.json(
        {
          id: updatedBoss.id,
          name: updatedBoss.name,
          createdAt: updatedBoss.createdAt,
          updatedAt: updatedBoss.updatedAt,
          ...dataWithoutPassword,
        },
        200,
      );
    },
  )

  // Delete boss
  .delete(
    '/:id',
    zValidator(
      'param',
      z.object({
        id: z.string().uuid('Invalid ID format'),
      }),
    ),
    zValidator(
      'json',
      z.object({
        password: z.string().nullable().optional(),
      }),
    ),
    async (c) => {
      const { id } = c.req.valid('param');
      const { password } = c.req.valid('json');

      const [boss] = await getDb().select().from(bosses).where(eq(bosses.id, id));

      if (!boss) {
        throw new HTTPException(404, { message: 'Boss not found' });
      }

      // パスワード認証
      await requirePasswordAuth(boss, password ?? undefined);

      // データベースから削除
      await getDb().delete(bosses).where(eq(bosses.id, id));

      return c.json({ message: 'Boss deleted successfully' }, 200);
    },
  )

  // Upload boss image
  .post(
    '/:id/upload-image',
    zValidator(
      'param',
      z.object({
        id: z.string().uuid('Invalid ID format'),
      }),
    ),
    async (c) => {
      const { id } = c.req.valid('param');
      if (!c.env.IMAGES_BUCKET) {
        throw new HTTPException(404, { message: 'Bucket not found' });
      }

      // ヌシの存在確認
      const [boss] = await getDb().select().from(bosses).where(eq(bosses.id, id));

      if (!boss) {
        throw new HTTPException(404, { message: 'Boss not found' });
      }

      // multipart/form-dataから画像を取得
      const formData = await c.req.formData();
      const imageFile = formData.get('image') as File | null;
      const password = formData.get('password') as string | null;

      // パスワード認証
      await requirePasswordAuth(boss, password ?? undefined);

      // 画像ファイルのバリデーション
      const validatedFile = validateImageFile(imageFile);

      // R2にアップロード
      const imageUrl = await uploadImageToR2(
        c.env.IMAGES_BUCKET,
        'bosses',
        id,
        validatedFile,
      );

      // データベースのimageUrlを更新
      const bossData = boss.data as Record<string, unknown>;
      const updatedData = {
        ...bossData,
        imageUrl,
      };

      await getDb()
        .update(bosses)
        .set({
          data: updatedData,
          updatedAt: new Date(),
        })
        .where(eq(bosses.id, id));

      return c.json({ imageUrl }, 200);
    },
  );
