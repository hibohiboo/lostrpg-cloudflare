import { Box, TextField, Typography } from '@mui/material';
import React from 'react';
import type { BossFormData } from '../../model/bossSlice';

type Props = {
  boss: BossFormData;
  isValidError: boolean;
  onChange: (data: Partial<BossFormData>) => void;
  onLevelChange: (level: number) => void;
};

export const BasicSection: React.FC<Props> = ({
  boss,
  isValidError,
  onChange,
  onLevelChange,
}) => (
  <Box sx={{ my: 2 }}>
    <Typography variant="h6" gutterBottom>
      基本情報
    </Typography>

    {/* ヌシ名（必須） */}
    <Box sx={{ my: 2 }}>
      <TextField
        fullWidth
        required
        label="名前"
        error={!boss.name && isValidError}
        helperText={!boss.name && isValidError ? '名前は必須です' : ''}
        value={boss.name}
        onChange={(e) => onChange({ name: e.target.value })}
      />
    </Box>

    {/* 外見 */}
    <Box sx={{ my: 2 }}>
      <TextField
        fullWidth
        multiline
        rows={4}
        label="外見"
        helperText="動物を中心に、機械や災害などの要素を組み合わせたものが多いようです"
        value={boss.appearance ?? ''}
        onChange={(e) => onChange({ appearance: e.target.value })}
      />
    </Box>

    {/* レベル */}
    <Box sx={{ my: 2 }}>
      <TextField
        type="number"
        label="レベル"
        helperText="初期作成の冒険者を相手にする場合、人数と等しい数にするとよいでしょう"
        value={boss.level}
        onChange={(e) => onLevelChange(Number(e.target.value))}
        sx={{ width: 200 }}
      />
    </Box>
  </Box>
);
