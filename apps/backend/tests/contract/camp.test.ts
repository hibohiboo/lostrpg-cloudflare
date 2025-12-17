import { describe, beforeAll, afterAll, beforeEach, it, expect } from 'vitest';
import app from '../../src/index';
import {
  setupTestDatabase,
  teardownTestDatabase,
  cleanupTestData,
} from '../setup/database';

describe('POST /api/characters', () => {
  // テスト用データベースのセットアップ
  beforeAll(async () => {
    await setupTestDatabase();
  }, 60000); // 60秒のタイムアウト（コンテナ起動時間を考慮）

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    // 各テスト前にデータをクリーンアップ
    await cleanupTestData();
  });

  // テストヘルパー関数
  const createCharacter = async (data: any) => {
    const req = new Request('http://localhost/api/camps', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return app.fetch(req);
  };
  const minimalData = {
    playerName: '',
    name: '',
    imageUrl: '',
    facilities: [],
    items: [],
    unusedCampPoint: 0,
    totalCampPoint: 0,
    summary: '',
    freeWriting: '',
  };
  describe('正常系', () => {
    it('ステータス201を返すこと', async () => {
      const res = await createCharacter(minimalData);
      expect(res.status).toBe(201);
    });
    it('作成されたキャンプのidを返すこと', async () => {
      const res = await createCharacter(minimalData);
      const data = (await res.json()) as any;
      expect(res.status).toBe(201);
      expect(data).toHaveProperty('id');
      // UUID v4 形式の正規表現
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(data.id).toMatch(uuidRegex);
    });
  });
  describe('パスワード', () => {
    it('パスワードありで作成できること', async () => {
      const dataWithPassword = { ...minimalData, password: 'secret123' };
      const res = await createCharacter(dataWithPassword);

      expect(res.status).toBe(201);
    });

    it('パスワードなしで作成できること', async () => {
      const res = await createCharacter(minimalData);

      expect(res.status).toBe(201);
    });
  });
});
