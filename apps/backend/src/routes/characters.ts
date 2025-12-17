/* eslint-disable @typescript-eslint/no-explicit-any */
import { zValidator } from '@hono/zod-validator';
import {
  createCharacterSchema,
  updateCharacterSchema,
} from '@lostrpg/schemas';
import bcrypt from 'bcryptjs';
import { desc, eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { z } from 'zod';
import { getDb } from '../lib/db/connection';
import { characters } from '../lib/db/schema';
import { requirePasswordAuth } from '../middleware/auth';

export const charactersRouter = new Hono();

// Get all characters
charactersRouter.get('/', async (c) => {
  try {
    const characterList = await getDb()
      .select({
        id: characters.id,
        name: characters.name,
        createdAt: characters.createdAt,
        updatedAt: characters.updatedAt,
      })
      .from(characters)
      .orderBy(desc(characters.updatedAt));

    return c.json(characterList);
  } catch (error) {
    console.error('Database error:', error);
    return c.json({ error: 'Database error' }, 500);
  }
});

// Create new character
charactersRouter.post(
  '/',
  zValidator('json', createCharacterSchema as any),
  async (c) => {
    const characterData = c.req.valid('json');

    // パスワードハッシュ化
    let passwordHash: string | undefined;
    if (characterData.password) {
      passwordHash = await bcrypt.hash(characterData.password, 12);
    }

    // パスワードを除いたデータを準備
    // eslint-disable-next-line sonarjs/no-unused-vars
    const { password: _password, ...dataWithoutPassword } = characterData;

    // データベースに保存
    const [newCharacter] = await getDb()
      .insert(characters)
      .values({
        name: characterData.name || '無名のヒーロー',
        data: dataWithoutPassword,
        passwordHash,
      })
      .returning();

    const url = `/character/${newCharacter.id}`;

    return c.json({ id: newCharacter.id, url }, 201);
  },
);

// Get character by ID
charactersRouter.get(
  '/:id',
  zValidator(
    'param',
    z.object({
      id: z.string().uuid('Invalid ID format'),
    }),
  ),
  async (c) => {
    const { id } = c.req.valid('param');

    const [character] = await getDb()
      .select()
      .from(characters)
      .where(eq(characters.id, id));

    if (!character) {
      return c.json({ error: 'Character not found' }, 404);
    }

    const data = character.data as object;

    return c.json({
      id: character.id,
      name: character.name,
      createdAt: character.createdAt,
      updatedAt: character.updatedAt,
      isPasswordProtected: !!character.passwordHash,
      ...data,
    });
  },
);

// Update character (add session)
charactersRouter.put(
  '/:id/session',
  zValidator(
    'param',
    z.object({
      id: z.string(),
    }),
  ),
  zValidator('json', updateCharacterSchema as any),
  async (c) => {
    const { id } = c.req.valid('param');
    const requestBody = c.req.valid('json');

    try {
      const [character] = await getDb()
        .select()
        .from(characters)
        .where(eq(characters.id, id));

      if (!character) {
        return c.json({ error: 'Character not found' }, 404);
      }

      // パスワード認証
      await requirePasswordAuth(character, requestBody.password);

      const characterData = character.data as { sessions?: unknown[] };

      // セッション情報を追加
      const newSession = {
        id: crypto.randomUUID(),
        ...requestBody.session,
        createdAt: new Date().toISOString(),
      };

      const updatedSessions = [...(characterData.sessions || []), newSession];

      const updatedData = {
        ...characterData,
        sessions: updatedSessions,
      };

      // データベースを更新
      const [updatedCharacter] = await getDb()
        .update(characters)
        .set({
          data: updatedData,
          updatedAt: new Date(),
        })
        .where(eq(characters.id, id))
        .returning();

      return c.json(
        {
          id: updatedCharacter.id,
          name: updatedCharacter.name,
          createdAt: updatedCharacter.createdAt,
          updatedAt: updatedCharacter.updatedAt,
          ...updatedData,
        },
        200,
      );
    } catch (error) {
      console.error('Database error:', error);
      return c.json({ error: 'Database error' }, 500);
    }
  },
);

// Update character
charactersRouter.put(
  '/:id',
  zValidator(
    'param',
    z.object({
      id: z.string(),
    }),
  ),
  zValidator('json', createCharacterSchema as any),
  async (c) => {
    const { id } = c.req.valid('param');
    const requestBody = c.req.valid('json');

    try {
      const [character] = await getDb()
        .select()
        .from(characters)
        .where(eq(characters.id, id));

      if (!character) {
        return c.json({ error: 'Character not found' }, 404);
      }

      // パスワード認証
      await requirePasswordAuth(character, requestBody.password);

      // データベースを更新
      const [updatedCharacter] = await getDb()
        .update(characters)
        .set({
          data: requestBody,
          name: requestBody.name,
          updatedAt: new Date(),
        })
        .where(eq(characters.id, id))
        .returning();

      return c.json(
        {
          id: updatedCharacter.id,
          name: updatedCharacter.name,
          createdAt: updatedCharacter.createdAt,
          updatedAt: updatedCharacter.updatedAt,
          ...requestBody,
        },
        200,
      );
    } catch (error) {
      console.error('Database error:', error);
      return c.json({ error: 'Database error' }, 500);
    }
  },
);
