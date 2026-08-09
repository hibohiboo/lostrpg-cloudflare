import { Box, Paper, TextField, Typography } from '@mui/material';
import React from 'react';
import type { EnemyFormData } from '../../model/enemySlice';

type Props = {
  dropItems: EnemyFormData['dropItems'];
  onDropItemChange: (index: number, value: string) => void;
};

export const DropItemsSection: React.FC<Props> = ({
  dropItems,
  onDropItemChange,
}) => (
  <Box sx={{ my: 3 }}>
    <Typography variant="h6" gutterBottom>
      ドロップアイテム表
    </Typography>
    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
      <Typography variant="body2" color="text.secondary">
        エネミーを倒した時に1d6を振って入手できるアイテムです。出目1〜6ごとに設定してください。
      </Typography>
    </Paper>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {dropItems.map((item, index) => (
        <TextField
          key={index}
          fullWidth
          label={`${index + 1}`}
          value={item}
          onChange={(e) => onDropItemChange(index, e.target.value)}
        />
      ))}
    </Box>
  </Box>
);
