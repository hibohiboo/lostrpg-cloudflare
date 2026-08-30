import {
  dragonPlainEquipmentList,
  equipmentList,
} from '@lostrpg/core/game-data/camp';
import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Typography } from '@mui/material';
import { GridRowId } from '@mui/x-data-grid';
import React, { useMemo, useState } from 'react';
import {
  AddFacilityForm,
  AddPersonalityForm,
  FacilityTable,
  type Facility,
} from '@lostrpg/frontend/entities/facility';
import type { ScenarioFacilityAppendix } from '@lostrpg/frontend/entities/scenario';

type Props = {
  facilities: ScenarioFacilityAppendix[];
  onChange: (facilities: ScenarioFacilityAppendix[]) => void;
};

const createBlankFacility = (): Facility => ({
  id: `facility-${Date.now()}`,
  name: '',
  type: '',
  specialty: '',
  level: 1,
  effect: '',
});

// 施設付録：本文に登場させたキャンプの施設の参照用一覧。
// キャンプの施設欄と同じ表（FacilityTable）で、選択・追加した内容をその場で編集できる。
// シナリオにはキャンプのようなサプリメント選択の概念が無いため、
// 設備選択の候補は常にサプリメントを全て含むカタログとする。
export const FacilityAppendixEditor: React.FC<Props> = ({
  facilities,
  onChange,
}) => {
  const [equipmentSelect] = useState('');
  const [personalitySelect] = useState('');

  const facilityCatalog = useMemo(
    () => [...equipmentList, ...dragonPlainEquipmentList],
    [],
  );

  const handleAdd = (facility: Facility) => onChange([...facilities, facility]);
  const handleAddManual = () => onChange([...facilities, createBlankFacility()]);
  const handleDelete = (id: string) =>
    onChange(facilities.filter((facility) => facility.id !== id));
  const handleUpdate = (
    newRow: Facility,
    _oldRow: Facility,
    _params: { rowId: GridRowId },
  ): Facility => {
    onChange(
      facilities.map((facility) =>
        facility.id === newRow.id ? newRow : facility,
      ),
    );
    return newRow;
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        施設
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <AddFacilityForm
          equipmentSelect={equipmentSelect}
          onEquipmentAdd={handleAdd}
          catalog={facilityCatalog}
        />
        <AddPersonalityForm
          personalitySelect={personalitySelect}
          onPersonalityAdd={handleAdd}
        />
        <Button startIcon={<AddIcon />} onClick={handleAddManual}>
          手動で追加
        </Button>
      </Box>
      <Box sx={{ width: '100%' }}>
        <FacilityTable
          facilities={facilities}
          handleFacilityDelete={handleDelete}
          handleFacilityUpdate={handleUpdate}
        />
      </Box>
    </Box>
  );
};
