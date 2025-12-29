import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Button } from '@mui/material';
import {
  DataGrid,
  DataGridProps,
  GridColDef,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  GridValidRowModel,
  useGridApiRef,
} from '@mui/x-data-grid';
import { useState } from 'react';

export type EditableDataGridProps<R extends GridValidRowModel> = Omit<
  DataGridProps<R>,
  'apiRef' | 'rowModesModel' | 'onRowModesModelChange' | 'columns'
> & {
  columns: GridColDef<R>[];
  onDelete?: (id: GridRowId) => void;
  hideActions?: boolean;
  actionsColumnWidth?: number;
};

export const EditableDataGrid = <R extends GridValidRowModel>({
  columns,
  onDelete,
  hideActions = false,
  actionsColumnWidth = 150,
  ...dataGridProps
}: EditableDataGridProps<R>) => {
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

  const columnsWithActions: GridColDef<R>[] = hideActions
    ? columns
    : [
        {
          field: 'actions',
          headerName: '操作',
          width: actionsColumnWidth,
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
                {onDelete && (
                  <Button
                    size="small"
                    color="error"
                    onClick={() => onDelete(params.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </Button>
                )}
              </>
            );
          },
        },
        ...columns,
      ];

  return (
    <DataGrid
      apiRef={apiRef}
      columns={columnsWithActions}
      rowModesModel={rowModesModel}
      onRowModesModelChange={setRowModesModel}
      {...dataGridProps}
    />
  );
};
