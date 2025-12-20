import { zValidator } from '@hono/zod-validator';
import { createCampSchema, updateCampSchema } from '@lostrpg/schemas';
import bcrypt from 'bcryptjs';
import { desc, eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';
import { getDb } from '../lib/db/connection';
import { camps } from '../lib/db/schema';
import { validateImageFile, uploadImageToR2 } from '../lib/r2/image-upload';
import { requirePasswordAuth } from '../middleware/auth';
import type { Env } from '../types/cloudflare';

export const campsRouter = new Hono<{ Bindings: Env }>()
  // Get all camps
  .get('/', async (c) => {
    const campList = await getDb()
      .select({
        id: camps.id,
        name: camps.name,
        createdAt: camps.createdAt,
        updatedAt: camps.updatedAt,
      })
      .from(camps)
      .orderBy(desc(camps.updatedAt));

    return c.json(campList);
  })
  // Create new camp
  .post('/', zValidator('json', createCampSchema), async (c) => {
    const campData = c.req.valid('json');

    // パスワードハッシュ化
    let passwordHash: string | undefined;
    if (campData.password) {
      passwordHash = await bcrypt.hash(campData.password, 12);
    }

    // パスワードを除いたデータを準備
    // eslint-disable-next-line sonarjs/no-unused-vars
    const { password: _password, ...dataWithoutPassword } = campData;

    // データベースに保存
    const [newCamp] = await getDb()
      .insert(camps)
      .values({
        name: campData.name,
        data: dataWithoutPassword,
        passwordHash,
      })
      .returning();

    const url = `/camp/${newCamp.id}`;

    return c.json({ id: newCamp.id, url }, 201);
  })

  // Get camp by ID
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

      const [camp] = await getDb().select().from(camps).where(eq(camps.id, id));

      if (!camp) {
        throw new HTTPException(404, { message: 'Camp not found' });
      }

      const data = camp.data as object;

      return c.json({
        id: camp.id,
        name: camp.name,
        createdAt: camp.createdAt,
        updatedAt: camp.updatedAt,
        isPasswordProtected: !!camp.passwordHash,
        data,
      });
    },
  )

  // Update camp
  .put(
    '/:id',
    zValidator(
      'param',
      z.object({
        id: z.string(),
      }),
    ),
    zValidator('json', updateCampSchema),
    async (c) => {
      const { id } = c.req.valid('param');
      const requestBody = c.req.valid('json');

      const [camp] = await getDb().select().from(camps).where(eq(camps.id, id));

      if (!camp) {
        throw new HTTPException(404, { message: 'Camp not found' });
      }

      // パスワード認証
      await requirePasswordAuth(camp, requestBody.password);

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
        name: requestBody.name || camp.name,
        updatedAt: new Date(),
      };

      // パスワードが未設定で、新しくパスワードを設定する場合のみハッシュ化
      if (!camp.passwordHash && requestBody.password) {
        updateData.passwordHash = await bcrypt.hash(requestBody.password, 12);
      }
      // 既にパスワードが設定されている場合は、passwordHashは更新しない

      // データベースを更新
      const [updatedCamp] = await getDb()
        .update(camps)
        .set(updateData)
        .where(eq(camps.id, id))
        .returning();

      return c.json(
        {
          id: updatedCamp.id,
          name: updatedCamp.name,
          createdAt: updatedCamp.createdAt,
          updatedAt: updatedCamp.updatedAt,
          ...dataWithoutPassword,
        },
        200,
      );
    },
  )

  // Delete camp
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

      const [camp] = await getDb().select().from(camps).where(eq(camps.id, id));

      if (!camp) {
        throw new HTTPException(404, { message: 'Camp not found' });
      }

      // パスワード認証
      await requirePasswordAuth(camp, password ?? undefined);

      // データベースから削除
      await getDb().delete(camps).where(eq(camps.id, id));

      return c.json({ message: 'Camp deleted successfully' }, 200);
    },
  )

  // Upload camp image
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

      // キャンプの存在確認
      const [camp] = await getDb().select().from(camps).where(eq(camps.id, id));

      if (!camp) {
        throw new HTTPException(404, { message: 'Camp not found' });
      }

      // multipart/form-dataから画像を取得
      const formData = await c.req.formData();
      const imageFile = formData.get('image') as File | null;
      const password = formData.get('password') as string | null;

      // パスワード認証
      await requirePasswordAuth(camp, password ?? undefined);

      // 画像ファイルのバリデーション
      const validatedFile = validateImageFile(imageFile);

      // R2にアップロード
      const imageUrl = await uploadImageToR2(
        c.env.IMAGES_BUCKET,
        'camps',
        id,
        validatedFile,
      );

      // データベースのimageUrlを更新
      const campData = camp.data as Record<string, unknown>;
      const updatedData = {
        ...campData,
        imageUrl,
      };

      await getDb()
        .update(camps)
        .set({
          data: updatedData,
          updatedAt: new Date(),
        })
        .where(eq(camps.id, id));

      return c.json({ imageUrl }, 200);
    },
  );
