import { GridColDef, GridRowId } from '@mui/x-data-grid';
import React from 'react';
import { EditableDataGrid } from '@lostrpg/frontend/shared/ui';
import type { Ability } from '../model/types';

type AbilityWithId = Ability & { id: string };

type Props = {
  abilities: Ability[];
  handleAbilityDelete: (ability: Ability) => void;
  handleAbilityUpdate: (
    newRow: Ability,
    oldRow: Ability,
    params: {
      rowId: GridRowId;
    },
  ) => Ability;
};

export const AbilityTable: React.FC<Props> = ({
  abilities,
  handleAbilityDelete,
  handleAbilityUpdate,
}) => {
  // nameをIDとして使用
  const abilitiesWithId: AbilityWithId[] = abilities.map((ability) => ({
    ...ability,
    id: ability.name,
  }));

  const columns: GridColDef<AbilityWithId>[] = [
    { field: 'name', headerName: '名前', width: 180, editable: false },
    { field: 'group', headerName: 'グループ', width: 120, editable: false },
    { field: 'type', headerName: 'タイプ', width: 100, editable: false },
    { field: 'recoil', headerName: '反動', width: 80, editable: false },
    { field: 'specialty', headerName: '特技', width: 120, editable: false },
    { field: 'target', headerName: '対象', width: 100, editable: false },
    { field: 'effect', headerName: '効果', width: 400, editable: false },
  ];

  const handleUpdate = (
    newRow: AbilityWithId,
    oldRow: AbilityWithId,
    params: { rowId: GridRowId },
  ): AbilityWithId => {
    // idを除いてAbilityとして渡す
    const { id: _newId, ...newAbility } = newRow;
    const { id: _oldId, ...oldAbility } = oldRow;
    const updated = handleAbilityUpdate(newAbility, oldAbility, params);
    return { ...updated, id: updated.name };
  };

  const handleDelete = (id: GridRowId) => {
    const ability = abilities.find((a) => a.name === String(id));
    if (ability) {
      handleAbilityDelete(ability);
    }
  };

  return (
    <EditableDataGrid
      rows={abilitiesWithId}
      columns={columns}
      processRowUpdate={handleUpdate}
      onDelete={handleDelete}
      hideFooter
      disableRowSelectionOnClick
      localeText={{
        noRowsLabel: 'アビリティがありません',
      }}
    />
  );
};
