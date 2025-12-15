/**
 * Age of Hero クラス別能力値マスターデータ
 */
export const CLASSES = {
  マッスル: {
    physical: 3,
    reflex: 2,
    sensory: 2,
    intellectual: 1,
    supernatural: 0,
    hp: 38,
    sp: 17,
  },
  テクノロジー: {
    physical: 1,
    reflex: 2,
    sensory: 3,
    intellectual: 2,
    supernatural: 0,
    hp: 30,
    sp: 25,
  },
  マジカル: {
    physical: 1,
    reflex: 1,
    sensory: 1,
    intellectual: 2,
    supernatural: 3,
    hp: 23,
    sp: 32,
  },
  サイキック: {
    physical: 1,
    reflex: 1,
    sensory: 2,
    intellectual: 2,
    supernatural: 2,
    hp: 25,
    sp: 30,
  },
  バイオ: {
    physical: 2,
    reflex: 2,
    sensory: 2,
    intellectual: 2,
    supernatural: 0,
    hp: 36,
    sp: 19,
  },
  エスペラント: {
    physical: 1,
    reflex: 2,
    sensory: 1,
    intellectual: 2,
    supernatural: 2,
    hp: 27,
    sp: 28,
  },
  アーティファクト: {
    physical: 2,
    reflex: 1,
    sensory: 2,
    intellectual: 1,
    supernatural: 2,
    hp: 34,
    sp: 21,
  },
  アーツ: {
    physical: 1,
    reflex: 3,
    sensory: 2,
    intellectual: 2,
    supernatural: 0,
    hp: 32,
    sp: 23,
  },
} as const;

export type ClassName = keyof typeof CLASSES;

export type ClassStats = typeof CLASSES[ClassName];