import { rollsForDice } from '@lostrpg/core/scenario/customTableMarkdown';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import type {
  ScenarioCustomTable,
  ScenarioCustomTableKind,
  ScenarioCustomTableRow,
} from '@lostrpg/frontend/entities/scenario';

const KIND_OPTIONS: { value: ScenarioCustomTableKind; label: string }[] = [
  { value: 'encounter', label: 'ランダムエンカウント表' },
  { value: 'wander', label: '散策表' },
  { value: 'search', label: '探索表' },
  { value: 'rest', label: '休憩表' },
];

const DICE_COUNT_OPTIONS = [1, 2] as const;

// 出目が変わっても、そのまま使える出目のテキストは引き継ぐ（サイコロ設定の変更時にゼロから
// 書き直さずに済むようにする）
const resizeRows = (
  rows: ScenarioCustomTableRow[],
  rolls: readonly number[],
): ScenarioCustomTableRow[] => {
  const byRoll = new Map(rows.map((row) => [row.roll, row.text ?? '']));
  return rolls.map((roll) => ({ roll, text: byRoll.get(roll) ?? '' }));
};

const createTable = (index: number): ScenarioCustomTable => ({
  id: `table-${Date.now()}-${index}`,
  kind: 'encounter',
  name: `表${String.fromCharCode(65 + index)}`,
  diceCount: 1,
  diceSides: 6,
  rows: resizeRows([], rollsForDice(1, 6)),
});

type Props = {
  tables: ScenarioCustomTable[];
  onChange: (tables: ScenarioCustomTable[]) => void;
};

// カスタム表：本文の「## カスタム表 {.customTable}」セクションを編集する。
// 1件ごとに種別（ランダムエンカウント表／散策表／探索表／休憩表）とサイコロ（1d/2d × 面数）を
// 指定でき、出目に応じた行の自由記述フォームで内容を編集する。種別を1つも追加しなければ、
// その種別はルールブック標準の表を使用する。
// Markdown編集タブで直接書いた内容もここに反映され、双方向に同期する。
export const CustomTablesForm: React.FC<Props> = ({ tables, onChange }) => {
  const handleAddTable = () => onChange([...tables, createTable(tables.length)]);

  const handleRemoveTable = (tableId: string) =>
    onChange(tables.filter((table) => table.id !== tableId));

  const updateTable = (tableId: string, changes: Partial<ScenarioCustomTable>) =>
    onChange(tables.map((table) => (table.id === tableId ? { ...table, ...changes } : table)));

  const handleDiceChange = (
    table: ScenarioCustomTable,
    diceCount: number,
    diceSides: number,
  ) => {
    updateTable(table.id, {
      diceCount,
      diceSides,
      rows: resizeRows(table.rows, rollsForDice(diceCount, diceSides)),
    });
  };

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
        カスタム表
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        表を追加すると、その種別（ランダムエンカウント表・散策表・探索表・休憩表）はカスタム表を
        使用します。種別ごとに1つも追加しなければ、その種別はルールブック標準の表を使用します。
      </Typography>

      {tables.map((table) => (
        <Paper key={table.id} variant="outlined" sx={{ p: 2, my: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
            <Select
              size="small"
              value={table.kind}
              onChange={(e) => updateTable(table.id, { kind: e.target.value as ScenarioCustomTableKind })}
              sx={{ minWidth: 180 }}
            >
              {KIND_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            <TextField
              size="small"
              label="表の名前"
              value={table.name}
              onChange={(e) => updateTable(table.id, { name: e.target.value })}
            />
            <Select
              size="small"
              value={table.diceCount}
              onChange={(e) => handleDiceChange(table, Number(e.target.value), table.diceSides)}
              sx={{ minWidth: 80 }}
            >
              {DICE_COUNT_OPTIONS.map((count) => (
                <MenuItem key={count} value={count}>
                  {count}d
                </MenuItem>
              ))}
            </Select>
            <TextField
              size="small"
              type="number"
              label="面数"
              value={table.diceSides}
              slotProps={{ htmlInput: { min: 2 } }}
              onChange={(e) =>
                handleDiceChange(table, table.diceCount, Math.max(2, Number(e.target.value) || 2))
              }
              sx={{ width: 100 }}
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
              <Typography sx={{ width: 32 }}>{row.roll}</Typography>
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
