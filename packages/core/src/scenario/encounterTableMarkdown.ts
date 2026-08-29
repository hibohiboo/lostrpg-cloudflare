import { buildTableFromRows, getAttributes, tokenizeBlocks, type Block } from './markdownBlocks';
import type { ScenarioEncounterRow, ScenarioEncounterTable } from '@lostrpg/schemas';

// カスタムのランダムエンカウント表をMarkdownで読み書きするための変換処理。
// エンカウント表本体は「出目」「内容」の2列の表として表現する:
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

const ROLLS = [1, 2, 3, 4, 5, 6] as const;

// 表の各行 [出目, 内容] を 1〜6 のロールに対応する ScenarioEncounterRow[] へ変換する。
// 出目が1〜6の整数として解釈できない行は無視する。
const toEncounterRows = (rows: { cells: string[] }[]): ScenarioEncounterRow[] => {
  const byRoll = new Map<number, string>();
  rows.forEach((row) => {
    const roll = Number(row.cells[0]);
    if (Number.isInteger(roll) && roll >= 1 && roll <= 6) {
      byRoll.set(roll, row.cells[1] ?? '');
    }
  });
  return ROLLS.map((roll) => ({ roll, text: byRoll.get(roll) ?? '' }));
};

interface EncounterParseState {
  tables: ScenarioEncounterTable[];
  pendingTitle: string;
}

const applyEncounterBlock = (state: EncounterParseState, block: Block): EncounterParseState => {
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
      rows: toEncounterRows(parsed.rows),
    };
    return { tables: [...state.tables, table], pendingTitle: '' };
  }

  return state;
};

export const parseEncounterTablesMarkdown = (
  markdown: string | undefined | null,
): ScenarioEncounterTable[] => {
  const blocks = tokenizeBlocks(markdown ?? '');
  const initial: EncounterParseState = { tables: [], pendingTitle: '' };
  return blocks.reduce(applyEncounterBlock, initial).tables;
};

const stringifyEncounterTable = (table: ScenarioEncounterTable): string => {
  const heading = `##### ${table.name} {.table}`;
  const header = '| 出目 | 内容 |';
  const separator = '| --- | --- |';
  const rows = table.rows.map((row) => `| ${row.roll} | ${row.text ?? ''} |`);
  return [heading, '', header, separator, ...rows].join('\n');
};

export const stringifyEncounterTables = (tables: ScenarioEncounterTable[]): string =>
  tables.map(stringifyEncounterTable).join('\n\n');
