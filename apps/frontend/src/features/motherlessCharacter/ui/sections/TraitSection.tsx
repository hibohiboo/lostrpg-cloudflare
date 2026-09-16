import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import React from 'react';
import { useMotherlessTraitCatalog } from '@lostrpg/frontend/entities/motherlessSheet';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';
import { setTrait } from '../../model/characterSlice';

export const TraitSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const trait = useAppSelector((state) => state.motherlessCharacter.trait);
  const catalog = useMotherlessTraitCatalog();

  const handleChange = (e: SelectChangeEvent) => {
    const { value } = e.target;
    if (!value) {
      dispatch(setTrait(undefined));
      return;
    }
    const selected = catalog.find((t) => t.name === value);
    if (selected) {
      dispatch(setTrait(selected));
    }
  };

  return (
    <Box sx={{ my: 3 }}>
      <Typography variant="h6" gutterBottom>
        特性
      </Typography>
      <Select
        value={trait?.name ?? ''}
        onChange={handleChange}
        displayEmpty
        sx={{ minWidth: 200 }}
      >
        <MenuItem value="">未選択</MenuItem>
        {catalog.map((t) => (
          <MenuItem value={t.name} key={t.name}>
            {t.name}
          </MenuItem>
        ))}
      </Select>
      {trait?.description && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {trait.description}
        </Typography>
      )}
    </Box>
  );
};
