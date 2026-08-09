import { Box, Chip, InputLabel, Typography } from '@mui/material';
import React from 'react';
import { SpecialtiesTable } from '@lostrpg/frontend/shared/ui';

type Props = {
  specialties: string[];
  gaps: string[];
  onSpecialtyToggle: (specialty: string) => void;
  onGapToggle: (gap: string) => void;
};

// エネミーもプレイヤーキャラクターと同様、習得特技・ギャップを選択して保存できる
// （部位ダメージは受けないため、ダメージのチェックボックス・身体部位決定表は持たない）
export const EditSpecialtiesSection: React.FC<Props> = ({
  specialties,
  gaps,
  onSpecialtyToggle,
  onGapToggle,
}) => (
  <Box sx={{ my: 3 }}>
    <Typography variant="h6" gutterBottom>
      特技・ギャップ
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
      特技取得はテキスト部分クリック。
    </Typography>
    <SpecialtiesTable
      gaps={gaps}
      specialties={specialties}
      damagedSpecialties={[]}
      onGapChange={onGapToggle}
      onSpecialtySelect={onSpecialtyToggle}
      onDamageChange={undefined}
      showDamageCheckbox={false}
    />

    <Box sx={{ my: 2 }}>
      <InputLabel>習得特技</InputLabel>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
        {specialties.length > 0 ? (
          specialties.map((specialty) => (
            <Chip key={specialty} label={specialty} color="primary" />
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            特技が選択されていません
          </Typography>
        )}
      </Box>
    </Box>
  </Box>
);
