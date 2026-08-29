import type {
  ScenarioEvent,
  ScenarioEventItem,
  ScenarioLink,
  ScenarioPhase,
  ScenarioScene,
  ScenarioTable,
} from '@lostrpg/schemas';

// シナリオ本文（Markdown）を フェイズ／シーン／イベント の構造に変換する。
//
// 対応する記法（create-now版 lostModule/scenario.ts の mdToScenario を移植）
// - `# タイトル`                          … シナリオタイトル（現状は未使用。将来の拡張用に予約）
// - `## フェイズ名`                       … フェイズの開始
// - `## 〇人 {.players}` など             … players/time/limit/caution の値を指定する特殊フェイズ見出し
// - `### シーン名 {.type-xxx.alias-xxx.next-a-b}` … シーンの開始（type/alias/next 属性を付与可能）
// - `#### イベント名 {.event-type}`       … イベントの開始（属性値がイベント種別になる）
// - `##### 項目名 {.item|.roll|.path|.prize}` … イベントに紐づく項目（ドロップ品・判定など）
// - `##### 表題 {.table}` の直後の表      … イベントに紐づく表
// - 独立した1行の `[表示名](URL)`         … イベントに紐づくリンク
// - 上記以外の地の文                       … フェイズ本文 / シーン本文 / イベント本文の説明文
//
// パーサ本体は state を書き換えず、各ブロックごとに新しい状態を返す純粋関数として実装している
// （no-param-reassign を避けつつ、処理の流れを追いやすくするため）。

type HeadingBlock = { type: 'heading'; depth: number; text: string };
type ParagraphBlock = { type: 'paragraph'; lines: string[] };
type TableBlock = { type: 'table'; rows: string[][] };
type Block = HeadingBlock | ParagraphBlock | TableBlock;

const LINK_LINE_RE = /^\[([^[\]]*)]\(([^()]*)\)$/;
const SEPARATOR_CELL_RE = /^:?-+:?$/;

const isBlank = (line: string) => line.trim() === '';

// `# 見出し` 〜 `###### 見出し` を解析する（正規表現の破局的バックトラックを避けるため文字走査で実装）
const parseHeadingLine = (rawLine: string): HeadingBlock | null => {
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

const isTableRowLine = (line: string): boolean => {
  const trimmed = line.trim();
  return trimmed.length >= 2 && trimmed.startsWith('|') && trimmed.endsWith('|');
};

const splitTableRow = (line: string): string[] =>
  line
    .trim()
    .slice(1, -1)
    .split('|')
    .map((cell) => cell.trim());

const isSeparatorRow = (cells: string[]): boolean =>
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
const tokenizeBlocks = (content: string): Block[] => {
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
// （正規表現ではなく文字列探索で実装し、破局的バックトラックの可能性を排除している）
const getAttributes = (text: string): [string | null, ...string[]] => {
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

const getTable = (rows: string[][], title: string): ScenarioTable | null => {
  if (rows.length < 2) return null;
  const [columns, ...bodyRows] = rows;
  return {
    title: title || undefined,
    columns,
    rows: bodyRows.map((cells) => ({ cells })),
  };
};

interface ParseState {
  phases: ScenarioPhase[];
  phase: { name: string; scenes: ScenarioScene[] } | null;
  scenes: ScenarioScene[];
  scene: Pick<ScenarioScene, 'name' | 'type' | 'alias' | 'next'> | null;
  events: ScenarioEvent[];
  event: Pick<ScenarioEvent, 'name' | 'type'> | null;
  sceneLines: string[];
  eventLines: string[];
  items: ScenarioEventItem[];
  tables: ScenarioTable[];
  tableTitle: string;
  links: ScenarioLink[];
  scenarioLines: string[];
  players: string;
  time: string;
  limit: string;
  caution: string;
}

const createInitialState = (): ParseState => ({
  phases: [],
  phase: null,
  scenes: [],
  scene: null,
  events: [],
  event: null,
  sceneLines: [],
  eventLines: [],
  items: [],
  tables: [],
  tableTitle: '',
  links: [],
  scenarioLines: [],
  players: '',
  time: '',
  limit: '',
  caution: '',
});

const pushEvent = (state: ParseState): ParseState => {
  if (!state.event) return state;
  const events = [
    ...state.events,
    {
      ...state.event,
      lines: state.eventLines,
      items: state.items,
      tables: state.tables,
      links: state.links,
    },
  ];
  return { ...state, events, event: null };
};

const pushScene = (state: ParseState): ParseState => {
  if (!state.scene) return state;
  const afterEvent = pushEvent(state);
  const scenes = [
    ...afterEvent.scenes,
    { ...state.scene, lines: afterEvent.sceneLines, events: afterEvent.events },
  ];
  return { ...afterEvent, scenes, scene: null };
};

const pushPhase = (state: ParseState): ParseState => {
  if (!state.phase) return state;
  const afterScene = pushScene(state);
  const phases = [
    ...afterScene.phases,
    { ...state.phase, scenes: afterScene.scenes },
  ];
  return { ...afterScene, phases, phase: null };
};

const handlePhaseHeading = (state: ParseState, text: string): ParseState => {
  const [val, key] = getAttributes(text);
  if (key === 'players') return { ...state, players: val ?? '' };
  if (key === 'time') return { ...state, time: val ?? '' };
  if (key === 'limit') return { ...state, limit: val ?? '' };
  if (key === 'caution') return { ...state, caution: val ?? '' };

  const pushed = pushPhase(state);
  return {
    ...pushed,
    phase: { name: text, scenes: [] },
    scenes: [],
    scene: null,
  };
};

const handleSceneHeading = (state: ParseState, text: string): ParseState => {
  const pushed = pushScene(state);
  const [val, ...attrs] = getAttributes(text);
  const type = attrs.find((a) => a.indexOf('type-') !== -1);
  const alias = attrs.find((a) => a.indexOf('alias-') !== -1);
  const next = attrs.find((a) => a.indexOf('next-') !== -1);
  return {
    ...pushed,
    scene: {
      name: val || text,
      type: type ? type.replace('type-', '') : null,
      alias: alias ? alias.replace('alias-', '') : null,
      next: next ? next.replace('next-', '').split('-') : null,
    },
    sceneLines: [],
    events: [],
    event: null,
  };
};

const handleEventHeading = (state: ParseState, text: string): ParseState => {
  const pushed = pushEvent(state);
  const [val, key] = getAttributes(text);
  return {
    ...pushed,
    event: { name: val || text, type: key || 'view' },
    eventLines: [],
    items: [],
    tables: [],
    links: [],
  };
};

const ITEM_KEYS = new Set(['item', 'roll', 'path', 'prize']);

const handleDetailHeading = (state: ParseState, text: string): ParseState => {
  const [val, key] = getAttributes(text);
  if (key === 'table') return { ...state, tableTitle: val ?? '' };
  if (key && ITEM_KEYS.has(key)) {
    return { ...state, items: [...state.items, { type: key, name: val ?? '' }] };
  }
  return state;
};

const handleHeading = (state: ParseState, block: HeadingBlock): ParseState => {
  if (block.depth === 2) return handlePhaseHeading(state, block.text);
  if (block.depth === 3) return handleSceneHeading(state, block.text);
  if (block.depth === 4) return handleEventHeading(state, block.text);
  if (block.depth === 5) return handleDetailHeading(state, block.text);
  return state; // depth 1（シナリオタイトル）・depth 6 は構造化の対象外
};

const collectLinks = (lines: string[], base: ScenarioLink[]): ScenarioLink[] =>
  lines.reduce<ScenarioLink[]>((acc, line) => {
    const match = LINK_LINE_RE.exec(line);
    if (!match) return acc;
    const [, value, url] = match;
    return [...acc, { url, value }];
  }, base);

const handleParagraph = (state: ParseState, block: ParagraphBlock): ParseState => {
  if (block.lines.length === 0) return state;

  const isLinkParagraph = block.lines.every((line) => LINK_LINE_RE.test(line));
  if (isLinkParagraph) {
    return { ...state, links: collectLinks(block.lines, state.links) };
  }

  if (!state.phase) {
    return { ...state, scenarioLines: [...state.scenarioLines, ...block.lines] };
  }
  if (!state.event) {
    return { ...state, sceneLines: [...state.sceneLines, ...block.lines] };
  }
  return { ...state, eventLines: [...state.eventLines, ...block.lines] };
};

const handleTable = (state: ParseState, block: TableBlock): ParseState => {
  const table = getTable(block.rows, state.tableTitle);
  const tables = table ? [...state.tables, table] : state.tables;
  return { ...state, tables, tableTitle: '' };
};

const applyBlock = (state: ParseState, block: Block): ParseState => {
  if (block.type === 'heading') return handleHeading(state, block);
  if (block.type === 'paragraph') return handleParagraph(state, block);
  return handleTable(state, block);
};

export interface ParsedScenarioContent {
  players: string;
  time: string;
  limit: string;
  caution: string;
  lines: string[];
  phases: ScenarioPhase[];
}

export const parseScenarioContent = (
  content: string | undefined | null,
): ParsedScenarioContent => {
  const blocks = tokenizeBlocks(content ?? '');
  const parsed = blocks.reduce(applyBlock, createInitialState());
  const final = pushPhase(parsed);

  return {
    players: final.players,
    time: final.time,
    limit: final.limit,
    caution: final.caution,
    lines: final.scenarioLines,
    phases: final.phases,
  };
};
