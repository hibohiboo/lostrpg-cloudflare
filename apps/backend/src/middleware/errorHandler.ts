import { HTTPException } from 'hono/http-exception';
import type { Context } from 'hono';

export function errorHandler(err: Error, c: Context) {
  // HTTPExceptionはそのまま返す
  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  // その他のエラーは500として処理
  console.error('Unhandled error:', err);
  return c.json(
    {
      error: 'Internal Server Error',
      message: err.message || 'An unexpected error occurred',
    },
    500,
  );
}
