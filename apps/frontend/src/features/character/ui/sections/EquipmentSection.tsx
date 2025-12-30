import { items } from '@lostrpg/core/game-data/item';
import { Equipment } from '@lostrpg/schemas/validation/items';
import { Box, Typography } from '@mui/material';
import { GridRowId } from '@mui/x-data-grid';
import React from 'react';
import {
  AddEquipmentForm,
  EquipmentTable,
} from '@lostrpg/frontend/entities/item';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';
import {
  addEquipment,
  deleteEquipment,
  updateEquipment,
} from '../../model/characterSlice';
import { equipmentCatalogSelector } from '../../model/selectors';

export const EquipmentSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const equipment = useAppSelector((state) => state.character.equipment);
  const catalog = useAppSelector(equipmentCatalogSelector);

  const handleEquipmentAdd = (itemName: string) => {
    const item = items.find((i) => i.name === itemName);
    if (item) {
      const newEquipment: Equipment = {
        id: `equipment-${Date.now()}`,
        name: item.name,
        equipedArea: item.area,
        j: item.j,
        weight:
          typeof item.weight === 'string'
            ? parseFloat(item.weight)
            : item.weight,
        type: item.type,
        area: item.area,
        specialty: item.specialty,
        target: item.target,
        trait: item.trait,
        effect: item.effect,
      };
      dispatch(addEquipment(newEquipment));
    }
  };
  const handleItemUpdate = (
    newRow: Equipment,
    _oldRow: Equipment,
    _params: { rowId: GridRowId },
  ): Equipment => {
    dispatch(updateEquipment(newRow));
    return newRow;
  };

  const handleItemDelete = (id: string) => {
    dispatch(deleteEquipment(id));
  };
  return (
    <Box my={3}>
      <Typography variant="h6" gutterBottom>
        装備
      </Typography>
      <AddEquipmentForm
        catalog={catalog}
        onItemAdd={(value) => {
          handleEquipmentAdd(value.name);
        }}
      />
      <Box sx={{ height: 400, width: '100%' }}>
        <EquipmentTable
          items={equipment}
          handleItemDelete={handleItemDelete}
          handleItemUpdate={handleItemUpdate}
        />
      </Box>
    </Box>
  );
};
