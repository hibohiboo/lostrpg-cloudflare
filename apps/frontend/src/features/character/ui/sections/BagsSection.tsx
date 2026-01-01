import { items } from '@lostrpg/core/game-data/item';
import { CharacterItem } from '@lostrpg/schemas/validation/items';
import { Box, Button, TextField, Typography } from '@mui/material';
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

import { addBag, updateBag, deleteBag } from '../../model/characterSlice';
import { itemCatalogSelector } from '../../model/selectors';
import type { Bag } from '@lostrpg/schemas';

// 個別のBagItemコンポーネント - 各バッグの独立した再レンダリングを実現
const BagItem: React.FC<{
  bag: Bag;
  catalog: typeof items;
  onBagUpdate: (bag: Bag) => void;
  onBagDelete: (bagId: string) => void;
  onItemAdd: (bagId: string, itemName: string) => void;
  onItemUpdate: (bagId: string, newRow: EntityItem, oldRow: EntityItem, params: { rowId: GridRowId }) => EntityItem;
  onItemDelete: (bagId: string, itemId: string) => void;
}> = React.memo(({ bag, catalog, onBagUpdate, onBagDelete, onItemAdd, onItemUpdate, onItemDelete }) => {
  const handleCapacityChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onBagUpdate({ ...bag, capacity: Number(e.target.value) });
  }, [bag, onBagUpdate]);

  const handleDelete = useCallback(() => {
    onBagDelete(bag.id);
  }, [bag.id, onBagDelete]);

  const handleItemAddWrapper = useCallback((value: { name: string }) => {
    onItemAdd(bag.id, value.name);
  }, [bag.id, onItemAdd]);

  const handleItemUpdateWrapper = useCallback((
    newRow: EntityItem,
    oldRow: EntityItem,
    params: { rowId: GridRowId },
  ) => onItemUpdate(bag.id, newRow, oldRow, params), [bag.id, onItemUpdate]);

  const handleItemDeleteWrapper = useCallback((id: string) => {
    onItemDelete(bag.id, id);
  }, [bag.id, onItemDelete]);

  const totalWeight = useMemo(
    () => bag.items.reduce((sum, item) => sum + item.weight * (item.number || 1), 0),
    [bag.items],
  );

  const tableItems = useMemo(
    () =>
      bag.items
        .filter((item) => item.id !== undefined)
        .map((item) => ({
          ...item,
          id: item.id!,
          number: item.number ?? 1,
        })),
    [bag.items],
  );

  return (
    <Box
      my={2}
      p={2}
      border={1}
      borderColor="grey.300"
      borderRadius={1}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="subtitle1">{bag.name}</Typography>
        <Button size="small" color="error" onClick={handleDelete}>
          削除
        </Button>
      </Box>
      <Box display="flex" gap={2} mb={2}>
        <TextField
          type="number"
          label="袋容量"
          value={bag.capacity}
          onChange={handleCapacityChange}
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
      </Box>

      <AddItemForm catalog={catalog} onItemAdd={handleItemAddWrapper} />

      <Box sx={{ width: '100%' }}>
        <ItemTable
          items={tableItems}
          handleItemDelete={handleItemDeleteWrapper}
          handleItemUpdate={handleItemUpdateWrapper}
        />
      </Box>
    </Box>
  );
});

BagItem.displayName = 'BagItem';

export const BagsSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const bags = useAppSelector((state) => state.character.bags, shallowEqual);
  const catalog = useAppSelector(itemCatalogSelector, shallowEqual);
  const [bagName, setBagName] = React.useState('');

  const handleBagAdd = useCallback(() => {
    if (!bagName) return;
    const newBag: Bag = {
      id: `bag-${Date.now()}`,
      name: bagName,
      capacity: 10,
      items: [],
    };
    dispatch(addBag(newBag));
    setBagName('');
  }, [bagName, dispatch]);

  const handleBagUpdate = useCallback((bag: Bag) => {
    dispatch(updateBag(bag));
  }, [dispatch]);

  const handleBagDelete = useCallback((bagId: string) => {
    dispatch(deleteBag(bagId));
  }, [dispatch]);

  const handleItemAdd = useCallback((bagId: string, itemName: string) => {
    const item = items.find((i) => i.name === itemName);
    const bag = bags.find((b) => b.id === bagId);
    if (item && bag) {
      const itemId = `item-${bagId}-${bag.items.length}`;
      const newItem: CharacterItem = {
        id: itemId,
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
      dispatch(updateBag({ ...bag, items: [...bag.items, newItem] }));
    }
  }, [bags, dispatch]);

  const handleItemUpdate = useCallback((
    bagId: string,
    newRow: EntityItem,
    _oldRow: EntityItem,
    _params: { rowId: GridRowId },
  ): EntityItem => {
    const bag = bags.find((b) => b.id === bagId);
    if (bag) {
      const updatedItems = bag.items.map((item) =>
        item.id === newRow.id ? newRow : item,
      );
      dispatch(updateBag({ ...bag, items: updatedItems }));
    }
    return newRow;
  }, [bags, dispatch]);

  const handleItemDelete = useCallback((bagId: string, itemId: string) => {
    const bag = bags.find((b) => b.id === bagId);
    if (bag) {
      const updatedItems = bag.items.filter((item) => item.id !== itemId);
      dispatch(updateBag({ ...bag, items: updatedItems }));
    }
  }, [bags, dispatch]);

  return (
    <Box my={3}>
      <Typography variant="h6" gutterBottom>
        袋
      </Typography>
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="袋の名前を入れて追加"
          value={bagName}
          onChange={(e) => setBagName(e.target.value)}
          sx={{ width: 200 }}
        />
        <Button variant="outlined" onClick={handleBagAdd}>
          追加
        </Button>
      </Box>
      {bags.map((bag) => (
        <BagItem
          key={bag.id}
          bag={bag}
          catalog={catalog}
          onBagUpdate={handleBagUpdate}
          onBagDelete={handleBagDelete}
          onItemAdd={handleItemAdd}
          onItemUpdate={handleItemUpdate}
          onItemDelete={handleItemDelete}
        />
      ))}
    </Box>
  );
};
