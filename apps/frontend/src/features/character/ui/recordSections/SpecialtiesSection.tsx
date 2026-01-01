import { damageTableRows } from '@lostrpg/core/game-data/speciality';
import { HelpOutline } from '@mui/icons-material';
import {
  Box,
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
  Button,
  Tooltip,
  IconButton,
} from '@mui/material';
import React, { useMemo, useCallback } from 'react';
import { shallowEqual } from 'react-redux';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';
import { SpecialtiesTable } from '@lostrpg/frontend/shared/ui';
import { updateCharacterForm } from '../../model/characterFormSlice';
import {
  toggleDamagedSpecialty,
  clearAllDamage,
} from '../../model/characterSlice';
import { specialtiesWithTargetSelector } from '../../model/selectors';

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
    <Table size="small">
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
                padding: 0,
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
            <TableCell key={row.name} align="center" sx={{ padding: 0 }}>
              {row.name}
              <Checkbox
                checked={row.damaged}
                onChange={() => damageHandler(row.name)}
                size="small"
                color="error"
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
              padding: 0,
            }}
          >
            7
          </TableCell>
          <TableCell colSpan={4} align="center" sx={{ padding: 0 }}>
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
                padding: 0,
              }}
            >
              {index + 8}
            </TableCell>
          ))}
        </TableRow>
        <TableRow>
          {rows.slice(5, 10).map((row) => (
            <TableCell key={row.name} align="center" sx={{ padding: 0 }}>
              {row.name}
              <Checkbox
                checked={row.damaged}
                onChange={() => damageHandler(row.name)}
                size="small"
                color="error"
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
  const gaps = useAppSelector((state) => state.character.gaps, shallowEqual);
  const specialties = useAppSelector(
    (state) => state.character.specialties,
    shallowEqual,
  );
  const damagedSpecialties = useAppSelector(
    (state) => state.character.damagedSpecialties,
    shallowEqual,
  );
  const selectedSpecialty = useAppSelector(
    (state) => state.characterForm.selectedSpecialty,
  );
  const specialtiesWithTarget = useAppSelector(
    specialtiesWithTargetSelector,
    shallowEqual,
  );

  // イベントハンドラをメモ化
  const handleSpecialtySelect = useCallback(
    (specialty: string) => {
      if (selectedSpecialty === specialty) {
        dispatch(updateCharacterForm({ selectedSpecialty: '' }));
        return;
      }
      dispatch(updateCharacterForm({ selectedSpecialty: specialty }));
    },
    [dispatch, selectedSpecialty],
  );

  const handleDamageChange = useCallback(
    (specialty: string) => {
      dispatch(toggleDamagedSpecialty(specialty));
    },
    [dispatch],
  );

  const handleClearAllDamage = useCallback(() => {
    dispatch(clearAllDamage());
  }, [dispatch]);

  // DamageTableのrows配列をメモ化
  const damageRows = useMemo(
    () =>
      damageTableRows.map((row) => ({
        name: row.name,
        damaged: damagedSpecialties.includes(row.name),
      })),
    [damagedSpecialties],
  );
  return (
    <>
      <Box my={1}>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h6">特技</Typography>
          <Tooltip
            title="判定特技指定はテキスト部分クリック。ダメージはチェック。"
            arrow
          >
            <IconButton size="small" sx={{ padding: 0 }}>
              <HelpOutline fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <SpecialtiesTable
          gaps={gaps}
          specialties={specialties}
          damagedSpecialties={damagedSpecialties}
          selectedSpecialty={selectedSpecialty}
          onGapChange={undefined}
          onSpecialtySelect={handleSpecialtySelect}
          onDamageChange={handleDamageChange}
        />
      </Box>

      <Box my={1}>
        <InputLabel>判定特技:{selectedSpecialty}</InputLabel>
        <Box display="flex" flexWrap="wrap" gap={1}>
          {selectedSpecialty ? (
            <TableContainer component={Paper} sx={{ width: 'auto' }}>
              <Table
                size="small"
                sx={{ border: 1, borderColor: 'divider', width: 'auto' }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        border: 1,
                        borderColor: 'divider',
                        fontWeight: 600,
                      }}
                    >
                      習得特技
                    </TableCell>
                    <TableCell
                      sx={{
                        border: 1,
                        borderColor: 'divider',
                        fontWeight: 600,
                      }}
                    >
                      目標値
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {specialtiesWithTarget.map(({ specialty, target }) => (
                    <TableRow key={specialty}>
                      <TableCell sx={{ border: 1, borderColor: 'divider' }}>
                        {specialty}
                      </TableCell>
                      <TableCell sx={{ border: 1, borderColor: 'divider' }}>
                        {target}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2" color="text.secondary">
              判定特技が選択されていません
            </Typography>
          )}
        </Box>
      </Box>

      <Box my={3}>
        <Box display="flex" gap={2} alignItems="center" mb={2}>
          <Typography variant="h6">身体部位決定表</Typography>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={handleClearAllDamage}
            disabled={damagedSpecialties.length === 0}
          >
            ダメージを全て回復
          </Button>
        </Box>
        <DamageTable
          rows={damageRows}
          damageHandler={handleDamageChange}
          sevenLabel="攻撃したキャラクターの任意の部位"
        />
      </Box>
    </>
  );
};
