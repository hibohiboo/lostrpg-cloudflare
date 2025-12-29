import {
  specialtiesTableColumns,
  specialtiesTableGaps,
  specialtyRows,
} from '@lostrpg/core/game-data/speciality';
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

interface SpecialtiesTableProps {
  gaps: string[];
  damagedSpecialties: string[];
  onGapChange?: (gap: string) => void;
  onSpecialtySelect?: (name: string) => void;
  onDamageChange?: (name: string) => void;
  readOnly?: boolean;
}

const HeaderCell: React.FC<{ col: string }> = ({ col }) => (
  <TableCell
    key={col}
    align="center"
    sx={{
      p: '4px',
      border: '1px solid rgba(224, 224, 224, 1)',
      fontSize: '14px',
      fontWeight: 600,
      color: 'rgba(0, 0, 0, 0.87)',
    }}
  >
    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
      {col}
    </Typography>
  </TableCell>
);

const HeaderGapCell: React.FC<{
  col: string;
  gaps: string[];
  readOnly?: boolean;
  onGapChange?: (s: string) => void;
}> = ({ col, gaps, onGapChange, readOnly }) => (
  <TableCell
    key={col}
    align="center"
    sx={{
      p: '4px',
      width: '32px',
      border: '1px solid rgba(224, 224, 224, 1)',
      fontSize: '14px',
      fontWeight: 600,
      color: 'rgba(0, 0, 0, 0.87)',
    }}
  >
    <Checkbox
      sx={{ p: 0.5 }}
      checked={gaps.includes(col)}
      onChange={() => {
        if (readOnly || !onGapChange) return;
        onGapChange(col);
      }}
      disabled={readOnly}
      size="small"
    />
    <br />
    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
      {col}
    </Typography>
  </TableCell>
);

const GapCell: React.FC = () => (
  <TableCell
    align={'right'}
    sx={{
      p: 0,
      height: '44px',
      border: '1px solid rgba(224, 224, 224, 1)',
    }}
  ></TableCell>
);

const Cell: React.FC<{
  name: string;
  isBodyParts: boolean;
  damagedSpecialties: string[];
  handleSpecialtyClick: (s: string) => void;
  handleDamageClick: (s: string) => void;
  readOnly?: boolean;
}> = ({
  name,
  damagedSpecialties,
  handleSpecialtyClick,
  handleDamageClick,
  isBodyParts,
  readOnly,
}) => (
  <TableCell
    align={'center'}
    sx={{
      p: '0 4px 0 8px',
      height: '44px',
      border: `${isBodyParts ? 'thick double' : '1px solid'} rgba(224, 224, 224, 1)`,
      cursor: 'pointer',
    }}
  >
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
        onClick={() => handleSpecialtyClick(name)}
        sx={{
          fontSize: '13px',
          marginRight: '4px',
          flexGrow: 1,
          textAlign: 'right',
        }}
      >
        {name}
      </Typography>
      <Checkbox
        sx={{ p: 0 }}
        checked={damagedSpecialties.includes(name)}
        onChange={() => handleDamageClick(name)}
        disabled={readOnly}
        size="small"
        color="error"
      />
    </div>
  </TableCell>
);
const cols = [0, -1, 1, -1, 2, -1, 4, -1, 5];
const SpecialtiesTable: React.FC<SpecialtiesTableProps> = ({
  gaps,
  damagedSpecialties,
  onGapChange,
  onSpecialtySelect,
  onDamageChange,
  readOnly = false,
}) => {
  const handleDamageClick = (specialtyName: string) => {
    if (!readOnly && onDamageChange && specialtyName) {
      onDamageChange(specialtyName);
    }
  };

  const handleSpecialtyClick = (cellName: string) => {
    if (!readOnly && onSpecialtySelect && cellName) {
      onSpecialtySelect(cellName);
    }
  };

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        my: 2,
        border: 'none',
        ...[3, 5, 7, 9, 11].reduce(
          (acc, i) => ({
            ...acc,
            [`&:has(thead th:nth-of-type(${i}) input:checked) tbody td:nth-of-type(${i})`]:
              {
                bgcolor: 'grey.900',
                color: 'common.white',
              },
          }),
          {},
        ),
      }}
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
            {specialtiesTableColumns.map((c) => {
              if (specialtiesTableGaps.includes(c)) {
                return (
                  <HeaderGapCell
                    key={c}
                    col={c}
                    gaps={gaps}
                    onGapChange={onGapChange}
                  />
                );
              }
              return <HeaderCell key={c} col={c} />;
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {specialtyRows.map((row, i) => (
            <TableRow key={`row-${i}`} sx={{ height: '44px' }}>
              <TableCell
                align="center"
                sx={{
                  border: '1px solid rgba(224, 224, 224, 1)',
                  p: 0,
                  width: '20px',
                  backgroundColor: '#fafafa',
                  fontSize: '13px',
                }}
              >
                {i + 2}
              </TableCell>
              {cols.map((c, rowIndex) =>
                c < 0 ? (
                  <GapCell key={`cell-${rowIndex}`} />
                ) : (
                  <Cell
                    key={`cell-${rowIndex}`}
                    name={row[c].name}
                    isBodyParts={row[c].isBodyParts}
                    damagedSpecialties={damagedSpecialties}
                    handleSpecialtyClick={handleSpecialtyClick}
                    handleDamageClick={handleDamageClick}
                    readOnly={readOnly}
                  />
                ),
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SpecialtiesTable;
