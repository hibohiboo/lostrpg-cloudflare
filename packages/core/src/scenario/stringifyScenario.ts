import { stringifyRollTables } from './encounterTableMarkdown';
import { stringifyScenarioPhases } from './stringifyScenarioPhases';
import type { ScenarioEncounterTable, ScenarioPhase } from '@lostrpg/schemas';

export interface StringifyScenarioInput {
  players?: string;
  time?: string;
  limit?: string;
  caution?: string;
  encounterTables?: ScenarioEncounterTable[];
  wanderTables?: ScenarioEncounterTable[];
  searchTables?: ScenarioEncounterTable[];
  restTables?: ScenarioEncounterTable[];
  phases: ScenarioPhase[];
}

// players/time/limit/caution は見出し1行に収める記法のため、改行が含まれていた場合は
// 1行のテキストに畳んでからシリアライズする（見出しとしてラウンドトリップできなくなるのを防ぐ）
const toSingleLine = (value: string): string => value.replace(/\s+/g, ' ').trim();

const buildMetaHeading = (value: string | undefined, key: string): string | null => {
  if (!value) return null;
  const singleLine = toSingleLine(value);
  return singleLine ? `## ${singleLine} {.${key}}` : null;
};

// ランダムエンカウント表・散策表・探索表・休憩表はいずれも同じ形式のセクション
// （`## 見出し {.key}` の直後にカスタム表を並べたもの）のため、共通の関数で組み立てる。
const buildRollTableSection = (
  tables: ScenarioEncounterTable[] | undefined,
  heading: string,
  key: string,
): string => {
  const list = tables ?? [];
  if (list.length === 0) return '';
  return `## ${heading} {.${key}}\n\n${stringifyRollTables(list)}`;
};

// parseScenarioContent の逆変換：players/time/limit/caution・ランダムエンカウント表／散策表／
// 探索表／休憩表・フェイズの構造からシナリオ本文（Markdown）を組み立てる。
// 構造編集タブでの編集結果をMarkdown編集タブと同期させるために使用する。
export const stringifyScenario = (input: StringifyScenarioInput): string => {
  const metaLines = [
    buildMetaHeading(input.players, 'players'),
    buildMetaHeading(input.time, 'time'),
    buildMetaHeading(input.limit, 'limit'),
    buildMetaHeading(input.caution, 'caution'),
  ].filter((line): line is string => line !== null);

  const meta = metaLines.join('\n\n');

  const tableSections = [
    buildRollTableSection(input.encounterTables, 'ランダムエンカウント表', 'encounterTable'),
    buildRollTableSection(input.wanderTables, '散策表', 'wanderTable'),
    buildRollTableSection(input.searchTables, '探索表', 'searchTable'),
    buildRollTableSection(input.restTables, '休憩表', 'restTable'),
  ]
    .filter((section) => section !== '')
    .join('\n\n');

  const body = stringifyScenarioPhases(input.phases);

  return [meta, tableSections, body].filter((part) => part).join('\n\n');
};
