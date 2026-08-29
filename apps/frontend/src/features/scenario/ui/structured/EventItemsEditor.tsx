import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, IconButton, MenuItem, Select, TextField, Typography } from '@mui/material';
import React from 'react';
import type { ScenarioEventItem } from '@lostrpg/frontend/entities/scenario';

const ITEM_TYPES = ['item', 'roll', 'path', 'prize'] as const;

type Props = {
  items: ScenarioEventItem[];
  onChange: (items: ScenarioEventItem[]) => void;
};

export const EventItemsEditor: React.FC<Props> = ({ items, onChange }) => {
  const handleAdd = () => onChange([...items, { name: '', type: 'item' }]);
  const handleRemove = (index: number) => onChange(items.filter((_, i) => i !== index));
  const handleUpdate = (index: number, changes: Partial<ScenarioEventItem>) =>
    onChange(items.map((item, i) => (i === index ? { ...item, ...changes } : item)));

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        項目（アイテム・判定・道・報酬）
      </Typography>
      {items.map((item, index) => (
        <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center', my: 1 }}>
          <Select
            size="small"
            value={item.type}
            onChange={(e) => handleUpdate(index, { type: e.target.value })}
            sx={{ minWidth: 120 }}
          >
            {ITEM_TYPES.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
          <TextField
            size="small"
            fullWidth
            placeholder="名称"
            value={item.name}
            onChange={(e) => handleUpdate(index, { name: e.target.value })}
          />
          <IconButton size="small" onClick={() => handleRemove(index)} aria-label="項目を削除">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}
      <Button size="small" startIcon={<AddIcon />} onClick={handleAdd}>
        項目を追加
      </Button>
    </Box>
  );
};
