import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import React from 'react';
import type { ScenarioCustomTable } from '../model/scenario';

const CustomTableCard: React.FC<{ table: ScenarioCustomTable }> = ({ table }) => (
  <Box sx={{ my: 2 }}>
    <Typography variant="subtitle1" gutterBottom>
      {table.name}（{table.diceCount}d{table.diceSides}）
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
  // すでに種別（ランダムエンカウント表・散策表・探索表・休憩表）で絞り込んだ表の一覧
  tables: ScenarioCustomTable[];
  defaultLabel: string;
};

// カスタム表（種別ごと）の詳細表示。同じ種別のカスタム表が1つも無ければルールブック標準を使う旨を表示する。
export const CustomTableView: React.FC<Props> = ({ tables, defaultLabel }) => {
  if (tables.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        {defaultLabel}
      </Typography>
    );
  }

  return (
    <Box>
      {tables.map((table) => (
        <CustomTableCard key={table.id} table={table} />
      ))}
    </Box>
  );
};
