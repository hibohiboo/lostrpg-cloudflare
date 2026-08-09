import { abilityList, trophyAbilityList } from '@lostrpg/core/game-data/character';
import {
  enemyAbilityList,
  strangeFieldsEnemyAbilityList,
} from '@lostrpg/core/game-data/enemy';
import { Box, Paper, Typography } from '@mui/material';
import React, { useMemo } from 'react';
import {
  AddAbilityForm,
  AbilityTable,
  type Ability,
  type AbilityGroup,
} from '@lostrpg/frontend/entities/ability';
import type { BossAbility } from '@lostrpg/frontend/entities/boss';

type Props = {
  level: number;
  abilities: BossAbility[];
  onAbilityAdd: (ability: BossAbility) => void;
  onAbilityUpdate: (ability: BossAbility) => void;
  onAbilityDelete: (id: string) => void;
};

// エネミーグループ（ヌシ・ケモノ・ムシ・ミュータント・その他）をこの並び順で先頭に出す
const ENEMY_GROUP_ORDER = ['ヌシ', 'ケモノ', 'ムシ', 'ミュータント', 'その他'];
const orderedEnemyAbilityList = ENEMY_GROUP_ORDER.map((name) =>
  enemyAbilityList.find((group) => group.name === name),
).filter((group): group is (typeof enemyAbilityList)[number] => !!group);

// ヌシはクラスや称号を持たないため、キャラクターが習得条件付きで選ぶアビリティ
// （クラス別アビリティ・称号アビリティ）も含めた全グループから自由に選択できる
// ドロップダウンの並びは ヌシ系グループ（基本+サプリメント1）→ 汎用 → クラス特技 → 称号特技 の順
const abilityGroups: readonly AbilityGroup[] = [
  ...orderedEnemyAbilityList,
  ...strangeFieldsEnemyAbilityList,
  ...abilityList,
  ...trophyAbilityList,
];

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
        abilityGroups={abilityGroups}
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
