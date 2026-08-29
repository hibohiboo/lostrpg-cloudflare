import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  FormControl,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from '@mui/material';
import React from 'react';
import { SCENARIO_NOTATION_ICONS } from '@lostrpg/frontend/entities/scenario';
import type { ScenarioNotationIconKey } from '@lostrpg/core/game-data/scenario';

// シナリオ本文の記法例（/scenario/sample）にあるイベント種類のみを選択肢とする
// （自由入力ではなくドロップダウンで選ばせる）
const EVENT_TYPE_OPTIONS: {
  value: string;
  label: string;
  icon: ScenarioNotationIconKey;
}[] = [
  { value: 'view', label: '描写', icon: 'view' },
  { value: 'battle', label: '戦闘', icon: 'battle' },
  { value: 'lock', label: '障害', icon: 'lock' },
  { value: 'search', label: '探索オブジェクト', icon: 'search' },
  { value: 'limitUp', label: 'リミット増加オブジェクト', icon: 'limitUp' },
  { value: 'boss', label: 'ヌシ', icon: 'boss' },
];

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const LABEL_ID = 'event-type-select-label';

export const EventTypeSelect: React.FC<Props> = ({ value, onChange }) => {
  const handleChange = (e: SelectChangeEvent) => {
    onChange(e.target.value || 'view');
  };

  return (
    <FormControl fullWidth sx={{ my: 2 }}>
      <InputLabel id={LABEL_ID}>カテゴリ</InputLabel>
      <Select
        labelId={LABEL_ID}
        label="カテゴリ"
        value={value}
        onChange={handleChange}
        renderValue={(selected) => {
          const option = EVENT_TYPE_OPTIONS.find((o) => o.value === selected);
          if (!option) return selected;
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FontAwesomeIcon icon={SCENARIO_NOTATION_ICONS[option.icon]} />
              {option.label}
            </Box>
          );
        }}
      >
        {EVENT_TYPE_OPTIONS.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <FontAwesomeIcon icon={SCENARIO_NOTATION_ICONS[option.icon]} />
            </ListItemIcon>
            <ListItemText>{option.label}</ListItemText>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
