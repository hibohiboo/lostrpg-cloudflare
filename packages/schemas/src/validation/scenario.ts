import { z } from 'zod';
import { createValidator } from './helpers';

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
