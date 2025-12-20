import { Hono } from 'hono';
import type { Env } from '../types/cloudflare';
import type { Headers as CFHeaders } from '@cloudflare/workers-types';

export const imagesRouter = new Hono<{ Bindings: Env }>()
  // Get image from R2
  .get('/*', async (c) => {
    const path = c.req.path.replace('/api/images/', '');

    if (!c.env.IMAGES_BUCKET) {
      return c.json({ error: 'Bucket not found' }, 404);
    }

    try {
      const object = await c.env.IMAGES_BUCKET.get(path);

      if (!object) {
        return c.json({ error: 'Image not found' }, 404);
      }

      const headers = new Headers();
      object.writeHttpMetadata(headers as unknown as CFHeaders); // bunのほうの undici の Headers と認識するのでcloudworkerのheadersとして認識させる
      headers.set('etag', object.httpEtag);
      headers.set('cache-control', 'public, max-age=31536000'); // 1年間

      // Cloudflare Workers の ReadableStream と DOM の ReadableStream の型の違いを吸収。これをしないとフロントエンド側のビルドに失敗する
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return new Response(object.body as any, {
        headers,
      });
    } catch (error) {
      console.error('Failed to fetch image:', error);
      return c.json({ error: 'Failed to fetch image' }, 500);
    }
  });
