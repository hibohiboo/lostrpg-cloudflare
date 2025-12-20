import { neon } from '@neondatabase/serverless';
import { drizzle as neonDrizzle } from 'drizzle-orm/neon-http';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import type { NeonQueryFunction } from '@neondatabase/serverless';
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

type NeonDBClient = NeonHttpDatabase<Record<string, never>> & {
  $client: NeonQueryFunction<false, false>;
};
const connectionString =
  process.env.DATABASE_URL || 'postgresql://localhost:5432/age_of_hero';

// Cloudflare Workers環境かどうかを判定
const isWorkersEnvironment = () =>
  typeof globalThis.WebSocketPair !== 'undefined';

// PostgreSQL接続設定
const client = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

// Drizzle ORMインスタンス
export const db = drizzle(client);

// テスト用DB接続を差し替えるためのヘルパー
let testDbInstance: ReturnType<typeof drizzle> | null = null;

export const setTestDb = (testDb: ReturnType<typeof drizzle>) => {
  testDbInstance = testDb;
};
let neonDb: NeonDBClient | null = null;
export const getDb = () => {
  if (neonDb) return neonDb;
  if (connectionString.includes('neon')) {
    const sql = neon(connectionString);
    neonDb = neonDrizzle({ client: sql });
    return neonDb;
  }
  // Workersでは、各リクエストが独立したコンテキストで実行されるため、あるリクエスト用に作成されたI/Oオブジェクト（データベース接続など）を別のリクエストで使い回すことができない。
  // ローカルPostgreSQLの場合はリクエストごとに接続を作成
  if (isWorkersEnvironment()) {
    // Workers環境でローカルPostgreSQLを使う場合、毎回新しい接続を作成
    const newClient = postgres(connectionString, {
      max: 1,
      idle_timeout: 0,
      connect_timeout: 10,
    });
    return drizzle(newClient);
  }
  return testDbInstance || db;
};

// 接続テスト用ヘルパー
export const testConnection = async (): Promise<boolean> => {
  try {
    await client`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};

// 接続クリーンアップ
export const closeConnection = async (): Promise<void> => {
  await client.end();
};
