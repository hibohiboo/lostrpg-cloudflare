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
interface Facility {
  id: string;
  name: string;
  type: string;
  specialty: string;
  level: number;
  effect: string;
}

interface Item {
  id: string;
  name: string;
  number: number;
  weight: number;
}

interface CampMember {
  characterId: string;
  characterName: string;
}

interface Camp {
  id: string;
  name: string;
  playerName: string;
  imageUrl: string;
  summary: string;
  freeWriting: string;
  facilities: Facility[];
  items: Item[];
  unusedCampPoint: number;
  totalCampPoint: number;
  members: CampMember[];
  uid: string;
}

// ダミーデータ
const DUMMY_CAMP: Camp = {
  id: '1',
  name: 'ドラゴンの洞窟キャンプ',
  playerName: '冒険者太郎',
  imageUrl: 'https://placehold.co/600x400/EEE/31343C?text=Camp+Image',
  summary:
    'ドラゴンの洞窟近くに設置された前線基地。\n険しい山岳地帯に位置しており、冒険者たちの拠点となっている。',
  freeWriting:
    'このキャンプは、伝説のドラゴンが住むと言われる洞窟の入り口近くに設置されています。\n\n【設立経緯】\n・3年前に冒険者ギルドによって設立\n・ドラゴン討伐を目指す冒険者の拠点として機能\n・最近は調査隊の活動が活発化\n\n【周辺環境】\n・標高1200m地点に位置\n・最寄りの街まで徒歩2日\n・豊富な鉱物資源',
  facilities: [
    {
      id: '1',
      name: '宿舎',
      type: '設備',
      specialty: '生活',
      level: 3,
      effect: '休息効果+3',
    },
    {
      id: '2',
      name: '倉庫',
      type: '設備',
      specialty: '保管',
      level: 2,
      effect: '収納量+20',
    },
    {
      id: '3',
      name: '訓練場',
      type: '設備',
      specialty: '訓練',
      level: 2,
      effect: '経験値+20%',
    },
    {
      id: '4',
      name: '料理人',
      type: '人材',
      specialty: '料理',
      level: 2,
      effect: '食事効果+4',
    },
    {
      id: '5',
      name: '鍛冶屋',
      type: '人材',
      specialty: '製作',
      level: 3,
      effect: '武器強化+3',
    },
  ],
  items: [
    { id: '1', name: '回復薬', number: 10, weight: 0.1 },
    { id: '2', name: '魔法の石', number: 5, weight: 0.5 },
    { id: '3', name: '古文書', number: 2, weight: 1.0 },
    { id: '4', name: '保存食', number: 50, weight: 0.3 },
    { id: '5', name: '宝の地図', number: 1, weight: 0.1 },
  ],
  unusedCampPoint: 5,
  totalCampPoint: 32,
  members: [
    { characterId: '1', characterName: '戦士ハンス' },
    { characterId: '2', characterName: '魔法使いリナ' },
    { characterId: '3', characterName: '僧侶マリア' },
    { characterId: '4', characterName: '盗賊キッド' },
  ],
  uid: 'dummy-user-id',
};

const DetailPage: React.FC = () => {
  const camp = DUMMY_CAMP;
  const isOwner = false; // ダミー: 実際は認証情報から判断

  // 施設テーブルの列定義
  const facilityColumns: GridColDef[] = [
    { field: 'name', headerName: '名前', width: 150 },
    { field: 'type', headerName: '種別', width: 100 },
    { field: 'specialty', headerName: '専門', width: 100 },
    { field: 'level', headerName: 'レベル', width: 100, type: 'number' },
    { field: 'effect', headerName: '効果', width: 200 },
  ];

  // アイテムテーブルの列定義
  const itemColumns: GridColDef[] = [
    { field: 'name', headerName: '名前', width: 250 },
    { field: 'number', headerName: '個数', width: 100, type: 'number' },
    { field: 'weight', headerName: '重量', width: 100, type: 'number' },
  ];

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        {/* タイトルと編集リンク */}
        <Box mb={3}>
          <Typography variant="h4" component="h1" gutterBottom>
            {camp.name}
          </Typography>
          {isOwner && (
            <Box mt={1}>
              <MuiLink href={`/camp/edit?id=${camp.id}`} underline="hover">
                編集
              </MuiLink>
            </Box>
          )}
        </Box>

        {/* 画像と概要 */}
        <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
          {camp.imageUrl && (
            <Box
              component={Paper}
              sx={{
                minWidth: 320,
                maxWidth: 500,
                overflow: 'hidden',
              }}
            >
              <img
                src={camp.imageUrl}
                alt="キャンプ画像"
                style={{ width: '100%', display: 'block' }}
              />
            </Box>
          )}

          {camp.summary.trim() && (
            <Box
              component={Paper}
              p={2}
              sx={{
                whiteSpace: 'pre-wrap',
                minWidth: 320,
                flex: 1,
              }}
            >
              <Typography variant="body1">{camp.summary}</Typography>
            </Box>
          )}
        </Box>

        {/* メンバー */}
        <Box my={3}>
          <InputLabel sx={{ mb: 1 }}>メンバー</InputLabel>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {camp.members.map((member) => (
              <Chip
                key={member.characterId}
                label={member.characterName}
                component="a"
                href={`/lostrpg/public/ja/characters/${member.characterId}`}
                clickable
                color="primary"
                variant="outlined"
              />
            ))}
            {camp.members.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                メンバーはいません
              </Typography>
            )}
          </Box>
        </Box>

        {/* 施設テーブル */}
        <Box my={4}>
          <Typography variant="h6" gutterBottom>
            施設
          </Typography>
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={camp.facilities}
              columns={facilityColumns}
              hideFooter
              disableRowSelectionOnClick
              localeText={{
                noRowsLabel: '施設がありません',
              }}
            />
          </Box>
        </Box>

        {/* アイテムテーブル */}
        <Box my={4}>
          <Typography variant="h6" gutterBottom>
            保管庫
          </Typography>
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={camp.items}
              columns={itemColumns}
              hideFooter
              disableRowSelectionOnClick
              localeText={{
                noRowsLabel: 'アイテムがありません',
              }}
            />
          </Box>
        </Box>

        {/* キャンプポイント */}
        <Box display="flex" gap={2} my={3} maxWidth={400}>
          <TextField
            label="未使用CP"
            value={camp.unusedCampPoint}
            type="number"
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
            sx={{ flex: 1 }}
          />
          <TextField
            label="合計CP"
            value={camp.totalCampPoint}
            type="number"
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
            sx={{ flex: 1 }}
          />
        </Box>

        {/* 詳細 */}
        {camp.freeWriting && (
          <Box my={3}>
            <InputLabel sx={{ mb: 1 }}>詳細</InputLabel>
            <Box
              component={Paper}
              p={2}
              sx={{
                whiteSpace: 'pre-wrap',
                minWidth: 320,
              }}
            >
              <Typography variant="body1">{camp.freeWriting}</Typography>
            </Box>
          </Box>
        )}

        {/* 戻るリンク */}
        <Box mt={4}>
          <MuiLink href="/camp/list" underline="hover">
            戻る
          </MuiLink>
        </Box>
      </Box>
    </Container>
  );
};

export default DetailPage;
