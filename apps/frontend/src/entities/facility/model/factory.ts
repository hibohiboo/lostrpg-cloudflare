import { Facility } from './types';

type FacilityItemInput = {
  name: string;
  type: string;
  specialty: string;
  effect: string;
};

/**
 * Facilityオブジェクトを生成するファクトリー関数
 * @param item - 設備または人材の基本情報
 * @param prefix - IDのプレフィックス（'facility' または 'personality'）
 * @returns 生成されたFacilityオブジェクト
 */
export const createFacility = (
  item: FacilityItemInput,
  prefix: 'facility' | 'personality' = 'facility',
): Facility => ({
  id: `${prefix}-${Date.now()}`,
  name: item.name,
  type: item.type,
  specialty: item.specialty,
  level: 1,
  effect: item.effect,
});
