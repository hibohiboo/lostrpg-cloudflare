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

export const EquipmentTable: React.FC<Props> = ({
  items,
  handleItemDelete,
  handleItemUpdate,
}) => {
  const columns: GridColDef<Item>[] = [
    { field: 'area', headerName: '部位', width: 100, editable: true },
    { field: 'name', headerName: '名前', width: 150, editable: true },
    {
      field: 'j',
      headerName: '価格',
      width: 80,
      type: 'number',
      editable: true,
    },
    {
      field: 'weight',
      headerName: '重量',
      width: 80,
      type: 'number',
      editable: true,
    },
    { field: 'type', headerName: 'タイプ', width: 100, editable: true },
    { field: 'specialty', headerName: '特技', width: 120, editable: true },
    { field: 'target', headerName: '対象', width: 100, editable: true },
    { field: 'trait', headerName: '特性', width: 150, editable: true },
    { field: 'effect', headerName: '効果', width: 300, editable: true },
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
        noRowsLabel: '装備がありません',
      }}
    />
  );
};
