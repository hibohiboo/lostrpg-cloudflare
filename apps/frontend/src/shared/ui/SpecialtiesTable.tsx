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
  const isGapSelected = (gapName: string): boolean =>
    gaps.includes(gapName as Gap);

  const isDamaged = (specialtyName: string): boolean =>
    damagedSpecialties.includes(specialtyName);

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
      <TableCell
        key={col.name}
        align="center"
        sx={{
          p: '4px',
          width: isGap ? '32px' : undefined,
          minWidth: isGap ? '32px' : '90px',
          border: '1px solid rgba(224, 224, 224, 1)',
          fontSize: '14px',
          fontWeight: 600,
          color: 'rgba(0, 0, 0, 0.87)',
        }}
      >
        {isGap ? (
          <>
            <Checkbox
              sx={{ p: 0.5 }}
              checked={isGapSelected(col.name)}
              onChange={() => handleGapClick(col.name)}
              disabled={readOnly}
              size="small"
            />
            <br />
            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
              {col.name}
            </Typography>
          </>
        ) : (
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            {col.name}
          </Typography>
        )}
      </TableCell>
    );
  };

  const renderCell = (
    cell: SpecialtyCell,
    key: string,
    isGapColumn: boolean,
  ) => {
    let backgroundColor: string | undefined;
    if (cell.selected) {
      backgroundColor = 'action.selected';
    } else if (cell.isBodyParts) {
      backgroundColor = 'action.hover';
    }

    return (
      <TableCell
        key={key}
        align={isGapColumn ? 'center' : 'right'}
        sx={{
          p: isGapColumn ? 0 : '0 4px 0 8px',
          height: '44px',
          border: '1px solid rgba(224, 224, 224, 1)',
          backgroundColor,
          cursor:
            cell.name && !readOnly && onSpecialtySelect ? 'pointer' : 'default',
        }}
      >
        {cell.name && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              width: '100%',
            }}
          >
            <Typography
              variant="body2"
              onClick={() =>
                !readOnly &&
                onSpecialtySelect &&
                cell.name &&
                onSpecialtySelect(cell.name)
              }
              sx={{
                fontSize: '13px',
                marginRight: '4px',
                flexGrow: 1,
                textAlign: 'right',
              }}
            >
              {cell.name}
            </Typography>
            <Checkbox
              sx={{ p: 0 }}
              checked={isDamaged(cell.name)}
              onChange={() => handleDamageClick(cell.name)}
              disabled={readOnly}
              size="small"
            />
          </div>
        )}
      </TableCell>
    );
  };

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{ my: 2, border: 'none' }}
    >
      <Table
        sx={{
          borderCollapse: 'collapse',
          '& .MuiTableCell-root': { borderColor: 'rgba(224, 224, 224, 1)' },
        }}
        size="small"
      >
        <TableHead>
          <TableRow sx={{ height: '44px' }}>
            {columns.map((col) => renderHeaderCell(col))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.number} sx={{ height: '44px' }}>
              <TableCell
                align="center"
                sx={{
                  border: '1px solid rgba(224, 224, 224, 1)',
                  p: 0,
                  width: '40px',
                  backgroundColor: '#fafafa',
                  fontSize: '13px',
                }}
              >
                {row.number}
              </TableCell>
              {renderCell(row.talent, 'talent', false)}
              {renderCell(row.a, 'a', true)}
              {renderCell(row.head, 'head', false)}
              {renderCell(row.b, 'b', true)}
              {renderCell(row.arms, 'arms', false)}
              {renderCell(row.c, 'c', true)}
              {renderCell(row.torso, 'torso', false)}
              {renderCell(row.d, 'd', true)}
              {renderCell(row.legs, 'legs', false)}
              {renderCell(row.e, 'e', true)}
              {renderCell(row.survival, 'survival', false)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SpecialtiesTable;
