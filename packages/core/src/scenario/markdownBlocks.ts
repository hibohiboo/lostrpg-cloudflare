// 汎用的なMarkdownブロック分割ユーティリティ（見出し／段落／表）。
// parseScenarioContent.ts と encounterTableMarkdown.ts で共有する。
//
// 正規表現の破局的バックトラックを避けるため、可能な限り文字列走査で実装している。

export type HeadingBlock = { type: 'heading'; depth: number; text: string };
export type ParagraphBlock = { type: 'paragraph'; lines: string[] };
export type TableBlock = { type: 'table'; rows: string[][] };
export type Block = HeadingBlock | ParagraphBlock | TableBlock;

const SEPARATOR_CELL_RE = /^:?-+:?$/;

export const isBlank = (line: string): boolean => line.trim() === '';

// `# 見出し` 〜 `###### 見出し` を解析する
export const parseHeadingLine = (rawLine: string): HeadingBlock | null => {
  const line = rawLine.trimEnd();
  let depth = 0;
  while (depth < line.length && depth < 6 && line[depth] === '#') {
    depth += 1;
  }
  if (depth === 0) return null;
  const afterHashes = line[depth];
  if (afterHashes !== ' ' && afterHashes !== '\t') return null;
  return { type: 'heading', depth, text: line.slice(depth).trim() };
};

export const isTableRowLine = (line: string): boolean => {
  const trimmed = line.trim();
  return trimmed.length >= 2 && trimmed.startsWith('|') && trimmed.endsWith('|');
};

export const splitTableRow = (line: string): string[] =>
  line
    .trim()
    .slice(1, -1)
    .split('|')
    .map((cell) => cell.trim());

export const isSeparatorRow = (cells: string[]): boolean =>
  cells.length > 0 && cells.every((cell) => SEPARATOR_CELL_RE.test(cell));

interface BlockResult {
  block: Block;
  nextIndex: number;
}

const readTableBlock = (lines: string[], start: number): BlockResult => {
  const rows: string[][] = [];
  let i = start;
  while (i < lines.length && isTableRowLine(lines[i])) {
    const cells = splitTableRow(lines[i]);
    if (!isSeparatorRow(cells)) rows.push(cells);
    i += 1;
  }
  return { block: { type: 'table', rows }, nextIndex: i };
};

const readParagraphBlock = (lines: string[], start: number): BlockResult => {
  const collected: string[] = [];
  let i = start;
  while (
    i < lines.length &&
    !isBlank(lines[i]) &&
    !parseHeadingLine(lines[i]) &&
    !isTableRowLine(lines[i])
  ) {
    collected.push(lines[i].trim());
    i += 1;
  }
  return { block: { type: 'paragraph', lines: collected }, nextIndex: i };
};

// content を見出し／表／段落のブロック列に分解する
export const tokenizeBlocks = (content: string): Block[] => {
  const rawLines = content.replace(/\r\n/g, '\n').split('\n');
  const blocks: Block[] = [];
  let i = 0;

  while (i < rawLines.length) {
    const line = rawLines[i];
    const heading = parseHeadingLine(line);

    if (isBlank(line)) {
      i += 1;
    } else if (heading) {
      blocks.push(heading);
      i += 1;
    } else if (isTableRowLine(line)) {
      const { block, nextIndex } = readTableBlock(rawLines, i);
      blocks.push(block);
      i = nextIndex;
    } else {
      const { block, nextIndex } = readParagraphBlock(rawLines, i);
      blocks.push(block);
      i = nextIndex;
    }
  }

  return blocks;
};

// `値 {.attr1.attr2}` を [値, 属性1, 属性2, ...] に分解する。属性が無ければ [値] を返す
export const getAttributes = (text: string): [string | null, ...string[]] => {
  const trimmed = text.trim();
  if (!trimmed) return [null];

  const braceStart = trimmed.indexOf('{');
  const hasClosingBrace = trimmed.endsWith('}');
  if (braceStart === -1 || !hasClosingBrace || braceStart >= trimmed.length - 1) {
    return [trimmed];
  }

  const inner = trimmed.slice(braceStart + 1, -1).trim();
  if (!inner.startsWith('.')) return [trimmed];

  const val = trimmed.slice(0, braceStart).trim();
  const attributes = inner
    .slice(1)
    .split('.')
    .map((a) => a.trim())
    .filter((a) => a !== '');
  return [val || null, ...attributes];
};

export interface ParsedTable {
  title?: string;
  columns: string[];
  rows: { cells: string[] }[];
}

// 表ブロックの行（1行目=列名, 2行目以降=データ）を ParsedTable に変換する
export const buildTableFromRows = (rows: string[][], title: string): ParsedTable | null => {
  if (rows.length < 2) return null;
  const [columns, ...bodyRows] = rows;
  return {
    title: title || undefined,
    columns,
    rows: bodyRows.map((cells) => ({ cells })),
  };
};
