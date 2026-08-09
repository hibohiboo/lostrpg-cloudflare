import {
  abilityList,
  trophyAbilityList,
} from '@lostrpg/core/game-data/character';
import {
  enemyAbilityList,
  strangeFieldsEnemyAbilityList,
} from '@lostrpg/core/game-data/enemy';
import { Box, Typography } from '@mui/material';
import React from 'react';
import {
  AddAbilityForm,
  AbilityTable,
  type Ability,
  type AbilityGroup,
} from '@lostrpg/frontend/entities/ability';
import type { EnemyAbility } from '@lostrpg/frontend/entities/enemy';

type Props = {
  abilities: EnemyAbility[];
  onAbilityAdd: (ability: EnemyAbility) => void;
  onAbilityUpdate: (ability: EnemyAbility) => void;
  onAbilityDelete: (id: string) => void;
};

// エネミーグループ（ケモノ・ムシ・ミュータント・その他）をこの並び順で先頭に出す
const ENEMY_GROUP_ORDER = ['ケモノ', 'ムシ', 'ミュータント', 'その他'];
const orderedEnemyAbilityList = ENEMY_GROUP_ORDER.map((name) =>
  enemyAbilityList.find((group) => group.name === name),
).filter((group): group is (typeof enemyAbilityList)[number] => !!group);

// ヌシと同様、タイプによる絞り込みは行わず、全グループから自由に選択できる
// ドロップダウンの並びは エネミー系グループ（基本+サプリメント1）→ 汎用 → クラス特技 → 称号特技 の順
const abilityGroups: readonly AbilityGroup[] = [
  ...orderedEnemyAbilityList,
  ...strangeFieldsEnemyAbilityList,
  ...abilityList,
  ...trophyAbilityList,
];

export const AbilitiesSection: React.FC<Props> = ({
  abilities,
  onAbilityAdd,
  onAbilityUpdate,
  onAbilityDelete,
}) => {
  const handleAbilityUpdate = (newRow: Ability): Ability => {
    onAbilityUpdate(newRow);
    return newRow;
  };

  return (
    <Box sx={{ my: 3 }}>
      <Typography variant="h6" gutterBottom>
        アビリティ
      </Typography>

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
