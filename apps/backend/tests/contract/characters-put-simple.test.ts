import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import app from '../../src/index';
import {
  setupTestDatabase,
  teardownTestDatabase,
  cleanupTestData,
} from '../setup/database';

describe('PUT /api/characters/{id} - TDD Step 1', () => {
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

  const updateCharacter = async (id: string, sessionData: any) => {
    const req = new Request(`http://localhost/api/characters/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionData),
    });
    return app.fetch(req);
  };

  // 基本的なキャラクターデータ
  const basicCharacterData = {
    name: '山田太郎',
    selectedClasses: ['マッスル', 'バイオ'],
    skillAllocations: {
      'パワー': 20,
      'タフネス': 30,
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

  // セッション追加データ
  const sessionData = {
    session: {
      sessionName: 'テストセッション',
      gmName: 'GM太郎',
      sessionDate: '2025-09-12',
      currentHp: 25,
      currentSp: 15,
      experiencePoints: 10
    }
  };

  describe('正常系', () => {
    it('ステータス200を返すこと', async () => {
      // キャラクターを作成
      const createRes = await createCharacter(basicCharacterData);
      const createData = (await createRes.json()) as any;

      // セッション情報を追加
      const res = await updateCharacter(createData.id, sessionData);
      expect(res.status).toBe(200);
    });

    it('セッション情報を追加できること', async () => {
      // キャラクターを作成
      const createRes = await createCharacter(basicCharacterData);
      const createData = (await createRes.json()) as any;

      // セッション情報を追加
      const updateRes = await updateCharacter(createData.id, sessionData);
      const updateData = (await updateRes.json()) as any;

      expect(updateRes.status).toBe(200);
      expect(updateData).toHaveProperty('sessions');
      expect(Array.isArray(updateData.sessions)).toBe(true);
      expect(updateData.sessions).toHaveLength(1);
      expect(updateData.sessions[0]).toMatchObject({
        sessionName: 'テストセッション',
        gmName: 'GM太郎',
        sessionDate: '2025-09-12',
        currentHp: 25,
        currentSp: 15,
        experiencePoints: 10
      });
      expect(updateData.sessions[0]).toHaveProperty('id');
      expect(updateData.sessions[0]).toHaveProperty('createdAt');
    });

    it('更新されたキャラクター情報を返すこと', async () => {
      // キャラクターを作成
      const createRes = await createCharacter(basicCharacterData);
      const createData = (await createRes.json()) as any;

      // セッション情報を追加
      const updateRes = await updateCharacter(createData.id, sessionData);
      const updateData = (await updateRes.json()) as any;

      expect(updateRes.status).toBe(200);
      expect(updateData.id).toBe(createData.id);
      expect(updateData.name).toBe(basicCharacterData.name);
      expect(updateData).toHaveProperty('createdAt');
      expect(updateData).toHaveProperty('updatedAt');
      
      // updatedAtが更新されていることを確認
      expect(new Date(updateData.updatedAt).getTime()).toBeGreaterThan(new Date(updateData.createdAt).getTime());
      
      // 元のキャラクター情報も含まれていることを確認
      expect(updateData.selectedClasses).toEqual(basicCharacterData.selectedClasses);
      expect(updateData.skillAllocations).toEqual(basicCharacterData.skillAllocations);
      expect(updateData.heroSkills).toEqual(basicCharacterData.heroSkills);
      expect(updateData.specialAttacks).toEqual(basicCharacterData.specialAttacks);
      expect(updateData.items).toEqual(basicCharacterData.items);
    });

    it('セッション履歴が時系列順になること', async () => {
      // キャラクターを作成
      const createRes = await createCharacter(basicCharacterData);
      const createData = (await createRes.json()) as any;

      // 複数のセッションを時間差をつけて追加
      const sessions = [
        {
          sessionName: '第1回セッション',
          gmName: 'GM太郎',
          sessionDate: '2025-09-10',
          currentHp: 25,
          currentSp: 15,
          experiencePoints: 5
        },
        {
          sessionName: '第2回セッション',
          gmName: 'GM花子',
          sessionDate: '2025-09-12',
          currentHp: 20,
          currentSp: 10,
          experiencePoints: 8
        },
        {
          sessionName: '第3回セッション',
          gmName: 'GM次郎',
          sessionDate: '2025-09-14',
          currentHp: 30,
          currentSp: 20,
          experiencePoints: 12
        }
      ];

      // セッションを順番に追加（時間差をつけて）
      for (let i = 0; i < sessions.length; i += 1) {
        await new Promise(resolve => setTimeout(resolve, 50)); // より確実な時間差
        
        const updateRes = await updateCharacter(createData.id, {
          session: sessions[i]
        });
        const updateData = (await updateRes.json()) as any;
        
        expect(updateRes.status).toBe(200);
        expect(updateData.sessions).toHaveLength(i + 1);
      }

      // 最終的な状態を確認
      const finalRes = await updateCharacter(createData.id, { session: sessions[sessions.length - 1] });
      const finalData = (await finalRes.json()) as any;

      // 3つのセッションが存在することを確認（最後の追加で4つ目になる）
      expect(finalData.sessions).toHaveLength(4);
      
      // 全てのセッションが時系列順（古い順→新しい順）になっていることを確認
      for (let i = 0; i < finalData.sessions.length - 1; i += 1) {
        const currentTime = new Date(finalData.sessions[i].createdAt).getTime();
        const nextTime = new Date(finalData.sessions[i + 1].createdAt).getTime();
        expect(currentTime).toBeLessThan(nextTime);
      }
      
      // セッション名も正しい順序になっていることを確認
      expect(finalData.sessions[0].sessionName).toBe('第1回セッション');
      expect(finalData.sessions[1].sessionName).toBe('第2回セッション');
      expect(finalData.sessions[2].sessionName).toBe('第3回セッション');
      expect(finalData.sessions[3].sessionName).toBe('第3回セッション'); // 重複した最後の追加
    });
  });

  describe('パスワード認証', () => {
    it('保護されたキャラクターはパスワード必須であること', async () => {
      // パスワード保護されたキャラクターを作成
      const protectedCharacterData = {
        ...basicCharacterData,
        password: 'test123'
      };

      const createRes = await createCharacter(protectedCharacterData);
      const createData = (await createRes.json()) as any;

      // パスワードなしでセッション追加を試行
      const sessionData = {
        session: {
          sessionName: 'テストセッション',
          gmName: 'GM太郎',
          sessionDate: '2025-09-12',
          currentHp: 25,
          currentSp: 15,
          experiencePoints: 10
        }
      };

      const updateRes = await updateCharacter(createData.id, sessionData);
      
      // パスワードが必要なので401が返されることを期待
      expect(updateRes.status).toBe(401);
      
      const errorData = (await updateRes.json()) as any;
      expect(errorData).toHaveProperty('error');
      expect(errorData.error).toMatch(/password/i);
    });

    it('正しいパスワードでセッション追加できること', async () => {
      // パスワード保護されたキャラクターを作成
      const protectedCharacterData = {
        ...basicCharacterData,
        password: 'test123'
      };

      const createRes = await createCharacter(protectedCharacterData);
      const createData = (await createRes.json()) as any;

      // 正しいパスワードでセッション追加
      const sessionDataWithPassword = {
        session: {
          sessionName: 'テストセッション',
          gmName: 'GM太郎',
          sessionDate: '2025-09-12',
          currentHp: 25,
          currentSp: 15,
          experiencePoints: 10
        },
        password: 'test123'
      };

      const updateRes = await updateCharacter(createData.id, sessionDataWithPassword);
      
      expect(updateRes.status).toBe(200);
      
      const updateData = (await updateRes.json()) as any;
      expect(updateData.sessions).toHaveLength(1);
      expect(updateData.sessions[0].sessionName).toBe('テストセッション');
    });

    it('間違ったパスワードで401を返すこと', async () => {
      // パスワード保護されたキャラクターを作成
      const protectedCharacterData = {
        ...basicCharacterData,
        password: 'correct123'
      };

      const createRes = await createCharacter(protectedCharacterData);
      const createData = (await createRes.json()) as any;

      // 間違ったパスワードでセッション追加を試行
      const sessionDataWithWrongPassword = {
        session: {
          sessionName: 'テストセッション',
          gmName: 'GM太郎',
          sessionDate: '2025-09-12',
          currentHp: 25,
          currentSp: 15,
          experiencePoints: 10
        },
        password: 'wrong123'  // 間違ったパスワード
      };

      const updateRes = await updateCharacter(createData.id, sessionDataWithWrongPassword);
      
      // 間違ったパスワードなので401が返されることを期待
      expect(updateRes.status).toBe(401);
      
      const errorData = (await updateRes.json()) as any;
      expect(errorData).toHaveProperty('error');
      expect(errorData.error).toMatch(/password/i);
    });
  });

  describe('エラーハンドリング', () => {
    it('存在しないIDで404を返すこと', async () => {
      // 存在しない有効なUUIDを使用
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      
      const sessionData = {
        session: {
          sessionName: 'テストセッション',
          gmName: 'GM太郎',
          sessionDate: '2025-09-12',
          currentHp: 25,
          currentSp: 15,
          experiencePoints: 10
        }
      };

      const updateRes = await updateCharacter(nonExistentId, sessionData);
      
      // 存在しないIDなので404が返されることを期待
      expect(updateRes.status).toBe(404);
      
      const errorData = (await updateRes.json()) as any;
      expect(errorData).toHaveProperty('error');
      expect(errorData.error).toMatch(/not found|character.*not.*exist/i);
    });
  });
});