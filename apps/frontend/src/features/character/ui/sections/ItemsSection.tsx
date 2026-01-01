import { items } from '@lostrpg/core/game-data/item';
import { CharacterItem } from '@lostrpg/schemas/validation/items';
import { Box, TextField, Typography } from '@mui/material';
import { GridRowId } from '@mui/x-data-grid';
import React, { useMemo, useCallback } from 'react';
import { shallowEqual } from 'react-redux';
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
  const characterItems = useAppSelector((state) => state.character.items, shallowEqual);
  const bags = useAppSelector((state) => state.character.bags, shallowEqual);
  const equipment = useAppSelector((state) => state.character.equipments, shallowEqual);
  const catalog = useAppSelector(itemCatalogSelector, shallowEqual);
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

  const handleItemAdd = useCallback((itemName: string) => {
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
    }
  }, [dispatch]);

  const handleItemUpdate = useCallback((
    newRow: EntityItem,
    _oldRow: EntityItem,
    _params: { rowId: GridRowId },
  ): EntityItem => {
    dispatch(updateItem(newRow));
    return newRow;
  }, [dispatch]);

  const handleItemDelete = useCallback((id: string) => {
    dispatch(deleteItem(id));
  }, [dispatch]);

  const handleCarryingCapacityChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateCharacter({ carryingCapacity: Number(e.target.value) }));
  }, [dispatch]);

  // アイテムテーブル用のデータをメモ化
  const tableItems = useMemo(
    () =>
      characterItems
        .filter((item) => item.id !== undefined)
        .map((item) => ({
          ...item,
          id: item.id!,
          number: item.number ?? 1,
        })),
    [characterItems],
  );

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
          onChange={handleCarryingCapacityChange}
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

      <Box sx={{ width: '100%' }}>
        <ItemTable
          items={tableItems}
          handleItemDelete={handleItemDelete}
          handleItemUpdate={handleItemUpdate}
        />
      </Box>
    </Box>
  );
};
