export const motherlessAbilityKeys = [
  'strength',
  'sense',
  'dexterity',
  'constitution',
  'intelligence',
] as const;

export type MotherlessAbilityKey = (typeof motherlessAbilityKeys)[number];

export type MotherlessAbilityScores = Record<MotherlessAbilityKey, number>;

// 能力値は6点ごとにボーナス+1(端数切り捨て)
export const abilityBonus = (score: number) => Math.floor(score / 6);

export const calcAbilityBonuses = (
  abilities: MotherlessAbilityScores,
): Record<MotherlessAbilityKey, number> => ({
  strength: abilityBonus(abilities.strength),
  sense: abilityBonus(abilities.sense),
  dexterity: abilityBonus(abilities.dexterity),
  constitution: abilityBonus(abilities.constitution),
  intelligence: abilityBonus(abilities.intelligence),
});

// 基礎HP = 5 + Lv + 体力ボーナス + (筋力ボーナス/2切り上げ)
export const calcBaseHp = (
  lv: number,
  constitutionBonus: number,
  strengthBonus: number,
) => 5 + lv + constitutionBonus + Math.ceil(strengthBonus / 2);

// 基礎TP = 知能ボーナス + (感覚ボーナス/2切り上げ)
export const calcBaseTp = (intelligenceBonus: number, senseBonus: number) =>
  intelligenceBonus + Math.ceil(senseBonus / 2);

// 攻撃力 = 装備の物理ダメージ合計 + 筋力ボーナス
export const calcAttackPower = (
  equippedPhysicalDamageTotal: number,
  strengthBonus: number,
) => equippedPhysicalDamageTotal + strengthBonus;

// 属性力 = 装備の属性ダメージ合計 + 感覚ボーナス
export const calcElementPower = (
  equippedElementDamageTotal: number,
  senseBonus: number,
) => equippedElementDamageTotal + senseBonus;

// 命中力 = 装備の命中力合計 + 器用ボーナス
export const calcAccuracy = (
  equippedAccuracyTotal: number,
  dexterityBonus: number,
) => equippedAccuracyTotal + dexterityBonus;

// 回避力 = 装備の回避力合計(ボーナス加算なし)
export const calcEvasion = (equippedEvasionTotal: number) =>
  equippedEvasionTotal;

// 防御力 = 装備の防御力合計(ボーナス加算なし)
export const calcDefense = (equippedDefenseTotal: number) =>
  equippedDefenseTotal;

// 先制値 = 2D6 + 器用ボーナス + (知力ボーナス/2切り上げ) + 装備の先制補正合計
// ダイス部分はキャラクターシート側で式として表示し、ここでは固定修正値のみ返す
export const calcInitiativeModifier = (
  dexterityBonus: number,
  intelligenceBonus: number,
  equippedInitiativeAdjustmentTotal: number,
) =>
  dexterityBonus +
  Math.ceil(intelligenceBonus / 2) +
  equippedInitiativeAdjustmentTotal;
