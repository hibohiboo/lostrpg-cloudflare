import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, IconButton, Paper, TextField, Typography } from '@mui/material';
import React from 'react';
import type { ScenarioTable } from '@lostrpg/frontend/entities/scenario';

const splitCsv = (value: string): string[] => value.split(',').map((v) => v.trim());

type CardProps = {
  table: ScenarioTable;
  onChange: (changes: Partial<ScenarioTable>) => void;
  onDelete: () => void;
};

const TableEditorCard: React.FC<CardProps> = ({ table, onChange, onDelete }) => {
  const handleRowChange = (rowIndex: number, value: string) => {
    onChange({
      rows: table.rows.map((row, i) => (i === rowIndex ? { cells: splitCsv(value) } : row)),
    });
  };
  const handleAddRow = () =>
    onChange({ rows: [...table.rows, { cells: table.columns.map(() => '') }] });
  const handleRemoveRow = (rowIndex: number) =>
    onChange({ rows: table.rows.filter((_, i) => i !== rowIndex) });

  return (
    <Paper variant="outlined" sx={{ p: 2, my: 1 }}>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
        <TextField
          size="small"
          label="表題"
          value={table.title ?? ''}
          onChange={(e) => onChange({ title: e.target.value || undefined })}
        />
        <IconButton size="small" onClick={onDelete} aria-label="表を削除">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
      <TextField
        size="small"
        fullWidth
        label="列名（カンマ区切り）"
        value={table.columns.join(', ')}
        onChange={(e) => onChange({ columns: splitCsv(e.target.value) })}
        sx={{ mb: 1 }}
      />
      {table.rows.map((row, rowIndex) => (
        <Box key={rowIndex} sx={{ display: 'flex', gap: 1, alignItems: 'center', my: 0.5 }}>
          <TextField
            size="small"
            fullWidth
            label={`行${rowIndex + 1}（カンマ区切り）`}
            value={row.cells.join(', ')}
            onChange={(e) => handleRowChange(rowIndex, e.target.value)}
          />
          <IconButton size="small" onClick={() => handleRemoveRow(rowIndex)} aria-label="行を削除">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}
      <Button size="small" startIcon={<AddIcon />} onClick={handleAddRow}>
        行を追加
      </Button>
    </Paper>
  );
};

type Props = {
  tables: ScenarioTable[];
  onChange: (tables: ScenarioTable[]) => void;
};

export const EventTablesEditor: React.FC<Props> = ({ tables, onChange }) => {
  const handleAddTable = () =>
    onChange([...tables, { title: '', columns: ['列1', '列2'], rows: [{ cells: ['', ''] }] }]);
  const handleRemoveTable = (index: number) => onChange(tables.filter((_, i) => i !== index));
  const handleUpdateTable = (index: number, changes: Partial<ScenarioTable>) =>
    onChange(tables.map((table, i) => (i === index ? { ...table, ...changes } : table)));

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        表
      </Typography>
      {tables.map((table, index) => (
        <TableEditorCard
          key={index}
          table={table}
          onChange={(changes) => handleUpdateTable(index, changes)}
          onDelete={() => handleRemoveTable(index)}
        />
      ))}
      <Button size="small" startIcon={<AddIcon />} onClick={handleAddTable}>
        表を追加
      </Button>
    </Box>
  );
};
