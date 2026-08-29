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

  describe('カスタム表', () => {
    it('未指定の場合カスタム表・エネミー付録がともに空配列になること', async () => {
      const createRes = await create(minimalData);
      const createData = (await createRes.json()) as any;

      const getRes = await get(createData.id);
      const getData = (await getRes.json()) as any;

      expect(getData.data.customTables).toEqual([]);
      expect(getData.data.enemies).toEqual([]);
    });

    it('本文（Markdown）の {.customTable} セクションから、種別・ダイス設定込みでカスタム表を再生成すること', async () => {
      const content = [
        '## カスタム表 {.customTable}',
        '',
        '##### 表A {.table.kind-encounter.dice-1d6}',
        '',
        '| 出目 | 内容 |',
        '| --- | --- |',
        '| 1 | ツノウサギ 1d6体 |',
        '| 2 | 何も起きない |',
        '| 3 |  |',
        '| 4 |  |',
        '| 5 |  |',
        '| 6 | 表B参照 |',
        '',
        '##### 表B {.table.kind-wander.dice-2d6}',
        '',
        '| 出目 | 内容 |',
        '| --- | --- |',
        '| 2 | 何も見つからない |',
        '| 12 | 大当たり |',
        '',
        '##### 表C {.table.kind-search.dice-1d8}',
        '',
        '| 出目 | 内容 |',
        '| --- | --- |',
        '| 8 | レアアイテム |',
        '',
        '##### 表D {.table.kind-other.dice-d66}',
        '',
        '| 出目 | 内容 |',
        '| --- | --- |',
        '| 66 | 大吉 |',
      ].join('\n');
      // エネミー付録は本文とは独立した参照用データなので、クライアントから送った値をそのまま保存する
      const enemies = [
        { enemyId: 'enemy-1', enemyName: 'ツノウサギ', url: '/enemy/enemy-1' },
      ];

      const createRes = await create({ ...minimalData, content, enemies });
      const createData = (await createRes.json()) as any;

      const getRes = await get(createData.id);
      const getData = (await getRes.json()) as any;

      expect(
        getData.data.customTables.map((t: any) => ({
          kind: t.kind,
          name: t.name,
          diceType: t.diceType,
        })),
      ).toEqual([
        { kind: 'encounter', name: '表A', diceType: 'sum' },
        { kind: 'wander', name: '表B', diceType: 'sum' },
        { kind: 'search', name: '表C', diceType: 'sum' },
        { kind: 'other', name: '表D', diceType: 'd66' },
      ]);
      expect(getData.data.customTables[0].rows).toEqual([
        { roll: 1, text: 'ツノウサギ 1d6体' },
        { roll: 2, text: '何も起きない' },
        { roll: 3, text: '' },
        { roll: 4, text: '' },
        { roll: 5, text: '' },
        { roll: 6, text: '表B参照' },
      ]);
      expect(getData.data.customTables[1].rows).toHaveLength(11);
      expect(getData.data.customTables[1].rows[10]).toEqual({
        roll: 12,
        text: '大当たり',
      });
      expect(getData.data.customTables[2].diceCount).toBe(1);
      expect(getData.data.customTables[2].diceSides).toBe(8);
      expect(getData.data.customTables[3].rows).toHaveLength(21);
      expect(getData.data.customTables[3].rows[0].roll).toBe(11);
      expect(getData.data.customTables[3].rows[20]).toEqual({
        roll: 66,
        text: '大吉',
      });
      expect(getData.data.enemies).toEqual(enemies);
    });

    it('クライアントが送ったcustomTablesは無視され、contentから再生成されること', async () => {
      const createRes = await create({
        ...minimalData,
        content: '',
        customTables: [
          {
            id: 'なりすまし',
            kind: 'encounter',
            name: 'なりすまし表',
            diceType: 'sum',
            diceCount: 1,
            diceSides: 6,
            rows: [],
          },
        ],
      });
      const createData = (await createRes.json()) as any;

      const getRes = await get(createData.id);
      const getData = (await getRes.json()) as any;

      expect(getData.data.customTables).toEqual([]);
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
