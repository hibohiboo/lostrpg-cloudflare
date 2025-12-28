import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Typography,
} from '@mui/material';
import React from 'react';

type Gap = 'A' | 'B' | 'C' | 'D' | 'E';

interface SpecialtyCell {
  name: string;
  selected: boolean;
  damaged: boolean;
  isBodyParts?: boolean;
}

interface SpecialtyRow {
  number: number;
  talent: SpecialtyCell;
  a: SpecialtyCell;
  head: SpecialtyCell;
  b: SpecialtyCell;
  arms: SpecialtyCell;
  c: SpecialtyCell;
  torso: SpecialtyCell;
  d: SpecialtyCell;
  legs: SpecialtyCell;
  e: SpecialtyCell;
  survival: SpecialtyCell;
}

interface Column {
  name: string;
  selected?: boolean;
}

interface SpecialtiesTableProps {
  rows: SpecialtyRow[];
  columns: Column[];
  gaps: Gap[];
  damagedSpecialties: string[];
  onGapChange?: (gap: Gap) => void;
  onSpecialtySelect?: (name: string) => void;
  onDamageChange?: (name: string) => void;
  readOnly?: boolean;
}

const SpecialtiesTable: React.FC<SpecialtiesTableProps> = ({
  rows,
  columns,
  gaps,
  damagedSpecialties,
  onGapChange,
  onSpecialtySelect,
  onDamageChange,
  readOnly = false,
}) => {
  const isGapSelected = (gapName: string): boolean => gaps.includes(gapName as Gap);

  const isDamaged = (specialtyName: string): boolean => damagedSpecialties.includes(specialtyName);

  const handleGapClick = (gapName: string) => {
    if (!readOnly && onGapChange) {
      onGapChange(gapName as Gap);
    }
  };

  const handleDamageClick = (specialtyName: string) => {
    if (!readOnly && onDamageChange && specialtyName) {
      onDamageChange(specialtyName);
    }
  };

  const renderHeaderCell = (col: Column) => {
    const isGap = ['A', 'B', 'C', 'D', 'E'].includes(col.name);
    return (
      <TableCell key={col.name} align="center" sx={{ p: 0, minWidth: 60 }}>
        {isGap ? (
          <>
            <Checkbox
              sx={{ p: 0.5 }}
              checked={isGapSelected(col.name)}
              onChange={() => handleGapClick(col.name)}
              disabled={readOnly}
            />
            <br />
            <Typography variant="body2">{col.name}</Typography>
          </>
        ) : (
          <Typography variant="body2">{col.name}</Typography>
        )}
      </TableCell>
    );
  };

  const renderCell = (cell: SpecialtyCell, key: string) => {
    let backgroundColor: string | undefined;
    if (cell.selected) {
      backgroundColor = 'action.selected';
    } else if (cell.isBodyParts) {
      backgroundColor = 'action.hover';
    }

    return (
      <TableCell
        key={key}
        align="center"
        sx={{
          p: 0.5,
          backgroundColor,
          cursor: cell.name && !readOnly && onSpecialtySelect ? 'pointer' : 'default',
        }}
      >
        <Typography
          variant="body2"
          onClick={() => !readOnly && onSpecialtySelect && cell.name && onSpecialtySelect(cell.name)}
          sx={{ display: 'inline-block', minHeight: '1em' }}
        >
          {cell.name}
        </Typography>
        {cell.name && (
          <Checkbox
            sx={{ p: 0.5 }}
            checked={isDamaged(cell.name)}
            onChange={() => handleDamageClick(cell.name)}
            disabled={readOnly}
          />
        )}
      </TableCell>
    );
  };

  return (
    <TableContainer component={Paper} sx={{ my: 2 }}>
      <Table sx={{ minWidth: 650, maxWidth: 800 }} size="small">
        <TableHead>
          <TableRow>
            {columns.map((col) => renderHeaderCell(col))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.number}>
              <TableCell align="center" sx={{ p: '0 10px' }}>
                {row.number}
              </TableCell>
              {renderCell(row.talent, 'talent')}
              {renderCell(row.a, 'a')}
              {renderCell(row.head, 'head')}
              {renderCell(row.b, 'b')}
              {renderCell(row.arms, 'arms')}
              {renderCell(row.c, 'c')}
              {renderCell(row.torso, 'torso')}
              {renderCell(row.d, 'd')}
              {renderCell(row.legs, 'legs')}
              {renderCell(row.e, 'e')}
              {renderCell(row.survival, 'survival')}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SpecialtiesTable;
