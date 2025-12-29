import { Box, Chip, InputLabel, Typography } from '@mui/material';
import React from 'react';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';
import { SpecialtiesTable } from '@lostrpg/frontend/shared/ui';
import {
  toggleSpecialty,
  toggleGap,
  toggleDamagedSpecialty,
} from '../../model/characterSlice';
import type { Gap } from '../../model/characterSlice';

export const SpecialtiesSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const gaps = useAppSelector((state) => state.character.gaps);
  const specialties = useAppSelector((state) => state.character.specialties);
  const damagedSpecialties = useAppSelector(
    (state) => state.character.damagedSpecialties
  );

  return (
    <>
      <Box my={3}>
        <Typography variant="h6" gutterBottom>
          特技
        </Typography>
        <SpecialtiesTable
          gaps={gaps}
          damagedSpecialties={damagedSpecialties}
          onGapChange={(gap: Gap) => dispatch(toggleGap(gap))}
          onSpecialtySelect={(specialty: string) =>
            dispatch(toggleSpecialty(specialty))
          }
          onDamageChange={(specialty: string) =>
            dispatch(toggleDamagedSpecialty(specialty))
          }
        />
      </Box>

      <Box my={3}>
        <InputLabel>習得特技</InputLabel>
        <Box display="flex" flexWrap="wrap" gap={1}>
          {specialties.length > 0 ? (
            specialties.map((specialty) => (
              <Chip key={specialty} label={specialty} color="primary" />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              専門特技が選択されていません
            </Typography>
          )}
        </Box>
      </Box>
    </>
  );
};
