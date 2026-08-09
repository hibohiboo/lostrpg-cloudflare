import { specialties } from '@lostrpg/core/game-data/speciality';
import { HelpOutlineOutlined as HelpOutline } from '@mui/icons-material';
import {
  Box,
  Button,
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
import { checkSpecialties } from '@lostrpg/frontend/shared/lib/specialty';
import { SpecialtiesTable } from '@lostrpg/frontend/shared/ui';

// 判定特技の目標値一覧を、折りたたみ表示するデフォルト件数
const TARGET_LIST_COLLAPSED_COUNT = 5;

// エネミーは部位ダメージを受けないため、特技グリッドはダメージ管理を持たない
// （判定特技の選択はこの画面内だけのセッション状態として扱い、保存はしない）
export const SpecialtiesSection: React.FC = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [showAllTargets, setShowAllTargets] = useState(false);

  const handleSpecialtySelect = (specialty: string) => {
    setSelectedSpecialty((prev) => (prev === specialty ? '' : specialty));
    setShowAllTargets(false);
  };

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

  return (
    <>
      <Box sx={{ my: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Typography variant="h6">特技・ギャップ</Typography>
          <Tooltip title="判定特技指定はテキスト部分クリック。" arrow>
            <IconButton size="small" sx={{ padding: 0 }}>
              <HelpOutline fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          エネミーは部位ダメージを受けません。体力が0になると倒れます。
        </Typography>
        <SpecialtiesTable
          gaps={[]}
          specialties={specialties}
          damagedSpecialties={[]}
          selectedSpecialty={selectedSpecialty}
          onGapChange={undefined}
          onSpecialtySelect={handleSpecialtySelect}
          onDamageChange={undefined}
          showDamageCheckbox={false}
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
    </>
  );
};
