import { stringifyCustomTables } from './customTableMarkdown';
import { stringifyScenarioPhases } from './stringifyScenarioPhases';
import type { ScenarioCustomTable, ScenarioPhase } from '@lostrpg/schemas';

export interface StringifyScenarioInput {
  players?: string;
  time?: string;
  limit?: string;
  caution?: string;
  customTables?: ScenarioCustomTable[];
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

// parseScenarioContent の逆変換：players/time/limit/caution・カスタム表（ランダムエンカウント表／
// 散策表／探索表／休憩表）・フェイズの構造からシナリオ本文（Markdown）を組み立てる。
// 構造編集タブでの編集結果をMarkdown編集タブと同期させるために使用する。
export const stringifyScenario = (input: StringifyScenarioInput): string => {
  const metaLines = [
    buildMetaHeading(input.players, 'players'),
    buildMetaHeading(input.time, 'time'),
    buildMetaHeading(input.limit, 'limit'),
    buildMetaHeading(input.caution, 'caution'),
  ].filter((line): line is string => line !== null);

  const meta = metaLines.join('\n\n');

  const customTables = input.customTables ?? [];
  const customTableSection =
    customTables.length > 0
      ? `## カスタム表 {.customTable}\n\n${stringifyCustomTables(customTables)}`
      : '';

  const body = stringifyScenarioPhases(input.phases);

  return [meta, customTableSection, body].filter((part) => part).join('\n\n');
};
