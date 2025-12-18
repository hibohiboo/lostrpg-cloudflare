import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import { logger } from 'hono/logger';
import { campsRouter } from './routes/camps';
import { charactersRouter } from './routes/characters';
import { gameDataRouter } from './routes/game-data';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use(
  '*',
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? ['https://lostrpg.hibohiboo66-cloudflare.workers.dev']
        : '*',
    credentials: true,
  }),
);

// エラーハンドリングミドルウェア
app.onError((err, c) => {
  // JSON parsing error
  if (err.message && err.message.includes('JSON')) {
    return c.json({ error: 'Invalid JSON format' }, 400);
  }
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  // その他のエラー
  console.error('Unexpected error:', err);
  return c.json({ error: 'Internal server error' }, 500);
});

// Health check
app.get('/health', (c) =>
  c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '0.1.0',
  }),
);

// API routes
// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
const routes = app.route('/api/camps', campsRouter);
app
  .route('/api/game-data', gameDataRouter)
  .route('/api/characters', charactersRouter);
const port = Number(process.env.PORT) || 3001;

console.log(`🚀 Backend server running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
export type AppType = typeof routes;
