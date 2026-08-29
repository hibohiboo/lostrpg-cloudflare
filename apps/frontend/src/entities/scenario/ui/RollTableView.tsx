import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import React from 'react';
import type { ScenarioEncounterTable, ScenarioRollTableSettings2d6 } from '../model/scenario';

const RollTableCard: React.FC<{ table: ScenarioEncounterTable }> = ({ table }) => (
  <Box sx={{ my: 2 }}>
    <Typography variant="subtitle1" gutterBottom>
      {table.name}
    </Typography>
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableBody>
          {table.rows.map((row) => (
            <TableRow key={row.roll}>
              <TableCell sx={{ width: 48 }}>{row.roll}</TableCell>
              <TableCell>{row.text || '－'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

type Props = {
  settings: ScenarioRollTableSettings2d6;
  defaultLabel: string;
};

// 散策表・探索表・休憩表（いずれも2d6）の詳細表示。ランダムエンカウント表と違い、
// エネミー付録のような専用の参照用一覧は持たない。
export const RollTableView: React.FC<Props> = ({ settings, defaultLabel }) => {
  const { mode, tables } = settings;

  if (mode === 'default') {
    return (
      <Typography variant="body2" color="text.secondary">
        {defaultLabel}
      </Typography>
    );
  }

  if (tables.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        カスタム表が設定されていません
      </Typography>
    );
  }

  return (
    <Box>
      {tables.map((table) => (
        <RollTableCard key={table.id} table={table} />
      ))}
    </Box>
  );
};
