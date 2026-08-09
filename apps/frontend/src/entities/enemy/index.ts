export * from './api/api';
export * from './actions/crud';
export type {
  EnemyAbility,
  EnemyType,
  EnemyGap,
} from '@lostrpg/schemas/validation/enemy';

// エネミーのタイプ一覧（絞り込みや選択肢の表示に使用）
export const ENEMY_TYPES = ['ケモノ', 'ムシ', 'ミュータント'] as const;
