import {
  Box,
  Chip,
  Container,
  InputLabel,
  Link as MuiLink,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React from 'react';

// 型定義
interface CharacterClass {
  id: string;
  name: string;
}

interface Ability {
  id: string;
  name: string;
  timing: string;
  judge: string;
  target: string;
  range: string;
  cost: string;
  limit: string;
  effect: string;
}

interface Item {
  id: string;
  name: string;
  number: number;
  weight: number;
  cost: number;
}

interface Character {
  id: string;
  playerName: string;
  name: string;
  campId: string;
  campName: string;
  imageUrl: string;
  classes: CharacterClass[];
  specialties: string[];
  abilities: Ability[];
  staminaBase: number;
  stamina: number;
  willPowerBase: number;
  willPower: number;
  carryingCapacity: number;
  items: Item[];
  unusedExperience: number;
  totalExperience: number;
  summary: string;
  appearance: string;
  freeWriting: string;
  quote: string;
  uid: string;
}

// ダミーデータ
// アビリティテーブルの列定義
const ABILITY_COLUMNS: GridColDef[] = [
  { field: 'name', headerName: '名前', width: 150 },
  { field: 'timing', headerName: 'タイミング', width: 120 },
  { field: 'judge', headerName: '判定', width: 100 },
  { field: 'target', headerName: '対象', width: 100 },
  { field: 'range', headerName: '射程', width: 100 },
  { field: 'cost', headerName: 'コスト', width: 120 },
  { field: 'limit', headerName: '制限', width: 120 },
  { field: 'effect', headerName: '効果', width: 200 },
];

// アイテムテーブルの列定義
const ITEM_COLUMNS: GridColDef[] = [
  { field: 'name', headerName: '名前', width: 200 },
  { field: 'number', headerName: '個数', width: 100, type: 'number' },
  { field: 'weight', headerName: '重量', width: 100, type: 'number' },
  { field: 'cost', headerName: '価格', width: 100, type: 'number' },
];

const DUMMY_CHARACTER: Character = {
  id: '1',
  playerName: '冒険者太郎',
  name: '戦士ハンス',
  campId: '1',
  campName: 'ドラゴンの洞窟キャンプ',
  imageUrl: 'https://placehold.co/600x400/EEE/31343C?text=Character+Image',
  classes: [
    { id: '1', name: '戦士' },
    { id: '2', name: '騎士' },
  ],
  specialties: ['武器攻撃', '防御', '知覚'],
  abilities: [
    {
      id: '1',
      name: '渾身の一撃',
      timing: 'メジャー',
      judge: '命中',
      target: '単体',
      range: '武器',
      cost: 'スタミナ2',
      limit: '1回/シーン',
      effect: 'ダメージ+2D6',
    },
    {
      id: '2',
      name: '鉄壁の守り',
      timing: 'リアクション',
      judge: '回避',
      target: '自身',
      range: '自身',
      cost: '意志力1',
      limit: '2回/シーン',
      effect: '回避判定+2',
    },
  ],
  staminaBase: 6,
  stamina: 4,
  willPowerBase: 3,
  willPower: 2,
  carryingCapacity: 15,
  items: [
    { id: '1', name: '回復薬', number: 3, weight: 0.1, cost: 50 },
    { id: '2', name: '保存食', number: 10, weight: 0.3, cost: 10 },
    { id: '3', name: '武器強化石', number: 1, weight: 0.2, cost: 500 },
  ],
  unusedExperience: 5,
  totalExperience: 120,
  summary:
    '北の辺境出身の若き戦士。\n剣術に優れ、仲間を守ることに命を賭けている。',
  appearance:
    '身長180cm、筋骨隆々とした体格。\n短く刈り込んだ金髪と、鋭い青い瞳が特徴。\n常に手入れの行き届いた鎧を身につけている。',
  freeWriting:
    '【来歴】\n故郷の村がモンスターに襲われた際、唯一生き残った。\nその経験から、自分の力で弱き者を守ることを誓った。\n\n【性格】\n正義感が強く、困っている人を放っておけない。\n少々無鉄砲なところがあるが、仲間思いで信頼されている。\n\n【目標】\n最強の戦士となり、故郷のような悲劇を二度と起こさせない。',
  quote: '俺が守る。それが俺の生きる道だ。',
  uid: 'dummy-user-id',
};

// ヘッダーコンポーネント
const CharacterHeader: React.FC<{
  character: Character;
  isOwner: boolean;
}> = ({ character, isOwner }) => (
  <Box mb={3}>
    <Typography variant="h4" component="h1" gutterBottom>
      {character.name}
    </Typography>
    {character.campId ? (
      <Typography variant="h6" color="text.secondary" gutterBottom>
        キャンプ:{' '}
        <MuiLink
          href={`/lostrpg/public/ja/camp?id=${character.campId}`}
          underline="hover"
        >
          {character.campName}
        </MuiLink>
      </Typography>
    ) : null}
    {isOwner ? (
      <Box mt={1}>
        <MuiLink href={`/character/edit?id=${character.id}`} underline="hover">
          編集
        </MuiLink>
      </Box>
    ) : null}
  </Box>
);

const DetailPage: React.FC = () => {
  const character = DUMMY_CHARACTER;
  const isOwner = false;

  const totalWeight = character.items.reduce(
    (sum, item) => sum + item.weight * item.number,
    0
  );

  const totalValue = character.items.reduce(
    (sum, item) => sum + item.cost * item.number,
    0
  );

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <CharacterHeader character={character} isOwner={isOwner} />

        {/* 名言 */}
        {character.quote ? (
          <Box my={3}>
            <Typography
              variant="h6"
              component="q"
              sx={{ fontStyle: 'italic', fontSize: '1.5rem' }}
            >
              {character.quote}
            </Typography>
          </Box>
        ) : null}

        {/* クラス */}
        <Box my={3}>
          <InputLabel sx={{ mb: 1 }}>クラス</InputLabel>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {character.classes.map((cls) => (
              <Chip key={cls.id} label={cls.name} color="primary" />
            ))}
          </Box>
        </Box>

        {/* 画像と概要 */}
        <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
          {character.imageUrl ? (
            <Box
              component={Paper}
              sx={{
                minWidth: 320,
                maxWidth: 500,
                overflow: 'hidden',
              }}
            >
              <img
                src={character.imageUrl}
                alt="キャラクター画像"
                style={{ width: '100%', display: 'block' }}
              />
            </Box>
          ) : null}

          {character.summary.trim() ? (
            <Box
              component={Paper}
              p={2}
              sx={{
                whiteSpace: 'pre-wrap',
                minWidth: 320,
                flex: 1,
              }}
            >
              <Typography variant="body1">{character.summary}</Typography>
            </Box>
          ) : null}
        </Box>

        {/* 専門特技 */}
        <Box my={3}>
          <InputLabel sx={{ mb: 1 }}>専門特技</InputLabel>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {character.specialties.map((specialty) => (
              <Chip
                key={specialty}
                label={specialty}
                variant="outlined"
                color="secondary"
              />
            ))}
          </Box>
        </Box>

        {/* アビリティテーブル */}
        {character.abilities.length > 0 ? (
          <Box my={4}>
            <Typography variant="h6" gutterBottom>
              アビリティ
            </Typography>
            <Box sx={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={character.abilities}
                columns={ABILITY_COLUMNS}
                hideFooter
                disableRowSelectionOnClick
                localeText={{
                  noRowsLabel: 'アビリティがありません',
                }}
              />
            </Box>
          </Box>
        ) : null}

        {/* 能力値 */}
        <Box my={3}>
          <Typography variant="h6" gutterBottom>
            能力値
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <TextField
              label="スタミナ基本値"
              value={character.staminaBase}
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
              sx={{ width: 150 }}
            />
            <TextField
              label="現在スタミナ"
              value={character.stamina}
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
              sx={{ width: 150 }}
            />
            <TextField
              label="意志力基本値"
              value={character.willPowerBase}
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
              sx={{ width: 150 }}
            />
            <TextField
              label="現在意志力"
              value={character.willPower}
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
              sx={{ width: 150 }}
            />
          </Box>
        </Box>

        {/* アイテム */}
        <Box my={4}>
          <Typography variant="h6" gutterBottom>
            アイテム
          </Typography>
          <Box display="flex" gap={2} mb={2}>
            <TextField
              label="運搬能力"
              value={character.carryingCapacity}
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
              sx={{ width: 150 }}
            />
            <TextField
              label="合計重量"
              value={totalWeight.toFixed(1)}
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
              sx={{ width: 150 }}
            />
            <TextField
              label="合計価格"
              value={totalValue}
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
              sx={{ width: 150 }}
            />
          </Box>
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={character.items}
              columns={ITEM_COLUMNS}
              hideFooter
              disableRowSelectionOnClick
              localeText={{
                noRowsLabel: 'アイテムがありません',
              }}
            />
          </Box>
        </Box>

        {/* 経験値 */}
        <Box display="flex" gap={2} my={3}>
          <TextField
            label="未使用経験値"
            value={character.unusedExperience}
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
            sx={{ width: 200 }}
          />
          <TextField
            label="合計経験値"
            value={character.totalExperience}
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
            sx={{ width: 200 }}
          />
        </Box>

        {/* 外見 */}
        {character.appearance ? (
          <Box my={3}>
            <InputLabel sx={{ mb: 1 }}>外見</InputLabel>
            <Box
              component={Paper}
              p={2}
              sx={{
                whiteSpace: 'pre-wrap',
                minWidth: 320,
              }}
            >
              <Typography variant="body1">{character.appearance}</Typography>
            </Box>
          </Box>
        ) : null}

        {/* 詳細 */}
        {character.freeWriting ? (
          <Box my={3}>
            <InputLabel sx={{ mb: 1 }}>メモ</InputLabel>
            <Box
              component={Paper}
              p={2}
              sx={{
                whiteSpace: 'pre-wrap',
                minWidth: 320,
              }}
            >
              <Typography variant="body1">{character.freeWriting}</Typography>
            </Box>
          </Box>
        ) : null}

        {/* 戻るリンク */}
        <Box mt={4}>
          <MuiLink href="/character/list" underline="hover">
            戻る
          </MuiLink>
        </Box>
      </Box>
    </Container>
  );
};

export default DetailPage;
