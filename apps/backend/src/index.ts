/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createCharacterSchema,
  updateCharacterSchema,
} from '@age-of-hero/schemas';
import { zValidator } from '@hono/zod-validator';
import bcrypt from 'bcryptjs';
import { desc, eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import { logger } from 'hono/logger';
import { z } from 'zod';
import { GAME_DATA } from './data/game-data';
import { getDb } from './lib/db/connection';
import { characters } from './lib/db/schema';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use(
  '*',
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? ['https://age-of-hero.hibohiboo66-cloudflare.workers.dev']
        : '*', // テスト環境では全オリジンを許可
    credentials: true,
  }),
);

// エラーハンドリングミドルウェア
app.onError((err, c) => {
  // JSON parsing error
  if (err.message && err.message.includes('JSON')) {
    return c.json({ error: 'Invalid JSON format' }, 400);
  }
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  // その他のエラー
  console.error('Unexpected error:', err);
  return c.json({ error: 'Internal server error' }, 500);
});

// Health check
app.get('/health', (c) =>
  c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '0.1.0',
  }),
);

// API routes placeholder
app.get('/api/game-data', (c) => c.json(GAME_DATA));

// Characters API
// Get all characters
app.get('/api/characters', async (c) => {
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

app.post(
  '/api/characters',
  zValidator('json', createCharacterSchema as any),
  async (c) => {
    // バリデーション済みのデータを取得
    const characterData = c.req.valid('json');

    // パスワードハッシュ化
    let passwordHash: string | undefined;
    if (characterData.password) {
      passwordHash = await bcrypt.hash(characterData.password, 12);
    }

    // パスワードを除いたデータを準備
    // eslint-disable-next-line sonarjs/no-unused-vars
    const { password: _password, ...dataWithoutPassword } = characterData;

    // データベースに保存（nameがない場合はデフォルト値を設定）
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
app.get(
  '/api/characters/:id',
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

    // キャラクター情報を返す（API仕様に合わせて構築）
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
app.put(
  '/api/characters/:id/session',
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

      // パスワード認証が必要な場合
      if (character.passwordHash) {
        if (!requestBody.password) {
          return c.json({ error: 'Password is required' }, 401);
        }

        const isValidPassword = await bcrypt.compare(
          requestBody.password,
          character.passwordHash,
        );
        if (!isValidPassword) {
          return c.json({ error: 'Invalid password' }, 401);
        }
      }

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

      // 更新されたキャラクター情報を返す
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
app.put(
  '/api/characters/:id',
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

      // パスワード認証が必要な場合
      if (character.passwordHash) {
        if (!requestBody.password) {
          return c.json({ error: 'Password is required' }, 401);
        }

        const isValidPassword = await bcrypt.compare(
          requestBody.password,
          character.passwordHash,
        );
        if (!isValidPassword) {
          return c.json({ error: 'Invalid password' }, 401);
        }
      }

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

      // 更新されたキャラクター情報を返す
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
const port = Number(process.env.PORT) || 3001;

console.log(`🚀 Backend server running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
