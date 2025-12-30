import { z } from 'zod';

const itemBase = {
  name: z.string(),
  j: z.number().min(0),
  weight: z.number().min(0),
  type: z.string(),
  area: z.string(),
  specialty: z.string(),
  target: z.string(),
  trait: z.string(),
  effect: z.string(),
};

export const itemSchema = z.object({
  id: z.string(),
  number: z.number().int().min(1),
  ...itemBase,
});
export type CharacterItem = z.infer<typeof itemSchema>;
export type ItemBase = Omit<CharacterItem, 'id' | 'number'>;

export const equipmentSchema = z.object({
  id: z.string(),
  ...itemBase,
  equipedArea: z.string(),
});
export type Equipment = z.infer<typeof equipmentSchema>;
