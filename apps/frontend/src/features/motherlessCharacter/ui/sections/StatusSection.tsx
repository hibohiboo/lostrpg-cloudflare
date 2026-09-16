import { Box, TextField, Typography } from '@mui/material';
import React, { useMemo } from 'react';
import { shallowEqual } from 'react-redux';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';
import { updateMotherlessCharacter } from '../../model/characterSlice';
import { calcMotherlessDerivedStats } from '../../model/derivedStats';

const ReadOnlyField: React.FC<{ label: string; value: number | string }> = ({
  label,
  value,
}) => (
  <TextField
    label={label}
    value={value}
    slotProps={{ input: { readOnly: true } }}
    sx={{ width: 150 }}
  />
);

export const StatusSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const level = useAppSelector((state) => state.motherlessCharacter.level);
  const abilities = useAppSelector(
    (state) => state.motherlessCharacter.abilities,
    shallowEqual,
  );
  const equipments = useAppSelector(
    (state) => state.motherlessCharacter.equipments,
    shallowEqual,
  );
  const hp = useAppSelector((state) => state.motherlessCharacter.hp);
  const tp = useAppSelector((state) => state.motherlessCharacter.tp);

  const derived = useMemo(
    () => calcMotherlessDerivedStats(level, abilities, equipments),
    [level, abilities, equipments],
  );

  return (
    <Box sx={{ my: 3 }}>
      <Typography variant="h6" gutterBottom>
        ステータス
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
        <ReadOnlyField label="基礎HP" value={derived.baseHp} />
        <TextField
          type="number"
          label="現在HP"
          value={hp}
          onChange={(e) =>
            dispatch(
              updateMotherlessCharacter({ hp: Number(e.target.value) }),
            )
          }
          sx={{ width: 150 }}
        />
        <ReadOnlyField label="基礎TP" value={derived.baseTp} />
        <TextField
          type="number"
          label="現在TP"
          value={tp}
          onChange={(e) =>
            dispatch(
              updateMotherlessCharacter({ tp: Number(e.target.value) }),
            )
          }
          sx={{ width: 150 }}
        />
      </Box>

      <Typography variant="body2" color="text.secondary" gutterBottom>
        以下は「装備」セクションで装備しているアイテムの数値と能力値ボーナスから自動計算されます
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
        <ReadOnlyField label="攻撃力" value={derived.attackPower} />
        <ReadOnlyField label="属性力" value={derived.elementPower} />
        <ReadOnlyField label="命中力" value={derived.accuracy} />
        <ReadOnlyField label="回避力" value={derived.evasion} />
        <ReadOnlyField label="防御力" value={derived.defense} />
        <ReadOnlyField
          label="先制値"
          value={`2D6+${derived.initiativeModifier}`}
        />
      </Box>
    </Box>
  );
};
