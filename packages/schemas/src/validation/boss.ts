import { z } from 'zod';

const bossAbilitySchema = z.object({
  id: z.string(),
  name: z.string(),
  group: z.string(),
  type: z.string(),
  recoil: z.string(),
  specialty: z.string(),
  target: z.string(),
  effect: z.string(),
});

export type BossAbility = z.infer<typeof bossAbilitySchema>;

// ＜ヌシ＞作成フィールドスキーマ
// 特技は全て習得済み・ギャップは埋めない前提のため保存項目には含めない
const baseBossFields = {
  name: z.string().max(100, 'name は100文字以内で入力してください'),
  appearance: z.string().optional(),
  level: z.number().int().min(1).default(1),
  abilities: z.array(bossAbilitySchema).default([]),
  stamina: z.number().int().min(0).default(5),
  willPower: z.number().int().min(0).default(11),
  imageUrl: z.string().optional(),
  password: z.string().nullable().optional(),
};

// ヌシ作成リクエストスキーマ
export const createBossSchema = z.object(baseBossFields);

export type CreateBossRequest = z.infer<typeof createBossSchema>;

// ヌシ更新リクエストスキーマ（作成スキーマのpartial + nameを必須から任意に）
export const updateBossSchema = createBossSchema
  .omit({ name: true })
  .extend({
    name: z.string().max(100).optional(),
  })
  .partial();

export type UpdateBossRequest = z.infer<typeof updateBossSchema>;

// ヌシ取得スキーマ
export const getBossSchema = z.object(baseBossFields);
