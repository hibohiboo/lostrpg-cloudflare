import { buildTableFromRows, getAttributes, tokenizeBlocks, type Block } from './markdownBlocks';
import type {
  ScenarioCustomTable,
  ScenarioCustomTableDiceType,
  ScenarioCustomTableKind,
} from '@lostrpg/schemas';

// カスタム表（ランダムエンカウント表・散策表・探索表・休憩表・その他）をMarkdownで読み書きする
// ための変換処理。種別を1つの「## カスタム表 {.customTable}」セクションにまとめ、表ごとの見出しで
// 種別・サイコロを指定する:
//
//   ## カスタム表 {.customTable}
//
//   ##### 表A {.table.kind-encounter.dice-1d6}
//   | 出目 | 内容 |
//   | --- | --- |
//   | 1   | オオカミ 1d6体 |
//   | 2   | 何も起きない |
//   ...
//   | 6   | 表B参照 |
//
//   ##### 表B {.table.kind-wander.dice-2d6}
//   | 出目 | 内容 |
//   | --- | --- |
//   | 2   | 何も見つからない |
//   ...
//
//   ##### 表C {.table.kind-other.dice-d66}
//   | 出目 | 内容 |
//   | --- | --- |
//   | 11  | 何も起きない |
//   ...
//   | 66  | 大当たり |
//
// kind-xxx を省略した場合は 'encounter'、dice-xxx を省略した場合は 1d6 として扱う（後方互換）。
// エネミー付録（scenario.enemies）は表とは独立した参照用データのため対象外。

const KIND_VALUES: ScenarioCustomTableKind[] = ['encounter', 'wander', 'search', 'rest', 'other'];
const DEFAULT_KIND: ScenarioCustomTableKind = 'encounter';
const DEFAULT_DICE_TYPE: ScenarioCustomTableDiceType = 'sum';
const DEFAULT_DICE_COUNT = 1;
const DEFAULT_DICE_SIDES = 6;

interface DiceSpec {
  diceType: ScenarioCustomTableDiceType;
  diceCount: number;
  diceSides: number;
}

const DEFAULT_DICE: DiceSpec = {
  diceType: DEFAULT_DICE_TYPE,
  diceCount: DEFAULT_DICE_COUNT,
  diceSides: DEFAULT_DICE_SIDES,
};

// サイコロを diceCount 個振って出目を合計する通常のダイスで、出目として取り得る値の一覧を返す
// （例: 2d6 → 2〜12）
export const rollsForDice = (diceCount: number, diceSides: number): number[] => {
  const min = diceCount;
  const max = diceCount * diceSides;
  return Array.from({ length: max - min + 1 }, (_, i) => min + i);
};

// d66：サイコロを2個振り、大きい方を十の位・小さい方を一の位として読む（2と1が出たら12）。
// 11〜66の21通り。
export const rollsForD66 = (): number[] => {
  const rolls: number[] = [];
  for (let tens = 1; tens <= 6; tens += 1) {
    for (let ones = tens; ones <= 6; ones += 1) {
      rolls.push(tens * 10 + ones);
    }
  }
  return rolls;
};

// テーブルのサイコロ設定（diceType/diceCount/diceSides）から、出目として取り得る値の一覧を返す
export const rollsForTable = (table: {
  diceType: ScenarioCustomTableDiceType;
  diceCount: number;
  diceSides: number;
}): number[] =>
  table.diceType === 'd66' ? rollsForD66() : rollsForDice(table.diceCount, table.diceSides);

const DICE_SUM_RE = /^(\d+)d(\d+)$/;

const parseKindAttr = (attrs: string[]): ScenarioCustomTableKind => {
  const attr = attrs.find((a) => a.startsWith('kind-'));
  const value = attr?.slice('kind-'.length);
  return (KIND_VALUES as string[]).includes(value ?? '')
    ? (value as ScenarioCustomTableKind)
    : DEFAULT_KIND;
};

// `dice-1d6` `dice-2d6` `dice-3d8`（自由入力の xdn） `dice-d66` のいずれかを解釈する
const parseDiceAttr = (attrs: string[]): DiceSpec => {
  const attr = attrs.find((a) => a.startsWith('dice-'));
  const value = attr?.slice('dice-'.length);
  if (!value) return DEFAULT_DICE;
  if (value === 'd66') return { diceType: 'd66', diceCount: 2, diceSides: 6 };

  const match = DICE_SUM_RE.exec(value);
  if (!match) return DEFAULT_DICE;
  const diceCount = Number(match[1]);
  const diceSides = Number(match[2]);
  if (!Number.isInteger(diceCount) || diceCount < 1) return DEFAULT_DICE;
  if (!Number.isInteger(diceSides) || diceSides < 2) return DEFAULT_DICE;
  return { diceType: 'sum', diceCount, diceSides };
};

const stringifyDiceAttr = (table: ScenarioCustomTable): string =>
  table.diceType === 'd66' ? 'dice-d66' : `dice-${table.diceCount}d${table.diceSides}`;

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
  dice: DiceSpec;
}

const DEFAULT_PENDING: PendingHeading = {
  title: '',
  kind: DEFAULT_KIND,
  dice: DEFAULT_DICE,
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
        dice: parseDiceAttr(attrs),
      },
    };
  }

  if (block.type === 'table') {
    const parsed = buildTableFromRows(block.rows, state.pending.title);
    if (!parsed) return { ...state, pending: DEFAULT_PENDING };
    const { kind, dice } = state.pending;
    const table: ScenarioCustomTable = {
      id: `table-${state.tables.length}`,
      kind,
      name: parsed.title || `表${state.tables.length + 1}`,
      diceType: dice.diceType,
      diceCount: dice.diceCount,
      diceSides: dice.diceSides,
      rows: toRollRows(parsed.rows, rollsForTable(dice)),
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
  const attrs = ['table', `kind-${table.kind}`, stringifyDiceAttr(table)].join('.');
  const heading = `##### ${table.name} {.${attrs}}`;
  const header = '| 出目 | 内容 |';
  const separator = '| --- | --- |';
  const rows = table.rows.map((row) => `| ${row.roll} | ${row.text ?? ''} |`);
  return [heading, '', header, separator, ...rows].join('\n');
};

export const stringifyCustomTables = (tables: ScenarioCustomTable[]): string =>
  tables.map(stringifyCustomTable).join('\n\n');
