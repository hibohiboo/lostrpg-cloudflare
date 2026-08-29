import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { SCENARIO_NOTATION_ICONS } from '@lostrpg/frontend/entities/scenario';
import type { ScenarioNotationIconKey } from '@lostrpg/core/game-data/scenario';
import type { ScenarioEventItem } from '@lostrpg/frontend/entities/scenario';

const ITEM_TYPE_OPTIONS: {
  value: string;
  label: string;
  icon: ScenarioNotationIconKey;
}[] = [
  { value: 'item', label: 'アイテム', icon: 'item' },
  { value: 'roll', label: '判定', icon: 'roll' },
  { value: 'path', label: '道', icon: 'path' },
  { value: 'prize', label: '報酬', icon: 'prize' },
];

type Props = {
  items: ScenarioEventItem[];
  onChange: (items: ScenarioEventItem[]) => void;
};

export const EventItemsEditor: React.FC<Props> = ({ items, onChange }) => {
  const handleAdd = () => onChange([...items, { name: '', type: 'item' }]);
  const handleRemove = (index: number) =>
    onChange(items.filter((_, i) => i !== index));
  const handleUpdate = (index: number, changes: Partial<ScenarioEventItem>) =>
    onChange(
      items.map((item, i) => (i === index ? { ...item, ...changes } : item)),
    );

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        項目（アイテム・判定・道・報酬）
      </Typography>
      {items.map((item, index) => (
        <Box
          key={index}
          sx={{ display: 'flex', gap: 1, alignItems: 'center', my: 1 }}
        >
          <Select
            size="small"
            value={item.type}
            onChange={(e) => handleUpdate(index, { type: e.target.value })}
            sx={{ minWidth: 160 }}
            renderValue={(selected) => {
              const option = ITEM_TYPE_OPTIONS.find(
                (o) => o.value === selected,
              );
              if (!option) return selected;
              return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FontAwesomeIcon
                    icon={SCENARIO_NOTATION_ICONS[option.icon]}
                  />
                  {option.label}
                </Box>
              );
            }}
          >
            {ITEM_TYPE_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <FontAwesomeIcon
                    icon={SCENARIO_NOTATION_ICONS[option.icon]}
                  />
                </ListItemIcon>
                <ListItemText>{option.label}</ListItemText>
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
          <IconButton
            size="small"
            onClick={() => handleRemove(index)}
            aria-label="項目を削除"
          >
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
