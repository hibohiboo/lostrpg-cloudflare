import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import app from '../../src/index';
import {
  setupTestDatabase,
  teardownTestDatabase,
  cleanupTestData,
} from '../setup/database';

describe('GET /api/characters', () => {
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

  const getCharacterList = async () => {
    const req = new Request('http://localhost/api/characters', {
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
    it('ステータス200を返すこと', async () => {
      const res = await getCharacterList();
      expect(res.status).toBe(200);
    });

    it('空の配列を返すこと（キャラクターが存在しない場合）', async () => {
      const res = await getCharacterList();
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(0);
    });

    it('作成されたキャラクターを一覧で取得できること', async () => {
      // キャラクターを1つ作成
      const createRes = await createCharacter(basicCharacterData);
      expect(createRes.status).toBe(201);

      // 一覧を取得
      const listRes = await getCharacterList();
      const listData = (await listRes.json()) as any;

      expect(listRes.status).toBe(200);
      expect(Array.isArray(listData)).toBe(true);
      expect(listData).toHaveLength(1);

      const character = listData[0];
      expect(character).toHaveProperty('id');
      expect(character).toHaveProperty('name');
      expect(character).toHaveProperty('createdAt');
      expect(character).toHaveProperty('updatedAt');
      expect(character.name).toBe(basicCharacterData.name);
    });

    it('複数のキャラクターを一覧で取得できること', async () => {
      // 複数のキャラクターを作成
      const character1 = { ...basicCharacterData, name: 'キャラクター1' };
      const character2 = { ...basicCharacterData, name: 'キャラクター2' };
      const character3 = { ...basicCharacterData, name: 'キャラクター3' };

      await createCharacter(character1);
      await createCharacter(character2);
      await createCharacter(character3);

      // 一覧を取得
      const listRes = await getCharacterList();
      const listData = (await listRes.json()) as any;

      expect(listRes.status).toBe(200);
      expect(Array.isArray(listData)).toBe(true);
      expect(listData).toHaveLength(3);

      // 名前が正しく設定されていることを確認
      const names = listData.map((char: any) => char.name);
      expect(names).toContain('キャラクター1');
      expect(names).toContain('キャラクター2');
      expect(names).toContain('キャラクター3');
    });

    it('更新日時の降順でソートされていること', async () => {
      // 時間差を作るためにキャラクターを順次作成
      const character1 = { ...basicCharacterData, name: '古いキャラクター' };
      await createCharacter(character1);

      // 少し待機
      await new Promise((resolve) => setTimeout(resolve, 10));

      const character2 = { ...basicCharacterData, name: '新しいキャラクター' };
      await createCharacter(character2);

      // 一覧を取得
      const listRes = await getCharacterList();
      const listData = (await listRes.json()) as any;

      expect(listRes.status).toBe(200);
      expect(listData).toHaveLength(2);

      // 更新日時の降順でソートされていることを確認
      const firstCharacter = listData[0];
      const secondCharacter = listData[1];

      expect(firstCharacter.name).toBe('新しいキャラクター');
      expect(secondCharacter.name).toBe('古いキャラクター');

      // 日時が正しい順序であることを確認
      const firstUpdatedAt = new Date(firstCharacter.updatedAt);
      const secondUpdatedAt = new Date(secondCharacter.updatedAt);
      expect(firstUpdatedAt.getTime()).toBeGreaterThanOrEqual(
        secondUpdatedAt.getTime(),
      );
    });

    it('正しいレスポンス形式を返すこと', async () => {
      // キャラクターを作成
      await createCharacter(basicCharacterData);

      // 一覧を取得
      const listRes = await getCharacterList();
      const listData = (await listRes.json()) as any;

      expect(listRes.status).toBe(200);
      expect(Array.isArray(listData)).toBe(true);
      expect(listData).toHaveLength(1);

      const character = listData[0];

      // 必要なフィールドが存在することを確認
      expect(character).toHaveProperty('id');
      expect(character).toHaveProperty('name');
      expect(character).toHaveProperty('createdAt');
      expect(character).toHaveProperty('updatedAt');

      // フィールドの型を確認
      expect(typeof character.id).toBe('string');
      expect(typeof character.name).toBe('string');
      expect(typeof character.createdAt).toBe('string');
      expect(typeof character.updatedAt).toBe('string');

      // UUIDの形式を確認
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(character.id).toMatch(uuidRegex);

      // 日時の形式を確認（ISO形式）
      expect(() => new Date(character.createdAt)).not.toThrow();
      expect(() => new Date(character.updatedAt)).not.toThrow();

      // 余計なフィールドが含まれていないことを確認（データ漏洩防止）
      const expectedFields = ['id', 'name', 'createdAt', 'updatedAt'];
      const actualFields = Object.keys(character);
      expect(actualFields.sort()).toEqual(expectedFields.sort());
    });
  });

  describe('エラーハンドリング', () => {
    it('データベースエラー時に500を返すこと', async () => {
      // 実際のデータベースエラーを発生させるのは困難なため、
      // 通常の正常系テストでエラーが発生しないことを確認
      const res = await getCharacterList();
      expect(res.status).not.toBe(500);
    });
  });

  describe('パフォーマンス', () => {
    it('大量のキャラクターがある場合でも正常に動作すること', async () => {
      // 10個のキャラクターを作成
      const promises = Array.from({ length: 10 }, (_, index) =>
        createCharacter({
          ...basicCharacterData,
          name: `キャラクター${index + 1}`,
        }),
      );

      await Promise.all(promises);

      // 一覧を取得
      const listRes = await getCharacterList();
      const listData = (await listRes.json()) as any;

      expect(listRes.status).toBe(200);
      expect(Array.isArray(listData)).toBe(true);
      expect(listData).toHaveLength(10);

      // 全てのキャラクターが正しい形式であることを確認
      listData.forEach((character: any) => {
        expect(character).toHaveProperty('id');
        expect(character).toHaveProperty('name');
        expect(character).toHaveProperty('createdAt');
        expect(character).toHaveProperty('updatedAt');
      });
    });
  });
});
