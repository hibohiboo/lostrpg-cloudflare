import type {
  ScenarioBossAppendix,
  ScenarioCustomTable,
  ScenarioEncounterEnemy,
  ScenarioItemAppendix,
  ScenarioPhase,
} from '@lostrpg/schemas';

export type {
  ScenarioPhase,
  ScenarioScene,
  ScenarioEvent,
  ScenarioEventItem,
  ScenarioTable,
  ScenarioLink,
  ScenarioCustomTableKind,
  ScenarioCustomTableDiceType,
  ScenarioCustomTableRow,
  ScenarioCustomTable,
  ScenarioEncounterEnemy,
  ScenarioBossAppendix,
  ScenarioItemAppendix,
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
  // カスタム表（ランダムエンカウント表・散策表・探索表・休憩表。種別ごとに1つも無ければ
  // ルールブック標準の表を使用する）
  customTables: ScenarioCustomTable[];
  // 付録のエネミー一覧（ランダムエンカウント表の自由記述に登場させたエネミーの参照用）
  enemies: ScenarioEncounterEnemy[];
  // ヌシ付録（本文に登場させたヌシの参照用一覧）
  bosses: ScenarioBossAppendix[];
  // アイテム付録（本文に登場させたアイテムの参照用一覧）
  items: ScenarioItemAppendix[];
  creatorName?: string; // 作者名
  isPublish: boolean; // 公開フラグ
  hideFromList: boolean; // 一覧に表示しない
}
