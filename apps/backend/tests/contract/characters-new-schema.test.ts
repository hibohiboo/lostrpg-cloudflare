import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import app from '../../src/index';
import {
  setupTestDatabase,
  teardownTestDatabase,
  cleanupTestData,
} from '../setup/database';

describe('POST /api/characters - 新データ構造対応', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  }, 60000);

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    await cleanupTestData();
  });

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

  it('完全なヒーロースキル情報セットでキャラクター作成できること', async () => {
    const requestData = {
      name: 'テストキャラクター',
      selectedClasses: ['マッスル', 'テクノロジー'],
      abilityBonus: 'physical',
      skillAllocations: {
        パワー: 20,
        技術: 15
      },
      heroSkills: [
        {
          name: 'オリジナルスキル1',
          level: 2,
          maxLevel: 5,
          timing: 'メジャーアクション',
          skill: '白兵攻撃',
          target: '単体',
          range: '武器',
          cost: 4,
          effect: '対象に白兵攻撃を行う。'
        },
        {
          name: 'カスタムスキル',
          level: 3,
          maxLevel: 7,
          timing: 'セットアップ',
          skill: 'なし',
          target: '自身',
          range: 'なし',
          cost: 2,
          effect: 'パワー判定に+30%'
        }
      ],
      specialAttacks: [
        {
          name: 'カスタム必殺技',
          level: 1,
          maxLevel: 3,
          timing: 'メジャーアクション',
          skill: '白兵攻撃',
          target: '単体',
          range: '武器',
          cost: 8,
          effect: '強力な一撃を放つ'
        }
      ],
      items: ['武器', '防具']
    };

    const response = await createCharacter(requestData);

    expect(response.status).toBe(201);
    
    const data = await response.json();
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('url');
  });

  it('空のスキル配列でもキャラクター作成できること（寛容な設計）', async () => {
    const requestData = {
      name: 'ミニマルキャラクター',
      selectedClasses: [],
      heroSkills: [],
      specialAttacks: [],
      items: []
    };

    const response = await createCharacter(requestData);

    expect(response.status).toBe(201);
  });

  it('nameなしでもキャラクター作成できること（寛容な設計）', async () => {
    const requestData = {
      selectedClasses: ['マッスル'],
      heroSkills: [],
      specialAttacks: [],
      items: []
    };

    const response = await createCharacter(requestData);

    expect(response.status).toBe(201);
  });
});