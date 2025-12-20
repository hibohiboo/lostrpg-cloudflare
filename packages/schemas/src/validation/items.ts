import { z } from 'zod';

export const itemSchema = z.object({
  id: z.string(),
  number: z.number().int().min(1),
  name: z.string(),
  j: z.number().min(0),
  weight: z.number().min(0),
  type: z.string(),
  area: z.string(),
  specialty: z.string(),
  target: z.string(),
  trait: z.string(),
  effect: z.string(),
});
