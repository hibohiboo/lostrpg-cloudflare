import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
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
  const createCharacter = async (characterData: any) => {
    const req = new Request('http://localhost/api/characters', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(characterData),
    });
    return app.fetch(req);
  };

  // 基本的なキャラクターデータ
  const basicCharacterData = {
    name: '山田太郎',
    selectedClasses: ['マッスル', 'バイオ'],
    skillAllocations: {
      パワー: 20,
      タフネス: 30,
    },
    heroSkills: [
      {
        name: 'パワードライブ',
        level: 3,
        maxLevel: 5,
        timing: 'メジャーアクション',
        skill: '白兵攻撃',
        target: '単体',
        range: '武器',
        cost: 4,
        effect: '対象に白兵攻撃を行う。',
      },
    ],
    specialAttacks: [
      {
        name: 'パワースラッシュ',
        level: 1,
        maxLevel: 3,
        timing: 'メジャーアクション',
        skill: '白兵攻撃',
        target: '単体',
        range: '武器',
        cost: 8,
        effect: '強力な一撃',
      },
    ],
    items: ['射撃武器（小）', 'ブレード（小）'],
  };

  describe('正常系', () => {
    it('ステータス201を返すこと', async () => {
      const res = await createCharacter(basicCharacterData);
      expect(res.status).toBe(201);
    });

    it('作成されたキャラクターのidとurlを返すこと', async () => {
      const res = await createCharacter(basicCharacterData);
      const data = (await res.json()) as any;

      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('url');
      expect(typeof data.id).toBe('string');
      expect(typeof data.url).toBe('string');
    });

    it.skip('UUIDが正しい形式であること', async () => {
      const res = await createCharacter(basicCharacterData);
      const data = (await res.json()) as any;

      // UUID v4 形式の正規表現
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(data.id).toMatch(uuidRegex);
    });

    it.skip('異なるリクエストで異なるIDを返すこと', async () => {
      const testData1 = { ...basicCharacterData, name: 'テスト太郎' };
      const testData2 = { ...basicCharacterData, name: 'テスト花子' };

      const res1 = await createCharacter(testData1);
      const res2 = await createCharacter(testData2);

      const data1 = (await res1.json()) as any;
      const data2 = (await res2.json()) as any;

      expect(res1.status).toBe(201);
      expect(res2.status).toBe(201);
      expect(data1.id).not.toBe(data2.id); // 異なるIDであることを確認
    });

    it.skip('作成したキャラクターをGETで取得できること', async () => {
      // キャラクターを作成
      const createRes = await createCharacter(basicCharacterData);
      const createData = (await createRes.json()) as any;

      expect(createRes.status).toBe(201);
      expect(createData).toHaveProperty('id');

      // 作成したキャラクターをGETで取得
      const getReq = new Request(
        `http://localhost/api/characters/${createData.id}`,
        {
          method: 'GET',
        },
      );
      const getRes = await app.fetch(getReq);

      expect(getRes.status).toBe(200);
      const getData = (await getRes.json()) as any;
      expect(getData.id).toBe(createData.id);
      expect(getData.name).toBe(basicCharacterData.name);
    });
  });

  describe.skip('パスワード', () => {
    it('パスワードありで作成できること', async () => {
      const dataWithPassword = { ...basicCharacterData, password: 'secret123' };
      const res = await createCharacter(dataWithPassword);

      expect(res.status).toBe(201);

      const data = (await res.json()) as any;
      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('url');
    });

    it('パスワードなしで作成できること', async () => {
      const res = await createCharacter(basicCharacterData);

      expect(res.status).toBe(201);

      const data = (await res.json()) as any;
      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('url');
    });
  });

  describe.skip('バリデーション', () => {
    it('nameがない場合もデフォルト値で作成されること（寛容な設計）', async () => {
      const dataWithoutName = { ...basicCharacterData };
      delete (dataWithoutName as any).name;

      const res = await createCharacter(dataWithoutName);
      expect(res.status).toBe(201);

      const data = (await res.json()) as any;
      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('url');
    });
  });

  describe.skip('エラーハンドリング', () => {
    it('不正なJSONで400を返すこと', async () => {
      const req = new Request('http://localhost/api/characters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: '{invalid json}', // 不正なJSON
      });

      const res = await app.fetch(req);
      expect(res.status).toBe(400);

      const data = (await res.json()) as any;
      expect(data).toHaveProperty('error');
    });

    it('寛容なバリデーションで201を返すこと', async () => {
      const validData = {
        ...basicCharacterData,
        selectedClasses: ['マッスル'], // 1つでも成功（寛容な設計）
      };

      const res = await createCharacter(validData);
      expect(res.status).toBe(201);

      const data = (await res.json()) as any;
      expect(data).toHaveProperty('id');
    });
  });
});
