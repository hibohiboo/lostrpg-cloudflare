import { z } from 'zod';
import { createValidator } from './helpers';
import { itemSchema } from './items';

// 施設スキーマ
const facilitySchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  specialty: z.string(),
  level: z.number().int().min(1),
  effect: z.string(),
});

// 基本フィールドスキーマ
const baseCampFields = {
  playerName: z.string().optional(),
  name: z.string().max(50, 'name は50文字以内で入力してください'),
  imageUrl: z.string().optional(),
  facilities: z.array(facilitySchema).optional().default([]),
  items: z.array(itemSchema).optional().default([]),
  unusedCampPoint: z.number().int().min(0).optional().default(0),
  totalCampPoint: z.number().int().min(0).optional().default(0),
  summary: z.string().optional(),
  freeWriting: z.string().optional(),
  password: z.string().nullable().optional(),
};

// Camp作成リクエストスキーマ
export const createCampSchema = z.object(baseCampFields);

export type CreateCampRequest = z.infer<typeof createCampSchema>;

// Camp更新リクエストスキーマ（作成スキーマのpartial + nameを必須から任意に）
export const updateCampSchema = createCampSchema
  .omit({ name: true })
  .extend({
    name: z.string().max(50).optional(),
  })
  .partial();

export type UpdateCampRequest = z.infer<typeof updateCampSchema>;

// バリデーション実行関数
export const validateCreateCamp = createValidator(createCampSchema);
export const validateUpdateCamp = createValidator(updateCampSchema);
