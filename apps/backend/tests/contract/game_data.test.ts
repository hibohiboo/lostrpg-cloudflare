import { describe, it, expect } from 'vitest';
import app from '../../src/index';

describe('GET /api/game-data', () => {
  // テストヘルパー関数
  const fetchGameData = async () => {
    const req = new Request('http://localhost/api/game-data', {
      method: 'GET',
    });
    return app.fetch(req);
  };

  it('ステータス200を返すこと', async () => {
    const res = await fetchGameData();
    expect(res.status).toBe(200);
  });

  it('Content-TypeがJSONであること', async () => {
    const res = await fetchGameData();
    expect(res.headers.get('content-type')).toContain('application/json');
  });

  // 必須フィールドの配列チェック
  it.each([['classes'], ['skills'], ['heroSkills'], ['items']])(
    '%s配列が含まれること',
    async (fieldName) => {
      const res = await fetchGameData();
      const data = (await res.json()) as any;

      expect(data).toHaveProperty(fieldName);
      expect(Array.isArray(data[fieldName])).toBe(true);
    },
  );

  it('期待するゲームデータ構造を返すこと', async () => {
    const res = await fetchGameData();
    const data = (await res.json()) as any;

    expect(data).toEqual({
      classes: [
        {
          id: expect.any(String),
          name: 'マッスル',
          physicalBase: 3,
          reflexBase: 2,
          sensoryBase: 2,
          intellectualBase: 1,
          supernaturalBase: 0,
          hpBase: 38,
          spBase: 17,
          description: expect.any(String),
        },
      ],
      skills: [
        {
          id: expect.any(String),
          name: 'パワー',
          category: 'physical',
          description: expect.any(String),
          order: expect.any(Number),
        },
      ],
      heroSkills: [
        {
          id: expect.any(String),
          name: 'パワードライブ',
          maxLevel: 7,
          timing: 'メジャーアクション',
          skill: 'パワー',
          target: '単体',
          range: '近接',
          cost: 3,
          effect: expect.any(String),
          classRestriction: null,
        },
      ],
      items: [
        {
          id: expect.any(String),
          name: '射撃武器（小）',
          type: '射撃武器',
          skill: '〈射撃〉',
          modifier: '+20%',
          attackPower: '+4',
          guardValue: '2',
          range: '近距離',
          price: 60,
          effect: expect.any(String),
        },
      ],
    });
  });

  it('CORSヘッダーが適切に設定されていること', async () => {
    const res = await fetchGameData();
    expect(res.headers.get('access-control-allow-origin')).toBe('*');
  });
});
