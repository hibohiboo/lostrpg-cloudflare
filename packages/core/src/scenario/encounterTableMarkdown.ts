import { buildTableFromRows, getAttributes, tokenizeBlocks, type Block } from './markdownBlocks';
import type { ScenarioEncounterRow, ScenarioEncounterTable } from '@lostrpg/schemas';

// カスタムの出目表（ランダムエンカウント表・散策表・探索表・休憩表）をMarkdownで読み書きするための
// 共通の変換処理。出目の範囲（ランダムエンカウント表は1d6、他の3つは2d6）は呼び出し側から
// rolls として渡す。表本体は「出目」「内容」の2列の表として表現する:
//
//   ##### 表A {.table}
//   | 出目 | 内容 |
//   | --- | --- |
//   | 1   | オオカミ 1d6体 |
//   | 2   | 何も起きない |
//   ...
//   | 6   | 表B参照 |
//
// エネミー付録（encounterTable.enemies）は表とは独立した参照用データのため対象外。

export const ROLLS_1D6 = [1, 2, 3, 4, 5, 6] as const;
export const ROLLS_2D6 = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

// 表の各行 [出目, 内容] を rolls に対応する ScenarioEncounterRow[] へ変換する。
// 出目が rolls に含まれない行は無視する。
const toRollRows = (
  rows: { cells: string[] }[],
  rolls: readonly number[],
): ScenarioEncounterRow[] => {
  const byRoll = new Map<number, string>();
  const validRolls = new Set<number>(rolls);
  rows.forEach((row) => {
    const roll = Number(row.cells[0]);
    if (Number.isInteger(roll) && validRolls.has(roll)) {
      byRoll.set(roll, row.cells[1] ?? '');
    }
  });
  return rolls.map((roll) => ({ roll, text: byRoll.get(roll) ?? '' }));
};

interface RollTableParseState {
  tables: ScenarioEncounterTable[];
  pendingTitle: string;
}

const applyRollTableBlock = (
  state: RollTableParseState,
  block: Block,
  rolls: readonly number[],
): RollTableParseState => {
  if (block.type === 'heading' && block.depth === 5) {
    const [val, key] = getAttributes(block.text);
    if (key !== 'table') return state;
    return { ...state, pendingTitle: val ?? '' };
  }

  if (block.type === 'table') {
    const parsed = buildTableFromRows(block.rows, state.pendingTitle);
    if (!parsed) return { ...state, pendingTitle: '' };
    const table: ScenarioEncounterTable = {
      id: `table-${state.tables.length}`,
      name: parsed.title || `表${state.tables.length + 1}`,
      rows: toRollRows(parsed.rows, rolls),
    };
    return { tables: [...state.tables, table], pendingTitle: '' };
  }

  return state;
};

export const parseRollTablesMarkdown = (
  markdown: string | undefined | null,
  rolls: readonly number[],
): ScenarioEncounterTable[] => {
  const blocks = tokenizeBlocks(markdown ?? '');
  const initial: RollTableParseState = { tables: [], pendingTitle: '' };
  return blocks.reduce(
    (state, block) => applyRollTableBlock(state, block, rolls),
    initial,
  ).tables;
};

const stringifyRollTable = (table: ScenarioEncounterTable): string => {
  const heading = `##### ${table.name} {.table}`;
  const header = '| 出目 | 内容 |';
  const separator = '| --- | --- |';
  const rows = table.rows.map((row) => `| ${row.roll} | ${row.text ?? ''} |`);
  return [heading, '', header, separator, ...rows].join('\n');
};

export const stringifyRollTables = (tables: ScenarioEncounterTable[]): string =>
  tables.map(stringifyRollTable).join('\n\n');

// ランダムエンカウント表（1d6）専用の関数。既存のMarkdown記法・呼び出し側との互換のため残す。
export const parseEncounterTablesMarkdown = (
  markdown: string | undefined | null,
): ScenarioEncounterTable[] => parseRollTablesMarkdown(markdown, ROLLS_1D6);

export const stringifyEncounterTables = stringifyRollTables;
