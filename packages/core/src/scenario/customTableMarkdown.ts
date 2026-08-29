import { buildTableFromRows, getAttributes, tokenizeBlocks, type Block } from './markdownBlocks';
import type { ScenarioCustomTable, ScenarioCustomTableKind } from '@lostrpg/schemas';

// カスタム表（ランダムエンカウント表・散策表・探索表・休憩表）をMarkdownで読み書きするための
// 変換処理。4種別を1つの「## カスタム表 {.customTable}」セクションにまとめ、表ごとの見出しで
// 種別・サイコロの個数／面数を指定する:
//
//   ## カスタム表 {.customTable}
//
//   ##### 表A {.table.kind-encounter.d1.s6}
//   | 出目 | 内容 |
//   | --- | --- |
//   | 1   | オオカミ 1d6体 |
//   | 2   | 何も起きない |
//   ...
//   | 6   | 表B参照 |
//
//   ##### 表B {.table.kind-wander.d2.s6}
//   | 出目 | 内容 |
//   | --- | --- |
//   | 2   | 何も見つからない |
//   ...
//
// kind-xxx を省略した場合は 'encounter'、d/s を省略した場合は 1d6 として扱う（後方互換）。
// エネミー付録（scenario.enemies）は表とは独立した参照用データのため対象外。

const KIND_VALUES: ScenarioCustomTableKind[] = ['encounter', 'wander', 'search', 'rest'];
const DEFAULT_KIND: ScenarioCustomTableKind = 'encounter';
const DEFAULT_DICE_COUNT = 1;
const DEFAULT_DICE_SIDES = 6;

// サイコロの個数・面数から、出目として取り得る値の一覧を返す（例: 2d6 → 2〜12）
export const rollsForDice = (diceCount: number, diceSides: number): number[] => {
  const min = diceCount;
  const max = diceCount * diceSides;
  return Array.from({ length: max - min + 1 }, (_, i) => min + i);
};

const parseKindAttr = (attrs: string[]): ScenarioCustomTableKind => {
  const attr = attrs.find((a) => a.startsWith('kind-'));
  const value = attr?.slice('kind-'.length);
  return (KIND_VALUES as string[]).includes(value ?? '')
    ? (value as ScenarioCustomTableKind)
    : DEFAULT_KIND;
};

const parseNumberAttr = (attrs: string[], prefix: string, fallback: number): number => {
  const attr = attrs.find((a) => new RegExp(`^${prefix}\\d+$`).test(a));
  if (!attr) return fallback;
  const value = Number(attr.slice(prefix.length));
  return Number.isInteger(value) && value >= 1 ? value : fallback;
};

// 表の各行 [出目, 内容] を rolls に対応する ScenarioCustomTableRow[] へ変換する。
// 出目が rolls に含まれない行は無視する。
const toRollRows = (rows: { cells: string[] }[], rolls: readonly number[]) => {
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

interface PendingHeading {
  title: string;
  kind: ScenarioCustomTableKind;
  diceCount: number;
  diceSides: number;
}

const DEFAULT_PENDING: PendingHeading = {
  title: '',
  kind: DEFAULT_KIND,
  diceCount: DEFAULT_DICE_COUNT,
  diceSides: DEFAULT_DICE_SIDES,
};

interface ParseState {
  tables: ScenarioCustomTable[];
  pending: PendingHeading;
}

const applyCustomTableBlock = (state: ParseState, block: Block): ParseState => {
  if (block.type === 'heading' && block.depth === 5) {
    const [val, ...attrs] = getAttributes(block.text);
    if (!attrs.includes('table')) return state;
    return {
      ...state,
      pending: {
        title: val ?? '',
        kind: parseKindAttr(attrs),
        diceCount: parseNumberAttr(attrs, 'd', DEFAULT_DICE_COUNT),
        diceSides: parseNumberAttr(attrs, 's', DEFAULT_DICE_SIDES),
      },
    };
  }

  if (block.type === 'table') {
    const parsed = buildTableFromRows(block.rows, state.pending.title);
    if (!parsed) return { ...state, pending: DEFAULT_PENDING };
    const { kind, diceCount, diceSides } = state.pending;
    const table: ScenarioCustomTable = {
      id: `table-${state.tables.length}`,
      kind,
      name: parsed.title || `表${state.tables.length + 1}`,
      diceCount,
      diceSides,
      rows: toRollRows(parsed.rows, rollsForDice(diceCount, diceSides)),
    };
    return { tables: [...state.tables, table], pending: DEFAULT_PENDING };
  }

  return state;
};

export const parseCustomTablesMarkdown = (
  markdown: string | undefined | null,
): ScenarioCustomTable[] => {
  const blocks = tokenizeBlocks(markdown ?? '');
  const initial: ParseState = { tables: [], pending: DEFAULT_PENDING };
  return blocks.reduce(applyCustomTableBlock, initial).tables;
};

const stringifyCustomTable = (table: ScenarioCustomTable): string => {
  const attrs = ['table', `kind-${table.kind}`, `d${table.diceCount}`, `s${table.diceSides}`].join(
    '.',
  );
  const heading = `##### ${table.name} {.${attrs}}`;
  const header = '| 出目 | 内容 |';
  const separator = '| --- | --- |';
  const rows = table.rows.map((row) => `| ${row.roll} | ${row.text ?? ''} |`);
  return [heading, '', header, separator, ...rows].join('\n');
};

export const stringifyCustomTables = (tables: ScenarioCustomTable[]): string =>
  tables.map(stringifyCustomTable).join('\n\n');
