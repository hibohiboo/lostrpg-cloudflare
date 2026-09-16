// スプレッドシート「MotherlessData」のタブ名。
// ユーザーが作業中のため今後も変わりうる。ここを直せば取得ロジック全体に反映される。
export const motherlessSheetNames = {
  skill: 'スキル',
  item: 'アイテム',
  equipment: '装備',
  trait: '特性',
  class: 'クラス',
  statusAilment: '変調',
  bodyDamage: '部位ダメージ',
} as const;

export interface MotherlessSkillCatalogEntry {
  class: string;
  name: string;
  type: string;
  recoil: string;
  target: string;
  element: string;
  effect: string;
}

export interface MotherlessItemCatalogEntry {
  name: string;
  weight: number;
  type: string;
  tag: string;
  target: string;
  effect: string;
  flavor: string;
  price: string;
}

export interface MotherlessEquipmentCatalogEntry {
  name: string;
  weight: number;
  type: string;
  physicalDamage: number;
  elementDamage: number;
  accuracy: number;
  defense: number;
  evasion: number;
  initiativeAdjustment: number;
  tag: string;
  target: string;
  effect: string;
  flavor: string;
  price: string;
}

export interface MotherlessTraitCatalogEntry {
  name: string;
  description: string;
}

export interface MotherlessClassCatalogEntry {
  name: string;
  description: string;
}

export interface MotherlessCheckListCatalogEntry {
  name: string;
  effect: string;
}
