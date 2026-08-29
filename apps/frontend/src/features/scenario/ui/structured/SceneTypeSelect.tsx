import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
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

// シナリオ本文の記法例（/scenario/sample）にある「チェックポイント」「道」に対応する
// シーン種類のみを選択肢とする（自由入力ではなくドロップダウンで選ばせる）
const SCENE_TYPE_OPTIONS: { value: string; label: string; icon: ScenarioNotationIconKey }[] = [
  { value: 'checkpoint', label: 'チェックポイント', icon: 'checkpoint' },
  { value: 'path', label: '道', icon: 'path' },
];

type Props = {
  value: string | null | undefined;
  onChange: (value: string | null) => void;
};

const LABEL_ID = 'scene-type-select-label';

export const SceneTypeSelect: React.FC<Props> = ({ value, onChange }) => {
  const handleChange = (e: SelectChangeEvent) => {
    onChange(e.target.value || null);
  };

  return (
    <FormControl fullWidth sx={{ my: 2 }}>
      <InputLabel id={LABEL_ID}>種類（type）</InputLabel>
      <Select
        labelId={LABEL_ID}
        label="種類（type）"
        value={value ?? ''}
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>未設定</em>
        </MenuItem>
        {SCENE_TYPE_OPTIONS.map((option) => (
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
