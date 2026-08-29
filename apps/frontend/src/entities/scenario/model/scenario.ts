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
  creatorName?: string; // 作者名
  isPublish: boolean; // 公開フラグ
  hideFromList: boolean; // 一覧に表示しない
}
