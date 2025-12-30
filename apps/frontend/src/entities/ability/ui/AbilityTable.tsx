import { GridColDef, GridRowId } from '@mui/x-data-grid';
import React from 'react';
import { EditableDataGrid } from '@lostrpg/frontend/shared/ui';
import type { Ability } from '../model/types';

type Props = {
  abilities: Ability[];
  handleAbilityDelete: (id: string) => void;
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
  const columns: GridColDef<Ability>[] = [
    { field: 'name', headerName: '名前', width: 180, editable: true },
    { field: 'group', headerName: 'グループ', width: 120, editable: true },
    { field: 'type', headerName: 'タイプ', width: 100, editable: true },
    { field: 'recoil', headerName: '反動', width: 80, editable: true },
    { field: 'specialty', headerName: '特技', width: 120, editable: true },
    { field: 'target', headerName: '対象', width: 100, editable: true },
    { field: 'effect', headerName: '効果', width: 400, editable: true },
  ];

  return (
    <EditableDataGrid
      rows={abilities}
      columns={columns}
      processRowUpdate={handleAbilityUpdate}
      onDelete={(id: GridRowId) => handleAbilityDelete(String(id))}
      hideFooter
      disableRowSelectionOnClick
      localeText={{
        noRowsLabel: 'アビリティがありません',
      }}
    />
  );
};
