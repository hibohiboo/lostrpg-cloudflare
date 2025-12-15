import { z } from 'zod';

// クラス名スキーマ
const ClassNameSchema = z.enum([
  'マッスル',
  'テクノロジー',
  'マジカル',
  'サイキック',
  'バイオ',
  'エスペラント',
  'アーティファクト',
  'アーツ',
]);

// 基本スキル/攻撃スキーマ
const skillOrAttackSchema = z.object({
  name: z.string().optional(),
  level: z.number().int().min(1).optional(),
  maxLevel: z.number().int().min(1).optional(),
  timing: z.string().optional(),
  skill: z.string().optional(),
  target: z.string().optional(),
  range: z.string().optional(),
  cost: z.string().optional(), // 文字列型に変更
  effect: z.string().optional(),
});

// アイテムスキーマ
const itemSchema = z.object({
  name: z.string(),
  type: z.string(), // 種別 (白兵/射撃/白兵/射撃/防具/消耗品/その他)
  skill: z.string().optional(), // 対応技能 (〈パワー〉/〈技術〉/〈射撃〉等)
  modifier: z.string().optional(), // 修正値 (＋５％/－１０％等)
  attackPower: z.string().optional(), // 攻撃力 (＋４/＋８等)
  guardValue: z.string().optional(), // ガード値 (３/０等)
  range: z.string().optional(), // 射程 (至近/近/中/遠)
  dodge: z.string().optional(), // ドッジ修正 (防具用: ＋５％/－１０％等)
  actionValue: z.string().optional(), // 行動値修正 (防具用: ＋０/－２等)
  protection: z.string().optional(), // 防護点 (防具用: ５/１０等)
  price: z.number().min(0), // 価格 (数値)
  effect: z.string().optional(), // 効果説明
  quantity: z.number().int().min(1).optional(), // 数量（消耗品用）
});

// セッションスキーマ
const sessionSchema = z.object({
  id: z.string().optional(),
  sessionName: z.string().optional(),
  gmName: z.string().optional(),
  sessionDate: z.string().optional(),
  currentHp: z.number().optional(),
  currentSp: z.number().optional(),
  currentFc: z.number().optional(),
  experiencePoints: z.number().optional(),
  memo: z.string().optional(),
  createdAt: z.string().optional(),
});

// 基本情報スキーマ
const basicInfoSchema = z.object({
  name: z.string().max(50, 'name は50文字以内で入力してください').optional(),
  selectedClasses: z.tuple([ClassNameSchema, ClassNameSchema]).optional(),
  abilityBonus: z
    .enum(['physical', 'reflex', 'sensory', 'intellectual', 'supernatural'])
    .optional(),
  skillPointsLimit: z.number().min(1).optional(),
  heroSkillLevelLimit: z.number().min(1).optional(),
  itemPriceLimit: z.number().min(1).optional(),
  password: z.string().nullable().optional(),
});

// スキル割り当てスキーマ
const skillAllocationsSchema = z.object({
  skillAllocations: z
    .record(z.string(), z.number().optional())
    .optional()
    .default({}),
});

// ヒーロースキルスキーマ
const heroSkillsSchema = z.object({
  heroSkills: z.array(skillOrAttackSchema).optional().default([]),
});

// 必殺技スキーマ
const specialAttacksSchema = z.object({
  specialAttacks: z.array(skillOrAttackSchema).optional().default([]),
});

// アイテムリストスキーマ
const itemsSchema = z.object({
  items: z.array(itemSchema).optional().default([]),
});

// セッション履歴スキーマ
const sessionsSchema = z.object({
  sessions: z.array(sessionSchema).optional().default([]),
});

// ステータススキーマ
const statusSchema = z.object({
  status: z.object({
    hp: z.number().optional(),
    sp: z.number().optional(),
    actionValue: z.number().optional(),
  }).optional(),
});

// ステータス補正値スキーマ
const statusModifiersSchema = z.object({
  statusModifiers: z.object({
    hpModifier: z.number().optional(),
    spModifier: z.number().optional(),
    actionValueModifier: z.number().optional(),
  }).optional(),
});

// CreateCharacterRequest のバリデーションスキーマ
export const createCharacterSchema = basicInfoSchema
  .merge(skillAllocationsSchema)
  .merge(heroSkillsSchema)
  .merge(specialAttacksSchema)
  .merge(itemsSchema)
  .merge(statusSchema)
  .merge(statusModifiersSchema)
  .merge(sessionsSchema);

export type CreateCharacterRequest = z.infer<typeof createCharacterSchema>;

// 更新用セッションスキーマ
const updateSessionSchema = z.object({
  id: z.string().optional(),
  sessionName: z.string().optional(),
  gmName: z.string().optional(),
  sessionDate: z.string().optional(),
  currentHp: z.number().int().min(0).optional(),
  currentSp: z.number().int().min(0).optional(),
  currentFc: z.number().int().min(0).optional().nullable(),
  experiencePoints: z.number().int().min(0).optional(),
  memo: z.string().optional().nullable(),
});

// UpdateCharacterRequest のバリデーションスキーマ
export const updateCharacterSchema = z.object({
  session: updateSessionSchema.optional(),
  password: z.string().nullable().optional(),
});

export type UpdateCharacterRequest = z.infer<typeof updateCharacterSchema>;

// バリデーション結果の型
export type ValidationResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
        details: Array<{
          field: string;
          message: string;
        }>;
      };
    };

// バリデーション実行関数
export const validateCreateCharacter = (
  data: unknown,
): ValidationResult<CreateCharacterRequest> => {
  const result = createCharacterSchema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  return {
    success: false,
    error: {
      code: 'VALIDATION_ERROR',
      message: 'バリデーションエラーが発生しました',
      details: [],
      // cloudflare workers 環境で以下のコードが原因でエラーになるため、一旦コメントアウト
      // details: result.error.errors.map((err: any) => ({
      //   field: err.path.join('.'),
      //   message: err.message,
      // })),
    },
  };
};

// UpdateCharacterRequest バリデーション実行関数
export const validateUpdateCharacter = (
  data: unknown,
): ValidationResult<UpdateCharacterRequest> => {
  const result = updateCharacterSchema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  return {
    success: false,
    error: {
      code: 'VALIDATION_ERROR',
      message: 'バリデーションエラーが発生しました',
      details: [],
      // cloudflare workers 環境で以下のコードが原因でエラーになるため、一旦コメントアウト
      //     details:result.error.errors.map((err: any) => ({
      //     field: err.path.join('.'),
      //     message: err.message,
      //   })),
    },
  };
};
