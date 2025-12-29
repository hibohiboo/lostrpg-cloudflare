import { items } from '@lostrpg/core/game-data/item';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { useMemo, useState } from 'react';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';
import { addItem, updateItem, deleteItem, updateCharacter } from '../../model/characterSlice';
import type { Item } from '../../model/characterSlice';

export const ItemsSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const characterItems = useAppSelector((state) => state.character.items);
  const carryingCapacity = useAppSelector(
    (state) => state.character.carryingCapacity
  );
  const [itemSelect, setItemSelect] = useState('');

  const totalWeight = useMemo(
    () =>
      characterItems.reduce(
        (sum, item) => sum + item.weight * (item.number || 1),
        0
      ),
    [characterItems]
  );

  const totalValue = useMemo(
    () =>
      characterItems.reduce((sum, item) => sum + item.j * (item.number || 1), 0),
    [characterItems]
  );

  const handleItemAdd = (itemName: string) => {
    const item = items.find((i) => i.name === itemName);
    if (item) {
      const newItem: Item = {
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

  const itemColumns: GridColDef[] = [
    { field: 'name', headerName: '名前', width: 200, editable: true },
    {
      field: 'number',
      headerName: '個数',
      width: 100,
      type: 'number',
      editable: true,
    },
    {
      field: 'weight',
      headerName: '重量',
      width: 100,
      type: 'number',
      editable: true,
    },
    {
      field: 'j',
      headerName: '価格(J)',
      width: 100,
      type: 'number',
      editable: true,
    },
    {
      field: 'actions',
      headerName: '操作',
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <Button
          size="small"
          color="error"
          onClick={() => dispatch(deleteItem(params.row.id))}
        >
          <DeleteIcon fontSize="small" />
        </Button>
      ),
    },
  ];

  return (
    <Box my={3}>
      <Typography variant="h6" gutterBottom>
        アイテム
      </Typography>
      <Box display="flex" gap={2} mb={2}>
        <TextField
          type="number"
          label="運搬能力"
          value={carryingCapacity}
          onChange={(e) =>
            dispatch(
              updateCharacter({ carryingCapacity: Number(e.target.value) })
            )
          }
          sx={{ width: 150 }}
        />
        <TextField
          type="number"
          label="合計重量"
          value={totalWeight.toFixed(1)}
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

      <Select
        value={itemSelect}
        label="アイテム追加"
        onChange={(e: SelectChangeEvent) => {
          const { value } = e.target;
          setItemSelect(value);
          if (value) {
            handleItemAdd(value);
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
        <DataGrid
          rows={characterItems}
          columns={itemColumns}
          processRowUpdate={(updatedRow: Item) => {
            dispatch(updateItem(updatedRow));
            return updatedRow;
          }}
          hideFooter
          disableRowSelectionOnClick
          localeText={{
            noRowsLabel: 'アイテムがありません',
          }}
        />
      </Box>
    </Box>
  );
};
