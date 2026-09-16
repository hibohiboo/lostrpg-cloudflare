import { zValidator } from '@hono/zod-validator';
import {
  createMotherlessCharacterSchema,
  getMotherlessCharacterSchema,
  updateMotherlessCharacterSchema,
} from '@lostrpg/schemas';
import bcrypt from 'bcryptjs';
import { and, desc, eq, ilike, sql } from 'drizzle-orm';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';
import { getDb } from '../lib/db/connection';
import { motherlessCharacters } from '../lib/db/schema';
import { validateImageFile, uploadImageToR2 } from '../lib/r2/image-upload';
import { requirePasswordAuth } from '../middleware/auth';
import type { Env } from '../types/cloudflare';

const listMotherlessCharactersQuerySchema = z.object({
  offset: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  name: z.string().trim().optional(),
});

export const motherlessCharactersRouter = new Hono<{ Bindings: Env }>()
  // Get motherless characters (paginated, optionally filtered by name)
  .get(
    '/',
    zValidator('query', listMotherlessCharactersQuerySchema),
    async (c) => {
      const { offset, limit, name } = c.req.valid('query');

      const characterList = await getDb()
        .select({
          id: motherlessCharacters.id,
          name: motherlessCharacters.name,
          createdAt: motherlessCharacters.createdAt,
          updatedAt: motherlessCharacters.updatedAt,
          imageUrl: sql<string | null>`${motherlessCharacters.data}->>'imageUrl'`,
        })
        .from(motherlessCharacters)
        .where(
          and(
            name ? ilike(motherlessCharacters.name, `%${name}%`) : undefined,
            sql`COALESCE((${motherlessCharacters.data}->>'hideFromList')::boolean, false) = false`,
          ),
        )
        .orderBy(desc(motherlessCharacters.updatedAt))
        .limit(limit + 1)
        .offset(offset);

      const hasMore = characterList.length > limit;
      const data = characterList.slice(0, limit).map((character) => ({
        id: character.id,
        name: character.name,
        createdAt: character.createdAt,
        updatedAt: character.updatedAt,
        imageUrl: character.imageUrl ?? undefined,
      }));

      return c.json({ data, hasMore });
    },
  )
  // Create new motherless character
  .post(
    '/',
    zValidator('json', createMotherlessCharacterSchema),
    async (c) => {
      const characterData = c.req.valid('json');

      let passwordHash: string | undefined;
      if (characterData.password) {
        passwordHash = await bcrypt.hash(characterData.password, 12);
      }

      // eslint-disable-next-line sonarjs/no-unused-vars
      const { password: _password, ...dataWithoutPassword } = characterData;

      const [newCharacter] = await getDb()
        .insert(motherlessCharacters)
        .values({
          name: characterData.name,
          data: dataWithoutPassword,
          passwordHash,
        })
        .returning();

      const url = `/motherless/characters/${newCharacter.id}`;

      return c.json({ id: newCharacter.id, url }, 201);
    },
  )

  // Get motherless character by ID
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
        .from(motherlessCharacters)
        .where(eq(motherlessCharacters.id, id));

      if (!character) {
        throw new HTTPException(404, { message: 'Character not found' });
      }

      const data = getMotherlessCharacterSchema.parse(character.data);

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

  // Update motherless character
  .put(
    '/:id',
    zValidator(
      'param',
      z.object({
        id: z.string(),
      }),
    ),
    zValidator('json', updateMotherlessCharacterSchema),
    async (c) => {
      const { id } = c.req.valid('param');
      const requestBody = c.req.valid('json');

      const [character] = await getDb()
        .select()
        .from(motherlessCharacters)
        .where(eq(motherlessCharacters.id, id));

      if (!character) {
        throw new HTTPException(404, { message: 'Character not found' });
      }

      await requirePasswordAuth(character, requestBody.password);

      // eslint-disable-next-line sonarjs/no-unused-vars
      const { password: _password, ...dataWithoutPassword } = requestBody;

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

      if (!character.passwordHash && requestBody.password) {
        updateData.passwordHash = await bcrypt.hash(requestBody.password, 12);
      }

      const [updatedCharacter] = await getDb()
        .update(motherlessCharacters)
        .set(updateData)
        .where(eq(motherlessCharacters.id, id))
        .returning();

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

  // Delete motherless character
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
        .from(motherlessCharacters)
        .where(eq(motherlessCharacters.id, id));

      if (!character) {
        throw new HTTPException(404, { message: 'Character not found' });
      }

      await requirePasswordAuth(character, password ?? undefined);

      await getDb()
        .delete(motherlessCharacters)
        .where(eq(motherlessCharacters.id, id));

      return c.json({ message: 'Character deleted successfully' }, 200);
    },
  )

  // Upload motherless character image
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

      const [character] = await getDb()
        .select()
        .from(motherlessCharacters)
        .where(eq(motherlessCharacters.id, id));

      if (!character) {
        throw new HTTPException(404, { message: 'Character not found' });
      }

      const formData = await c.req.formData();
      const imageFile = formData.get('image') as File | null;
      const password = formData.get('password') as string | null;

      await requirePasswordAuth(character, password ?? undefined);

      const validatedFile = validateImageFile(imageFile);

      const imageUrl = await uploadImageToR2(
        c.env.IMAGES_BUCKET,
        'motherless-characters',
        id,
        validatedFile,
      );

      const characterData = character.data as Record<string, unknown>;
      const updatedData = {
        ...characterData,
        imageUrl,
      };

      await getDb()
        .update(motherlessCharacters)
        .set({
          data: updatedData,
          updatedAt: new Date(),
        })
        .where(eq(motherlessCharacters.id, id));

      return c.json({ imageUrl }, 200);
    },
  );
