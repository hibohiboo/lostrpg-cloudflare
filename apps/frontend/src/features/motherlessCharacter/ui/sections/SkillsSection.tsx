import { MotherlessSkill } from '@lostrpg/schemas';
import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Typography } from '@mui/material';
import { GridColDef, GridRowId } from '@mui/x-data-grid';
import React, { useCallback, useMemo, useState } from 'react';
import { shallowEqual } from 'react-redux';
import {
  CatalogSelectionModal,
  createMotherlessSkill,
} from '@lostrpg/frontend/entities/motherlessCharacter';
import {
  MotherlessSkillCatalogEntry,
  useMotherlessSkillCatalog,
} from '@lostrpg/frontend/entities/motherlessSheet';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';
import { EditableDataGrid } from '@lostrpg/frontend/shared/ui';
import { addSkill, deleteSkill, updateSkill } from '../../model/characterSlice';
import { filterSkillsByClasses } from '../../model/skillFilter';

const columns: GridColDef<MotherlessSkill>[] = [
  { field: 'name', headerName: '名前', width: 160, editable: true },
  { field: 'class', headerName: 'クラス', width: 100, editable: true },
  { field: 'type', headerName: 'タイプ', width: 90, editable: true },
  { field: 'recoil', headerName: '反動', width: 80, editable: true },
  { field: 'target', headerName: '対象', width: 90, editable: true },
  { field: 'element', headerName: '属性', width: 90, editable: true },
  { field: 'effect', headerName: '効果', width: 360, editable: true },
];

export const SkillsSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const skills = useAppSelector(
    (state) => state.motherlessCharacter.acquiredSkills,
    shallowEqual,
  );
  const classes = useAppSelector(
    (state) => state.motherlessCharacter.classes,
    shallowEqual,
  );
  const catalog = useMotherlessSkillCatalog();
  const [modalOpen, setModalOpen] = useState(false);

  const classNames = useMemo(() => classes.map((c) => c.name), [classes]);
  const availableSkills = useMemo(
    () => filterSkillsByClasses(catalog, classNames),
    [catalog, classNames],
  );

  const handleSelect = useCallback(
    (entry: MotherlessSkillCatalogEntry) => {
      dispatch(addSkill(createMotherlessSkill(entry)));
    },
    [dispatch],
  );

  const handleUpdate = useCallback(
    (newRow: MotherlessSkill): MotherlessSkill => {
      dispatch(updateSkill(newRow));
      return newRow;
    },
    [dispatch],
  );

  const handleDelete = useCallback(
    (id: GridRowId) => {
      dispatch(deleteSkill(String(id)));
    },
    [dispatch],
  );

  return (
    <Box sx={{ my: 3 }}>
      <Typography variant="h6" gutterBottom>
        スキル
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        習得しているクラスのスキルのみ選択候補になります
      </Typography>

      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => setModalOpen(true)}
      >
        スキル追加
      </Button>
      <CatalogSelectionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        catalog={availableSkills}
        onSelect={handleSelect}
        title="スキルを選択"
        getSearchText={(entry) =>
          `${entry.name} ${entry.class} ${entry.type} ${entry.effect}`
        }
        renderDetails={(entry) => (
          <>
            <Typography variant="body2" color="text.secondary">
              {entry.class} / {entry.type} / 反動{entry.recoil}
            </Typography>
            <Typography variant="body2">{entry.effect}</Typography>
          </>
        )}
      />

      <Box sx={{ width: '100%', mt: 2 }}>
        <EditableDataGrid
          rows={skills}
          columns={columns}
          processRowUpdate={handleUpdate}
          onDelete={handleDelete}
          hideFooter
          disableRowSelectionOnClick
          localeText={{ noRowsLabel: 'スキルがありません' }}
        />
      </Box>
    </Box>
  );
};
