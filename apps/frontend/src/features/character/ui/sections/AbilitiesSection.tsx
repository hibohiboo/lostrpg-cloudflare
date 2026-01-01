import { Box, Typography } from '@mui/material';
import { GridRowId } from '@mui/x-data-grid';
import React, { useCallback } from 'react';
import { shallowEqual } from 'react-redux';
import {
  AddAbilityForm,
  AbilityTable,
  type Ability,
} from '@lostrpg/frontend/entities/ability';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';
import {
  addAbility,
  updateAbility,
  deleteAbility,
} from '../../model/characterSlice';
import { abilityCatalogSelector } from '../../model/selectors';

export const AbilitiesSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const abilities = useAppSelector((state) => state.character.abilities, shallowEqual);
  const abilityGroups = useAppSelector(abilityCatalogSelector, shallowEqual);

  const handleAbilityAdd = useCallback((ability: Ability) => {
    dispatch(addAbility(ability));
  }, [dispatch]);

  const handleAbilityUpdate = useCallback((
    newRow: Ability,
    _oldRow: Ability,
    _params: { rowId: GridRowId },
  ): Ability => {
    dispatch(updateAbility(newRow));
    return newRow;
  }, [dispatch]);

  const handleAbilityDelete = useCallback((id: string) => {
    dispatch(deleteAbility(id));
  }, [dispatch]);

  return (
    <Box my={3}>
      <Typography variant="h6" gutterBottom>
        アビリティ
      </Typography>

      <AddAbilityForm
        abilityGroups={abilityGroups}
        onAbilityAdd={handleAbilityAdd}
      />

      <Box sx={{ width: '100%', mt: 2 }}>
        <AbilityTable
          abilities={abilities}
          handleAbilityDelete={handleAbilityDelete}
          handleAbilityUpdate={handleAbilityUpdate}
        />
      </Box>
    </Box>
  );
};
