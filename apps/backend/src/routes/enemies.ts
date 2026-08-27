import { zValidator } from '@hono/zod-validator';
import { createEnemySchema, getEnemySchema, updateEnemySchema } from '@lostrpg/schemas';
import bcrypt from 'bcryptjs';
import { and, asc, desc, eq, ilike, sql } from 'drizzle-orm';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';
import { getDb } from '../lib/db/connection';
import { enemies } from '../lib/db/schema';
import { validateImageFile, uploadImageToR2 } from '../lib/r2/image-upload';
import { requirePasswordAuth } from '../middleware/auth';
import type { Env } from '../types/cloudflare';

const listEnemiesQuerySchema = z.object({
  offset: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  name: z.string().trim().optional(),
  type: z.enum(['ケモノ', 'ムシ', 'ミュータント']).optional(),
  sortBy: z.enum(['updatedAt', 'level']).default('updatedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const enemiesRouter = new Hono<{ Bindings: Env }>()
  // Get enemies (paginated, optionally filtered by name/type, sortable by level)
  .get('/', zValidator('query', listEnemiesQuerySchema), async (c) => {
    const { offset, limit, name, type, sortBy, sortOrder } = c.req.valid('query');

    const conditions = [
      name ? ilike(enemies.name, `%${name}%`) : undefined,
      type ? eq(sql`${enemies.data}->>'type'`, type) : undefined,
      // 「一覧に表示しない」がONのエネミーは一覧から除外する（詳細への直接リンクは可）
      sql`COALESCE((${enemies.data}->>'hideFromList')::boolean, false) = false`,
    ].filter((condition) => condition !== undefined);

    const levelExpr = sql`(${enemies.data}->>'level')::int`;
    let orderBy = desc(enemies.updatedAt);
    if (sortBy === 'level') {
      orderBy = sortOrder === 'asc' ? asc(levelExpr) : desc(levelExpr);
    }

    const enemyList = await getDb()
      .select({
        id: enemies.id,
        name: enemies.name,
        createdAt: enemies.createdAt,
        updatedAt: enemies.updatedAt,
        data: enemies.data,
      })
      .from(enemies)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(orderBy)
      .limit(limit + 1)
      .offset(offset);

    const hasMore = enemyList.length > limit;
    // シナリオに登場させるエネミーを選びやすいよう、一覧にも主要ステータスを含める
    const data = enemyList.slice(0, limit).map((enemy) => {
      const parsed = getEnemySchema.parse(enemy.data);
      return {
        id: enemy.id,
        name: enemy.name,
        createdAt: enemy.createdAt,
        updatedAt: enemy.updatedAt,
        imageUrl: parsed.imageUrl,
        level: parsed.level,
        type: parsed.type,
        stamina: parsed.stamina,
        willPower: parsed.willPower,
        specialties: parsed.specialties,
        abilities: parsed.abilities.map((a) => a.name),
      };
    });

    return c.json({ data, hasMore });
  })
  // Create new enemy
  .post('/', zValidator('json', createEnemySchema), async (c) => {
    const enemyData = c.req.valid('json');

    // パスワードハッシュ化
    let passwordHash: string | undefined;
    if (enemyData.password) {
      passwordHash = await bcrypt.hash(enemyData.password, 12);
    }

    // パスワードを除いたデータを準備
    // eslint-disable-next-line sonarjs/no-unused-vars
    const { password: _password, ...dataWithoutPassword } = enemyData;

    // データベースに保存
    const [newEnemy] = await getDb()
      .insert(enemies)
      .values({
        name: enemyData.name,
        data: dataWithoutPassword,
        passwordHash,
      })
      .returning();

    const url = `/enemy/${newEnemy.id}`;

    return c.json({ id: newEnemy.id, url }, 201);
  })

  // Get enemy by ID
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

      const [enemy] = await getDb().select().from(enemies).where(eq(enemies.id, id));

      if (!enemy) {
        throw new HTTPException(404, { message: 'Enemy not found' });
      }

      const data = getEnemySchema.parse(enemy.data);

      return c.json({
        id: enemy.id,
        name: enemy.name,
        createdAt: enemy.createdAt,
        updatedAt: enemy.updatedAt,
        isPasswordProtected: !!enemy.passwordHash,
        data,
      });
    },
  )

  // Update enemy
  .put(
    '/:id',
    zValidator(
      'param',
      z.object({
        id: z.string(),
      }),
    ),
    zValidator('json', updateEnemySchema),
    async (c) => {
      const { id } = c.req.valid('param');
      const requestBody = c.req.valid('json');

      const [enemy] = await getDb().select().from(enemies).where(eq(enemies.id, id));

      if (!enemy) {
        throw new HTTPException(404, { message: 'Enemy not found' });
      }

      // パスワード認証
      await requirePasswordAuth(enemy, requestBody.password);

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
        name: requestBody.name || enemy.name,
        updatedAt: new Date(),
      };

      // パスワードが未設定で、新しくパスワードを設定する場合のみハッシュ化
      if (!enemy.passwordHash && requestBody.password) {
        updateData.passwordHash = await bcrypt.hash(requestBody.password, 12);
      }
      // 既にパスワードが設定されている場合は、passwordHashは更新しない

      // データベースを更新
      const [updatedEnemy] = await getDb()
        .update(enemies)
        .set(updateData)
        .where(eq(enemies.id, id))
        .returning();

      return c.json(
        {
          id: updatedEnemy.id,
          name: updatedEnemy.name,
          createdAt: updatedEnemy.createdAt,
          updatedAt: updatedEnemy.updatedAt,
          ...dataWithoutPassword,
        },
        200,
      );
    },
  )

  // Delete enemy
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

      const [enemy] = await getDb().select().from(enemies).where(eq(enemies.id, id));

      if (!enemy) {
        throw new HTTPException(404, { message: 'Enemy not found' });
      }

      // パスワード認証
      await requirePasswordAuth(enemy, password ?? undefined);

      // データベースから削除
      await getDb().delete(enemies).where(eq(enemies.id, id));

      return c.json({ message: 'Enemy deleted successfully' }, 200);
    },
  )

  // Upload enemy image
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

      // エネミーの存在確認
      const [enemy] = await getDb().select().from(enemies).where(eq(enemies.id, id));

      if (!enemy) {
        throw new HTTPException(404, { message: 'Enemy not found' });
      }

      // multipart/form-dataから画像を取得
      const formData = await c.req.formData();
      const imageFile = formData.get('image') as File | null;
      const password = formData.get('password') as string | null;

      // パスワード認証
      await requirePasswordAuth(enemy, password ?? undefined);

      // 画像ファイルのバリデーション
      const validatedFile = validateImageFile(imageFile);

      // R2にアップロード
      const imageUrl = await uploadImageToR2(
        c.env.IMAGES_BUCKET,
        'enemies',
        id,
        validatedFile,
      );

      // データベースのimageUrlを更新
      const enemyData = enemy.data as Record<string, unknown>;
      const updatedData = {
        ...enemyData,
        imageUrl,
      };

      await getDb()
        .update(enemies)
        .set({
          data: updatedData,
          updatedAt: new Date(),
        })
        .where(eq(enemies.id, id));

      return c.json({ imageUrl }, 200);
    },
  );
