import { hc } from 'hono/client';
import { baseUrl } from '../config';
import type { AppType } from '@lostrpg/backend/index';

const _ = hc<AppType>(baseUrl);
type ApiClient = typeof _;

// /api/camps の GET リクエストのレスポンス型
export type ApiType = ApiClient['api'];
