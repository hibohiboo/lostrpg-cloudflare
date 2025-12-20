import { describe, beforeAll, afterAll, beforeEach, it, expect } from 'vitest';
import app from '../../src/index';
import {
  setupTestDatabase,
  teardownTestDatabase,
  cleanupTestData,
} from '../setup/database';

describe('GET /api/camps/:id/characters', () => {
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

  const campsUrl = 'http://localhost/api/camps';
  const charactersUrl = 'http://localhost/api/characters';

  // テストヘルパー関数
  const createCamp = async (data: any) => {
    const req = new Request(campsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return app.fetch(req);
  };

  const createCharacter = async (data: any) => {
    const req = new Request(charactersUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return app.fetch(req);
  };

  const updateCharacter = async (id: string, data: any) => {
    const req = new Request(`${charactersUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return app.fetch(req);
  };

  const getCampCharacters = async (campId: string) => {
    const req = new Request(`${campsUrl}/${campId}/characters`, {
      method: 'GET',
    });
    return app.fetch(req);
  };

  const minimalCampData = {
    playerName: '',
    name: 'Test Camp',
    imageUrl: '',
    facilities: [],
    items: [],
    unusedCampPoint: 0,
    totalCampPoint: 0,
    summary: '',
    freeWriting: '',
  };

  const minimalCharacterData = {
    name: 'Test Character',
    classes: [],
    specialties: [],
    abilities: [],
    gaps: [],
    bags: [],
    items: [],
    equipments: [],
    staminaBase: 5,
    willPowerBase: 10,
    statusAilments: [],
    carryingCapacity: 5,
    stamina: 10,
    willPower: 10,
    damagedSpecialties: [],
    unusedExperience: 0,
    totalExperience: 0,
    backbones: [],
    subbliments: {
      useStrangeField: false,
      useDragonPlain: false,
    },
  };

  describe('正常系', () => {
    it('キャラクター作成後、キャンプに紐づくキャラクター一覧を取得できること', async () => {
      // 1. キャンプを作成
      const campRes = await createCamp(minimalCampData);
      const campData = (await campRes.json()) as any;
      expect(campRes.status).toBe(201);

      // 2. そのキャンプに紐づくキャラクターを作成
      const characterData = {
        ...minimalCharacterData,
        campId: campData.id,
      };
      const charRes = await createCharacter(characterData);
      const charData = (await charRes.json()) as any;
      expect(charRes.status).toBe(201);

      // 3. キャンプに紐づくキャラクター一覧を取得
      const listRes = await getCampCharacters(campData.id);
      expect(listRes.status).toBe(200);

      const characters = (await listRes.json()) as any[];
      expect(characters).toHaveLength(1);
      expect(characters[0].id).toBe(charData.id);
      expect(characters[0].name).toBe('Test Character');
    });

    it('キャラクターのcampIdを削除した後、空配列が返ること', async () => {
      // 1. キャンプを作成
      const campRes = await createCamp(minimalCampData);
      const campData = (await campRes.json()) as any;
      expect(campRes.status).toBe(201);

      // 2. そのキャンプに紐づくキャラクターを作成
      const characterData = {
        ...minimalCharacterData,
        campId: campData.id,
      };
      const charRes = await createCharacter(characterData);
      const charData = (await charRes.json()) as any;
      expect(charRes.status).toBe(201);

      // 3. キャラクターのcampIdを削除（nullまたは未設定にする）
      const updateData = {
        campId: undefined, // campIdを削除
      };
      const updateRes = await updateCharacter(charData.id, updateData);
      expect(updateRes.status).toBe(200);

      // 4. キャンプに紐づくキャラクター一覧を取得
      const listRes = await getCampCharacters(campData.id);
      expect(listRes.status).toBe(200);

      const characters = (await listRes.json()) as any[];
      expect(characters).toHaveLength(0);
    });

    it('複数のキャラクターが紐づいている場合、すべて取得できること', async () => {
      // 1. キャンプを作成
      const campRes = await createCamp(minimalCampData);
      const campData = (await campRes.json()) as any;
      expect(campRes.status).toBe(201);

      // 2. 複数のキャラクターを作成
      const char1Data = {
        ...minimalCharacterData,
        name: 'Character 1',
        campId: campData.id,
      };
      const char1Res = await createCharacter(char1Data);
      expect(char1Res.status).toBe(201);

      const char2Data = {
        ...minimalCharacterData,
        name: 'Character 2',
        campId: campData.id,
      };
      const char2Res = await createCharacter(char2Data);
      expect(char2Res.status).toBe(201);

      // 3. キャンプに紐づくキャラクター一覧を取得
      const listRes = await getCampCharacters(campData.id);
      expect(listRes.status).toBe(200);

      const characters = (await listRes.json()) as any[];
      expect(characters).toHaveLength(2);
      expect(characters.map((c) => c.name).sort()).toEqual([
        'Character 1',
        'Character 2',
      ]);
    });
  });

  describe('異常系', () => {
    it('存在しないキャンプIDの場合、404エラーを返すこと', async () => {
      const fakeUuid = '00000000-0000-0000-0000-000000000000';
      const listRes = await getCampCharacters(fakeUuid);

      expect(listRes.status).toBe(404);
    });

    it('不正なUUID形式の場合、400エラーを返すこと', async () => {
      const listRes = await getCampCharacters('invalid-uuid');

      expect(listRes.status).toBe(400);
    });
  });
});
