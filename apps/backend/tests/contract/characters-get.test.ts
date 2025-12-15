import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import app from '../../src/index';
import {
  setupTestDatabase,
  teardownTestDatabase,
  cleanupTestData,
} from '../setup/database';

describe('GET /api/characters/{id}', () => {
  // テスト用データベースのセットアップ
  beforeAll(async () => {
    await setupTestDatabase();
  }, 60000);

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
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

  const getCharacter = async (id: string) => {
    const req = new Request(`http://localhost/api/characters/${id}`, {
      method: 'GET',
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
        effect: '対象に白兵攻撃を行う。'
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
        effect: '強力な一撃'
      },
    ],
    items: ['射撃武器（小）', 'ブレード（小）'],
    sessions: [],
  };

  describe('正常系', () => {
    it('ステータス200を返すこと', async () => {
      // キャラクターを作成
      const createRes = await createCharacter(basicCharacterData);
      const createData = (await createRes.json()) as any;

      // 作成したキャラクターを取得
      const res = await getCharacter(createData.id);
      expect(res.status).toBe(200);
    });

    it('完全なキャラクター情報を返すこと', async () => {
      // キャラクターを作成
      const createRes = await createCharacter(basicCharacterData);
      const createData = (await createRes.json()) as any;

      // 作成したキャラクターを取得
      const res = await getCharacter(createData.id);
      const data = (await res.json()) as any;

      expect(res.status).toBe(200);
      expect(data.id).toBe(createData.id);
      expect(data.name).toBe(basicCharacterData.name);
      expect(data.selectedClasses).toEqual(basicCharacterData.selectedClasses);
      expect(data.skillAllocations).toEqual(
        basicCharacterData.skillAllocations,
      );
      expect(data.heroSkills).toEqual(basicCharacterData.heroSkills);
      expect(data.specialAttacks).toEqual(basicCharacterData.specialAttacks);
      expect(data.items).toEqual(basicCharacterData.items);
      expect(data).toHaveProperty('createdAt');
      expect(data).toHaveProperty('updatedAt');
    });

    it('セッション履歴が含まれること', async () => {
      // キャラクターを作成
      const createRes = await createCharacter(basicCharacterData);
      const createData = (await createRes.json()) as any;

      // 作成したキャラクターを取得
      const res = await getCharacter(createData.id);
      const data = (await res.json()) as any;
      console.log(data);
      expect(res.status).toBe(200);
      expect(data).toHaveProperty('sessions');
      expect(Array.isArray(data.sessions)).toBe(true);
      expect(data.sessions).toHaveLength(0); // 初期状態では空
    });
  });

  describe('エラーハンドリング', () => {
    it('存在しないIDで404を返すこと', async () => {
      const nonExistentId = '550e8400-e29b-41d4-a716-446655440000';
      const res = await getCharacter(nonExistentId);

      expect(res.status).toBe(404);

      const data = (await res.json()) as any;
      expect(data).toHaveProperty('error');
    });

    it('不正なUUID形式で400を返すこと', async () => {
      const invalidId = 'invalid-uuid';
      const res = await getCharacter(invalidId);

      expect(res.status).toBe(400);

      const data = (await res.json()) as any;
      expect(data).toHaveProperty('error');
    });
  });
});
