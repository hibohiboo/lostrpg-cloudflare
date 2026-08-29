import { describe, expect, it } from 'vitest';
import {
  parseCustomTablesMarkdown,
  rollsForD66,
  rollsForDice,
  stringifyCustomTables,
} from './customTableMarkdown';

describe('customTableMarkdown', () => {
  it('空文字列を渡すと空配列を返すこと', () => {
    expect(parseCustomTablesMarkdown('')).toEqual([]);
    expect(stringifyCustomTables([])).toBe('');
  });

  it('kind/dice属性を指定した表をMarkdownから読み取れること', () => {
    const md = [
      '##### 表A {.table.kind-wander.dice-2d6}',
      '| 出目 | 内容 |',
      '| --- | --- |',
      '| 2 | 何も見つからない |',
      '| 7 | 平凡な発見 |',
      '| 12 | 大当たり |',
    ].join('\n');

    const tables = parseCustomTablesMarkdown(md);

    expect(tables).toHaveLength(1);
    expect(tables[0].kind).toBe('wander');
    expect(tables[0].diceType).toBe('sum');
    expect(tables[0].diceCount).toBe(2);
    expect(tables[0].diceSides).toBe(6);
    expect(tables[0].rows).toHaveLength(11);
    expect(tables[0].rows[0]).toEqual({ roll: 2, text: '何も見つからない' });
    expect(tables[0].rows.find((r) => r.roll === 7)).toEqual({
      roll: 7,
      text: '平凡な発見',
    });
    expect(tables[0].rows[10]).toEqual({ roll: 12, text: '大当たり' });
  });

  it('kind/dice属性を省略すると encounter・1d6 として扱うこと（後方互換）', () => {
    const md = [
      '##### 表A {.table}',
      '| 出目 | 内容 |',
      '| --- | --- |',
      '| 1 | ツノウサギ 1d6体 |',
      '| 6 | 表B参照 |',
    ].join('\n');

    const tables = parseCustomTablesMarkdown(md);

    expect(tables[0].kind).toBe('encounter');
    expect(tables[0].diceType).toBe('sum');
    expect(tables[0].diceCount).toBe(1);
    expect(tables[0].diceSides).toBe(6);
    expect(tables[0].rows).toHaveLength(6);
    expect(tables[0].rows[0]).toEqual({ roll: 1, text: 'ツノウサギ 1d6体' });
  });

  it('自由入力の xdn（例: 1d8, 3d10）を扱えること', () => {
    const md = [
      '##### 表A {.table.kind-search.dice-1d8}',
      '| 出目 | 内容 |',
      '| --- | --- |',
      '| 8 | レアアイテム |',
    ].join('\n');

    const tables = parseCustomTablesMarkdown(md);

    expect(tables[0].diceType).toBe('sum');
    expect(tables[0].diceCount).toBe(1);
    expect(tables[0].diceSides).toBe(8);
    expect(tables[0].rows).toHaveLength(8);
    expect(tables[0].rows[7]).toEqual({ roll: 8, text: 'レアアイテム' });
  });

  it('kind-other（その他）を扱えること', () => {
    const md = [
      '##### 運勢表 {.table.kind-other.dice-1d6}',
      '| 出目 | 内容 |',
      '| --- | --- |',
      '| 1 | 大凶 |',
    ].join('\n');

    const tables = parseCustomTablesMarkdown(md);

    expect(tables[0].kind).toBe('other');
  });

  it('dice-d66を扱えること（大きい方が十の位、小さい方が一の位。11〜66の21通り）', () => {
    const md = [
      '##### 表A {.table.kind-rest.dice-d66}',
      '| 出目 | 内容 |',
      '| --- | --- |',
      '| 11 | 何も起きない |',
      '| 66 | 大当たり |',
    ].join('\n');

    const tables = parseCustomTablesMarkdown(md);

    expect(tables[0].diceType).toBe('d66');
    expect(tables[0].rows).toHaveLength(21);
    expect(tables[0].rows[0]).toEqual({ roll: 11, text: '何も起きない' });
    expect(tables[0].rows[tables[0].rows.length - 1]).toEqual({
      roll: 66,
      text: '大当たり',
    });
    expect(rollsForD66()).toEqual(tables[0].rows.map((r) => r.roll));
  });

  it('複数の表を混同せずに読み取れること', () => {
    const md = [
      '##### 表A {.table.kind-encounter.dice-1d6}',
      '| 出目 | 内容 |',
      '| --- | --- |',
      '| 1 | 表Aの1 |',
      '##### 表B {.table.kind-rest.dice-2d6}',
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
        diceType: 'sum' as const,
        diceCount: 1,
        diceSides: 6,
        rows: [
          { roll: 1, text: 'ツノウサギ 1d6体' },
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
        diceType: 'sum' as const,
        diceCount: 2,
        diceSides: 6,
        rows: rollsForDice(2, 6).map((roll) => ({
          roll,
          text: roll === 7 ? '平凡な発見' : '',
        })),
      },
      {
        id: 'c',
        kind: 'other' as const,
        name: '運勢表',
        diceType: 'd66' as const,
        diceCount: 2,
        diceSides: 6,
        rows: rollsForD66().map((roll) => ({
          roll,
          text: roll === 66 ? '大吉' : '',
        })),
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
