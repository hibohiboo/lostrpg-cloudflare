import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material';
import React from 'react';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';
import { toggleStatusAilment } from '../../model/characterSlice';

export const StatusAilmentsSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const statusAilments = useAppSelector(
    (state) => state.character.statusAilments
  );

  return (
    <Box my={3}>
      <Typography variant="h6" gutterBottom>
        状態異常
      </Typography>
      <Box>
        {statusAilments.map((ailment) => (
          <FormControlLabel
            key={ailment.id}
            control={
              <Checkbox
                checked={ailment.isChecked}
                onChange={() => dispatch(toggleStatusAilment(ailment.id))}
              />
            }
            label={`${ailment.name} - ${ailment.effect}`}
          />
        ))}
      </Box>
    </Box>
  );
};
