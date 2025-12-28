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
import { useGetCharacterQuery } from '@lostrpg/frontend/entities/character';

type Character = NonNullable<
  ReturnType<typeof useGetCharacterQuery>['data']
>;

// CharacterInfo表示コンポーネント
const CharacterInfo: React.FC<{ character: Character; id: string }> = ({
  character,
  id,
}) => (
  <>
    {/* タイトルと編集ボタン */}
    <Box mb={2} display="flex" alignItems="center" gap={2}>
      <Typography variant="h4" component="h1">
        {character.name}
      </Typography>
      <Link to={`/character/${id}/edit`}>
        <Button variant="outlined" startIcon={<EditIcon />} size="small">
          編集
        </Button>
      </Link>
    </Box>

    {/* プレイヤー名 */}
    {character.playerName && (
      <Box mb={3}>
        <Typography variant="body1" color="text.secondary">
          プレイヤー: {character.playerName}
        </Typography>
      </Box>
    )}

    {/* 画像と概要 */}
    <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
      {character.imageUrl && (
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
      )}

      {character.summary && character.summary.trim() && (
        <Box sx={{ minWidth: 320, flex: 1 }}>
          <InputLabel sx={{ mb: 1 }}>概要</InputLabel>
          <Box
            component={Paper}
            p={2}
            sx={{
              whiteSpace: 'pre-wrap',
            }}
          >
            <Typography variant="body1">{character.summary}</Typography>
          </Box>
        </Box>
      )}
    </Box>
  </>
);

// CharacterStats表示コンポーネント
const CharacterStats: React.FC<{ character: Character }> = ({ character }) => (
  <>
    {/* クラス */}
    <Box my={3}>
      <InputLabel sx={{ mb: 1 }}>クラス</InputLabel>
      <Box display="flex" flexWrap="wrap" gap={1}>
        {character.classes && character.classes.length > 0 ? (
          character.classes.map((cls: { name: string }, index: number) => (
            <Chip key={index} label={cls.name} color="primary" />
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            クラスが設定されていません
          </Typography>
        )}
      </Box>
    </Box>

    {/* 専門特技 */}
    <Box my={3}>
      <InputLabel sx={{ mb: 1 }}>専門特技</InputLabel>
      <Box display="flex" flexWrap="wrap" gap={1}>
        {character.specialties && character.specialties.length > 0 ? (
          character.specialties.map((specialty: string, index: number) => (
            <Chip key={index} label={specialty} variant="outlined" />
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            専門特技が設定されていません
          </Typography>
        )}
      </Box>
    </Box>

    {/* 能力値 */}
    <Box display="flex" gap={2} my={3} maxWidth={600} flexWrap="wrap">
      <TextField
        label="スタミナ基本値"
        value={character.staminaBase}
        type="number"
        slotProps={{ input: { readOnly: true } }}
        sx={{ flex: 1, minWidth: 120 }}
      />
      <TextField
        label="現在スタミナ"
        value={character.stamina}
        type="number"
        slotProps={{ input: { readOnly: true } }}
        sx={{ flex: 1, minWidth: 120 }}
      />
      <TextField
        label="意志力基本値"
        value={character.willPowerBase}
        type="number"
        slotProps={{ input: { readOnly: true } }}
        sx={{ flex: 1, minWidth: 120 }}
      />
      <TextField
        label="現在意志力"
        value={character.willPower}
        type="number"
        slotProps={{ input: { readOnly: true } }}
        sx={{ flex: 1, minWidth: 120 }}
      />
    </Box>

    {/* 経験値 */}
    <Box display="flex" gap={2} my={3} maxWidth={400}>
      <TextField
        label="未使用経験値"
        value={character.unusedExperience}
        type="number"
        slotProps={{ input: { readOnly: true } }}
        sx={{ flex: 1 }}
      />
      <TextField
        label="合計経験値"
        value={character.totalExperience}
        type="number"
        slotProps={{ input: { readOnly: true } }}
        sx={{ flex: 1 }}
      />
    </Box>
  </>
);

// CharacterNotes表示コンポーネント
const CharacterNotes: React.FC<{ character: Character }> = ({ character }) => (
  <>
    {character.appearance && (
      <Box my={3}>
        <InputLabel sx={{ mb: 1 }}>外見</InputLabel>
        <Box
          component={Paper}
          p={2}
          sx={{ whiteSpace: 'pre-wrap', minWidth: 320 }}
        >
          <Typography variant="body1">{character.appearance}</Typography>
        </Box>
      </Box>
    )}

    {character.freeWriting && (
      <Box my={3}>
        <InputLabel sx={{ mb: 1 }}>メモ</InputLabel>
        <Box
          component={Paper}
          p={2}
          sx={{ whiteSpace: 'pre-wrap', minWidth: 320 }}
        >
          <Typography variant="body1">{character.freeWriting}</Typography>
        </Box>
      </Box>
    )}

    {character.quote && (
      <Box my={3}>
        <InputLabel sx={{ mb: 1 }}>名言</InputLabel>
        <Box
          component={Paper}
          p={2}
          sx={{ whiteSpace: 'pre-wrap', minWidth: 320 }}
        >
          <Typography variant="body1" fontStyle="italic">
            「{character.quote}」
          </Typography>
        </Box>
      </Box>
    )}
  </>
);

const DetailPage: React.FC = () => {
  const { id } = useParams();
  const { data: character, isLoading } = useGetCharacterQuery(id!);

  if (isLoading || !character) {
    return (
      <Container maxWidth="lg">
        <Box my={4}>
          <Typography>読み込み中...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <CharacterInfo character={character} id={id!} />
        <CharacterStats character={character} />
        <CharacterNotes character={character} />

        {/* 戻るリンク */}
        <Box mt={4}>
          <MuiLink href="/character/" underline="hover">
            戻る
          </MuiLink>
        </Box>
      </Box>
    </Container>
  );
};

export default DetailPage;
