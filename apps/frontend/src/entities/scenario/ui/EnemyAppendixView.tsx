import { Link as MuiLink, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import React from 'react';
import type { ScenarioEncounterEnemy } from '../model/scenario';

type Props = {
  enemies: ScenarioEncounterEnemy[];
};

// エネミー付録の詳細表示：ランダムエンカウント表の自由記述に登場させたエネミーの参照用一覧。
export const EnemyAppendixView: React.FC<Props> = ({ enemies }) => {
  if (enemies.length === 0) return null;

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableBody>
          {enemies.map((enemy, index) => (
            <TableRow key={index}>
              <TableCell>
                {enemy.url ? (
                  <MuiLink
                    href={enemy.url}
                    underline="hover"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {enemy.enemyName || 'エネミー'}
                  </MuiLink>
                ) : (
                  enemy.enemyName || '－'
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
