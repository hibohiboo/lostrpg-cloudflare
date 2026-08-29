import { rollsForTable } from '@lostrpg/core/scenario/customTableMarkdown';
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
import React, { useState } from 'react';
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
  { value: 'other', label: 'その他' },
];

// ダイスのプリセット。'custom' を選ぶとサイコロの個数・面数を自由入力できる。
type DicePresetKey = '1d6' | '2d6' | 'd66' | 'custom';

const DICE_PRESET_OPTIONS: { value: DicePresetKey; label: string }[] = [
  { value: '1d6', label: '1d6' },
  { value: '2d6', label: '2d6' },
  { value: 'd66', label: 'd66' },
  { value: 'custom', label: '自由入力' },
];

const dicePresetOf = (table: ScenarioCustomTable): DicePresetKey => {
  if (table.diceType === 'd66') return 'd66';
  if (table.diceCount === 1 && table.diceSides === 6) return '1d6';
  if (table.diceCount === 2 && table.diceSides === 6) return '2d6';
  return 'custom';
};

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
  diceType: 'sum',
  diceCount: 1,
  diceSides: 6,
  rows: resizeRows(
    [],
    rollsForTable({ diceType: 'sum', diceCount: 1, diceSides: 6 }),
  ),
});

type Props = {
  tables: ScenarioCustomTable[];
  onChange: (tables: ScenarioCustomTable[]) => void;
};

// カスタム表：本文の「## カスタム表 {.customTable}」セクションを編集する。
// 1件ごとに種別（ランダムエンカウント表／散策表／探索表／休憩表／その他）とサイコロ
// （1d6・2d6・d66・自由入力）を指定でき、出目に応じた行の自由記述フォームで内容を編集する。
// 種別を1つも追加しなければ、その種別（その他を除く）はルールブック標準の表を使用する。
// Markdown編集タブで直接書いた内容もここに反映され、双方向に同期する。
export const CustomTablesForm: React.FC<Props> = ({ tables, onChange }) => {
  // 「自由入力」を選んだ表のIDを覚えておく。個数・面数がたまたま1d6/2d6と同じ値になっても
  // dicePresetOf() の逆算だけに頼るとプリセット扱いに戻ってしまい、自由入力欄が消えてしまうため。
  const [customDiceTableIds, setCustomDiceTableIds] = useState<Set<string>>(
    new Set(),
  );

  const handleAddTable = () =>
    onChange([...tables, createTable(tables.length)]);

  const handleRemoveTable = (tableId: string) => {
    onChange(tables.filter((table) => table.id !== tableId));
    setCustomDiceTableIds((prev) => {
      if (!prev.has(tableId)) return prev;
      const next = new Set(prev);
      next.delete(tableId);
      return next;
    });
  };

  const updateTable = (
    tableId: string,
    changes: Partial<ScenarioCustomTable>,
  ) =>
    onChange(
      tables.map((table) =>
        table.id === tableId ? { ...table, ...changes } : table,
      ),
    );

  const applyDice = (
    table: ScenarioCustomTable,
    changes: Pick<ScenarioCustomTable, 'diceType' | 'diceCount' | 'diceSides'>,
  ) => {
    const next = { ...table, ...changes };
    updateTable(table.id, {
      ...changes,
      rows: resizeRows(table.rows, rollsForTable(next)),
    });
  };

  const handleDicePresetChange = (
    table: ScenarioCustomTable,
    preset: DicePresetKey,
  ) => {
    setCustomDiceTableIds((prev) => {
      const next = new Set(prev);
      if (preset === 'custom') next.add(table.id);
      else next.delete(table.id);
      return next;
    });

    if (preset === '1d6')
      applyDice(table, { diceType: 'sum', diceCount: 1, diceSides: 6 });
    else if (preset === '2d6')
      applyDice(table, { diceType: 'sum', diceCount: 2, diceSides: 6 });
    else if (preset === 'd66')
      applyDice(table, { diceType: 'd66', diceCount: 2, diceSides: 6 });
    // '自由入力' に切り替えた直後は、それまでのサイコロ設定を初期値として引き継ぐ
    else
      applyDice(table, {
        diceType: 'sum',
        diceCount: table.diceCount,
        diceSides: table.diceSides,
      });
  };

  const handleRowTextChange = (tableId: string, roll: number, text: string) =>
    onChange(
      tables.map((table) => {
        if (table.id !== tableId) return table;
        return {
          ...table,
          rows: table.rows.map((row) =>
            row.roll === roll ? { ...row, text } : row,
          ),
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

      {tables.map((table) => {
        const dicePreset: DicePresetKey = customDiceTableIds.has(table.id)
          ? 'custom'
          : dicePresetOf(table);
        return (
          <Paper key={table.id} variant="outlined" sx={{ p: 2, my: 1 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 1,
                flexWrap: 'wrap',
              }}
            >
              <Select
                size="small"
                value={table.kind}
                onChange={(e) =>
                  updateTable(table.id, {
                    kind: e.target.value as ScenarioCustomTableKind,
                  })
                }
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
                onChange={(e) =>
                  updateTable(table.id, { name: e.target.value })
                }
              />
              <Select
                size="small"
                value={dicePreset}
                onChange={(e) =>
                  handleDicePresetChange(table, e.target.value as DicePresetKey)
                }
                sx={{ minWidth: 110 }}
              >
                {DICE_PRESET_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {dicePreset === 'custom' && (
                <>
                  <TextField
                    size="small"
                    type="number"
                    label="個数"
                    value={table.diceCount}
                    slotProps={{ htmlInput: { min: 1 } }}
                    onChange={(e) =>
                      applyDice(table, {
                        diceType: 'sum',
                        diceCount: Math.max(1, Number(e.target.value) || 1),
                        diceSides: table.diceSides,
                      })
                    }
                    sx={{ width: 90 }}
                  />
                  <Typography>d</Typography>
                  <TextField
                    size="small"
                    type="number"
                    label="面数"
                    value={table.diceSides}
                    slotProps={{ htmlInput: { min: 2 } }}
                    onChange={(e) =>
                      applyDice(table, {
                        diceType: 'sum',
                        diceCount: table.diceCount,
                        diceSides: Math.max(2, Number(e.target.value) || 2),
                      })
                    }
                    sx={{ width: 90 }}
                  />
                </>
              )}
              <IconButton
                size="small"
                aria-label="表を削除"
                onClick={() => handleRemoveTable(table.id)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>

            {table.rows.map((row) => (
              <Box
                key={row.roll}
                sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 0.5 }}
              >
                <Typography sx={{ width: 32 }}>{row.roll}</Typography>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="例: ツノウサギ 1d6体 / 表B参照 / 何も起きない"
                  value={row.text ?? ''}
                  onChange={(e) =>
                    handleRowTextChange(table.id, row.roll, e.target.value)
                  }
                />
              </Box>
            ))}
          </Paper>
        );
      })}

      <Button size="small" startIcon={<AddIcon />} onClick={handleAddTable}>
        表を追加
      </Button>
    </Box>
  );
};
