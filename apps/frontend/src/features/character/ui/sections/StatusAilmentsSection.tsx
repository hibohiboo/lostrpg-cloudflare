import { statusAilments } from '@lostrpg/core/game-data/character';
import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material';
import React from 'react';
import { shallowEqual } from 'react-redux';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';
import { toggleStatusAilment } from '../../model/characterSlice';

export const StatusAilmentsSection = React.memo(() => {
  const dispatch = useAppDispatch();
  const selectedStatusAilments = useAppSelector(
    (state) => state.character.statusAilments,
    shallowEqual,
  );

  return (
    <Box my={3}>
      <Typography variant="h6" gutterBottom>
        変調
      </Typography>
      <Box display="flex" flexDirection="column" flexWrap="wrap" gap={1}>
        {statusAilments.map((ailment) => (
          <FormControlLabel
            key={ailment.name}
            control={
              <Checkbox
                checked={selectedStatusAilments.includes(ailment.name)}
                onChange={() => dispatch(toggleStatusAilment(ailment.name))}
              />
            }
            label={`${ailment.name} - ${ailment.effect}`}
          />
        ))}
      </Box>
    </Box>
  );
});
