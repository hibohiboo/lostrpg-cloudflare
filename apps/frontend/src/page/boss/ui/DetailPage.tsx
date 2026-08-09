import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Button,
  Container,
  InputLabel,
  Link as MuiLink,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { Link, useParams } from 'react-router';
import { AbilityTable } from '@lostrpg/frontend/entities/ability';
import { SpecialtiesSection } from '@lostrpg/frontend/features/boss';
import { useAppSelector } from '@lostrpg/frontend/shared/lib/store';

const DetailPage: React.FC = () => {
  const { id } = useParams();
  const boss = useAppSelector((state) => state.boss);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        {/* タイトルと編集ボタン */}
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4" component="h1">
            {boss.name}
          </Typography>
          <Link to={`/boss/${id}/edit`}>
            <Button variant="outlined" startIcon={<EditIcon />} size="small">
              編集
            </Button>
          </Link>
        </Box>

        {boss.appearance && (
          <Box sx={{ my: 3 }}>
            <InputLabel sx={{ mb: 1 }}>概要</InputLabel>
            <Box
              component={Paper}
              sx={{ p: 2, whiteSpace: 'pre-wrap', minWidth: 320 }}
            >
              <Typography variant="body1">{boss.appearance}</Typography>
            </Box>
          </Box>
        )}

        {/* 特技・ギャップ */}
        <SpecialtiesSection />

        {/* 能力値 */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            my: 3,
            maxWidth: 600,
            flexWrap: 'wrap',
          }}
        >
          <TextField
            label="レベル"
            value={boss.level}
            type="number"
            slotProps={{ input: { readOnly: true } }}
            sx={{ flex: 1, minWidth: 120 }}
          />
          <TextField
            label="体力"
            value={boss.stamina}
            type="number"
            slotProps={{ input: { readOnly: true } }}
            sx={{ flex: 1, minWidth: 120 }}
          />
          <TextField
            label="気力"
            value={boss.willPower}
            type="number"
            slotProps={{ input: { readOnly: true } }}
            sx={{ flex: 1, minWidth: 120 }}
          />
        </Box>

        {/* アビリティ */}
        {boss.abilities && boss.abilities.length > 0 && (
          <Box sx={{ my: 3 }}>
            <Typography variant="h6" gutterBottom>
              アビリティ
            </Typography>
            <Box sx={{ width: '100%' }}>
              <AbilityTable
                abilities={boss.abilities}
                handleAbilityDelete={() => {}}
                handleAbilityUpdate={(row) => row}
                hideActions={true}
              />
            </Box>
          </Box>
        )}

        {/* 戻るリンク */}
        <Box sx={{ mt: 4 }}>
          <MuiLink component={Link} to="/boss/" underline="hover">
            戻る
          </MuiLink>
        </Box>
      </Box>
    </Container>
  );
};

export default DetailPage;
