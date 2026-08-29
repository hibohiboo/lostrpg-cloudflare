import type { ScenarioEncounterSettings, ScenarioPhase } from '@lostrpg/schemas';

export type {
  ScenarioPhase,
  ScenarioScene,
  ScenarioEvent,
  ScenarioEventItem,
  ScenarioTable,
  ScenarioLink,
  ScenarioEncounterSettings,
  ScenarioEncounterTable,
  ScenarioEncounterRow,
  ScenarioEncounterRowType,
} from '@lostrpg/schemas';

export interface Scenario {
  name: string;
  password?: string;
  imageUrl?: string;
  players?: string; // 想定人数
  time?: string; // 想定プレイ時間
  limit?: string; // 制限値
  caution?: string; // 注意事項
  summary?: string; // 概要
  content?: string; // 本文（Markdown）
  // content から生成される構造化データ（サーバー側で再生成されるため、フォームからは編集不可）
  phases: ScenarioPhase[];
  // ランダムエンカウント表（デフォルト表 or カスタム表）
  encounterTable: ScenarioEncounterSettings;
  creatorName?: string; // 作者名
  isPublish: boolean; // 公開フラグ
  hideFromList: boolean; // 一覧に表示しない
}
