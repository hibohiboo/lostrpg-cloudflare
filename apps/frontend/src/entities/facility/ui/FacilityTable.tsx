import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@mui/material';
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid';
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
  // 施設テーブルの列定義
  const facilityColumns: GridColDef[] = [
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
    {
      field: 'actions',
      headerName: '操作',
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <Button
          size="small"
          color="error"
          onClick={() => handleFacilityDelete(params.row.id)}
        >
          <DeleteIcon fontSize="small" />
        </Button>
      ),
    },
  ];
  return (
    <DataGrid
      rows={facilities}
      columns={facilityColumns}
      processRowUpdate={handleFacilityUpdate}
      hideFooter
      disableRowSelectionOnClick
      localeText={{
        noRowsLabel: '施設がありません',
      }}
    />
  );
};
