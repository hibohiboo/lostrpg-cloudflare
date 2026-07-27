import { describe, beforeAll, afterAll, beforeEach, it, expect } from 'vitest';
import app from '../../src/index';
import {
  setupTestDatabase,
  teardownTestDatabase,
  cleanupTestData,
} from '../setup/database';

describe('GET /api/camps', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  }, 60000);

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    await cleanupTestData();
  });

  const campsUrl = 'http://localhost/api/camps';

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

  const listCamps = async (query = '') => {
    const req = new Request(`${campsUrl}${query}`, { method: 'GET' });
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

  describe('正常系', () => {
    it('デフォルトのlimitで一覧を取得できること', async () => {
      for (let i = 0; i < 3; i += 1) {
        const res = await createCamp({
          ...minimalCampData,
          name: `Camp ${i}`,
        });
        expect(res.status).toBe(201);
      }

      const listRes = await listCamps();
      expect(listRes.status).toBe(200);

      const body = (await listRes.json()) as { data: any[]; hasMore: boolean };
      expect(body.data).toHaveLength(3);
      expect(body.hasMore).toBe(false);
    });

    it('limitを指定するとその件数に絞り込まれ、hasMoreがtrueになること', async () => {
      for (let i = 0; i < 3; i += 1) {
        const res = await createCamp({
          ...minimalCampData,
          name: `Camp ${i}`,
        });
        expect(res.status).toBe(201);
      }

      const listRes = await listCamps('?limit=2');
      expect(listRes.status).toBe(200);

      const body = (await listRes.json()) as { data: any[]; hasMore: boolean };
      expect(body.data).toHaveLength(2);
      expect(body.hasMore).toBe(true);
    });

    it('offsetを指定すると続きのページを取得できること', async () => {
      for (let i = 0; i < 3; i += 1) {
        const res = await createCamp({
          ...minimalCampData,
          name: `Camp ${i}`,
        });
        expect(res.status).toBe(201);
      }

      const firstPageRes = await listCamps('?limit=2&offset=0');
      const firstPage = (await firstPageRes.json()) as {
        data: any[];
        hasMore: boolean;
      };

      const secondPageRes = await listCamps('?limit=2&offset=2');
      const secondPage = (await secondPageRes.json()) as {
        data: any[];
        hasMore: boolean;
      };

      expect(secondPageRes.status).toBe(200);
      expect(secondPage.data).toHaveLength(1);
      expect(secondPage.hasMore).toBe(false);

      const firstPageIds = firstPage.data.map((c) => c.id);
      const secondPageIds = secondPage.data.map((c) => c.id);
      expect(firstPageIds).not.toEqual(expect.arrayContaining(secondPageIds));
    });

    it('nameで名前を部分一致検索できること', async () => {
      await createCamp({ ...minimalCampData, name: 'Alice Camp' });
      await createCamp({ ...minimalCampData, name: 'Bob Camp' });
      await createCamp({ ...minimalCampData, name: 'Alicia Camp' });

      const listRes = await listCamps('?name=ali');
      expect(listRes.status).toBe(200);

      const body = (await listRes.json()) as { data: any[]; hasMore: boolean };
      expect(body.data.map((c) => c.name).sort()).toEqual([
        'Alice Camp',
        'Alicia Camp',
      ]);
    });
  });

  describe('異常系', () => {
    it('limitが範囲外の場合、400エラーを返すこと', async () => {
      const listRes = await listCamps('?limit=100000');
      expect(listRes.status).toBe(400);
    });

    it('offsetが負数の場合、400エラーを返すこと', async () => {
      const listRes = await listCamps('?offset=-1');
      expect(listRes.status).toBe(400);
    });
  });
});
