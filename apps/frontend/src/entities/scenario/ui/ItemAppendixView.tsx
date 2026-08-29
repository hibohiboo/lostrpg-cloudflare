import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import React from 'react';
import type { ScenarioItemAppendix } from '../model/scenario';

type Props = {
  items: ScenarioItemAppendix[];
};

export const ItemAppendixView: React.FC<Props> = ({ items }) => {
  if (items.length === 0) return null;

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.itemName || 'アイテム'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
