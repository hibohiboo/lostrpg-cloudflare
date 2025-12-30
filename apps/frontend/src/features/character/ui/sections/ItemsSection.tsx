import { items } from '@lostrpg/core/game-data/item';
import { CharacterItem } from '@lostrpg/schemas/validation/items';
import { Box, TextField, Typography } from '@mui/material';
import { GridRowId } from '@mui/x-data-grid';
import React, { useMemo } from 'react';
import {
  AddItemForm,
  ItemTable,
  type Item as EntityItem,
} from '@lostrpg/frontend/entities/item';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';

import {
  addItem,
  updateItem,
  deleteItem,
  updateCharacter,
} from '../../model/characterSlice';
import { itemCatalogSelector } from '../../model/selectors';

export const ItemsSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const characterItems = useAppSelector((state) => state.character.items);
  const bags = useAppSelector((state) => state.character.bags);
  const equipment = useAppSelector((state) => state.character.equipment);
  const catalog = useAppSelector(itemCatalogSelector);
  const carryingCapacity = useAppSelector(
    (state) => state.character.carryingCapacity,
  );

  const totalWeight = useMemo(
    () =>
      characterItems.reduce(
        (sum, item) => sum + item.weight * (item.number || 1),
        0,
      ),
    [characterItems],
  );

  const totalValue = useMemo(() => {
    // アイテムリストの合計
    const itemsTotal = characterItems.reduce(
      (sum, item) => sum + item.j * (item.number || 1),
      0,
    );

    // 袋の中のアイテムの合計
    const bagsTotal = bags.reduce((bagSum, bag) => {
      const bagItemsTotal = bag.items.reduce(
        (itemSum, item) => itemSum + item.j * (item.number || 1),
        0,
      );
      return bagSum + bagItemsTotal;
    }, 0);

    // 装備の合計
    const equipmentTotal = equipment.reduce((sum, item) => sum + item.j, 0);

    return itemsTotal + bagsTotal + equipmentTotal;
  }, [characterItems, bags, equipment]);

  const handleItemAdd = (itemName: string) => {
    const item = items.find((i) => i.name === itemName);
    if (item) {
      const newItem: CharacterItem = {
        id: `item-${Date.now()}`,
        name: item.name,
        number: 1,
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
      dispatch(addItem(newItem));
      setItemSelect('');
    }
  };

  const handleItemUpdate = (
    newRow: EntityItem,
    _oldRow: EntityItem,
    _params: { rowId: GridRowId },
  ): EntityItem => {
    dispatch(updateItem(newRow));
    return newRow;
  };

  const handleItemDelete = (id: string) => {
    dispatch(deleteItem(id));
  };

  return (
    <Box my={3}>
      <Typography variant="h6" gutterBottom>
        アイテム
      </Typography>
      <Box display="flex" gap={2} mb={2}>
        <TextField
          type="number"
          label="所持限界"
          value={carryingCapacity}
          onChange={(e) =>
            dispatch(
              updateCharacter({ carryingCapacity: Number(e.target.value) }),
            )
          }
          sx={{ width: 150 }}
        />
        <TextField
          type="number"
          label="アイテム重量"
          value={totalWeight}
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
          sx={{ width: 150 }}
        />
        <TextField
          type="number"
          label="合計価格(J)"
          value={totalValue}
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
          sx={{ width: 150 }}
        />
      </Box>

      <AddItemForm
        catalog={catalog}
        onItemAdd={(value) => {
          handleItemAdd(value.name);
        }}
      />

      <Box sx={{ height: 400, width: '100%' }}>
        <ItemTable
          items={characterItems
            .filter((item) => item.id !== undefined)
            .map((item) => ({
              ...item,
              id: item.id!,
              number: item.number ?? 1,
            }))}
          handleItemDelete={handleItemDelete}
          handleItemUpdate={handleItemUpdate}
        />
      </Box>
    </Box>
  );
};
