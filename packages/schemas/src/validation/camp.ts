import { z } from 'zod';

// 施設スキーマ
const facilitySchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  specialty: z.string(),
  level: z.number().int().min(1),
  effect: z.string(),
});

// アイテムスキーマ
const itemSchema = z.object({
  id: z.string(),
  number: z.number().int().min(1),
  name: z.string(),
  price: z.number().min(0),
  weight: z.number().min(0),
  type: z.string(),
  area: z.string(),
  specialty: z.string(),
  target: z.string(),
  trait: z.string(),
  effect: z.string(),
});

// Camp作成リクエストスキーマ
export const createCampSchema = z.object({
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
});

export type CreateCampRequest = z.infer<typeof createCampSchema>;

// Camp更新リクエストスキーマ
export const updateCampSchema = z.object({
  playerName: z.string().optional(),
  name: z.string().max(50).optional(),
  imageUrl: z.string().optional(),
  facilities: z.array(facilitySchema).optional(),
  items: z.array(itemSchema).optional(),
  unusedCampPoint: z.number().int().min(0).optional(),
  totalCampPoint: z.number().int().min(0).optional(),
  summary: z.string().optional(),
  freeWriting: z.string().optional(),
  password: z.string().nullable().optional(),
});

export type UpdateCampRequest = z.infer<typeof updateCampSchema>;

// バリデーション結果の型（character.tsから再利用）
type ValidationResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
        details: Array<{
          field: string;
          message: string;
        }>;
      };
    };

// バリデーション実行関数
export const validateCreateCamp = (
  data: unknown,
): ValidationResult<CreateCampRequest> => {
  const result = createCampSchema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  return {
    success: false,
    error: {
      code: 'VALIDATION_ERROR',
      message: 'バリデーションエラーが発生しました',
      details: [],
    },
  };
};

// UpdateCampRequest バリデーション実行関数
export const validateUpdateCamp = (
  data: unknown,
): ValidationResult<UpdateCampRequest> => {
  const result = updateCampSchema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  return {
    success: false,
    error: {
      code: 'VALIDATION_ERROR',
      message: 'バリデーションエラーが発生しました',
      details: [],
    },
  };
};
