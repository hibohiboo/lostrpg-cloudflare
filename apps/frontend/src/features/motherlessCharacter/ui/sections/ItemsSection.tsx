import { MotherlessItem } from '@lostrpg/schemas';
import AddIcon from '@mui/icons-material/Add';
import { Box, Button, TextField, Typography } from '@mui/material';
import { GridColDef, GridRowId } from '@mui/x-data-grid';
import React, { useCallback, useMemo, useState } from 'react';
import { shallowEqual } from 'react-redux';
import {
  CatalogSelectionModal,
  createMotherlessItem,
} from '@lostrpg/frontend/entities/motherlessCharacter';
import {
  MotherlessItemCatalogEntry,
  useMotherlessItemCatalog,
} from '@lostrpg/frontend/entities/motherlessSheet';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';
import { EditableDataGrid } from '@lostrpg/frontend/shared/ui';
import { addItem, deleteItem, updateItem } from '../../model/characterSlice';

const columns: GridColDef<MotherlessItem>[] = [
  { field: 'name', headerName: '名前', width: 160, editable: true },
  { field: 'number', headerName: '数量', width: 70, type: 'number', editable: true },
  { field: 'weight', headerName: '重量', width: 70, type: 'number', editable: true },
  { field: 'type', headerName: 'タイプ', width: 90, editable: true },
  { field: 'tag', headerName: 'タグ', width: 140, editable: true },
  { field: 'target', headerName: '対象', width: 90, editable: true },
  { field: 'price', headerName: '価格', width: 80, editable: true },
  { field: 'effect', headerName: '効果', width: 300, editable: true },
  { field: 'flavor', headerName: 'フレーバー', width: 240, editable: true },
];

export const ItemsSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(
    (state) => state.motherlessCharacter.items,
    shallowEqual,
  );
  const catalog = useMotherlessItemCatalog();
  const [modalOpen, setModalOpen] = useState(false);

  const totalWeight = useMemo(
    () => items.reduce((sum, item) => sum + item.weight * (item.number || 1), 0),
    [items],
  );

  const handleSelect = useCallback(
    (entry: MotherlessItemCatalogEntry) => {
      dispatch(addItem(createMotherlessItem(entry)));
    },
    [dispatch],
  );

  const handleUpdate = useCallback(
    (newRow: MotherlessItem): MotherlessItem => {
      dispatch(updateItem(newRow));
      return newRow;
    },
    [dispatch],
  );

  const handleDelete = useCallback(
    (id: GridRowId) => {
      dispatch(deleteItem(String(id)));
    },
    [dispatch],
  );

  return (
    <Box sx={{ my: 3 }}>
      <Typography variant="h6" gutterBottom>
        アイテム
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          type="number"
          label="アイテム重量"
          value={totalWeight}
          slotProps={{ input: { readOnly: true } }}
          sx={{ width: 150 }}
        />
      </Box>

      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => setModalOpen(true)}
      >
        アイテム追加
      </Button>
      <CatalogSelectionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        catalog={catalog}
        onSelect={handleSelect}
        title="アイテムを選択"
        getSearchText={(entry) =>
          `${entry.name} ${entry.type} ${entry.tag} ${entry.effect}`
        }
        renderDetails={(entry) => (
          <>
            <Typography variant="body2" color="text.secondary">
              {entry.type} / 重量{entry.weight} / 価格{entry.price}
            </Typography>
            <Typography variant="body2">{entry.effect}</Typography>
          </>
        )}
      />

      <Box sx={{ width: '100%', mt: 2 }}>
        <EditableDataGrid
          rows={items}
          columns={columns}
          processRowUpdate={handleUpdate}
          onDelete={handleDelete}
          hideFooter
          disableRowSelectionOnClick
          localeText={{ noRowsLabel: 'アイテムがありません' }}
        />
      </Box>
    </Box>
  );
};
