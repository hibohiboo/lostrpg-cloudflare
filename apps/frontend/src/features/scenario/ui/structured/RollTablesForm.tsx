import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, IconButton, Paper, TextField, Typography } from '@mui/material';
import React from 'react';
import type {
  ScenarioEncounterRow,
  ScenarioEncounterTable,
} from '@lostrpg/frontend/entities/scenario';

const createEmptyRows = (rolls: readonly number[]): ScenarioEncounterRow[] =>
  rolls.map((roll) => ({ roll, text: '' }));

const createTable = (index: number, rolls: readonly number[]): ScenarioEncounterTable => ({
  id: `table-${Date.now()}-${index}`,
  name: `表${String.fromCharCode(65 + index)}`,
  rows: createEmptyRows(rolls),
});

type Props = {
  title: string;
  helperText: string;
  rolls: readonly number[];
  tables: ScenarioEncounterTable[];
  onChange: (tables: ScenarioEncounterTable[]) => void;
};

// 本文の「## 〇〇表 {.xxxTable}」セクションを、出目ごとの自由記述フォームで編集する。
// ランダムエンカウント表（1d6）・散策表／探索表／休憩表（2d6）で共通して使用する。
// Markdown編集タブで直接書いた内容もここに反映され、双方向に同期する。
export const RollTablesForm: React.FC<Props> = ({
  title,
  helperText,
  rolls,
  tables,
  onChange,
}) => {
  const handleAddTable = () => onChange([...tables, createTable(tables.length, rolls)]);

  const handleRemoveTable = (tableId: string) =>
    onChange(tables.filter((table) => table.id !== tableId));

  const handleRenameTable = (tableId: string, name: string) =>
    onChange(tables.map((table) => (table.id === tableId ? { ...table, name } : table)));

  const handleRowTextChange = (tableId: string, roll: number, text: string) =>
    onChange(
      tables.map((table) => {
        if (table.id !== tableId) return table;
        return {
          ...table,
          rows: table.rows.map((row) => (row.roll === roll ? { ...row, text } : row)),
        };
      }),
    );

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {helperText}
      </Typography>

      {tables.map((table) => (
        <Paper key={table.id} variant="outlined" sx={{ p: 2, my: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <TextField
              size="small"
              label="表の名前"
              value={table.name}
              onChange={(e) => handleRenameTable(table.id, e.target.value)}
            />
            <IconButton
              size="small"
              aria-label="表を削除"
              onClick={() => handleRemoveTable(table.id)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>

          {table.rows.map((row) => (
            <Box key={row.roll} sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 0.5 }}>
              <Typography sx={{ width: 24 }}>{row.roll}</Typography>
              <TextField
                size="small"
                fullWidth
                placeholder="例: オオカミ 1d6体 / 表B参照 / 何も起きない"
                value={row.text ?? ''}
                onChange={(e) => handleRowTextChange(table.id, row.roll, e.target.value)}
              />
            </Box>
          ))}
        </Paper>
      ))}

      <Button size="small" startIcon={<AddIcon />} onClick={handleAddTable}>
        表を追加
      </Button>
    </Box>
  );
};
