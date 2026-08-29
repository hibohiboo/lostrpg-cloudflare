import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Button,
  Chip,
  Container,
  InputLabel,
  Link as MuiLink,
  Paper,
  Typography,
} from '@mui/material';
import React from 'react';
import { Link, useParams } from 'react-router';
import { useAppSelector } from '@lostrpg/frontend/shared/lib/store';

const DetailPage: React.FC = () => {
  const { id } = useParams();
  if (!id) throw new Error('id is empty');

  const scenario = useAppSelector((state) => state.scenario);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        {/* タイトルと編集ボタン */}
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4" component="h1">
            {scenario.name}
          </Typography>
          <Link to={`/scenario/${id}/edit`}>
            <Button variant="outlined" startIcon={<EditIcon />} size="small">
              編集
            </Button>
          </Link>
          {scenario.isPublish && <Chip label="公開中" color="success" size="small" />}
        </Box>

        {/* 作者名 */}
        {scenario.creatorName && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" color="text.secondary">
              作者: {scenario.creatorName}
            </Typography>
          </Box>
        )}

        {/* 画像と概要 */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          {scenario.imageUrl && (
            <Box
              component={Paper}
              sx={{
                minWidth: 320,
                maxWidth: 500,
                overflow: 'hidden',
              }}
            >
              <img
                src={scenario.imageUrl}
                alt="シナリオ画像"
                style={{ width: '100%', display: 'block' }}
              />
            </Box>
          )}

          {scenario.summary?.trim() && (
            <Box sx={{ minWidth: 320, flex: 1 }}>
              <InputLabel sx={{ mb: 1 }}>概要</InputLabel>
              <Box
                component={Paper}
                sx={{
                  p: 2,
                  whiteSpace: 'pre-wrap',
                }}
              >
                <Typography variant="body1">{scenario.summary}</Typography>
              </Box>
            </Box>
          )}
        </Box>

        {/* 想定人数・プレイ時間・制限値 */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 3 }}>
          {scenario.players && (
            <Chip label={`想定人数: ${scenario.players}`} variant="outlined" />
          )}
          {scenario.time && (
            <Chip label={`プレイ時間: ${scenario.time}`} variant="outlined" />
          )}
          {scenario.limit && (
            <Chip label={`制限値: ${scenario.limit}`} variant="outlined" />
          )}
        </Box>

        {/* 注意事項 */}
        {scenario.caution?.trim() && (
          <Box sx={{ my: 3 }}>
            <InputLabel sx={{ mb: 1 }}>注意事項</InputLabel>
            <Box
              component={Paper}
              sx={{
                p: 2,
                whiteSpace: 'pre-wrap',
                minWidth: 320,
              }}
            >
              <Typography variant="body1">{scenario.caution}</Typography>
            </Box>
          </Box>
        )}

        {/* 本文 */}
        {scenario.content?.trim() && (
          <Box sx={{ my: 3 }}>
            <InputLabel sx={{ mb: 1 }}>本文</InputLabel>
            <Box
              component={Paper}
              sx={{
                p: 2,
                whiteSpace: 'pre-wrap',
                minWidth: 320,
              }}
            >
              <Typography variant="body1">{scenario.content}</Typography>
            </Box>
          </Box>
        )}

        {/* 戻るリンク */}
        <Box sx={{ mt: 4 }}>
          <MuiLink href="/scenario/" underline="hover">
            戻る
          </MuiLink>
        </Box>
      </Box>
    </Container>
  );
};

export default DetailPage;
