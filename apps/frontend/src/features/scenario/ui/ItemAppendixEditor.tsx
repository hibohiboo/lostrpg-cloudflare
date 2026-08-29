import { buildItemCatalog } from '@lostrpg/core/game-data/item';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, IconButton, TextField, Typography } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { ItemSelectionModal } from '@lostrpg/frontend/entities/item';
import type { ScenarioItemAppendix } from '@lostrpg/frontend/entities/scenario';

type Props = {
  items: ScenarioItemAppendix[];
  onChange: (items: ScenarioItemAppendix[]) => void;
};

// アイテム付録：本文に登場させたアイテムの参照用一覧。
// シナリオにはキャラクターのようなサプリメント選択の概念が無いため、
// アイテム選択の候補は常にサプリメントを全て含むカタログとする。
export const ItemAppendixEditor: React.FC<Props> = ({ items, onChange }) => {
  const [isItemModalOpen, setItemModalOpen] = useState(false);
  const catalog = useMemo(
    () => buildItemCatalog({ useStrangeField: true, useDragonPlain: true }),
    [],
  );

  const handleAddItem = (itemName: string) => {
    onChange([...items, { itemName }]);
    setItemModalOpen(false);
  };

  const handleAddManualItem = () => {
    onChange([...items, { itemName: '' }]);
  };

  const handleRemoveItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleItemNameChange = (index: number, itemName: string) => {
    onChange(items.map((item, i) => (i === index ? { ...item, itemName } : item)));
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        アイテム付録（本文に登場させたアイテムの参照用）
      </Typography>
      {items.map((item, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1 }}>
          <TextField
            size="small"
            fullWidth
            placeholder="名前"
            value={item.itemName ?? ''}
            onChange={(e) => handleItemNameChange(index, e.target.value)}
          />
          <IconButton aria-label="アイテムを削除" size="small" onClick={() => handleRemoveItem(index)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button startIcon={<AddIcon />} onClick={() => setItemModalOpen(true)}>
          アイテムを選択して追加
        </Button>
        <Button startIcon={<AddIcon />} onClick={handleAddManualItem}>
          手動で追加
        </Button>
      </Box>

      <ItemSelectionModal
        open={isItemModalOpen}
        onClose={() => setItemModalOpen(false)}
        items={catalog}
        onSelect={(item) => handleAddItem(item.name)}
        title="アイテムを選択"
      />
    </Box>
  );
};
