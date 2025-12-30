/* eslint-disable complexity */
import { CreateCharacterRequest } from '@lostrpg/schemas';
import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Button,
  Chip,
  Container,
  InputLabel,
  Link as MuiLink,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { Link, useParams } from 'react-router';
import { AbilityTable } from '@lostrpg/frontend/entities/ability';
import { BackboneTable } from '@lostrpg/frontend/entities/backbone';
import { useGetCampQuery } from '@lostrpg/frontend/entities/camp';
import { ItemTable, EquipmentTable } from '@lostrpg/frontend/entities/item';
import { useAppSelector } from '@lostrpg/frontend/shared/lib/store';
import { SpecialtiesTable } from '@lostrpg/frontend/shared/ui';

type Character = CreateCharacterRequest;

// CharacterInfo表示コンポーネント
const CharacterInfo: React.FC<{
  character: Character;
  id: string;
  campName?: string;
}> = ({ character, id, campName }) => (
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

    {/* キャンプ */}
    {campName && (
      <Box mb={3}>
        <Typography variant="body1" color="text.secondary">
          キャンプ: {campName}
        </Typography>
      </Box>
    )}

    {/* サプリメント */}
    {(character.supplements?.useStrangeField ||
      character.supplements?.useDragonPlain) && (
      <Box mb={3}>
        <InputLabel sx={{ mb: 1 }}>使用サプリメント</InputLabel>
        <Box display="flex" flexWrap="wrap" gap={1}>
          {character.supplements.useStrangeField && (
            <Chip label="終末列島百景" variant="outlined" />
          )}
          {character.supplements.useDragonPlain && (
            <Chip label="関ヶ原暴竜平原" variant="outlined" />
          )}
        </Box>
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

// CharacterClasses表示コンポーネント
const CharacterClasses: React.FC<{ character: Character }> = ({
  character,
}) => (
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
);

// CharacterSpecialties表示コンポーネント
const CharacterSpecialties: React.FC<{ character: Character }> = ({
  character,
}) => (
  <>
    <Box my={3}>
      <InputLabel sx={{ mb: 1 }}>専門特技</InputLabel>
      <SpecialtiesTable
        specialties={character.specialties || []}
        gaps={character.gaps || []}
        damagedSpecialties={character.damagedSpecialties || []}
        readOnly
      />
    </Box>

    <Box my={3}>
      <InputLabel sx={{ mb: 1 }}>選択された専門特技</InputLabel>
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
  </>
);

// CharacterStats表示コンポーネント
const CharacterStats: React.FC<{ character: Character }> = ({ character }) => (
  <>
    <CharacterClasses character={character} />
    <CharacterSpecialties character={character} />

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

// CharacterAbilities表示コンポーネント
const CharacterAbilities: React.FC<{ character: Character }> = ({
  character,
}) => (
  <>
    {character.abilities && character.abilities.length > 0 && (
      <Box my={3}>
        <Typography variant="h6" gutterBottom>
          アビリティ
        </Typography>
        <Box sx={{ width: '100%' }}>
          <AbilityTable
            abilities={character.abilities}
            handleAbilityDelete={() => {}}
            handleAbilityUpdate={(row) => row}
          />
        </Box>
      </Box>
    )}
  </>
);

// CharacterItems表示コンポーネント
const CharacterItems: React.FC<{ character: Character }> = ({ character }) => (
  <>
    {character.items && character.items.length > 0 && (
      <Box my={3}>
        <Typography variant="h6" gutterBottom>
          アイテム
        </Typography>
        <Box sx={{ width: '100%' }}>
          <ItemTable
            items={character.items.map((item) => ({
              ...item,
              number: item.number ?? 1,
            }))}
            handleItemDelete={() => {}}
            handleItemUpdate={(row) => row}
          />
        </Box>
      </Box>
    )}

    {character.equipments && character.equipments.length > 0 && (
      <Box my={3}>
        <Typography variant="h6" gutterBottom>
          装備
        </Typography>
        <Box sx={{ width: '100%' }}>
          <EquipmentTable
            items={character.equipments}
            handleItemDelete={() => {}}
            handleItemUpdate={(row) => row}
          />
        </Box>
      </Box>
    )}

    {character.bags && character.bags.length > 0 && (
      <Box my={3}>
        <Typography variant="h6" gutterBottom>
          袋
        </Typography>
        {character.bags.map((bag) => (
          <Box
            key={bag.id}
            my={2}
            p={2}
            component={Paper}
            sx={{ borderRadius: 1 }}
          >
            <Typography variant="subtitle1" gutterBottom>
              {bag.name}
            </Typography>
            <Box display="flex" gap={2} mb={2}>
              <TextField
                label="袋容量"
                value={bag.capacity}
                size="small"
                slotProps={{ input: { readOnly: true } }}
                sx={{ width: 150 }}
              />
            </Box>
            {bag.items && bag.items.length > 0 && (
              <ItemTable
                items={bag.items.map((item) => ({
                  ...item,
                  number: item.number ?? 1,
                }))}
                handleItemDelete={() => {}}
                handleItemUpdate={(row) => row}
              />
            )}
          </Box>
        ))}
      </Box>
    )}
  </>
);

// CharacterBackbones表示コンポーネント
const CharacterBackbones: React.FC<{ character: Character }> = ({
  character,
}) => {
  if (
    !character.supplements?.useStrangeField ||
    !character.backbones ||
    character.backbones.length === 0
  ) {
    return null;
  }

  return (
    <Box my={3}>
      <Typography variant="h6" gutterBottom>
        背景
      </Typography>
      <Box sx={{ width: '100%' }}>
        <BackboneTable
          backbones={character.backbones}
          handleBackboneDelete={() => {}}
          handleBackboneUpdate={(row) => row}
        />
      </Box>
    </Box>
  );
};

// CharacterTrophies表示コンポーネント
const CharacterTrophies: React.FC<{ character: Character }> = ({
  character,
}) => {
  if (
    !character.supplements?.useStrangeField ||
    !character.trophies ||
    character.trophies.length === 0
  ) {
    return null;
  }

  return (
    <Box my={3}>
      <Typography variant="h6" gutterBottom>
        称号
      </Typography>
      <List>
        {character.trophies.map((trophy, index) => (
          <ListItem key={index}>
            <ListItemText primary={trophy} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

// CharacterStatusAilments表示コンポーネント
const CharacterStatusAilments: React.FC<{ character: Character }> = ({
  character,
}) => {
  if (!character.statusAilments || character.statusAilments.length === 0) {
    return null;
  }

  return (
    <Box my={3}>
      <Typography variant="h6" gutterBottom>
        状態異常
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={1}>
        {character.statusAilments.map((ailment, index) => (
          <Chip key={index} label={ailment} color="warning" />
        ))}
      </Box>
    </Box>
  );
};

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
  const character = useAppSelector((state) => state.character);
  const campId = character?.campId || '';
  const { data: camp } = useGetCampQuery(campId, {
    skip: !campId,
  });

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <CharacterInfo character={character} id={id!} campName={camp?.name} />
        <CharacterStats character={character} />
        <CharacterAbilities character={character} />
        <CharacterItems character={character} />
        <CharacterBackbones character={character} />
        <CharacterTrophies character={character} />
        <CharacterStatusAilments character={character} />
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
