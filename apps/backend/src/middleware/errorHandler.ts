import { HTTPException } from 'hono/http-exception';
import type { Context } from 'hono';

export function errorHandler(err: Error, c: Context) {
  // JSON parsing error
  if (err.message && err.message.includes('JSON')) {
    return c.json({ error: 'Invalid JSON format' }, 400);
  }

  // HTTPExceptionはそのまま返す
  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  // その他のエラーは500として処理
  console.error('Unexpected error:', err);
  return c.json({ error: 'Internal server error' }, 500);
}
