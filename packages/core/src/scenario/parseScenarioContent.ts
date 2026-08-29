import { parseRollTablesMarkdown, ROLLS_1D6, ROLLS_2D6 } from './encounterTableMarkdown';
import {
  buildTableFromRows,
  getAttributes,
  parseHeadingLine,
  tokenizeBlocks,
  type Block,
  type HeadingBlock,
  type ParagraphBlock,
  type TableBlock,
} from './markdownBlocks';
import type {
  ScenarioEncounterTable,
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
// - `## ランダムエンカウント表 {.encounterTable}` セクション（次の `##` 見出しの直前まで）
//                                          … ランダムエンカウント表（1d6、本文中どこに書いてもよい）
// - `## 散策表 {.wanderTable}` / `## 探索表 {.searchTable}` / `## 休憩表 {.restTable}` セクション
//                                          … 散策表・探索表・休憩表（いずれも2d6、本文中どこに書いてもよい）
// - 上記以外の地の文                       … フェイズ本文 / シーン本文 / イベント本文の説明文
//
// パーサ本体は state を書き換えず、各ブロックごとに新しい状態を返す純粋関数として実装している
// （no-param-reassign を避けつつ、処理の流れを追いやすくするため）。

const LINK_LINE_RE = /^\[([^[\]]*)]\(([^()]*)\)$/;

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
  const parsed = buildTableFromRows(block.rows, state.tableTitle);
  const tables = parsed ? [...state.tables, parsed] : state.tables;
  return { ...state, tables, tableTitle: '' };
};

const applyBlock = (state: ParseState, block: Block): ParseState => {
  if (block.type === 'heading') return handleHeading(state, block);
  if (block.type === 'paragraph') return handleParagraph(state, block);
  return handleTable(state, block);
};

const isMarkedHeading = (line: string, key: string): boolean => {
  const heading = parseHeadingLine(line);
  if (!heading || heading.depth !== 2) return false;
  const [, headingKey] = getAttributes(heading.text);
  return headingKey === key;
};

const isDepth2Heading = (line: string): boolean => parseHeadingLine(line)?.depth === 2;

// content から `## 〇〇 {.key}` セクション（次の `##` 見出しの直前まで）を全て取り除き、
// その中身だけを結合したMarkdownとして返す。フェイズ／シーンの構造とは独立して扱うため、
// 通常の tokenizeBlocks によるフェイズ解析より前に行単位で分離する。
// ランダムエンカウント表・散策表・探索表・休憩表のいずれも同じ形式のセクションのため、
// key（encounterTable / wanderTable / searchTable / restTable）を変えて使い回す。
const extractMarkedSection = (
  content: string,
  key: string,
): { content: string; sectionMarkdown: string } => {
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const remainingLines: string[] = [];
  const sections: string[] = [];
  let i = 0;

  while (i < lines.length) {
    if (isMarkedHeading(lines[i], key)) {
      i += 1;
      const sectionLines: string[] = [];
      while (i < lines.length && !isDepth2Heading(lines[i])) {
        sectionLines.push(lines[i]);
        i += 1;
      }
      sections.push(sectionLines.join('\n'));
    } else {
      remainingLines.push(lines[i]);
      i += 1;
    }
  }

  return { content: remainingLines.join('\n'), sectionMarkdown: sections.join('\n\n') };
};

export interface ParsedScenarioContent {
  players: string;
  time: string;
  limit: string;
  caution: string;
  lines: string[];
  phases: ScenarioPhase[];
  encounterTables: ScenarioEncounterTable[];
  wanderTables: ScenarioEncounterTable[];
  searchTables: ScenarioEncounterTable[];
  restTables: ScenarioEncounterTable[];
}

export const parseScenarioContent = (
  content: string | undefined | null,
): ParsedScenarioContent => {
  const encounter = extractMarkedSection(content ?? '', 'encounterTable');
  const wander = extractMarkedSection(encounter.content, 'wanderTable');
  const search = extractMarkedSection(wander.content, 'searchTable');
  const rest = extractMarkedSection(search.content, 'restTable');

  const blocks = tokenizeBlocks(rest.content);
  const parsed = blocks.reduce(applyBlock, createInitialState());
  const final = pushPhase(parsed);

  return {
    players: final.players,
    time: final.time,
    limit: final.limit,
    caution: final.caution,
    lines: final.scenarioLines,
    phases: final.phases,
    encounterTables: parseRollTablesMarkdown(encounter.sectionMarkdown, ROLLS_1D6),
    wanderTables: parseRollTablesMarkdown(wander.sectionMarkdown, ROLLS_2D6),
    searchTables: parseRollTablesMarkdown(search.sectionMarkdown, ROLLS_2D6),
    restTables: parseRollTablesMarkdown(rest.sectionMarkdown, ROLLS_2D6),
  };
};

const PHASE_META_KEYS = new Set(['players', 'time', 'limit', 'caution']);

export interface SplitScenarioIntroResult {
  intro: string;
  phasesMarkdown: string;
}

// content の先頭から「最初の実フェイズ見出し」より前の部分
// （タイトル・概要文・players/time/limit/caution 等のメタ見出し）を intro として切り出す。
export const splitScenarioIntro = (
  content: string | undefined | null,
): SplitScenarioIntroResult => {
  const lines = (content ?? '').replace(/\r\n/g, '\n').split('\n');
  let phaseStartLine = lines.length;

  for (let i = 0; i < lines.length; i += 1) {
    const heading = parseHeadingLine(lines[i]);
    if (heading && heading.depth === 2) {
      const [, key] = getAttributes(heading.text);
      if (!key || !PHASE_META_KEYS.has(key)) {
        phaseStartLine = i;
        break;
      }
    }
  }

  const intro = lines.slice(0, phaseStartLine).join('\n').trimEnd();
  const phasesMarkdown = lines.slice(phaseStartLine).join('\n');
  return { intro, phasesMarkdown };
};
