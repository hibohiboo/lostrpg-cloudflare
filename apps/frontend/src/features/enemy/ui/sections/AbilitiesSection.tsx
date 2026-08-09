import { enemyAbilityList } from '@lostrpg/core/game-data/enemy';
import { Box, Paper, Typography } from '@mui/material';
import React, { useMemo } from 'react';
import {
  AddAbilityForm,
  AbilityTable,
  type Ability,
} from '@lostrpg/frontend/entities/ability';
import type { EnemyAbility, EnemyType } from '@lostrpg/frontend/entities/enemy';

type Props = {
  type: EnemyType | undefined;
  abilities: EnemyAbility[];
  onAbilityAdd: (ability: EnemyAbility) => void;
  onAbilityUpdate: (ability: EnemyAbility) => void;
  onAbilityDelete: (id: string) => void;
};

// ヌシと違い、エネミーは自身のタイプ（ケモノ・ムシ・ミュータント）と
// タイプ不問の「その他」グループのアビリティのみ選択できる
export const AbilitiesSection: React.FC<Props> = ({
  type,
  abilities,
  onAbilityAdd,
  onAbilityUpdate,
  onAbilityDelete,
}) => {
  const abilityGroups = useMemo(
    () =>
      enemyAbilityList.filter(
        (group) => group.name === type || group.name === 'その他',
      ),
    [type],
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
          {type
            ? `タイプ「${type}」と「その他」グループのアビリティから選択できます。`
            : 'タイプを選択すると、そのタイプのアビリティを選択できるようになります（「その他」は常に選択可能です）。'}
        </Typography>
      </Paper>

      <AddAbilityForm
        abilityGroups={abilityGroups}
        onAbilityAdd={(ability) => onAbilityAdd(ability as EnemyAbility)}
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
