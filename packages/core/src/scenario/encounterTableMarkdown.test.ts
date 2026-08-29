import { describe, expect, it } from 'vitest';
import {
  parseEncounterTablesMarkdown,
  parseRollTablesMarkdown,
  ROLLS_2D6,
  stringifyEncounterTables,
  stringifyRollTables,
} from './encounterTableMarkdown';

describe('encounterTableMarkdown', () => {
  it('空文字列を渡すと空配列を返すこと', () => {
    expect(parseEncounterTablesMarkdown('')).toEqual([]);
    expect(stringifyEncounterTables([])).toBe('');
  });

  it('1つの表をMarkdownから読み取れること', () => {
    const md = [
      '##### 表A {.table}',
      '| 出目 | 内容 |',
      '| --- | --- |',
      '| 1 | オオカミ 1d6体 |',
      '| 2 | 何も起きない |',
      '| 3 |  |',
      '| 4 |  |',
      '| 5 |  |',
      '| 6 | 表B参照 |',
    ].join('\n');

    const tables = parseEncounterTablesMarkdown(md);

    expect(tables).toHaveLength(1);
    expect(tables[0].name).toBe('表A');
    expect(tables[0].rows).toEqual([
      { roll: 1, text: 'オオカミ 1d6体' },
      { roll: 2, text: '何も起きない' },
      { roll: 3, text: '' },
      { roll: 4, text: '' },
      { roll: 5, text: '' },
      { roll: 6, text: '表B参照' },
    ]);
  });

  it('複数の表を混同せずに読み取れること', () => {
    const md = [
      '##### 表A {.table}',
      '| 出目 | 内容 |',
      '| --- | --- |',
      '| 1 | 表Aの1 |',
      '##### 表B {.table}',
      '| 出目 | 内容 |',
      '| --- | --- |',
      '| 1 | 表Bの1 |',
    ].join('\n');

    const tables = parseEncounterTablesMarkdown(md);

    expect(tables.map((t) => t.name)).toEqual(['表A', '表B']);
    expect(tables[0].rows[0].text).toBe('表Aの1');
    expect(tables[1].rows[0].text).toBe('表Bの1');
  });

  it('stringifyしたものをparseすると、名前と各出目の内容が一致すること（ラウンドトリップ）', () => {
    const tables = [
      {
        id: 'a',
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
        id: 'b',
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
    ];

    const md = stringifyEncounterTables(tables);
    const reparsed = parseEncounterTablesMarkdown(md);

    expect(reparsed.map((t) => ({ name: t.name, rows: t.rows }))).toEqual(
      tables.map((t) => ({ name: t.name, rows: t.rows })),
    );
  });

  it('rollsに2〜12（2d6）を渡すと、出目2〜12の行として読み取れること（散策表・探索表・休憩表用）', () => {
    const md = [
      '##### 表A {.table}',
      '| 出目 | 内容 |',
      '| --- | --- |',
      '| 2 | 悪夢を見る |',
      '| 7 | 何も起きない |',
      '| 12 | 大当たり |',
    ].join('\n');

    const tables = parseRollTablesMarkdown(md, ROLLS_2D6);

    expect(tables).toHaveLength(1);
    expect(tables[0].rows).toHaveLength(11);
    expect(tables[0].rows[0]).toEqual({ roll: 2, text: '悪夢を見る' });
    expect(tables[0].rows.find((r) => r.roll === 7)).toEqual({ roll: 7, text: '何も起きない' });
    expect(tables[0].rows[tables[0].rows.length - 1]).toEqual({ roll: 12, text: '大当たり' });
  });

  it('2d6の表もラウンドトリップできること', () => {
    const tables = [
      {
        id: 'a',
        name: '表A',
        rows: ROLLS_2D6.map((roll) => ({ roll, text: roll === 7 ? '何も起きない' : '' })),
      },
    ];

    const md = stringifyRollTables(tables);
    const reparsed = parseRollTablesMarkdown(md, ROLLS_2D6);

    expect(reparsed.map((t) => ({ name: t.name, rows: t.rows }))).toEqual(
      tables.map((t) => ({ name: t.name, rows: t.rows })),
    );
  });
});
