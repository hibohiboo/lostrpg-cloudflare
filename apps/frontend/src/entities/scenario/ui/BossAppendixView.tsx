import {
  Link as MuiLink,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import React from 'react';
import type { ScenarioBossAppendix } from '../model/scenario';

type Props = {
  bosses: ScenarioBossAppendix[];
};

export const BossAppendixView: React.FC<Props> = ({ bosses }) => {
  if (bosses.length === 0) return null;

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableBody>
          {bosses.map((boss, index) => (
            <TableRow key={index}>
              <TableCell>
                {boss.url ? (
                  <MuiLink
                    href={boss.url}
                    underline="hover"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {boss.bossName}
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
  );
};
