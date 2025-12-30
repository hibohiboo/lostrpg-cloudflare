import { Item } from './types';

type ItemInput = {
  name: string;
  j: number;
  weight: number;
  type: string;
  area: string;
  specialty: string;
  target: string;
  trait: string;
  effect: string;
};

/**
 * Itemオブジェクトを生成するファクトリー関数
 * @param item - アイテムの基本情報
 * @returns 生成されたItemオブジェクト
 */
export const createItem = (item: ItemInput): Item => ({
  id: `item-${Date.now()}`,
  number: 1,
  name: item.name,
  j: item.j,
  weight: item.weight,
  type: item.type,
  area: item.area,
  specialty: item.specialty,
  target: item.target,
  trait: item.trait,
  effect: item.effect,
});
