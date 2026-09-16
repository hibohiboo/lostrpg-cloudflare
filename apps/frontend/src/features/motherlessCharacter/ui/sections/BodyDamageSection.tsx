import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material';
import React from 'react';
import { shallowEqual } from 'react-redux';
import { useMotherlessBodyDamageCatalog } from '@lostrpg/frontend/entities/motherlessSheet';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';
import { toggleBodyDamage } from '../../model/characterSlice';

export const BodyDamageSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const selected = useAppSelector(
    (state) => state.motherlessCharacter.bodyDamages,
    shallowEqual,
  );
  const catalog = useMotherlessBodyDamageCatalog();

  return (
    <Box sx={{ my: 3 }}>
      <Typography variant="h6" gutterBottom>
        部位ダメージ
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {catalog.map((damage) => (
          <FormControlLabel
            key={damage.name}
            control={
              <Checkbox
                checked={selected.includes(damage.name)}
                onChange={() => dispatch(toggleBodyDamage(damage.name))}
              />
            }
            label={`${damage.name} - ${damage.effect}`}
          />
        ))}
      </Box>
    </Box>
  );
};
