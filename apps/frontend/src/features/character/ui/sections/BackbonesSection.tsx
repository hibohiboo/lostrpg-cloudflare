import { backboneList } from '@lostrpg/core/game-data/character';
import { Box, Typography } from '@mui/material';
import { GridRowId } from '@mui/x-data-grid';
import React from 'react';
import {
  AddBackboneForm,
  BackboneTable,
  type Backbone,
} from '@lostrpg/frontend/entities/backbone';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';
import {
  addBackbone,
  updateBackbone,
  deleteBackbone,
} from '../../model/characterSlice';

export const BackbonesSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const backbones = useAppSelector((state) => state.character.backbones);
  const useStrangeField = useAppSelector(
    (state) => state.character.supplements.useStrangeField,
  );

  const handleBackboneAdd = (backbone: Backbone) => {
    dispatch(addBackbone(backbone));
  };

  const handleBackboneUpdate = (
    newRow: Backbone,
    _oldRow: Backbone,
    _params: { rowId: GridRowId },
  ): Backbone => {
    dispatch(updateBackbone(newRow));
    return newRow;
  };

  const handleBackboneDelete = (backbone: Backbone) => {
    dispatch(deleteBackbone(backbone));
  };

  if (!useStrangeField) {
    return null;
  }

  return (
    <Box my={3}>
      <Typography variant="h6" gutterBottom>
        背景
      </Typography>

      <AddBackboneForm
        backbones={backboneList}
        onBackboneAdd={handleBackboneAdd}
      />

      <Box sx={{ width: '100%', mt: 2 }}>
        <BackboneTable
          backbones={backbones}
          handleBackboneDelete={handleBackboneDelete}
          handleBackboneUpdate={handleBackboneUpdate}
        />
      </Box>
    </Box>
  );
};
