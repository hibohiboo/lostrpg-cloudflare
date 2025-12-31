import z from 'zod';
import { createCharacterSchema } from './character';

export const recordSchema = z.object({
  name: z.string(),
  character: createCharacterSchema,
  password: z.string().nullable().optional(),
});
export const updateRecordSchema = recordSchema
  .omit({ name: true })
  .extend({
    name: z.string().optional(),
  })
  .partial();
