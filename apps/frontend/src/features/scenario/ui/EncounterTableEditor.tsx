import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  FormControlLabel,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { EnemySelectionModal } from '@lostrpg/frontend/entities/enemy';
import type {
  ScenarioEncounterRow,
  ScenarioEncounterSettings,
  ScenarioEncounterTable,
} from '@lostrpg/frontend/entities/scenario';

const ROLLS = [1, 2, 3, 4, 5, 6] as const;

const createEmptyRows = (): ScenarioEncounterRow[] =>
  ROLLS.map((roll) => ({ roll, text: '' }));

const createTable = (index: number): ScenarioEncounterTable => ({
  id: `table-${Date.now()}`,
  name: `表${String.fromCharCode(65 + index)}`,
  rows: createEmptyRows(),
});

type Props = {
  encounterTable: ScenarioEncounterSettings;
  onChange: (value: ScenarioEncounterSettings) => void;
};

export const EncounterTableEditor: React.FC<Props> = ({
  encounterTable,
  onChange,
}) => {
  const [isEnemyModalOpen, setEnemyModalOpen] = useState(false);
  const { mode, tables, enemies } = encounterTable;

  const handleModeChange = (nextMode: 'default' | 'custom') => {
    onChange({ ...encounterTable, mode: nextMode });
  };

  const handleAddTable = () => {
    onChange({ ...encounterTable, tables: [...tables, createTable(tables.length)] });
  };

  const handleRemoveTable = (tableId: string) => {
    onChange({ ...encounterTable, tables: tables.filter((table) => table.id !== tableId) });
  };

  const handleRenameTable = (tableId: string, name: string) => {
    onChange({
      ...encounterTable,
      tables: tables.map((table) => (table.id === tableId ? { ...table, name } : table)),
    });
  };

  const handleRowTextChange = (tableId: string, roll: number, text: string) => {
    onChange({
      ...encounterTable,
      tables: tables.map((table) => {
        if (table.id !== tableId) return table;
        return {
          ...table,
          rows: table.rows.map((row) => (row.roll === roll ? { ...row, text } : row)),
        };
      }),
    });
  };

  const handleAddEnemy = (enemyId: string, enemyName: string) => {
    if (!enemyId) return;
    onChange({
      ...encounterTable,
      enemies: [...enemies, { enemyId, enemyName, note: '' }],
    });
  };

  const handleRemoveEnemy = (index: number) => {
    onChange({
      ...encounterTable,
      enemies: enemies.filter((_, i) => i !== index),
    });
  };

  const handleEnemyNoteChange = (index: number, note: string) => {
    onChange({
      ...encounterTable,
      enemies: enemies.map((enemy, i) => (i === index ? { ...enemy, note } : enemy)),
    });
  };

  return (
    <Box>
      <RadioGroup
        row
        value={mode}
        onChange={(e) => handleModeChange(e.target.value as 'default' | 'custom')}
      >
        <FormControlLabel value="default" control={<Radio />} label="デフォルト表を使う" />
        <FormControlLabel value="custom" control={<Radio />} label="カスタム表を使う" />
      </RadioGroup>

      {mode === 'default' && (
        <Typography variant="body2" color="text.secondary">
          ルールブック標準のランダムエンカウント表を使用します。
        </Typography>
      )}

      {mode === 'custom' && (
        <Box>
          {tables.map((table) => (
            <Paper key={table.id} variant="outlined" sx={{ p: 2, my: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TextField
                  label="表の名前"
                  size="small"
                  value={table.name}
                  onChange={(e) => handleRenameTable(table.id, e.target.value)}
                />
                <IconButton
                  aria-label="表を削除"
                  size="small"
                  onClick={() => handleRemoveTable(table.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>

              {table.rows.map((row) => (
                <Box
                  key={row.roll}
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1 }}
                >
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

          <Button startIcon={<AddIcon />} onClick={handleAddTable}>
            表を追加
          </Button>
        </Box>
      )}

      {/* エネミー付録：表の自由記述に登場させたエネミーの参照用一覧 */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          エネミー付録（表に登場させたエネミーの参照用）
        </Typography>
        {enemies.map((enemy, index) => (
          <Box
            key={index}
            sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1 }}
          >
            <Typography sx={{ minWidth: 140 }}>{enemy.enemyName || 'エネミー'}</Typography>
            <TextField
              size="small"
              fullWidth
              placeholder="補足（例: 1d6体、表Aの1で登場 など）"
              value={enemy.note ?? ''}
              onChange={(e) => handleEnemyNoteChange(index, e.target.value)}
            />
            <IconButton
              aria-label="エネミーを削除"
              size="small"
              onClick={() => handleRemoveEnemy(index)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
        <Button startIcon={<AddIcon />} onClick={() => setEnemyModalOpen(true)}>
          エネミーを追加
        </Button>
      </Box>

      <EnemySelectionModal
        open={isEnemyModalOpen}
        onClose={() => setEnemyModalOpen(false)}
        selectedEnemyId=""
        onSelect={handleAddEnemy}
      />
    </Box>
  );
};
