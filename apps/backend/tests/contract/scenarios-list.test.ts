import { describe, beforeAll, afterAll, beforeEach, it, expect } from 'vitest';
import app from '../../src/index';
import {
  setupTestDatabase,
  teardownTestDatabase,
  cleanupTestData,
} from '../setup/database';

describe('GET /api/scenarios', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  }, 60000);

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    await cleanupTestData();
  });

  const scenariosUrl = 'http://localhost/api/scenarios';

  const createScenario = async (data: any) => {
    const req = new Request(scenariosUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return app.fetch(req);
  };

  const listScenarios = async (query = '') => {
    const req = new Request(`${scenariosUrl}${query}`, { method: 'GET' });
    return app.fetch(req);
  };

  const minimalScenarioData = {
    name: 'Test Scenario',
    players: '',
    time: '',
    limit: '',
    caution: '',
    summary: '',
    content: '',
  };

  describe('正常系', () => {
    it('デフォルトのlimitで一覧を取得できること', async () => {
      for (let i = 0; i < 3; i += 1) {
        const res = await createScenario({
          ...minimalScenarioData,
          name: `Scenario ${i}`,
        });
        expect(res.status).toBe(201);
      }

      const listRes = await listScenarios();
      expect(listRes.status).toBe(200);

      const body = (await listRes.json()) as { data: any[]; hasMore: boolean };
      expect(body.data).toHaveLength(3);
      expect(body.hasMore).toBe(false);
    });

    it('limitを指定するとその件数に絞り込まれ、hasMoreがtrueになること', async () => {
      for (let i = 0; i < 3; i += 1) {
        const res = await createScenario({
          ...minimalScenarioData,
          name: `Scenario ${i}`,
        });
        expect(res.status).toBe(201);
      }

      const listRes = await listScenarios('?limit=2');
      expect(listRes.status).toBe(200);

      const body = (await listRes.json()) as { data: any[]; hasMore: boolean };
      expect(body.data).toHaveLength(2);
      expect(body.hasMore).toBe(true);
    });

    it('offsetを指定すると続きのページを取得できること', async () => {
      for (let i = 0; i < 3; i += 1) {
        const res = await createScenario({
          ...minimalScenarioData,
          name: `Scenario ${i}`,
        });
        expect(res.status).toBe(201);
      }

      const firstPageRes = await listScenarios('?limit=2&offset=0');
      const firstPage = (await firstPageRes.json()) as {
        data: any[];
        hasMore: boolean;
      };

      const secondPageRes = await listScenarios('?limit=2&offset=2');
      const secondPage = (await secondPageRes.json()) as {
        data: any[];
        hasMore: boolean;
      };

      expect(secondPageRes.status).toBe(200);
      expect(secondPage.data).toHaveLength(1);
      expect(secondPage.hasMore).toBe(false);

      const firstPageIds = firstPage.data.map((s) => s.id);
      const secondPageIds = secondPage.data.map((s) => s.id);
      expect(firstPageIds).not.toEqual(expect.arrayContaining(secondPageIds));
    });

    it('nameで名前を部分一致検索できること', async () => {
      await createScenario({ ...minimalScenarioData, name: 'Alice Scenario' });
      await createScenario({ ...minimalScenarioData, name: 'Bob Scenario' });
      await createScenario({ ...minimalScenarioData, name: 'Alicia Scenario' });

      const listRes = await listScenarios('?name=ali');
      expect(listRes.status).toBe(200);

      const body = (await listRes.json()) as { data: any[]; hasMore: boolean };
      expect(body.data.map((s) => s.name).sort()).toEqual([
        'Alice Scenario',
        'Alicia Scenario',
      ]);
    });

    it('hideFromListがtrueのシナリオは一覧から除外されること', async () => {
      await createScenario({ ...minimalScenarioData, name: 'Visible Scenario' });
      await createScenario({
        ...minimalScenarioData,
        name: 'Hidden Scenario',
        hideFromList: true,
      });

      const listRes = await listScenarios();
      expect(listRes.status).toBe(200);

      const body = (await listRes.json()) as { data: any[]; hasMore: boolean };
      expect(body.data.map((s) => s.name)).toEqual(['Visible Scenario']);
    });
  });

  describe('異常系', () => {
    it('limitが範囲外の場合、400エラーを返すこと', async () => {
      const listRes = await listScenarios('?limit=100000');
      expect(listRes.status).toBe(400);
    });

    it('offsetが負数の場合、400エラーを返すこと', async () => {
      const listRes = await listScenarios('?offset=-1');
      expect(listRes.status).toBe(400);
    });
  });
});
