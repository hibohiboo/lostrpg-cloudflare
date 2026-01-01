import z from 'zod';
import { createCharacterSchema } from './character';

const recordDataSchema = z.object({
  title: z.string(),
  date: z.string().optional(),
  gm: z.string().optional(),
  expCheckPoints: z.array(z.string()).optional(),
  parties: z.array(
    z.object({
      name: z.string().optional(),
      memo: z.string().optional(),
      trophy: z.string().optional(),
    }),
  ),
  memo: z.string().optional(),
  exp: z.number().optional(),
  trophy: z.string().optional(),
});
export type Record = z.infer<typeof recordDataSchema>;

export const recordSchema = z.object({
  name: z.string(),
  character: createCharacterSchema,
  record: recordDataSchema,
  password: z.string().nullable().optional(),
});
export const updateRecordSchema = recordSchema
  .omit({ name: true })
  .extend({
    name: z.string().optional(),
  })
  .partial();
