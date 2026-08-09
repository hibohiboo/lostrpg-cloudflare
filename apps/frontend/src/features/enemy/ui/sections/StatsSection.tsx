import { Box, TextField, Typography } from '@mui/material';
import React from 'react';
import type { EnemyFormData } from '../../model/enemySlice';

type Props = {
  enemy: EnemyFormData;
  onChange: (data: Partial<EnemyFormData>) => void;
};

export const StatsSection: React.FC<Props> = ({ enemy, onChange }) => (
  <Box sx={{ my: 3 }}>
    <Typography variant="h6" gutterBottom>
      能力値
    </Typography>
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <TextField
        type="number"
        label="体力"
        value={enemy.stamina}
        onChange={(e) => onChange({ stamina: Number(e.target.value) })}
        sx={{ width: 180 }}
      />
      <TextField
        type="number"
        label="気力"
        value={enemy.willPower}
        onChange={(e) => onChange({ willPower: Number(e.target.value) })}
        sx={{ width: 180 }}
      />
    </Box>
  </Box>
);
