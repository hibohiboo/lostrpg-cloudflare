import { buildItemCatalog } from '@lostrpg/core/game-data/item';
import { Box, Typography } from '@mui/material';
import { GridRowId } from '@mui/x-data-grid';
import React from 'react';
import { AddItemForm, ItemTable, type Item } from '@lostrpg/frontend/entities/item';

type Props = {
  itemDetails: Item[];
  onItemDetailAdd: (item: Item) => void;
  onItemDetailUpdate: (item: Item) => void;
  onItemDetailDelete: (id: string) => void;
};

// エネミー登録は管理側の作業のため、サプリメントによる絞り込みは行わず全アイテムから選択できる
const itemCatalog = buildItemCatalog({
  useStrangeField: true,
  useDragonPlain: true,
});

export const ItemDetailsSection: React.FC<Props> = ({
  itemDetails,
  onItemDetailAdd,
  onItemDetailUpdate,
  onItemDetailDelete,
}) => {
  const handleItemUpdate = (
    newRow: Item,
    _oldRow: Item,
    _params: { rowId: GridRowId },
  ): Item => {
    onItemDetailUpdate(newRow);
    return newRow;
  };

  return (
    <Box sx={{ my: 3 }}>
      <Typography variant="h6" gutterBottom>
        アイテム詳細
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        ドロップアイテムの詳細情報です。既存アイテムから追加するか、値を自由に編集して登録できます。
      </Typography>

      <AddItemForm catalog={itemCatalog} onItemAdd={onItemDetailAdd} />

      <Box sx={{ width: '100%', mt: 2 }}>
        <ItemTable
          items={itemDetails}
          handleItemDelete={onItemDetailDelete}
          handleItemUpdate={handleItemUpdate}
        />
      </Box>
    </Box>
  );
};
