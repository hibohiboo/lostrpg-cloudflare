import React from 'react';
import { ItemTable } from '@lostrpg/frontend/entities/item';
import type { ScenarioItemAppendix } from '@lostrpg/frontend/entities/scenario';

type Props = {
  items: ScenarioItemAppendix[];
};

// アイテム付録の詳細表示：キャラクターシートと同じ表（ItemTable）を読み取り専用で表示する。
export const ItemAppendixView: React.FC<Props> = ({ items }) => {
  if (items.length === 0) return null;

  return (
    <ItemTable
      items={items}
      handleItemDelete={() => {}}
      handleItemUpdate={(row) => row}
      hideActions
      hideNumberColumn
    />
  );
};
