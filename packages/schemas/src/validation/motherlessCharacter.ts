import { z } from 'zod';
import { createValidator } from './helpers';

const motherlessAbilityScoresSchema = z.object({
  strength: z.number().int().min(0),
  sense: z.number().int().min(0),
  dexterity: z.number().int().min(0),
  constitution: z.number().int().min(0),
  intelligence: z.number().int().min(0),
});

export type MotherlessAbilityScores = z.infer<
  typeof motherlessAbilityScoresSchema
>;

const motherlessTraitSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export type MotherlessTrait = z.infer<typeof motherlessTraitSchema>;

const motherlessClassSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export type MotherlessClass = z.infer<typeof motherlessClassSchema>;

const motherlessSkillBase = {
  class: z.string(),
  name: z.string(),
  type: z.string(),
  recoil: z.string(),
  target: z.string(),
  element: z.string(),
  effect: z.string(),
};
const motherlessSkillSchema = z.object({
  id: z.string(),
  ...motherlessSkillBase,
});

export type MotherlessSkill = z.infer<typeof motherlessSkillSchema>;
export type MotherlessSkillBase = Omit<MotherlessSkill, 'id'>;

const motherlessItemBase = {
  name: z.string(),
  weight: z.number().min(0),
  type: z.string(),
  tag: z.string(),
  target: z.string(),
  effect: z.string(),
  flavor: z.string(),
  price: z.string(),
};
const motherlessItemSchema = z.object({
  id: z.string(),
  number: z.number().int().min(1),
  ...motherlessItemBase,
});

export type MotherlessItem = z.infer<typeof motherlessItemSchema>;
export type MotherlessItemBase = Omit<MotherlessItem, 'id' | 'number'>;

const motherlessEquipmentBase = {
  name: z.string(),
  weight: z.number().min(0),
  type: z.string(),
  physicalDamage: z.number().default(0),
  elementDamage: z.number().default(0),
  accuracy: z.number().default(0),
  defense: z.number().default(0),
  evasion: z.number().default(0),
  initiativeAdjustment: z.number().default(0),
  tag: z.string(),
  target: z.string(),
  effect: z.string(),
  flavor: z.string(),
  price: z.string(),
};
const motherlessEquipmentSchema = z.object({
  id: z.string(),
  ...motherlessEquipmentBase,
});

export type MotherlessEquipment = z.infer<typeof motherlessEquipmentSchema>;
export type MotherlessEquipmentBase = Omit<MotherlessEquipment, 'id'>;

// 基本キャラクターフィールドスキーマ
const baseMotherlessCharacterFields = {
  name: z.string().max(100, 'name は100文字以内で入力してください'),
  playerName: z.string().optional(),
  imageUrl: z.string().optional(),
  level: z.number().int().min(1).default(1),
  trait: motherlessTraitSchema.optional(),
  classes: z.array(motherlessClassSchema).default([]),
  totalExperience: z.number().int().min(0).default(0),
  unusedExperience: z.number().int().min(0).default(0),
  abilities: motherlessAbilityScoresSchema,
  hp: z.number().int().default(0),
  tp: z.number().int().default(0),
  acquiredSkills: z.array(motherlessSkillSchema).default([]),
  items: z.array(motherlessItemSchema).default([]),
  equipments: z.array(motherlessEquipmentSchema).default([]),
  statusAilments: z.array(z.string()).default([]),
  bodyDamages: z.array(z.string()).default([]),
  freeWriting: z.string().optional(),
  quote: z.string().optional(),
  summary: z.string().optional(),
  appearance: z.string().optional(),
  password: z.string().nullable().optional(),
  hideFromList: z.boolean().optional().default(false),
};

// キャラクター作成リクエストスキーマ
export const createMotherlessCharacterSchema = z.object(
  baseMotherlessCharacterFields,
);

export type CreateMotherlessCharacterRequest = z.infer<
  typeof createMotherlessCharacterSchema
>;

// キャラクター更新リクエストスキーマ(作成スキーマのpartial + nameを必須から任意に)
export const updateMotherlessCharacterSchema = createMotherlessCharacterSchema
  .omit({ name: true })
  .extend({
    name: z.string().max(100).optional(),
  })
  .partial();

export type UpdateMotherlessCharacterRequest = z.infer<
  typeof updateMotherlessCharacterSchema
>;

// バリデーション実行関数
export const validateCreateMotherlessCharacter = createValidator(
  createMotherlessCharacterSchema,
);
export const validateUpdateMotherlessCharacter = createValidator(
  updateMotherlessCharacterSchema,
);

// キャラクター取得スキーマ
export const getMotherlessCharacterSchema = z.object(
  baseMotherlessCharacterFields,
);
