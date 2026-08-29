import { z } from 'zod';
import { createValidator } from './helpers';
import { itemSchema } from './items';

// フェイズ本文をMarkdownから構造化した結果のスキーマ
// （表）
const scenarioTableRowSchema = z.object({
  cells: z.array(z.string()),
});
export const scenarioTableSchema = z.object({
  title: z.string().optional(),
  columns: z.array(z.string()),
  rows: z.array(scenarioTableRowSchema),
});
export type ScenarioTable = z.infer<typeof scenarioTableSchema>;

// （リンク）
export const scenarioLinkSchema = z.object({
  url: z.string(),
  value: z.string(),
});
export type ScenarioLink = z.infer<typeof scenarioLinkSchema>;

// （道・判定などの項目）
export const scenarioEventItemSchema = z.object({
  name: z.string(),
  type: z.string(),
});
export type ScenarioEventItem = z.infer<typeof scenarioEventItemSchema>;

// （イベント：####見出し）
export const scenarioEventSchema = z.object({
  name: z.string(),
  type: z.string(),
  lines: z.array(z.string()).default([]),
  items: z.array(scenarioEventItemSchema).default([]),
  tables: z.array(scenarioTableSchema).default([]),
  links: z.array(scenarioLinkSchema).default([]),
});
export type ScenarioEvent = z.infer<typeof scenarioEventSchema>;

// （シーン：###見出し）
export const scenarioSceneSchema = z.object({
  name: z.string(),
  lines: z.array(z.string()).default([]),
  events: z.array(scenarioEventSchema).default([]),
  type: z.string().nullable().optional(),
  alias: z.string().nullable().optional(),
  next: z.array(z.string()).nullable().optional(),
});
export type ScenarioScene = z.infer<typeof scenarioSceneSchema>;

// （フェイズ：##見出し）
export const scenarioPhaseSchema = z.object({
  name: z.string(),
  scenes: z.array(scenarioSceneSchema).default([]),
});
export type ScenarioPhase = z.infer<typeof scenarioPhaseSchema>;

// ランダムエンカウント表
// 1マスは自由記述（例: 「オオカミ 1d6体」「表B参照」「何も起きない」等）。
// 出現数（1d6等）や他の表への振り直しも、表記自体を自由記述の中に書いてもらう。
export const scenarioEncounterRowSchema = z.object({
  roll: z.number().int().min(1).max(6),
  text: z.string().optional(),
});
export type ScenarioEncounterRow = z.infer<typeof scenarioEncounterRowSchema>;

export const scenarioEncounterTableSchema = z.object({
  id: z.string(),
  name: z.string(), // 表A・表B 等
  rows: z.array(scenarioEncounterRowSchema),
});
export type ScenarioEncounterTable = z.infer<
  typeof scenarioEncounterTableSchema
>;

// 表中に登場させたエネミーの付録（参照用一覧）。
// エネミー選択から追加した場合は名前・URL（サイト内のエネミー詳細ページ）が自動入力されるが、
// 内部に登録されていないエネミー（外部サイト参照等）も想定し、名前・URLは自由に編集できる。
export const scenarioEncounterEnemySchema = z.object({
  // エネミー選択で追加した場合の内部エネミーID（任意。手動追加の場合は無い）
  enemyId: z.string().optional(),
  // 表示用の名前（自由記述。エネミー選択時は自動入力されるが後から編集可能）
  enemyName: z.string().optional(),
  // エネミーの参照先URL（サイト内のエネミー詳細ページ or 外部サイトへのリンク）
  url: z.string().optional(),
});
export type ScenarioEncounterEnemy = z.infer<
  typeof scenarioEncounterEnemySchema
>;

// mode: 'default' はルールブック標準のランダムエンカウント表を使用（追加データ不要）
// mode: 'custom' は tables（先頭が起点の表）を使用する
export const scenarioEncounterSettingsSchema = z.object({
  mode: z.enum(['default', 'custom']).default('default'),
  tables: z.array(scenarioEncounterTableSchema).default([]),
  // 付録のエネミー一覧（表の自由記述に登場させたエネミーの参照用）
  enemies: z.array(scenarioEncounterEnemySchema).default([]),
});
export type ScenarioEncounterSettings = z.infer<
  typeof scenarioEncounterSettingsSchema
>;

// 本文中に登場させたヌシ（ボス）の付録（参照用一覧）。
// ヌシ選択から追加した場合は名前・URL（サイト内のヌシ詳細ページ）が自動入力されるが、
// 内部に登録されていないヌシ（外部サイト参照等）も想定し、名前・URLは自由に編集できる。
export const scenarioBossAppendixSchema = z.object({
  // ヌシ選択で追加した場合の内部ヌシID（任意。手動追加の場合は無い）
  bossId: z.string().optional(),
  // 表示用の名前（自由記述。ヌシ選択時は自動入力されるが後から編集可能）
  bossName: z.string().optional(),
  // ヌシの参照先URL（サイト内のヌシ詳細ページ or 外部サイトへのリンク）
  url: z.string().optional(),
});
export type ScenarioBossAppendix = z.infer<typeof scenarioBossAppendixSchema>;

// 本文中に登場させたアイテムの付録（参照用一覧）。
// キャラクターシートのアイテムと同じ形式（id・名前・価格・重量・特性等）を持ち、
// アイテム選択（ルールブック標準アイテム＋サプリメント全て）で追加した内容も
// キャラクターシートと同様にその場で自由に編集できる。
export const scenarioItemAppendixSchema = itemSchema;
export type ScenarioItemAppendix = z.infer<typeof scenarioItemAppendixSchema>;

// 基本フィールドスキーマ
const baseScenarioFields = {
  name: z.string().max(50, 'name は50文字以内で入力してください'),
  imageUrl: z.string().optional(),
  players: z.string().optional(), // 想定人数
  time: z.string().optional(), // 想定プレイ時間
  limit: z.string().optional(), // リミット
  caution: z.string().optional(), // 注意事項
  summary: z.string().optional(), // 概要
  content: z.string().optional(), // 本文（Markdown）
  // 本文（Markdown）から構造化されたフェイズ／シーン／イベント。
  // クライアントからの入力値は無視し、サーバー側で content から再生成する。
  phases: z.array(scenarioPhaseSchema).optional().default([]),
  // ランダムエンカウント表（デフォルト表 or カスタム表）
  encounterTable: scenarioEncounterSettingsSchema
    .optional()
    .default({ mode: 'default', tables: [], enemies: [] }),
  // ヌシ付録（本文に登場させたヌシの参照用一覧）
  bosses: z.array(scenarioBossAppendixSchema).optional().default([]),
  // アイテム付録（本文に登場させたアイテムの参照用一覧）
  items: z.array(scenarioItemAppendixSchema).optional().default([]),
  creatorName: z.string().optional(), // 作者名
  isPublish: z.boolean().optional().default(false), // 公開フラグ
  password: z.string().nullable().optional(),
  // 一覧に表示しない（詳細への直接リンクでは表示される）
  hideFromList: z.boolean().optional().default(false),
};

// Scenario作成リクエストスキーマ
export const createScenarioSchema = z.object(baseScenarioFields);

export type CreateScenarioRequest = z.infer<typeof createScenarioSchema>;

// Scenario更新リクエストスキーマ（作成スキーマのpartial + nameを必須から任意に）
export const updateScenarioSchema = createScenarioSchema
  .omit({ name: true })
  .extend({
    name: z.string().max(50).optional(),
  })
  .partial();

export type UpdateScenarioRequest = z.infer<typeof updateScenarioSchema>;

// 保存済みデータの読み込み用スキーマ（デフォルト値の補完に使用）
export const getScenarioSchema = z.object(baseScenarioFields);

// バリデーション実行関数
export const validateCreateScenario = createValidator(createScenarioSchema);
export const validateUpdateScenario = createValidator(updateScenarioSchema);
