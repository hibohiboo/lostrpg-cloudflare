import {
  Box,
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
import type { ScenarioEncounterSettings, ScenarioEncounterTable } from '../model/scenario';

const EncounterTableCard: React.FC<{ table: ScenarioEncounterTable }> = ({ table }) => (
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
  encounterTable: ScenarioEncounterSettings;
};

export const EncounterTableView: React.FC<Props> = ({ encounterTable }) => {
  const { mode, tables, enemies } = encounterTable;

  if (mode === 'default') {
    return (
      <Typography variant="body2" color="text.secondary">
        ルールブック標準のランダムエンカウント表を使用します。
      </Typography>
    );
  }

  return (
    <Box>
      {tables.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          カスタム表が設定されていません
        </Typography>
      ) : (
        tables.map((table) => <EncounterTableCard key={table.id} table={table} />)
      )}

      {enemies.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            エネミー付録
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableBody>
                {enemies.map((enemy, index) => (
                  <TableRow key={index}>
                    <TableCell>{enemy.enemyName || 'エネミー'}</TableCell>
                    <TableCell>
                      {enemy.url ? (
                        <MuiLink href={enemy.url} underline="hover" target="_blank" rel="noopener noreferrer">
                          {enemy.url}
                        </MuiLink>
                      ) : (
                        '－'
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};
