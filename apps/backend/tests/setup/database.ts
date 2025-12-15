import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { setTestDb } from '../../src/lib/db/connection';
import { characters } from '../../src/lib/db/schema';

let container: StartedPostgreSqlContainer;
let testDb: ReturnType<typeof drizzle>;
let testClient: ReturnType<typeof postgres>;

export const setupTestDatabase = async () => {
  // PostgreSQLコンテナを起動
  container = await new PostgreSqlContainer('postgres:18rc1-alpine')
    .withDatabase('test_age_of_hero')
    .withUsername('test_user')
    .withPassword('test_password')
    .start();

  // 接続文字列を取得
  const connectionString = container.getConnectionUri();

  // テスト用DB接続を作成
  testClient = postgres(connectionString);
  testDb = drizzle(testClient);

  // Drizzleマイグレーションを実行
  await migrate(testDb, { migrationsFolder: './drizzle/migrations' });

  // アプリで使用するデータベース接続を差し替え
  setTestDb(testDb);

  return { testDb, connectionString };
};

export const teardownTestDatabase = async () => {
  // テストデータベース接続をリセット
  setTestDb(null as any);

  if (testClient) {
    await testClient.end();
  }
  if (container) {
    await container.stop();
  }
};

export const cleanupTestData = async () => {
  if (testDb) {
    await testDb.delete(characters);
  }
};

export const getTestDb = () => testDb;
export const getConnectionString = () => container?.getConnectionUri();
