import { buildItemCatalog } from '@lostrpg/core/game-data/item';
import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Typography } from '@mui/material';
import { GridRowId } from '@mui/x-data-grid';
import React, { useMemo } from 'react';
import {
  AddItemForm,
  ItemTable,
  type Item,
} from '@lostrpg/frontend/entities/item';
import type { ScenarioItemAppendix } from '@lostrpg/frontend/entities/scenario';

type Props = {
  items: ScenarioItemAppendix[];
  onChange: (items: ScenarioItemAppendix[]) => void;
};

const createBlankItem = (): Item => ({
  id: `item-${Date.now()}`,
  number: 1,
  name: '',
  j: 0,
  weight: 0,
  type: '',
  area: '',
  specialty: '',
  target: '',
  trait: '',
  effect: '',
});

// アイテム付録：本文に登場させたアイテムの参照用一覧。
// キャラクターシートのアイテム欄と同じ表（ItemTable）で、選択・追加した内容をその場で編集できる。
// シナリオにはキャラクターのようなサプリメント選択の概念が無いため、
// アイテム選択の候補は常にサプリメントを全て含むカタログとする。
export const ItemAppendixEditor: React.FC<Props> = ({ items, onChange }) => {
  const catalog = useMemo(
    () => buildItemCatalog({ useStrangeField: true, useDragonPlain: true }),
    [],
  );

  const handleAdd = (item: Item) => onChange([...items, item]);
  const handleAddManual = () => onChange([...items, createBlankItem()]);
  const handleDelete = (id: string) =>
    onChange(items.filter((item) => item.id !== id));
  const handleUpdate = (
    newRow: Item,
    _oldRow: Item,
    _params: { rowId: GridRowId },
  ): Item => {
    onChange(items.map((item) => (item.id === newRow.id ? newRow : item)));
    return newRow;
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        アイテム
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <AddItemForm catalog={catalog} onItemAdd={handleAdd} />
        <Button startIcon={<AddIcon />} onClick={handleAddManual}>
          手動で追加
        </Button>
      </Box>
      <Box sx={{ width: '100%' }}>
        <ItemTable
          items={items}
          handleItemDelete={handleDelete}
          handleItemUpdate={handleUpdate}
        />
      </Box>
    </Box>
  );
};
