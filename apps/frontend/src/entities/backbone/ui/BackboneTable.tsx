import { GridColDef, GridRowId } from '@mui/x-data-grid';
import React from 'react';
import { EditableDataGrid } from '@lostrpg/frontend/shared/ui';
import type { Backbone } from '../model/types';

type BackboneWithId = Backbone & { id: string };

type Props = {
  backbones: Backbone[];
  handleBackboneDelete: (backbone: Backbone) => void;
  handleBackboneUpdate: (
    newRow: Backbone,
    oldRow: Backbone,
    params: {
      rowId: GridRowId;
    },
  ) => Backbone;
};

export const BackboneTable: React.FC<Props> = ({
  backbones,
  handleBackboneDelete,
  handleBackboneUpdate,
}) => {
  // nameをIDとして使用
  const backbonesWithId: BackboneWithId[] = backbones.map((backbone) => ({
    ...backbone,
    id: backbone.name,
  }));

  const columns: GridColDef<BackboneWithId>[] = [
    { field: 'name', headerName: '名前', width: 180, editable: false },
    { field: 'cp', headerName: '必要経験点', width: 100, editable: false },
    { field: 'type', headerName: 'タイプ', width: 100, editable: false },
    { field: 'effect', headerName: '効果', width: 400, editable: false },
  ];

  const handleUpdate = (
    newRow: BackboneWithId,
    oldRow: BackboneWithId,
    params: { rowId: GridRowId },
  ): BackboneWithId => {
    // idを除いてBackboneとして渡す
    // eslint-disable-next-line sonarjs/no-unused-vars
    const { id: _newId, ...newBackbone } = newRow;
    // eslint-disable-next-line sonarjs/no-unused-vars
    const { id: _oldId, ...oldBackbone } = oldRow;
    const updated = handleBackboneUpdate(newBackbone, oldBackbone, params);
    return { ...updated, id: updated.name };
  };

  const handleDelete = (id: GridRowId) => {
    const backbone = backbones.find((b) => b.name === String(id));
    if (backbone) {
      handleBackboneDelete(backbone);
    }
  };

  return (
    <EditableDataGrid
      rows={backbonesWithId}
      columns={columns}
      processRowUpdate={handleUpdate}
      onDelete={handleDelete}
      hideFooter
      disableRowSelectionOnClick
      localeText={{
        noRowsLabel: '背景がありません',
      }}
    />
  );
};
