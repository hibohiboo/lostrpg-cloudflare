import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React from 'react';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';
import { addBackbone, updateBackbone, deleteBackbone } from '../../model/characterSlice';
import type { Backbone } from '../../model/characterSlice';

export const BackbonesSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const backbones = useAppSelector((state) => state.character.backbones);
  const useStrangeField = useAppSelector(
    (state) => state.character.useStrangeField
  );

  const handleBackboneAdd = () => {
    const newBackbone: Backbone = {
      id: `bb-${Date.now()}`,
      name: '',
      type: '',
      effect: '',
    };
    dispatch(addBackbone(newBackbone));
  };

  const backboneColumns: GridColDef[] = [
    { field: 'name', headerName: '名前', width: 200, editable: true },
    { field: 'type', headerName: '種類', width: 150, editable: true },
    { field: 'effect', headerName: '効果', width: 300, editable: true },
    {
      field: 'actions',
      headerName: '操作',
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <Button
          size="small"
          color="error"
          onClick={() => dispatch(deleteBackbone(params.row.id))}
        >
          <DeleteIcon fontSize="small" />
        </Button>
      ),
    },
  ];

  if (!useStrangeField) {
    return null;
  }

  return (
    <Box my={3}>
      <Typography variant="h6" gutterBottom>
        バックボーン
      </Typography>
      <Button variant="outlined" onClick={handleBackboneAdd} sx={{ mb: 2 }}>
        追加
      </Button>
      <Box sx={{ height: 300, width: '100%' }}>
        <DataGrid
          rows={backbones}
          columns={backboneColumns}
          processRowUpdate={(updatedRow: Backbone) => {
            dispatch(updateBackbone(updatedRow));
            return updatedRow;
          }}
          hideFooter
          disableRowSelectionOnClick
          localeText={{
            noRowsLabel: 'バックボーンがありません',
          }}
        />
      </Box>
    </Box>
  );
};
