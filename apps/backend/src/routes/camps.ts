import { zValidator } from '@hono/zod-validator';
import { createCampSchema, updateCampSchema } from '@lostrpg/schemas';
import bcrypt from 'bcryptjs';
import { desc, eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { z } from 'zod';
import { getDb } from '../lib/db/connection';
import { camps } from '../lib/db/schema';
import { requirePasswordAuth } from '../middleware/auth';

export const campsRouter = new Hono();

// Get all camps
campsRouter.get('/', async (c) => {
  try {
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
  } catch (error) {
    console.error('Database error:', error);
    return c.json({ error: 'Database error' }, 500);
  }
});

// Create new camp
campsRouter.post('/', zValidator('json', createCampSchema), async (c) => {
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
});

// Get camp by ID
campsRouter.get(
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
      return c.json({ error: 'Camp not found' }, 404);
    }

    const data = camp.data as object;

    return c.json({
      id: camp.id,
      name: camp.name,
      createdAt: camp.createdAt,
      updatedAt: camp.updatedAt,
      isPasswordProtected: !!camp.passwordHash,
      ...data,
    });
  },
);

// Update camp
campsRouter.put(
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

    try {
      const [camp] = await getDb().select().from(camps).where(eq(camps.id, id));

      if (!camp) {
        return c.json({ error: 'Camp not found' }, 404);
      }

      // パスワード認証
      await requirePasswordAuth(camp, requestBody.password);

      // パスワードを除いたデータを準備
      // eslint-disable-next-line sonarjs/no-unused-vars
      const { password: _password, ...dataWithoutPassword } = requestBody;

      // データベースを更新
      const [updatedCamp] = await getDb()
        .update(camps)
        .set({
          data: dataWithoutPassword,
          name: requestBody.name || camp.name,
          updatedAt: new Date(),
        })
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
    } catch (error) {
      console.error('Database error:', error);
      return c.json({ error: 'Database error' }, 500);
    }
  },
);

// Delete camp
campsRouter.delete(
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

    try {
      const [camp] = await getDb().select().from(camps).where(eq(camps.id, id));

      if (!camp) {
        return c.json({ error: 'Camp not found' }, 404);
      }

      // パスワード認証
      await requirePasswordAuth(camp, password ?? undefined);

      // データベースから削除
      await getDb().delete(camps).where(eq(camps.id, id));

      return c.json({ message: 'Camp deleted successfully' }, 200);
    } catch (error) {
      console.error('Database error:', error);
      return c.json({ error: 'Database error' }, 500);
    }
  },
);
