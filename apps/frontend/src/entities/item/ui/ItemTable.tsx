import { GridColDef, GridRowId } from '@mui/x-data-grid';
import { EditableDataGrid } from '@lostrpg/frontend/shared/ui';
import { Item } from '../model/types';

type Props = {
  items: Item[];
  handleItemDelete: (id: string) => void;
  handleItemUpdate: (
    newRow: Item,
    oldRow: Item,
    params: {
      rowId: GridRowId;
    },
  ) => Item;
};

export const ItemTable: React.FC<Props> = ({
  items,
  handleItemDelete,
  handleItemUpdate,
}) => {
  const columns: GridColDef<Item>[] = [
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
  ];

  return (
    <EditableDataGrid
      rows={items}
      columns={columns}
      processRowUpdate={handleItemUpdate}
      onDelete={(id: GridRowId) => handleItemDelete(String(id))}
      hideFooter
      disableRowSelectionOnClick
      localeText={{
        noRowsLabel: 'アイテムがありません',
      }}
    />
  );
};
