import { damageTableRows, specialties } from '@lostrpg/core/game-data/speciality';
import { HelpOutlineOutlined as HelpOutline } from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  InputLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useMemo, useState } from 'react';
import {
  checkSpecialties,
  toggleDamagedSpecialtyList,
} from '@lostrpg/frontend/shared/lib/specialty';
import { SpecialtiesTable } from '@lostrpg/frontend/shared/ui';

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

// ＜ヌシ＞は全ての特技を習得しておりギャップを埋めないため、
// 習得特技・ギャップは常に固定。ダメージ・判定特技の選択はこの画面内だけのセッション状態として扱う（保存はしない）

// 判定特技の目標値一覧を、折りたたみ表示するデフォルト件数
const TARGET_LIST_COLLAPSED_COUNT = 5;

export const SpecialtiesSection: React.FC = () => {
  const [damagedSpecialties, setDamagedSpecialties] = useState<string[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [showAllTargets, setShowAllTargets] = useState(false);

  const handleSpecialtySelect = (specialty: string) => {
    setSelectedSpecialty((prev) => (prev === specialty ? '' : specialty));
    setShowAllTargets(false);
  };

  const handleDamageChange = (specialty: string) => {
    setDamagedSpecialties((prev) => toggleDamagedSpecialtyList(prev, specialty));
  };

  const handleClearAllDamage = () => setDamagedSpecialties([]);

  const specialtiesWithTarget = useMemo(
    () =>
      specialties
        .map((specialty) => ({
          specialty,
          target: checkSpecialties(specialty, selectedSpecialty, []),
        }))
        .sort((a, b) => a.target - b.target),
    [selectedSpecialty],
  );

  const visibleTargets = showAllTargets
    ? specialtiesWithTarget
    : specialtiesWithTarget.slice(0, TARGET_LIST_COLLAPSED_COUNT);

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
      <Box sx={{ my: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Typography variant="h6">特技・ギャップ</Typography>
          <Tooltip
            title="判定特技指定はテキスト部分クリック。ダメージはチェック。"
            arrow
          >
            <IconButton size="small" sx={{ padding: 0 }}>
              <HelpOutline fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          ＜ヌシ＞は全ての特技を習得しており、ギャップは埋めません。
        </Typography>
        <SpecialtiesTable
          gaps={[]}
          specialties={specialties}
          damagedSpecialties={damagedSpecialties}
          selectedSpecialty={selectedSpecialty}
          onGapChange={undefined}
          onSpecialtySelect={handleSpecialtySelect}
          onDamageChange={handleDamageChange}
        />
      </Box>

      <Box sx={{ my: 3 }}>
        <InputLabel>判定特技:{selectedSpecialty}</InputLabel>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {selectedSpecialty ? (
            <TableContainer component={Paper} sx={{ width: 'auto' }}>
              <Table
                size="small"
                sx={{ border: 1, borderColor: 'divider', width: 'auto' }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{ border: 1, borderColor: 'divider', fontWeight: 600 }}
                    >
                      特技
                    </TableCell>
                    <TableCell
                      sx={{ border: 1, borderColor: 'divider', fontWeight: 600 }}
                    >
                      目標値
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleTargets.map(({ specialty, target }) => (
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
        {selectedSpecialty &&
          specialtiesWithTarget.length > TARGET_LIST_COLLAPSED_COUNT && (
            <Button
              size="small"
              onClick={() => setShowAllTargets((prev) => !prev)}
              sx={{ mt: 1 }}
            >
              {showAllTargets
                ? '折りたたむ'
                : `すべて表示（${specialtiesWithTarget.length}件）`}
            </Button>
          )}
      </Box>

      <Box sx={{ my: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
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
