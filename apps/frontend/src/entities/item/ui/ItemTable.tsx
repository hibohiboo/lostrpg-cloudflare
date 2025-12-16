import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Item } from '../model/types';

type Props = {
  items: Item[];
  handleItemDelete: (id: string) => void;
  handleItemUpdate: (updatedRow: Item) => Item;
};

export const ItemTable: React.FC<Props> = ({
  items,
  handleItemDelete,
  handleItemUpdate,
}) => {
  const columns: GridColDef[] = [
    { field: 'name', headerName: '名前', width: 200, editable: true },
    {
      field: 'number',
      headerName: '個数',
      width: 100,
      type: 'number',
      editable: true,
    },
    {
      field: 'weight',
      headerName: '重量',
      width: 100,
      type: 'number',
      editable: true,
    },
    {
      field: 'actions',
      headerName: '操作',
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <Button
          size="small"
          color="error"
          onClick={() => handleItemDelete(params.row.id)}
        >
          <DeleteIcon fontSize="small" />
        </Button>
      ),
    },
  ];

  return (
    <DataGrid
      rows={items}
      columns={columns}
      processRowUpdate={handleItemUpdate}
      hideFooter
      disableRowSelectionOnClick
      localeText={{
        noRowsLabel: 'アイテムがありません',
      }}
    />
  );
};
