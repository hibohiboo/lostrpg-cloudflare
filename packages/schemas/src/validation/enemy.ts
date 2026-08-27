import { z } from 'zod';
import { itemSchema } from './items';

const enemyAbilitySchema = z.object({
  id: z.string(),
  name: z.string(),
  group: z.string(),
  type: z.string(),
  recoil: z.string(),
  specialty: z.string(),
  target: z.string(),
  effect: z.string(),
});

export type EnemyAbility = z.infer<typeof enemyAbilitySchema>;

// エネミーのタイプ（エネミーアビリティのグループに対応）
const enemyTypeEnum = z.enum(['ケモノ', 'ムシ', 'ミュータント']);

export type EnemyType = z.infer<typeof enemyTypeEnum>;

// ギャップの列挙型（キャラクターと同じ）
const gapEnum = z.enum(['A', 'B', 'C', 'D', 'E']);

export type EnemyGap = z.infer<typeof gapEnum>;

// 1d6で出た目に応じて入手できるドロップアイテム表（1〜6の6項目固定）
const dropItemsSchema = z.array(z.string()).length(6);

// エネミー作成フィールドスキーマ
// エネミーは部位ダメージを受けず体力が0で倒れるため、部位ダメージ（damagedSpecialties）は持たない
const baseEnemyFields = {
  name: z.string().max(100, 'name は100文字以内で入力してください'),
  appearance: z.string().optional(),
  type: enemyTypeEnum.optional(),
  level: z.number().int().min(1).default(1),
  specialties: z.array(z.string()).default([]),
  gaps: z.array(gapEnum).default([]),
  abilities: z.array(enemyAbilitySchema).default([]),
  stamina: z.number().int().min(0).default(5),
  willPower: z.number().int().min(0).default(10),
  dropItems: dropItemsSchema.default(['', '', '', '', '', '']),
  // ドロップアイテムの詳細情報（既存アイテムからの追加・自由編集が可能）
  itemDetails: z.array(itemSchema).default([]),
  imageUrl: z.string().optional(),
  creator: z.string().optional(),
  password: z.string().nullable().optional(),
  // 一覧に表示しない（キャンプ等からの直接リンクでは表示される）
  hideFromList: z.boolean().optional().default(false),
};

// エネミー作成リクエストスキーマ
export const createEnemySchema = z.object(baseEnemyFields);

export type CreateEnemyRequest = z.infer<typeof createEnemySchema>;

// エネミー更新リクエストスキーマ（作成スキーマのpartial + nameを必須から任意に）
export const updateEnemySchema = createEnemySchema
  .omit({ name: true })
  .extend({
    name: z.string().max(100).optional(),
  })
  .partial();

export type UpdateEnemyRequest = z.infer<typeof updateEnemySchema>;

// エネミー取得スキーマ
export const getEnemySchema = z.object(baseEnemyFields);
