import {
  Box,
  Chip,
  Link as MuiLink,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import React from 'react';
import type {
  ScenarioEncounterRow,
  ScenarioEncounterSettings,
  ScenarioEncounterTable,
} from '../model/scenario';

const describeRow = (row: ScenarioEncounterRow, tables: ScenarioEncounterTable[]) => {
  if (row.type === 'enemy') {
    return row.enemyId ? (
      <MuiLink href={`/enemy/${row.enemyId}`} underline="hover">
        {row.enemyName || 'エネミー'}
      </MuiLink>
    ) : (
      <Typography variant="body2" color="text.secondary">
        未設定
      </Typography>
    );
  }
  if (row.type === 'table') {
    const target = tables.find((table) => table.id === row.targetTableId);
    return (
      <Chip
        label={`→ ${target?.name ?? '未設定'}`}
        size="small"
        color="secondary"
        variant="outlined"
      />
    );
  }
  return <Typography variant="body2">{row.text || '－'}</Typography>;
};

const EncounterTableCard: React.FC<{
  table: ScenarioEncounterTable;
  tables: ScenarioEncounterTable[];
}> = ({ table, tables }) => (
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
              <TableCell>{describeRow(row, tables)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

type Props = {
  encounterTable: ScenarioEncounterSettings;
};

export const EncounterTableView: React.FC<Props> = ({ encounterTable }) => {
  const { mode, tables } = encounterTable;

  if (mode === 'default') {
    return (
      <Typography variant="body2" color="text.secondary">
        ルールブック標準のランダムエンカウント表を使用します。
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
        <EncounterTableCard key={table.id} table={table} tables={tables} />
      ))}
    </Box>
  );
};
