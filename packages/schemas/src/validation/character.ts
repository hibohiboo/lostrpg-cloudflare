import { z } from 'zod';
import { createValidator } from './helpers';
import { equipmentSchema, itemSchema } from './items';

const characterClassSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type CharacterClass = z.infer<typeof characterClassSchema>;

const bagSchema = z.object({
  name: z.string(),
  capacity: z.number().int().min(1),
  items: z.array(itemSchema),
  id: z.string(),
});

export type Bag = z.infer<typeof bagSchema>;
const backBoneBase = {
  name: z.string(),
  cp: z.number(),
  type: z.string(),
  effect: z.string(),
};
const backboneSchema = z.object(backBoneBase);

export type Backbone = z.infer<typeof backboneSchema>;
const abilityBase = {
  name: z.string(),
  group: z.string(),
  type: z.string(),
  recoil: z.string(),
  specialty: z.string(),
  target: z.string(),
  effect: z.string(),
};
const abilitySchema = z.object({
  id: z.string(),
  ...abilityBase,
});

export type Ability = z.infer<typeof abilitySchema>;

// ギャップの列挙型
const gapEnum = z.enum(['A', 'B', 'C', 'D', 'E']);

export type Gap = z.infer<typeof gapEnum>;

const supplementSchema = z.object({
  useStrangeField: z.boolean().optional().default(false),
  useDragonPlain: z.boolean().optional().default(false),
});

export type Supplement = z.infer<typeof supplementSchema>;

// 基本キャラクターフィールドスキーマ
const baseCharacterFields = {
  name: z.string().max(100, 'name は100文字以内で入力してください'),
  classes: z.array(characterClassSchema).default([]),
  specialties: z.array(z.string()).default([]),
  abilities: z.array(abilitySchema).default([]),
  gaps: z.array(gapEnum).default([]),
  bags: z.array(bagSchema).default([]),
  items: z.array(itemSchema).default([]),
  equipments: z.array(equipmentSchema).default([]),
  staminaBase: z.number().int().min(0).default(5),
  willPowerBase: z.number().int().min(0).default(10),
  statusAilments: z.array(z.string()).default([]),
  carryingCapacity: z.number().int().min(0).default(5),
  stamina: z.number().int().min(0).default(10),
  willPower: z.number().int().min(0).default(10),
  damagedSpecialties: z.array(z.string()).default([]),
  freeWriting: z.string().optional(),
  quote: z.string().optional(),
  summary: z.string().optional(),
  appearance: z.string().optional(),
  unusedExperience: z.number().int().min(0).default(0),
  totalExperience: z.number().int().min(0).default(0),
  campName: z.string().optional(),
  campId: z.string().optional(),
  playerName: z.string().optional(),
  imageUrl: z.string().optional(),
  backbones: z.array(backboneSchema).default([]),
  trophies: z.array(z.string()).default([]),
  supplements: supplementSchema,
  password: z.string().nullable().optional(),
};

// キャラクター作成リクエストスキーマ
export const createCharacterSchema = z.object(baseCharacterFields);

export type CreateCharacterRequest = z.infer<typeof createCharacterSchema>;

// キャラクター更新リクエストスキーマ（作成スキーマのpartial + nameを必須から任意に）
export const updateCharacterSchema = createCharacterSchema
  .omit({ name: true })
  .extend({
    name: z.string().max(100).optional(),
  })
  .partial();

export type UpdateCharacterRequest = z.infer<typeof updateCharacterSchema>;

// バリデーション実行関数
export const validateCreateCharacter = createValidator(createCharacterSchema);
export const validateUpdateCharacter = createValidator(updateCharacterSchema);

// キャラクター取得スキーマ
export const getCharacterSchema = z.object(baseCharacterFields);
