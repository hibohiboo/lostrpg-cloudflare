import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  FormControlLabel,
  IconButton,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { EnemySelectionModal } from '@lostrpg/frontend/entities/enemy';
import type {
  ScenarioEncounterRow,
  ScenarioEncounterRowType,
  ScenarioEncounterSettings,
  ScenarioEncounterTable,
} from '@lostrpg/frontend/entities/scenario';

const ROLLS = [1, 2, 3, 4, 5, 6] as const;

const createEmptyRows = (): ScenarioEncounterRow[] =>
  ROLLS.map((roll) => ({ roll, type: 'text', text: '' }));

const createTable = (index: number): ScenarioEncounterTable => ({
  id: `table-${Date.now()}`,
  name: `表${String.fromCharCode(65 + index)}`,
  rows: createEmptyRows(),
});

// 削除された表への「他の表」参照は自由記述にフォールバックする
const clearReferencesToTable = (
  tables: ScenarioEncounterTable[],
  removedTableId: string,
): ScenarioEncounterTable[] =>
  tables.map((table) => ({
    ...table,
    rows: table.rows.map((row) =>
      row.type === 'table' && row.targetTableId === removedTableId
        ? { roll: row.roll, type: 'text', text: '' }
        : row,
    ),
  }));

type Props = {
  encounterTable: ScenarioEncounterSettings;
  onChange: (value: ScenarioEncounterSettings) => void;
};

type EditingEnemyTarget = { tableId: string; roll: number };

export const EncounterTableEditor: React.FC<Props> = ({
  encounterTable,
  onChange,
}) => {
  const [editingEnemyTarget, setEditingEnemyTarget] =
    useState<EditingEnemyTarget | null>(null);
  const { mode, tables } = encounterTable;

  const handleModeChange = (nextMode: 'default' | 'custom') => {
    onChange({ ...encounterTable, mode: nextMode });
  };

  const handleAddTable = () => {
    onChange({ ...encounterTable, tables: [...tables, createTable(tables.length)] });
  };

  const handleRemoveTable = (tableId: string) => {
    const remaining = tables.filter((table) => table.id !== tableId);
    onChange({ ...encounterTable, tables: clearReferencesToTable(remaining, tableId) });
  };

  const handleRenameTable = (tableId: string, name: string) => {
    onChange({
      ...encounterTable,
      tables: tables.map((table) => (table.id === tableId ? { ...table, name } : table)),
    });
  };

  const handleRowChange = (
    tableId: string,
    roll: number,
    changes: Partial<ScenarioEncounterRow>,
  ) => {
    onChange({
      ...encounterTable,
      tables: tables.map((table) => {
        if (table.id !== tableId) return table;
        return {
          ...table,
          rows: table.rows.map((row) =>
            row.roll === roll ? { ...row, ...changes } : row,
          ),
        };
      }),
    });
  };

  const handleRowTypeChange = (
    tableId: string,
    roll: number,
    type: ScenarioEncounterRowType,
  ) => {
    handleRowChange(tableId, roll, {
      type,
      enemyId: undefined,
      enemyName: undefined,
      targetTableId: undefined,
      text: undefined,
    });
  };

  const handleEnemySelect = (enemyId: string, enemyName: string) => {
    if (!editingEnemyTarget) return;
    const { tableId, roll } = editingEnemyTarget;
    handleRowChange(tableId, roll, {
      enemyId: enemyId || undefined,
      enemyName: enemyId ? enemyName : undefined,
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
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1, flexWrap: 'wrap' }}
                >
                  <Typography sx={{ width: 56 }}>{row.roll}</Typography>
                  <Select
                    size="small"
                    value={row.type}
                    onChange={(e) =>
                      handleRowTypeChange(
                        table.id,
                        row.roll,
                        e.target.value as ScenarioEncounterRowType,
                      )
                    }
                    sx={{ minWidth: 140 }}
                  >
                    <MenuItem value="enemy">エネミー</MenuItem>
                    <MenuItem value="table">他の表</MenuItem>
                    <MenuItem value="text">自由記述</MenuItem>
                  </Select>

                  {row.type === 'enemy' && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() =>
                        setEditingEnemyTarget({ tableId: table.id, roll: row.roll })
                      }
                    >
                      {row.enemyName || 'エネミーを選択'}
                    </Button>
                  )}

                  {row.type === 'table' && (
                    <Select
                      size="small"
                      displayEmpty
                      value={row.targetTableId ?? ''}
                      onChange={(e) =>
                        handleRowChange(table.id, row.roll, {
                          targetTableId: e.target.value || undefined,
                        })
                      }
                      sx={{ minWidth: 160 }}
                    >
                      <MenuItem value="">未選択</MenuItem>
                      {tables
                        .filter((candidate) => candidate.id !== table.id)
                        .map((candidate) => (
                          <MenuItem key={candidate.id} value={candidate.id}>
                            {candidate.name}
                          </MenuItem>
                        ))}
                    </Select>
                  )}

                  {row.type === 'text' && (
                    <TextField
                      size="small"
                      placeholder="例: 何も起きない、アイテム発見 など"
                      value={row.text ?? ''}
                      onChange={(e) =>
                        handleRowChange(table.id, row.roll, { text: e.target.value })
                      }
                      sx={{ flex: 1, minWidth: 200 }}
                    />
                  )}
                </Box>
              ))}
            </Paper>
          ))}

          <Button startIcon={<AddIcon />} onClick={handleAddTable}>
            表を追加
          </Button>
        </Box>
      )}

      <EnemySelectionModal
        open={!!editingEnemyTarget}
        onClose={() => setEditingEnemyTarget(null)}
        selectedEnemyId={
          editingEnemyTarget
            ? tables
                .find((table) => table.id === editingEnemyTarget.tableId)
                ?.rows.find((row) => row.roll === editingEnemyTarget.roll)
                ?.enemyId ?? ''
            : ''
        }
        onSelect={handleEnemySelect}
      />
    </Box>
  );
};
