import { Box, Checkbox, FormControlLabel, TextField } from '@mui/material';
import React from 'react';
import type { EnemyFormData } from '../../model/enemySlice';

type Props = {
  enemy: EnemyFormData;
  onChange: (data: Partial<EnemyFormData>) => void;
};

export const PasswordSection: React.FC<Props> = ({ enemy, onChange }) => (
  <Box sx={{ my: 2 }}>
    <TextField
      fullWidth
      type="password"
      label="パスワード（任意）"
      value={enemy.password || ''}
      onChange={(e) => onChange({ password: e.target.value })}
      helperText="パスワードを設定すると、エネミーの編集・削除にパスワードが必要になります"
    />

    {/* 一覧に表示しない */}
    <Box sx={{ mt: 2 }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={enemy.hideFromList ?? false}
            onChange={(e) => onChange({ hideFromList: e.target.checked })}
          />
        }
        label="一覧に表示しない"
      />
    </Box>
  </Box>
);
