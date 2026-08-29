import type {
  ScenarioBossAppendix,
  ScenarioEncounterSettings,
  ScenarioItemAppendix,
  ScenarioPhase,
  ScenarioRollTableSettings2d6,
} from '@lostrpg/schemas';

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
  ScenarioEncounterEnemy,
  ScenarioBossAppendix,
  ScenarioItemAppendix,
  ScenarioRollTableSettings2d6,
  ScenarioRollTable2d6,
  ScenarioRollRow2d6,
} from '@lostrpg/schemas';

export interface Scenario {
  name: string;
  password?: string;
  imageUrl?: string;
  players?: string; // 推奨人数
  time?: string; // 想定プレイ時間
  limit?: string; // リミット
  caution?: string; // 注意事項
  summary?: string; // 概要
  content?: string; // 本文（Markdown）
  // content から生成される構造化データ（サーバー側で再生成されるため、フォームからは編集不可）
  phases: ScenarioPhase[];
  // ランダムエンカウント表（デフォルト表 or カスタム表、1d6）
  encounterTable: ScenarioEncounterSettings;
  // 散策表（デフォルト表 or カスタム表、2d6）
  wanderTable: ScenarioRollTableSettings2d6;
  // 探索表（デフォルト表 or カスタム表、2d6）
  searchTable: ScenarioRollTableSettings2d6;
  // 休憩表（デフォルト表 or カスタム表、2d6）
  restTable: ScenarioRollTableSettings2d6;
  // ヌシ付録（本文に登場させたヌシの参照用一覧）
  bosses: ScenarioBossAppendix[];
  // アイテム付録（本文に登場させたアイテムの参照用一覧）
  items: ScenarioItemAppendix[];
  creatorName?: string; // 作者名
  isPublish: boolean; // 公開フラグ
  hideFromList: boolean; // 一覧に表示しない
}
