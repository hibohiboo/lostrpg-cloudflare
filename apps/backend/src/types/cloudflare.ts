// Cloudflare Workers環境の型定義
import type { R2Bucket } from '@cloudflare/workers-types';

export type Env = {
  IMAGES_BUCKET: R2Bucket;
  NODE_ENV?: string;
};
