import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material';
import React from 'react';
import { shallowEqual } from 'react-redux';
import { useMotherlessStatusAilmentCatalog } from '@lostrpg/frontend/entities/motherlessSheet';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';
import { toggleStatusAilment } from '../../model/characterSlice';

export const StatusAilmentsSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const selected = useAppSelector(
    (state) => state.motherlessCharacter.statusAilments,
    shallowEqual,
  );
  const catalog = useMotherlessStatusAilmentCatalog();

  return (
    <Box sx={{ my: 3 }}>
      <Typography variant="h6" gutterBottom>
        変調
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {catalog.map((ailment) => (
          <FormControlLabel
            key={ailment.name}
            control={
              <Checkbox
                checked={selected.includes(ailment.name)}
                onChange={() => dispatch(toggleStatusAilment(ailment.name))}
              />
            }
            label={`${ailment.name} - ${ailment.effect}`}
          />
        ))}
      </Box>
    </Box>
  );
};
