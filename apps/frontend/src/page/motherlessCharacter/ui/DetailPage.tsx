import { abilityBonus } from '@lostrpg/core/game-data/motherless';
import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Button,
  Chip,
  Container,
  InputLabel,
  Link as MuiLink,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router';
import { calcMotherlessDerivedStats } from '@lostrpg/frontend/features/motherlessCharacter';
import { useAppSelector } from '@lostrpg/frontend/shared/lib/store';
import { EditableDataGrid } from '@lostrpg/frontend/shared/ui';

const ReadOnlyField: React.FC<{ label: string; value: number | string }> = ({
  label,
  value,
}) => (
  <TextField
    label={label}
    value={value}
    slotProps={{ input: { readOnly: true } }}
    sx={{ flex: 1, minWidth: 120 }}
  />
);

const abilityLabels: { key: 'strength' | 'sense' | 'dexterity' | 'constitution' | 'intelligence'; label: string }[] = [
  { key: 'strength', label: '筋力' },
  { key: 'sense', label: '感覚' },
  { key: 'dexterity', label: '器用' },
  { key: 'constitution', label: '体力' },
  { key: 'intelligence', label: '知能' },
];

const DetailPage: React.FC = () => {
  const { id } = useParams();
  const character = useAppSelector((state) => state.motherlessCharacter);

  const derived = useMemo(
    () =>
      calcMotherlessDerivedStats(
        character.level,
        character.abilities,
        character.equipments,
      ),
    [character.level, character.abilities, character.equipments],
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4" component="h1">
            {character.name}
          </Typography>
          <Link to={`/motherless/characters/${id}/edit`}>
            <Button variant="outlined" startIcon={<EditIcon />} size="small">
              編集
            </Button>
          </Link>
        </Box>

        {character.quote && (
          <Box sx={{ my: 3 }}>
            <Typography
              variant="body1"
              sx={{ fontSize: '1.5rem', fontStyle: 'italic' }}
            >
              「{character.quote}」
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          {character.imageUrl && (
            <Box
              component={Paper}
              sx={{ minWidth: 320, maxWidth: 500, overflow: 'hidden' }}
            >
              <img
                src={character.imageUrl}
                alt="キャラクター画像"
                style={{ width: '100%', display: 'block' }}
              />
            </Box>
          )}
          {character.summary && character.summary.trim() && (
            <Box sx={{ minWidth: 320, flex: 1 }}>
              <InputLabel sx={{ mb: 1 }}>概要</InputLabel>
              <Box component={Paper} sx={{ p: 2, whiteSpace: 'pre-wrap' }}>
                <Typography variant="body1">{character.summary}</Typography>
              </Box>
            </Box>
          )}
        </Box>

        <Box sx={{ my: 3 }}>
          <InputLabel sx={{ mb: 1 }}>特性 / クラス</InputLabel>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {character.trait && (
              <Chip label={`特性: ${character.trait.name}`} color="secondary" />
            )}
            {character.classes.map((cls) => (
              <Chip key={cls.name} label={cls.name} color="primary" />
            ))}
          </Box>
        </Box>

        <Box sx={{ my: 3 }}>
          <Typography variant="h6" gutterBottom>
            能力値
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {abilityLabels.map(({ key, label }) => (
              <ReadOnlyField
                key={key}
                label={`${label}(+${abilityBonus(character.abilities[key])})`}
                value={character.abilities[key]}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ my: 3 }}>
          <Typography variant="h6" gutterBottom>
            ステータス
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            <ReadOnlyField label="HP" value={`${character.hp} / ${derived.baseHp}`} />
            <ReadOnlyField label="TP" value={`${character.tp} / ${derived.baseTp}`} />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
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

        {character.acquiredSkills.length > 0 && (
          <Box sx={{ my: 3 }}>
            <Typography variant="h6" gutterBottom>
              スキル
            </Typography>
            <EditableDataGrid
              rows={character.acquiredSkills}
              columns={[
                { field: 'name', headerName: '名前', width: 160 },
                { field: 'class', headerName: 'クラス', width: 100 },
                { field: 'type', headerName: 'タイプ', width: 90 },
                { field: 'recoil', headerName: '反動', width: 80 },
                { field: 'target', headerName: '対象', width: 90 },
                { field: 'element', headerName: '属性', width: 90 },
                { field: 'effect', headerName: '効果', width: 360 },
              ]}
              hideActions
              hideFooter
              disableRowSelectionOnClick
            />
          </Box>
        )}

        {character.items.length > 0 && (
          <Box sx={{ my: 3 }}>
            <Typography variant="h6" gutterBottom>
              アイテム
            </Typography>
            <EditableDataGrid
              rows={character.items}
              columns={[
                { field: 'name', headerName: '名前', width: 160 },
                { field: 'number', headerName: '数量', width: 70 },
                { field: 'weight', headerName: '重量', width: 70 },
                { field: 'type', headerName: 'タイプ', width: 90 },
                { field: 'effect', headerName: '効果', width: 320 },
              ]}
              hideActions
              hideFooter
              disableRowSelectionOnClick
            />
          </Box>
        )}

        {character.equipments.length > 0 && (
          <Box sx={{ my: 3 }}>
            <Typography variant="h6" gutterBottom>
              装備
            </Typography>
            <EditableDataGrid
              rows={character.equipments}
              columns={[
                { field: 'name', headerName: '名前', width: 160 },
                { field: 'type', headerName: 'タイプ', width: 90 },
                { field: 'physicalDamage', headerName: '物理', width: 70 },
                { field: 'elementDamage', headerName: '属性', width: 70 },
                { field: 'accuracy', headerName: '命中', width: 70 },
                { field: 'defense', headerName: '防御', width: 70 },
                { field: 'evasion', headerName: '回避', width: 70 },
                { field: 'effect', headerName: '効果', width: 280 },
              ]}
              hideActions
              hideFooter
              disableRowSelectionOnClick
            />
          </Box>
        )}

        {character.statusAilments.length > 0 && (
          <Box sx={{ my: 3 }}>
            <Typography variant="h6" gutterBottom>
              変調
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {character.statusAilments.map((ailment) => (
                <Chip key={ailment} label={ailment} color="warning" />
              ))}
            </Box>
          </Box>
        )}

        {character.bodyDamages.length > 0 && (
          <Box sx={{ my: 3 }}>
            <Typography variant="h6" gutterBottom>
              部位ダメージ
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {character.bodyDamages.map((damage) => (
                <Chip key={damage} label={damage} color="error" />
              ))}
            </Box>
          </Box>
        )}

        {character.appearance && (
          <Box sx={{ my: 3 }}>
            <InputLabel sx={{ mb: 1 }}>容姿</InputLabel>
            <Box component={Paper} sx={{ p: 2, whiteSpace: 'pre-wrap' }}>
              <Typography variant="body1">{character.appearance}</Typography>
            </Box>
          </Box>
        )}

        {character.freeWriting && (
          <Box sx={{ my: 3 }}>
            <InputLabel sx={{ mb: 1 }}>設定</InputLabel>
            <Box component={Paper} sx={{ p: 2, whiteSpace: 'pre-wrap' }}>
              <Typography variant="body1">{character.freeWriting}</Typography>
            </Box>
          </Box>
        )}

        {character.playerName && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" color="text.secondary">
              プレイヤー: {character.playerName}
            </Typography>
          </Box>
        )}

        <Box sx={{ mt: 4 }}>
          <MuiLink component={Link} to="/motherless/characters" underline="hover">
            戻る
          </MuiLink>
        </Box>
      </Box>
    </Container>
  );
};

export default DetailPage;
