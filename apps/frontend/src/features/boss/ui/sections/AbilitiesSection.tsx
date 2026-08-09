import { enemyAbilityList } from '@lostrpg/core/game-data/enemy';
import { Box, Paper, Typography } from '@mui/material';
import React, { useMemo } from 'react';
import {
  AddAbilityForm,
  AbilityTable,
  type Ability,
} from '@lostrpg/frontend/entities/ability';
import type { BossAbility } from '@lostrpg/frontend/entities/boss';

type Props = {
  level: number;
  abilities: BossAbility[];
  onAbilityAdd: (ability: BossAbility) => void;
  onAbilityUpdate: (ability: BossAbility) => void;
  onAbilityDelete: (id: string) => void;
};

// 4レベル以降は2つ、8レベル以降は3つの補助アビリティを組み合わせられる
const comboCount = (level: number) => {
  if (level >= 8) return 3;
  if (level >= 4) return 2;
  return 1;
};

export const AbilitiesSection: React.FC<Props> = ({
  level,
  abilities,
  onAbilityAdd,
  onAbilityUpdate,
  onAbilityDelete,
}) => {
  const bossGroupCount = useMemo(
    () => abilities.filter((a) => a.group === 'ヌシ').length,
    [abilities],
  );

  const handleAbilityUpdate = (newRow: Ability): Ability => {
    onAbilityUpdate(newRow);
    return newRow;
  };

  return (
    <Box sx={{ my: 3 }}>
      <Typography variant="h6" gutterBottom>
        アビリティ
      </Typography>

      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          ・ヌシグループの【アビリティ】をまず4つ習得しています（現在
          {bossGroupCount}
          / 4）
          <br />
          ・さらに、レベルと同じ数（{level}
          個）の【アビリティ】を全てのグループから習得できます
          <br />
          ・4レベル以降は2つ、8レベル以降は3つの補助アビリティを組み合わせることができます（現在のレベルでの組み合わせ可能数:{' '}
          {comboCount(level)}つ）
        </Typography>
      </Paper>

      <AddAbilityForm
        abilityGroups={enemyAbilityList}
        onAbilityAdd={(ability) => onAbilityAdd(ability as BossAbility)}
      />

      <Box sx={{ width: '100%', mt: 2 }}>
        <AbilityTable
          abilities={abilities}
          handleAbilityDelete={onAbilityDelete}
          handleAbilityUpdate={(newRow) => handleAbilityUpdate(newRow)}
        />
      </Box>
    </Box>
  );
};
