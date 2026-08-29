import { describe, expect, it } from 'vitest';
import {
  parseCustomTablesMarkdown,
  rollsForDice,
  stringifyCustomTables,
} from './customTableMarkdown';

describe('customTableMarkdown', () => {
  it('空文字列を渡すと空配列を返すこと', () => {
    expect(parseCustomTablesMarkdown('')).toEqual([]);
    expect(stringifyCustomTables([])).toBe('');
  });

  it('kind/d/s属性を指定した表をMarkdownから読み取れること', () => {
    const md = [
      '##### 表A {.table.kind-wander.d2.s6}',
      '| 出目 | 内容 |',
      '| --- | --- |',
      '| 2 | 何も見つからない |',
      '| 7 | 平凡な発見 |',
      '| 12 | 大当たり |',
    ].join('\n');

    const tables = parseCustomTablesMarkdown(md);

    expect(tables).toHaveLength(1);
    expect(tables[0].kind).toBe('wander');
    expect(tables[0].diceCount).toBe(2);
    expect(tables[0].diceSides).toBe(6);
    expect(tables[0].rows).toHaveLength(11);
    expect(tables[0].rows[0]).toEqual({ roll: 2, text: '何も見つからない' });
    expect(tables[0].rows.find((r) => r.roll === 7)).toEqual({ roll: 7, text: '平凡な発見' });
    expect(tables[0].rows[10]).toEqual({ roll: 12, text: '大当たり' });
  });

  it('kind/d/s属性を省略すると encounter・1d6 として扱うこと（後方互換）', () => {
    const md = [
      '##### 表A {.table}',
      '| 出目 | 内容 |',
      '| --- | --- |',
      '| 1 | オオカミ 1d6体 |',
      '| 6 | 表B参照 |',
    ].join('\n');

    const tables = parseCustomTablesMarkdown(md);

    expect(tables[0].kind).toBe('encounter');
    expect(tables[0].diceCount).toBe(1);
    expect(tables[0].diceSides).toBe(6);
    expect(tables[0].rows).toHaveLength(6);
    expect(tables[0].rows[0]).toEqual({ roll: 1, text: 'オオカミ 1d6体' });
  });

  it('1d8など任意の面数を扱えること', () => {
    const md = [
      '##### 表A {.table.kind-search.d1.s8}',
      '| 出目 | 内容 |',
      '| --- | --- |',
      '| 8 | レアアイテム |',
    ].join('\n');

    const tables = parseCustomTablesMarkdown(md);

    expect(tables[0].diceCount).toBe(1);
    expect(tables[0].diceSides).toBe(8);
    expect(tables[0].rows).toHaveLength(8);
    expect(tables[0].rows[7]).toEqual({ roll: 8, text: 'レアアイテム' });
  });

  it('複数の表を混同せずに読み取れること', () => {
    const md = [
      '##### 表A {.table.kind-encounter.d1.s6}',
      '| 出目 | 内容 |',
      '| --- | --- |',
      '| 1 | 表Aの1 |',
      '##### 表B {.table.kind-rest.d2.s6}',
      '| 出目 | 内容 |',
      '| --- | --- |',
      '| 2 | 表Bの2 |',
    ].join('\n');

    const tables = parseCustomTablesMarkdown(md);

    expect(tables.map((t) => ({ name: t.name, kind: t.kind }))).toEqual([
      { name: '表A', kind: 'encounter' },
      { name: '表B', kind: 'rest' },
    ]);
  });

  it('stringifyしたものをparseすると、種別・ダイス設定・各出目の内容が一致すること（ラウンドトリップ）', () => {
    const tables = [
      {
        id: 'a',
        kind: 'encounter' as const,
        name: '表A',
        diceCount: 1,
        diceSides: 6,
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
        id: 'b',
        kind: 'wander' as const,
        name: '表B',
        diceCount: 2,
        diceSides: 6,
        rows: rollsForDice(2, 6).map((roll) => ({ roll, text: roll === 7 ? '平凡な発見' : '' })),
      },
    ];

    const md = stringifyCustomTables(tables);
    const reparsed = parseCustomTablesMarkdown(md);

    // idはMarkdownに保存されず、パース時にindexから振り直されるため比較対象から除く
    expect(reparsed.map(({ id: _id, ...rest }) => rest)).toEqual(
      tables.map(({ id: _id, ...rest }) => rest),
    );
  });
});
