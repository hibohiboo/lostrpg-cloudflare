import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { Button } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  useGridApiRef,
} from '@mui/x-data-grid';
import { useState } from 'react';
import { Facility } from '../model/types';

type Props = {
  facilities: Facility[];
  handleFacilityDelete: (id: string) => void;
  handleFacilityUpdate: (
    newRow: Facility,
    oldRow: Facility,
    params: {
      rowId: GridRowId;
    },
  ) => Facility;
};

export const FacilityTable: React.FC<Props> = ({
  facilities,
  handleFacilityDelete,
  handleFacilityUpdate,
}) => {
  const apiRef = useGridApiRef();
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const handleEditClick = (id: GridRowId) => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id: GridRowId) => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  // 施設テーブルの列定義
  const facilityColumns: GridColDef[] = [
    {
      field: 'actions',
      headerName: '操作',
      width: 150,
      sortable: false,
      renderCell: (params) => {
        const isInEditMode =
          rowModesModel[params.id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return (
            <>
              <Button
                size="small"
                color="primary"
                onClick={() => handleSaveClick(params.id)}
              >
                <SaveIcon fontSize="small" />
              </Button>
              <Button
                size="small"
                color="inherit"
                onClick={() => handleCancelClick(params.id)}
              >
                <CancelIcon fontSize="small" />
              </Button>
            </>
          );
        }

        return (
          <>
            <Button
              size="small"
              color="primary"
              onClick={() => handleEditClick(params.id)}
            >
              <EditIcon fontSize="small" />
            </Button>
            <Button
              size="small"
              color="error"
              onClick={() => handleFacilityDelete(params.row.id)}
            >
              <DeleteIcon fontSize="small" />
            </Button>
          </>
        );
      },
    },
    { field: 'name', headerName: '名前', width: 150, editable: true },
    { field: 'type', headerName: '種別', width: 100, editable: true },
    { field: 'specialty', headerName: '特技', width: 100, editable: true },
    {
      field: 'level',
      headerName: 'レベル',
      width: 100,
      type: 'number',
      editable: true,
    },
    { field: 'effect', headerName: '効果', width: 200, editable: true },
  ];
  return (
    <DataGrid
      apiRef={apiRef}
      rows={facilities}
      columns={facilityColumns}
      processRowUpdate={handleFacilityUpdate}
      rowModesModel={rowModesModel}
      onRowModesModelChange={setRowModesModel}
      hideFooter
      disableRowSelectionOnClick
      localeText={{
        noRowsLabel: '施設がありません',
      }}
    />
  );
};
