import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, TextField, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { useState } from 'react';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';
import { addEquipment, updateEquipment, deleteEquipment } from '../../model/characterSlice';
import type { Equipment } from '../../model/characterSlice';

export const EquipmentSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const equipment = useAppSelector((state) => state.character.equipment);
  const [equipmentArea, setEquipmentArea] = useState('');

  const handleEquipmentAdd = () => {
    if (!equipmentArea) return;
    const newEquipment: Equipment = {
      id: `eq-${Date.now()}`,
      equipedArea: equipmentArea,
      name: '',
      j: 0,
      weight: 0,
      type: '',
      area: '',
      specialty: '',
      target: '',
      trait: '',
      effect: '',
    };
    dispatch(addEquipment(newEquipment));
    setEquipmentArea('');
  };

  const equipmentColumns: GridColDef[] = [
    { field: 'equipedArea', headerName: '部位', width: 120, editable: true },
    { field: 'name', headerName: '名前', width: 200, editable: true },
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
          onClick={() => dispatch(deleteEquipment(params.row.id))}
        >
          <DeleteIcon fontSize="small" />
        </Button>
      ),
    },
  ];

  return (
    <Box my={3}>
      <Typography variant="h6" gutterBottom>
        装備
      </Typography>
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="部位"
          value={equipmentArea}
          onChange={(e) => setEquipmentArea(e.target.value)}
          sx={{ width: 200 }}
        />
        <Button variant="outlined" onClick={handleEquipmentAdd}>
          追加
        </Button>
      </Box>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={equipment}
          columns={equipmentColumns}
          processRowUpdate={(updatedRow: Equipment) => {
            dispatch(updateEquipment(updatedRow));
            return updatedRow;
          }}
          hideFooter
          disableRowSelectionOnClick
          localeText={{
            noRowsLabel: '装備がありません',
          }}
        />
      </Box>
    </Box>
  );
};
