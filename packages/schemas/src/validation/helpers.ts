import { z } from 'zod';

// バリデーション結果の型
export type ValidationResult<T> =
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

// ジェネリックなバリデーション実行関数
export const createValidator =
  <T extends z.ZodTypeAny>(schema: T) =>
  (data: unknown): ValidationResult<z.infer<T>> => {
    const result = schema.safeParse(data);

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
