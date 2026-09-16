import { MotherlessEquipment } from '@lostrpg/schemas';
import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Typography } from '@mui/material';
import { GridColDef, GridRowId } from '@mui/x-data-grid';
import React, { useCallback, useState } from 'react';
import { shallowEqual } from 'react-redux';
import {
  CatalogSelectionModal,
  createMotherlessEquipment,
} from '@lostrpg/frontend/entities/motherlessCharacter';
import {
  MotherlessEquipmentCatalogEntry,
  useMotherlessEquipmentCatalog,
} from '@lostrpg/frontend/entities/motherlessSheet';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';
import { EditableDataGrid } from '@lostrpg/frontend/shared/ui';
import {
  addEquipment,
  deleteEquipment,
  updateEquipment,
} from '../../model/characterSlice';

const columns: GridColDef<MotherlessEquipment>[] = [
  { field: 'name', headerName: '名前', width: 160, editable: true },
  { field: 'type', headerName: 'タイプ', width: 90, editable: true },
  { field: 'physicalDamage', headerName: '物理ダメージ', width: 100, type: 'number', editable: true },
  { field: 'elementDamage', headerName: '属性ダメージ', width: 100, type: 'number', editable: true },
  { field: 'accuracy', headerName: '命中力', width: 80, type: 'number', editable: true },
  { field: 'defense', headerName: '防御力', width: 80, type: 'number', editable: true },
  { field: 'evasion', headerName: '回避力', width: 80, type: 'number', editable: true },
  { field: 'initiativeAdjustment', headerName: '先制補正', width: 90, type: 'number', editable: true },
  { field: 'weight', headerName: '重量', width: 70, type: 'number', editable: true },
  { field: 'effect', headerName: '効果', width: 280, editable: true },
];

export const EquipmentSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const equipments = useAppSelector(
    (state) => state.motherlessCharacter.equipments,
    shallowEqual,
  );
  const catalog = useMotherlessEquipmentCatalog();
  const [modalOpen, setModalOpen] = useState(false);

  const handleSelect = useCallback(
    (entry: MotherlessEquipmentCatalogEntry) => {
      dispatch(addEquipment(createMotherlessEquipment(entry)));
    },
    [dispatch],
  );

  const handleUpdate = useCallback(
    (newRow: MotherlessEquipment): MotherlessEquipment => {
      dispatch(updateEquipment(newRow));
      return newRow;
    },
    [dispatch],
  );

  const handleDelete = useCallback(
    (id: GridRowId) => {
      dispatch(deleteEquipment(String(id)));
    },
    [dispatch],
  );

  return (
    <Box sx={{ my: 3 }}>
      <Typography variant="h6" gutterBottom>
        装備
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        ここに追加した装備の数値がステータスの攻撃力等に自動反映されます
      </Typography>

      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => setModalOpen(true)}
      >
        装備追加
      </Button>
      <CatalogSelectionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        catalog={catalog}
        onSelect={handleSelect}
        title="装備を選択"
        getSearchText={(entry) => `${entry.name} ${entry.type} ${entry.tag}`}
        renderDetails={(entry) => (
          <>
            <Typography variant="body2" color="text.secondary">
              {entry.type} / 物理{entry.physicalDamage} / 属性
              {entry.elementDamage} / 命中{entry.accuracy} / 防御
              {entry.defense} / 回避{entry.evasion}
            </Typography>
            <Typography variant="body2">{entry.effect}</Typography>
          </>
        )}
      />

      <Box sx={{ width: '100%', mt: 2 }}>
        <EditableDataGrid
          rows={equipments}
          columns={columns}
          processRowUpdate={handleUpdate}
          onDelete={handleDelete}
          hideFooter
          disableRowSelectionOnClick
          localeText={{ noRowsLabel: '装備がありません' }}
        />
      </Box>
    </Box>
  );
};
