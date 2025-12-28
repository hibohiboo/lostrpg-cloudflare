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
      minWidth: '90px',
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
  handleSpecialtyClick: (s: string) => void;
  damagedSpecialties: string[];
  handleDamageClick: (s: string) => void;
  readOnly?: boolean;
}> = ({
  name,
  damagedSpecialties,
  handleSpecialtyClick,
  handleDamageClick,
  readOnly,
}) => (
  <TableCell
    align={'center'}
    sx={{
      p: '0 4px 0 8px',
      height: '44px',
      border: '1px solid rgba(224, 224, 224, 1)',
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
      />
    </div>
  </TableCell>
);

const rowNums = [0, 1, 2, 3, 4, 5];

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
            {specialtiesTableColumns.map((c) => {
              console.log(c);
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
            <TableRow key={i} sx={{ height: '44px' }}>
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
                {i + 2}
              </TableCell>
              {rowNums.map((number) => (
                <>
                  <Cell
                    name={row[number]}
                    damagedSpecialties={damagedSpecialties}
                    handleSpecialtyClick={handleSpecialtyClick}
                    handleDamageClick={handleDamageClick}
                    readOnly={readOnly}
                  />
                  {number !== 5 && <GapCell />}
                </>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SpecialtiesTable;
