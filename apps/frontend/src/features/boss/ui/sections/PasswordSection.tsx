import { Box, Checkbox, FormControlLabel, TextField } from '@mui/material';
import React from 'react';
import type { BossFormData } from '../../model/bossSlice';

type Props = {
  boss: BossFormData;
  onChange: (data: Partial<BossFormData>) => void;
};

export const PasswordSection: React.FC<Props> = ({ boss, onChange }) => (
  <Box sx={{ my: 2 }}>
    <TextField
      fullWidth
      type="password"
      label="パスワード（任意）"
      value={boss.password || ''}
      onChange={(e) => onChange({ password: e.target.value })}
      helperText="パスワードを設定すると、ヌシの編集・削除にパスワードが必要になります"
    />

    {/* 一覧に表示しない */}
    <Box sx={{ mt: 2 }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={boss.hideFromList ?? false}
            onChange={(e) => onChange({ hideFromList: e.target.checked })}
          />
        }
        label="一覧に表示しない"
      />
    </Box>
  </Box>
);
