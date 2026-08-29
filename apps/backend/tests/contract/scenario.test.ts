import { describe, beforeAll, afterAll, beforeEach, it, expect } from 'vitest';
import app from '../../src/index';
import {
  setupTestDatabase,
  teardownTestDatabase,
  cleanupTestData,
} from '../setup/database';

describe('POST /api/scenarios', () => {
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
  const url = 'http://localhost/api/scenarios';
  // テストヘルパー関数
  const create = async (data: any) => {
    const req = new Request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return app.fetch(req);
  };
  const update = async (id: string, sessionData: any) => {
    const req = new Request(`${url}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionData),
    });
    return app.fetch(req);
  };
  const get = async (id: string) => {
    const req = new Request(`${url}/${id}`, { method: 'GET' });
    return app.fetch(req);
  };
  const minimalData = {
    name: 'テストシナリオ',
    players: '',
    time: '',
    limit: '',
    caution: '',
    summary: '',
    content: '',
  };
  describe('正常系', () => {
    it('ステータス201を返すこと', async () => {
      const res = await create(minimalData);
      expect(res.status).toBe(201);
    });
    it('作成されたシナリオのidを返すこと', async () => {
      const res = await create(minimalData);
      const data = (await res.json()) as any;
      expect(res.status).toBe(201);
      expect(data).toHaveProperty('id');
      // UUID v4 形式の正規表現
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(data.id).toMatch(uuidRegex);
    });
  });
  describe('本文の構造化', () => {
    it('作成時にcontentからphasesが生成され、詳細取得で返ること', async () => {
      const md = [
        '## 探索フェイズ',
        '### チェックポイント',
        '#### 描写',
        'チェックポイントの描写です',
      ].join('\n');

      const createRes = await create({ ...minimalData, content: md });
      const createData = (await createRes.json()) as any;
      expect(createRes.status).toBe(201);

      const getRes = await get(createData.id);
      const getData = (await getRes.json()) as any;

      expect(getRes.status).toBe(200);
      expect(getData.data.phases).toEqual([
        {
          name: '探索フェイズ',
          scenes: [
            {
              name: 'チェックポイント',
              type: null,
              alias: null,
              next: null,
              lines: [],
              events: [
                {
                  name: '描写',
                  type: 'view',
                  lines: ['チェックポイントの描写です'],
                  items: [],
                  tables: [],
                  links: [],
                },
              ],
            },
          ],
        },
      ]);
    });

    it('クライアントが送ったphasesは無視され、contentから再生成されること', async () => {
      const createRes = await create({
        ...minimalData,
        content: '## 探索フェイズ',
        phases: [{ name: 'なりすまし', scenes: [] }],
      });
      const createData = (await createRes.json()) as any;

      const getRes = await get(createData.id);
      const getData = (await getRes.json()) as any;

      expect(getData.data.phases).toEqual([
        { name: '探索フェイズ', scenes: [] },
      ]);
    });

    it('更新時にcontentを変更するとphasesも更新されること', async () => {
      const createRes = await create({ ...minimalData, content: '## A' });
      const createData = (await createRes.json()) as any;

      const updateRes = await update(createData.id, {
        ...minimalData,
        content: '## B',
      });
      expect(updateRes.status).toBe(200);

      const getRes = await get(createData.id);
      const getData = (await getRes.json()) as any;
      expect(getData.data.phases).toEqual([{ name: 'B', scenes: [] }]);
    });

    it('contentのplayers/time/limit/caution見出しから値が抽出されること', async () => {
      const md = [
        '## 3人 {.players}',
        '## 3時間 {.time}',
        '## 4 {.limit}',
        '## 時間は目安です {.caution}',
        '## キャンプフェイズ',
      ].join('\n');

      const createRes = await create({ ...minimalData, content: md });
      const createData = (await createRes.json()) as any;

      const getRes = await get(createData.id);
      const getData = (await getRes.json()) as any;

      expect(getData.data.players).toBe('3人');
      expect(getData.data.time).toBe('3時間');
      expect(getData.data.limit).toBe('4');
      expect(getData.data.caution).toBe('時間は目安です');
    });

    it('クライアントが送ったplayers等は無視され、contentから再生成されること', async () => {
      const createRes = await create({
        ...minimalData,
        content: '## 3人 {.players}',
        players: 'なりすまし',
      });
      const createData = (await createRes.json()) as any;

      const getRes = await get(createData.id);
      const getData = (await getRes.json()) as any;

      expect(getData.data.players).toBe('3人');
    });
  });

  describe('ランダムエンカウント表', () => {
    it('未指定の場合デフォルト表になること', async () => {
      const createRes = await create(minimalData);
      const createData = (await createRes.json()) as any;

      const getRes = await get(createData.id);
      const getData = (await getRes.json()) as any;

      expect(getData.data.encounterTable).toEqual({
        mode: 'default',
        tables: [],
        enemies: [],
      });
    });

    it('本文（Markdown）の {.encounterTable} セクションからカスタム表を再生成すること', async () => {
      const content = [
        '## ランダムエンカウント表 {.encounterTable}',
        '',
        '##### 表A {.table}',
        '',
        '| 出目 | 内容 |',
        '| --- | --- |',
        '| 1 | オオカミ 1d6体 |',
        '| 2 | 何も起きない |',
        '| 3 |  |',
        '| 4 |  |',
        '| 5 |  |',
        '| 6 | 表B参照 |',
        '',
        '##### 表B {.table}',
        '',
        '| 出目 | 内容 |',
        '| --- | --- |',
        '| 1 | 強敵に遭遇した |',
        '| 2 |  |',
        '| 3 |  |',
        '| 4 |  |',
        '| 5 |  |',
        '| 6 |  |',
      ].join('\n');
      // エネミー付録は本文とは独立した参照用データなので、クライアントから送った値をそのまま保存する
      const enemies = [{ enemyId: 'enemy-1', enemyName: 'オオカミ', note: '表Aの1で1d6体登場' }];

      const createRes = await create({
        ...minimalData,
        content,
        encounterTable: { mode: 'default', tables: [], enemies },
      });
      const createData = (await createRes.json()) as any;

      const getRes = await get(createData.id);
      const getData = (await getRes.json()) as any;

      expect(getData.data.encounterTable).toEqual({
        mode: 'custom',
        tables: [
          {
            id: 'table-0',
            name: '表A',
            rows: [
              { roll: 1, text: 'オオカミ 1d6体' },
              { roll: 2, text: '何も起きない' },
              { roll: 3, text: '' },
              { roll: 4, text: '' },
              { roll: 5, text: '' },
              { roll: 6, text: '表B参照' },
            ],
          },
          {
            id: 'table-1',
            name: '表B',
            rows: [
              { roll: 1, text: '強敵に遭遇した' },
              { roll: 2, text: '' },
              { roll: 3, text: '' },
              { roll: 4, text: '' },
              { roll: 5, text: '' },
              { roll: 6, text: '' },
            ],
          },
        ],
        enemies,
      });
    });

    it('クライアントが送ったtables/modeは無視され、contentから再生成されること', async () => {
      const createRes = await create({
        ...minimalData,
        content: '',
        encounterTable: {
          mode: 'custom',
          tables: [{ id: 'なりすまし', name: 'なりすまし表', rows: [] }],
          enemies: [],
        },
      });
      const createData = (await createRes.json()) as any;

      const getRes = await get(createData.id);
      const getData = (await getRes.json()) as any;

      expect(getData.data.encounterTable).toEqual({ mode: 'default', tables: [], enemies: [] });
    });
  });

  describe('パスワード', () => {
    it('パスワードありで作成できること', async () => {
      const dataWithPassword = { ...minimalData, password: 'secret123' };
      const res = await create(dataWithPassword);

      expect(res.status).toBe(201);
    });

    it('パスワードなしで作成できること', async () => {
      const res = await create(minimalData);

      expect(res.status).toBe(201);
    });
    it('保護されたデータはパスワード必須であること', async () => {
      const protectedData = {
        ...minimalData,
        password: 'test123',
      };
      const createRes = await create(protectedData);
      const createData = (await createRes.json()) as any;

      const updateRes = await update(createData.id, minimalData);

      expect(updateRes.status).toBe(401);
    });
    it('保護されたデータを更新できること', async () => {
      const protectedData = {
        ...minimalData,
        password: 'test123',
      };
      const createRes = await create(protectedData);
      const createData = (await createRes.json()) as any;

      const updateRes = await update(createData.id, protectedData);

      expect(updateRes.status).toBe(200);
    });
  });
});
