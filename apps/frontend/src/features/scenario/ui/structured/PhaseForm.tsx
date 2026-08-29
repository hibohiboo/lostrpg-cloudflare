import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, TextField, Typography } from '@mui/material';
import React from 'react';
import type { ScenarioPhase } from '@lostrpg/frontend/entities/scenario';

type Props = {
  phase: ScenarioPhase;
  onChange: (changes: Partial<ScenarioPhase>) => void;
  onDelete: () => void;
};

export const PhaseForm: React.FC<Props> = ({ phase, onChange, onDelete }) => (
  <Box>
    <Typography variant="h6" gutterBottom>
      フェイズを編集
    </Typography>
    <TextField
      fullWidth
      label="フェイズ名"
      value={phase.name}
      onChange={(e) => onChange({ name: e.target.value })}
      sx={{ my: 2 }}
    />
    <Button
      variant="outlined"
      color="error"
      startIcon={<DeleteIcon />}
      onClick={onDelete}
    >
      このフェイズを削除
    </Button>
  </Box>
);
