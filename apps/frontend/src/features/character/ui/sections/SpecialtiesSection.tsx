import { damageTableRows } from '@lostrpg/core/game-data/speciality';
import {
  Box,
  Chip,
  InputLabel,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
} from '@mui/material';
import React from 'react';


import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';
import { SpecialtiesTable } from '@lostrpg/frontend/shared/ui';
import {
  toggleSpecialty,
  toggleGap,
  toggleDamagedSpecialty,
} from '../../model/characterSlice';
import type { Gap } from '../../model/characterSlice';

interface DamageRow {
  name: string;
  damaged: boolean;
}

interface DamageTableProps {
  rows: DamageRow[];
  damageHandler: (name: string) => void;
  sevenLabel: string;
}

const DamageTable: React.FC<DamageTableProps> = ({
  rows,
  damageHandler,
  sevenLabel,
}) => (
  <TableContainer component={Paper}>
    <Table sx={{ borderCollapse: 'collapse' }} size="small">
      <TableHead>
        <TableRow>
          {rows.slice(0, 5).map((row, index) => (
            <TableCell
              key={row.name}
              component="th"
              align="center"
              sx={{
                bgcolor: 'grey.900',
                color: 'white',
                fontWeight: 600,
              }}
            >
              {index + 2}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          {rows.slice(0, 5).map((row) => (
            <TableCell key={row.name} align="center">
              {row.name}
              <Checkbox
                checked={row.damaged}
                onChange={() => damageHandler(row.name)}
                size="small"
              />
            </TableCell>
          ))}
        </TableRow>
        <TableRow>
          <TableCell
            component="th"
            align="center"
            sx={{
              bgcolor: 'grey.900',
              color: 'white',
              fontWeight: 600,
            }}
          >
            7
          </TableCell>
          <TableCell colSpan={4} align="center">
            {sevenLabel}
          </TableCell>
        </TableRow>
        <TableRow>
          {rows.slice(5, 10).map((row, index) => (
            <TableCell
              key={row.name}
              component="th"
              align="center"
              sx={{
                bgcolor: 'grey.900',
                color: 'white',
                fontWeight: 600,
              }}
            >
              {index + 8}
            </TableCell>
          ))}
        </TableRow>
        <TableRow>
          {rows.slice(5, 10).map((row) => (
            <TableCell key={row.name} align="center">
              {row.name}
              <Checkbox
                checked={row.damaged}
                onChange={() => damageHandler(row.name)}
                size="small"
              />
            </TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  </TableContainer>
);

export const SpecialtiesSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const gaps = useAppSelector((state) => state.character.gaps);
  const specialties = useAppSelector((state) => state.character.specialties);
  const damagedSpecialties = useAppSelector(
    (state) => state.character.damagedSpecialties,
  );

  return (
    <>
      <Box my={3}>
        <Typography variant="h6" gutterBottom>
          特技
        </Typography>
        <SpecialtiesTable
          gaps={gaps}
          specialties={specialties}
          damagedSpecialties={damagedSpecialties}
          onGapChange={(gap: Gap) => dispatch(toggleGap(gap))}
          onSpecialtySelect={(specialty: string) =>
            dispatch(toggleSpecialty(specialty))
          }
          onDamageChange={(specialty: string) =>
            dispatch(toggleDamagedSpecialty(specialty))
          }
        />
      </Box>

      <Box my={3}>
        <InputLabel>習得特技</InputLabel>
        <Box display="flex" flexWrap="wrap" gap={1}>
          {specialties.length > 0 ? (
            specialties.map((specialty) => (
              <Chip key={specialty} label={specialty} color="primary" />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              専門特技が選択されていません
            </Typography>
          )}
        </Box>
      </Box>

      <Box my={3}>
        <Typography variant="h6" gutterBottom>
          ダメージ表
        </Typography>
        <DamageTable
          rows={damageTableRows.map((row) => ({
            name: row.name,
            damaged: damagedSpecialties.includes(row.name),
          }))}
          damageHandler={(specialty: string) =>
            dispatch(toggleDamagedSpecialty(specialty))
          }
          sevenLabel="全ての判定に-1のペナルティ修正"
        />
      </Box>
    </>
  );
};
