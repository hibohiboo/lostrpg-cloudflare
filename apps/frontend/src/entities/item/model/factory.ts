import { Item } from './types';

type ItemInput = {
  name: string;
  weight: number;
};

/**
 * Itemオブジェクトを生成するファクトリー関数
 * @param item - アイテムの基本情報
 * @returns 生成されたItemオブジェクト
 */
export const createItem = (item: ItemInput): Item => ({
  id: `item-${Date.now()}`,
  name: item.name,
  number: 1,
  weight: item.weight,
});
