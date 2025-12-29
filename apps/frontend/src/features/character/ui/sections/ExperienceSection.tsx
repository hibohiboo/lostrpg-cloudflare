import { Box, TextField, Typography } from '@mui/material';
import React from 'react';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';
import { updateCharacter } from '../../model/characterSlice';

export const ExperienceSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const unusedExperience = useAppSelector(
    (state) => state.character.unusedExperience
  );
  const totalExperience = useAppSelector(
    (state) => state.character.totalExperience
  );

  return (
    <Box my={3}>
      <Typography variant="h6" gutterBottom>
        経験値
      </Typography>
      <Box display="flex" gap={2}>
        <TextField
          type="number"
          label="未使用経験値"
          value={unusedExperience}
          onChange={(e) =>
            dispatch(
              updateCharacter({ unusedExperience: Number(e.target.value) })
            )
          }
          sx={{ width: 200 }}
        />
        <TextField
          type="number"
          label="合計経験値"
          value={totalExperience}
          onChange={(e) =>
            dispatch(
              updateCharacter({ totalExperience: Number(e.target.value) })
            )
          }
          sx={{ width: 200 }}
        />
      </Box>
    </Box>
  );
};
