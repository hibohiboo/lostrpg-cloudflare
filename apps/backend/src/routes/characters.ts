import { zValidator } from '@hono/zod-validator';
import {
  createCharacterSchema,
  getCharacterSchema,
  recordSchema,
  updateCharacterSchema,
  updateRecordSchema,
} from '@lostrpg/schemas';
import bcrypt from 'bcryptjs';
import { desc, eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';
import { getDb } from '../lib/db/connection';
import {
  characters,
  campCharacters,
  characterRecords,
  records,
} from '../lib/db/schema';
import { validateImageFile, uploadImageToR2 } from '../lib/r2/image-upload';
import { requirePasswordAuth } from '../middleware/auth';
import type { Env } from '../types/cloudflare';

export const charactersRouter = new Hono<{ Bindings: Env }>()
  // Get all characters
  .get('/', async (c) => {
    const characterList = await getDb()
      .select({
        id: characters.id,
        name: characters.name,
        createdAt: characters.createdAt,
        updatedAt: characters.updatedAt,
        data: characters.data,
      })
      .from(characters)
      .orderBy(desc(characters.updatedAt));

    const formattedList = characterList.map((character) => {
      const data = character.data as Record<string, unknown>;
      return {
        id: character.id,
        name: character.name,
        createdAt: character.createdAt,
        updatedAt: character.updatedAt,
        imageUrl: data?.imageUrl as string | undefined,
      };
    });

    return c.json(formattedList);
  })
  // Create new character
  .post('/', zValidator('json', createCharacterSchema), async (c) => {
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
        name: characterData.name,
        data: dataWithoutPassword,
        passwordHash,
      })
      .returning();

    // campIdが設定されている場合、camp_charactersに追加
    if (characterData.campId) {
      await getDb().insert(campCharacters).values({
        campId: characterData.campId,
        characterId: newCharacter.id,
      });
    }

    const url = `/character/${newCharacter.id}`;

    return c.json({ id: newCharacter.id, url }, 201);
  })

  // Get character by ID
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

      const [character] = await getDb()
        .select()
        .from(characters)
        .where(eq(characters.id, id));

      if (!character) {
        throw new HTTPException(404, { message: 'Character not found' });
      }

      const data = getCharacterSchema.parse(character.data);

      return c.json({
        id: character.id,
        name: character.name,
        createdAt: character.createdAt,
        updatedAt: character.updatedAt,
        isPasswordProtected: !!character.passwordHash,
        data,
      });
    },
  )

  // Update character
  .put(
    '/:id',
    zValidator(
      'param',
      z.object({
        id: z.string(),
      }),
    ),
    zValidator('json', updateCharacterSchema),
    async (c) => {
      const { id } = c.req.valid('param');
      const requestBody = c.req.valid('json');

      const [character] = await getDb()
        .select()
        .from(characters)
        .where(eq(characters.id, id));

      if (!character) {
        throw new HTTPException(404, { message: 'Character not found' });
      }

      // パスワード認証
      await requirePasswordAuth(character, requestBody.password);

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
        name: requestBody.name || character.name,
        updatedAt: new Date(),
      };

      // パスワードが未設定で、新しくパスワードを設定する場合のみハッシュ化
      if (!character.passwordHash && requestBody.password) {
        updateData.passwordHash = await bcrypt.hash(requestBody.password, 12);
      }
      // 既にパスワードが設定されている場合は、passwordHashは更新しない

      // データベースを更新
      const [updatedCharacter] = await getDb()
        .update(characters)
        .set(updateData)
        .where(eq(characters.id, id))
        .returning();

      // camp_charactersの管理
      // 1. まず既存の関連を削除
      await getDb()
        .delete(campCharacters)
        .where(eq(campCharacters.characterId, id));

      // 2. 新しいcampIdが設定されている場合のみ追加
      if (requestBody.campId) {
        await getDb().insert(campCharacters).values({
          campId: requestBody.campId,
          characterId: id,
        });
      }

      return c.json(
        {
          id: updatedCharacter.id,
          name: updatedCharacter.name,
          createdAt: updatedCharacter.createdAt,
          updatedAt: updatedCharacter.updatedAt,
          ...dataWithoutPassword,
        },
        200,
      );
    },
  )

  // Delete character
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

      const [character] = await getDb()
        .select()
        .from(characters)
        .where(eq(characters.id, id));

      if (!character) {
        throw new HTTPException(404, { message: 'Character not found' });
      }

      // パスワード認証
      await requirePasswordAuth(character, password ?? undefined);

      // データベースから削除
      await getDb().delete(characters).where(eq(characters.id, id));

      return c.json({ message: 'Character deleted successfully' }, 200);
    },
  )

  // Upload character image
  .post(
    '/:id/upload-image',
    zValidator(
      'param',
      z.object({
        id: z.string(),
      }),
    ),
    async (c) => {
      const { id } = c.req.valid('param');
      if (!c.env.IMAGES_BUCKET) {
        throw new HTTPException(404, { message: 'Bucket not found' });
      }

      // キャラクターの存在確認
      const [character] = await getDb()
        .select()
        .from(characters)
        .where(eq(characters.id, id));

      if (!character) {
        throw new HTTPException(404, { message: 'Character not found' });
      }

      // multipart/form-dataから画像を取得
      const formData = await c.req.formData();
      const imageFile = formData.get('image') as File | null;
      const password = formData.get('password') as string | null;

      // パスワード認証
      await requirePasswordAuth(character, password ?? undefined);

      // 画像ファイルのバリデーション
      const validatedFile = validateImageFile(imageFile);

      // R2にアップロード
      const imageUrl = await uploadImageToR2(
        c.env.IMAGES_BUCKET,
        'characters',
        id,
        validatedFile,
      );

      // データベースのimageUrlを更新
      const characterData = character.data as Record<string, unknown>;
      const updatedData = {
        ...characterData,
        imageUrl,
      };

      await getDb()
        .update(characters)
        .set({
          data: updatedData,
          updatedAt: new Date(),
        })
        .where(eq(characters.id, id));

      return c.json({ imageUrl }, 200);
    },
  )
  .get(
    '/:id/records',
    zValidator(
      'param',
      z.object({
        id: z.uuid('Invalid ID format'),
      }),
    ),
    async (c) => {
      const { id } = c.req.valid('param');

      const [character] = await getDb()
        .select()
        .from(characters)
        .where(eq(characters.id, id));

      if (!character) {
        throw new HTTPException(404, { message: 'Character not found' });
      }
      const recordList = await getDb()
        .select({
          id: records.id,
          name: records.name,
          data: records.data,
        })
        .from(characterRecords)
        .innerJoin(records, eq(characterRecords.recordId, records.id))
        .where(eq(characterRecords.characterId, id));
      return c.json(
        recordList.map((r) => {
          const data = recordSchema.parse(r.data);
          return {
            id: r.id,
            name: r.name,
            exp: data.record.exp,
            trophy: data.record.trophy,
          };
        }),
      );
    },
  )
  // Create new record
  .post(
    '/:characterId/records',
    zValidator(
      'param',
      z.object({
        characterId: z.uuid('Invalid ID format'),
      }),
    ),
    zValidator('json', recordSchema),
    async (c) => {
      const { characterId } = c.req.valid('param');
      const recordData = c.req.valid('json');

      const [character] = await getDb()
        .select()
        .from(characters)
        .where(eq(characters.id, characterId));
      if (!character) {
        throw new HTTPException(404, { message: 'Character not found' });
      }
      // パスワード認証
      await requirePasswordAuth(character, recordData.password);

      // パスワードを除いたデータを準備
      // eslint-disable-next-line sonarjs/no-unused-vars
      const { password: _password, ...dataWithoutPassword } = recordData;

      // データベースに保存
      const [newRecord] = await getDb()
        .insert(records)
        .values({
          name: recordData.name,
          data: dataWithoutPassword,
        })
        .returning();

      // character_recordsに追加

      await getDb().insert(characterRecords).values({
        recordId: newRecord.id,
        characterId: character.id,
      });

      const url = `/${character.id}/records/${newRecord.id}`;

      return c.json({ id: newRecord.id, url }, 201);
    },
  ) // Get record by ID
  .get(
    '/records/:id',
    zValidator(
      'param',
      z.object({
        id: z.uuid('Invalid ID format'),
      }),
    ),
    async (c) => {
      const { id } = c.req.valid('param');

      const [record] = await getDb()
        .select()
        .from(records)
        .where(eq(records.id, id));

      if (!record) {
        throw new HTTPException(404, { message: 'Character not found' });
      }

      const data = recordSchema.parse(record.data);

      return c.json({
        id: record.id,
        name: record.name,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
        data,
      });
    },
  )
  // Update record
  .put(
    '/:characterId/records/:id',
    zValidator(
      'param',
      z.object({
        characterId: z.uuid('Invalid ID format'),
        id: z.uuid('Invalid ID format'),
      }),
    ),
    zValidator('json', updateRecordSchema),
    async (c) => {
      const { id, characterId } = c.req.valid('param');
      const requestBody = c.req.valid('json');

      const [character] = await getDb()
        .select()
        .from(characters)
        .where(eq(characters.id, characterId));

      if (!character) {
        throw new HTTPException(404, { message: 'Character not found' });
      }

      // パスワード認証
      await requirePasswordAuth(character, requestBody.password);

      const [record] = await getDb()
        .select()
        .from(records)
        .where(eq(records.id, id));

      if (!record) {
        throw new HTTPException(404, { message: 'Record not found' });
      }
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
        name: requestBody.name || record.name,
        updatedAt: new Date(),
      };

      // データベースを更新
      const [updatedRecord] = await getDb()
        .update(records)
        .set(updateData)
        .where(eq(records.id, id))
        .returning();

      return c.json(
        {
          id: updatedRecord.id,
          name: updatedRecord.name,
          createdAt: updatedRecord.createdAt,
          updatedAt: updatedRecord.updatedAt,
          ...dataWithoutPassword,
        },
        200,
      );
    },
  )
  // Delete record
  .delete(
    '/:characterId/records/:id',
    zValidator(
      'param',
      z.object({
        characterId: z.uuid('Invalid ID format'),
        id: z.uuid('Invalid ID format'),
      }),
    ),
    zValidator(
      'json',
      z.object({
        password: z.string().nullable().optional(),
      }),
    ),
    async (c) => {
      const { id, characterId } = c.req.valid('param');
      const { password } = c.req.valid('json');

      const [character] = await getDb()
        .select()
        .from(characters)
        .where(eq(characters.id, characterId));

      if (!character) {
        throw new HTTPException(404, { message: 'Character not found' });
      }

      // パスワード認証
      await requirePasswordAuth(character, password ?? undefined);

      // データベースから削除
      await getDb().delete(records).where(eq(records.id, id));

      return c.json({ message: 'Record deleted successfully' }, 200);
    },
  );
