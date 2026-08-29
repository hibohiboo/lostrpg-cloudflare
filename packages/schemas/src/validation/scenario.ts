import { z } from 'zod';
import { createValidator } from './helpers';

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

// 基本フィールドスキーマ
const baseScenarioFields = {
  name: z.string().max(50, 'name は50文字以内で入力してください'),
  imageUrl: z.string().optional(),
  players: z.string().optional(), // 想定人数
  time: z.string().optional(), // 想定プレイ時間
  limit: z.string().optional(), // 制限値
  caution: z.string().optional(), // 注意事項
  summary: z.string().optional(), // 概要
  content: z.string().optional(), // 本文（Markdown）
  // 本文（Markdown）から構造化されたフェイズ／シーン／イベント。
  // クライアントからの入力値は無視し、サーバー側で content から再生成する。
  phases: z.array(scenarioPhaseSchema).optional().default([]),
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
