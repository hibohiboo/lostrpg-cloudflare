import { abilityBonus } from '@lostrpg/core/game-data/motherless';
import { MotherlessAbilityScores } from '@lostrpg/schemas';
import { Box, TextField, Typography } from '@mui/material';
import React from 'react';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';
import { setAbilityScore } from '../../model/characterSlice';

const abilityLabels: { key: keyof MotherlessAbilityScores; label: string }[] =
  [
    { key: 'strength', label: '筋力' },
    { key: 'sense', label: '感覚' },
    { key: 'dexterity', label: '器用' },
    { key: 'constitution', label: '体力' },
    { key: 'intelligence', label: '知能' },
  ];

export const AbilityScoresSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const abilities = useAppSelector(
    (state) => state.motherlessCharacter.abilities,
  );

  return (
    <Box sx={{ my: 3 }}>
      <Typography variant="h6" gutterBottom>
        能力値
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        6点ごとにボーナス+1(端数切り捨て)
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {abilityLabels.map(({ key, label }) => (
          <Box
            key={key}
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <TextField
              type="number"
              label={label}
              value={abilities[key]}
              onChange={(e) =>
                dispatch(
                  setAbilityScore({ key, value: Number(e.target.value) }),
                )
              }
              sx={{ width: 120 }}
            />
            <Typography variant="body2" color="text.secondary">
              ボーナス {abilityBonus(abilities[key]) >= 0 ? '+' : ''}
              {abilityBonus(abilities[key])}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
