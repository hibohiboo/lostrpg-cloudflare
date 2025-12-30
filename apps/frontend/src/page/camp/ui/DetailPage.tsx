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
import React from 'react';
import { Link, useParams } from 'react-router';
import { useGetCampCharactersQuery } from '@lostrpg/frontend/entities/camp';
import { FacilityTable } from '@lostrpg/frontend/entities/facility';
import { ItemTable } from '@lostrpg/frontend/entities/item';
import { useAppSelector } from '@lostrpg/frontend/shared/lib/store';

// eslint-disable-next-line complexity
const DetailPage: React.FC = () => {
  const { id } = useParams();
  if (!id) throw new Error('id is empty');
  const { data: members = [] } = useGetCampCharactersQuery(id);

  const camp = useAppSelector((state) => state.camp);

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        {/* タイトルと編集ボタン */}
        <Box mb={2} display="flex" alignItems="center" gap={2}>
          <Typography variant="h4" component="h1">
            {camp.name}
          </Typography>
          <Link to={`/camp/${id}/edit`}>
            <Button variant="outlined" startIcon={<EditIcon />} size="small">
              編集
            </Button>
          </Link>
        </Box>

        {/* プレイヤー名 */}
        {camp.playerName && (
          <Box mb={3}>
            <Typography variant="body1" color="text.secondary">
              プレイヤー: {camp.playerName}
            </Typography>
          </Box>
        )}

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
            <Box sx={{ minWidth: 320, flex: 1 }}>
              <InputLabel sx={{ mb: 1 }}>概要</InputLabel>
              <Box
                component={Paper}
                p={2}
                sx={{
                  whiteSpace: 'pre-wrap',
                }}
              >
                <Typography variant="body1">{camp.summary}</Typography>
              </Box>
            </Box>
          )}
        </Box>

        {/* メンバー */}
        <Box my={3}>
          <InputLabel sx={{ mb: 1 }}>メンバー</InputLabel>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {members.map((member) => (
              <Link key={member.id} to={`/character/${member.id}`}>
                <Chip
                  label={member.name}
                  clickable
                  color="primary"
                  variant="outlined"
                />
              </Link>
            ))}
            {members.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                メンバーはいません
              </Typography>
            )}
          </Box>
        </Box>

        {/* 施設テーブル */}
        <Box my={3}>
          <Typography variant="h6" gutterBottom>
            施設
          </Typography>
          <Box sx={{ height: 400, width: '100%' }}>
            <FacilityTable
              facilities={camp.facilities}
              handleFacilityDelete={() => {}}
              handleFacilityUpdate={(newRow) => newRow}
            />
          </Box>
        </Box>

        {/* アイテムテーブル */}
        <Box my={3}>
          <Typography variant="h6" gutterBottom>
            倉庫
          </Typography>
          <Box sx={{ height: 400, width: '100%' }}>
            <ItemTable
              items={camp.items}
              handleItemDelete={() => {}}
              handleItemUpdate={(newRow) => newRow}
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
          <MuiLink href="/camp/" underline="hover">
            戻る
          </MuiLink>
        </Box>
      </Box>
    </Container>
  );
};

export default DetailPage;
