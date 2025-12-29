import { items } from '@lostrpg/core/game-data/item';
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { GridRowId } from '@mui/x-data-grid';
import React, { useState } from 'react';
import {
  ItemTable,
  type Item as EntityItem,
} from '@lostrpg/frontend/entities/item';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';

import { addBag, updateBag, deleteBag } from '../../model/characterSlice';
import type { Bag, Item } from '../../model/characterSlice';

export const BagsSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const bags = useAppSelector((state) => state.character.bags);
  const [bagName, setBagName] = useState('');
  const [itemSelects, setItemSelects] = useState<Record<string, string>>({});

  const handleBagAdd = () => {
    if (!bagName) return;
    const newBag: Bag = {
      id: `bag-${Date.now()}`,
      name: bagName,
      capacity: 10,
      items: [],
    };
    dispatch(addBag(newBag));
    setBagName('');
  };

  const handleItemAdd = (bagId: string, itemName: string) => {
    const item = items.find((i) => i.name === itemName);
    const bag = bags.find((b) => b.id === bagId);
    if (item && bag) {
      const itemId = `item-${bagId}-${bag.items.length}`;
      const newItem: Item = {
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
      setItemSelects({ ...itemSelects, [bagId]: '' });
    }
  };

  const handleItemUpdate = (
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
  };

  const handleItemDelete = (bagId: string, itemId: string) => {
    const bag = bags.find((b) => b.id === bagId);
    if (bag) {
      const updatedItems = bag.items.filter((item) => item.id !== itemId);
      dispatch(updateBag({ ...bag, items: updatedItems }));
    }
  };

  const getTotalWeight = (bag: Bag) =>
    bag.items.reduce((sum, item) => sum + item.weight * (item.number || 1), 0);

  return (
    <Box my={3}>
      <Typography variant="h6" gutterBottom>
        袋
      </Typography>
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="名前"
          value={bagName}
          onChange={(e) => setBagName(e.target.value)}
          sx={{ width: 200 }}
        />
        <Button variant="outlined" onClick={handleBagAdd}>
          追加
        </Button>
      </Box>
      {bags.map((bag) => (
        <Box
          key={bag.id}
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
            <Button
              size="small"
              color="error"
              onClick={() => dispatch(deleteBag(bag.id))}
            >
              削除
            </Button>
          </Box>
          <Box display="flex" gap={2} mb={2}>
            <TextField
              type="number"
              label="袋容量"
              value={bag.capacity}
              onChange={(e) =>
                dispatch(
                  updateBag({ ...bag, capacity: Number(e.target.value) }),
                )
              }
              sx={{ width: 150 }}
            />
            <TextField
              type="number"
              label="アイテム重量"
              value={getTotalWeight(bag)}
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
              sx={{ width: 150 }}
            />
          </Box>

          <Select
            value={itemSelects[bag.id] || ''}
            label="アイテム追加"
            onChange={(e: SelectChangeEvent) => {
              const { value } = e.target;
              setItemSelects({ ...itemSelects, [bag.id]: value });
              if (value) {
                handleItemAdd(bag.id, value);
              }
            }}
            sx={{ minWidth: 200, mb: 2 }}
          >
            <MenuItem value="">未選択</MenuItem>
            {items.map((item) => (
              <MenuItem value={item.name} key={item.name}>
                {item.name}
              </MenuItem>
            ))}
          </Select>

          <Box sx={{ height: 400, width: '100%' }}>
            <ItemTable
              items={bag.items
                .filter((item) => item.id !== undefined)
                .map((item) => ({
                  ...item,
                  id: item.id!,
                  number: item.number ?? 1,
                }))}
              handleItemDelete={(id: string) => handleItemDelete(bag.id, id)}
              handleItemUpdate={(newRow, oldRow, params) =>
                handleItemUpdate(bag.id, newRow, oldRow, params)
              }
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
};
