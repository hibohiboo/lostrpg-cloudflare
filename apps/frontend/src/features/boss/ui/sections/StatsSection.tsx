import { Box, Button, TextField, Typography } from '@mui/material';
import React from 'react';
import { calcBossStamina, calcBossWillPower } from '../../model/bossSlice';
import type { BossFormData } from '../../model/bossSlice';

type Props = {
  boss: BossFormData;
  onChange: (data: Partial<BossFormData>) => void;
};

export const StatsSection: React.FC<Props> = ({ boss, onChange }) => (
  <Box sx={{ my: 3 }}>
    <Typography variant="h6" gutterBottom>
      能力値
    </Typography>
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <TextField
        type="number"
        label="体力"
        helperText="[レベル×5]点"
        value={boss.stamina}
        onChange={(e) => onChange({ stamina: Number(e.target.value) })}
        sx={{ width: 180 }}
      />
      <TextField
        type="number"
        label="気力"
        helperText="[10+レベル]点"
        value={boss.willPower}
        onChange={(e) => onChange({ willPower: Number(e.target.value) })}
        sx={{ width: 180 }}
      />
      <Button
        variant="outlined"
        onClick={() =>
          onChange({
            stamina: calcBossStamina(boss.level),
            willPower: calcBossWillPower(boss.level),
          })
        }
        sx={{ height: 56 }}
      >
        レベルから再計算
      </Button>
    </Box>
  </Box>
);
