import { Box, TextField, Typography } from '@mui/material';
import React from 'react';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';
import { updateCharacter } from '../../model/characterSlice';

export const AbilitySection: React.FC = () => {
  const dispatch = useAppDispatch();
  const staminaBase = useAppSelector((state) => state.character.staminaBase);
  const stamina = useAppSelector((state) => state.character.stamina);
  const willPowerBase = useAppSelector((state) => state.character.willPowerBase);
  const willPower = useAppSelector((state) => state.character.willPower);

  return (
    <Box my={3}>
      <Typography variant="h6" gutterBottom>
        能力値
      </Typography>
      <Box display="flex" gap={2} flexWrap="wrap">
        <TextField
          type="number"
          label="スタミナ基本値"
          value={staminaBase}
          onChange={(e) =>
            dispatch(updateCharacter({ staminaBase: Number(e.target.value) }))
          }
          sx={{ width: 150 }}
        />
        <TextField
          type="number"
          label="現在スタミナ"
          value={stamina}
          onChange={(e) =>
            dispatch(updateCharacter({ stamina: Number(e.target.value) }))
          }
          sx={{ width: 150 }}
        />
        <TextField
          type="number"
          label="意志力基本値"
          value={willPowerBase}
          onChange={(e) =>
            dispatch(updateCharacter({ willPowerBase: Number(e.target.value) }))
          }
          sx={{ width: 150 }}
        />
        <TextField
          type="number"
          label="現在意志力"
          value={willPower}
          onChange={(e) =>
            dispatch(updateCharacter({ willPower: Number(e.target.value) }))
          }
          sx={{ width: 150 }}
        />
      </Box>
    </Box>
  );
};
