/* eslint-disable complexity */
import { Box, TextField, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router';
import { useGetCampQuery } from '@lostrpg/frontend/entities/camp';
import { setRecordTitle } from '@lostrpg/frontend/entities/record';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';
import { updateCharacter } from '../../model/characterSlice';

export const CharacterBasicSection: React.FC<{
  isValidError: boolean;
  onImageChange: (file: File | null) => void;
  previewUrl: string;
}> = ({ isValidError }) => {
  const dispatch = useAppDispatch();
  const playerName = useAppSelector((state) => state.character.playerName);
  const campId = useAppSelector((state) => state.character.campId);
  const name = useAppSelector((state) => state.character.name);
  const title = useAppSelector((state) => state.record.title);
  const { data: camp } = useGetCampQuery(campId || '', {
    skip: !campId,
  });

  return (
    <>
      {playerName && (
        <Box my={2}>
          <TextField
            disabled
            fullWidth
            label="プレイヤー名"
            value={playerName}
          />
        </Box>
      )}
      {camp?.name && (
        <Box mb={3}>
          <Typography variant="body1" color="text.secondary">
            キャンプ:
            <Link to={`/camp/${campId}`} style={{ color: '#00f' }}>
              {camp.name}
            </Link>
          </Typography>
        </Box>
      )}

      <Box my={2}>
        <TextField
          fullWidth
          required
          label="キャラクター名"
          error={!name && isValidError}
          helperText={!name && isValidError ? 'キャラクター名は必須です' : ''}
          value={name}
          onChange={(e) => dispatch(updateCharacter({ name: e.target.value }))}
        />
      </Box>
      <Box my={2}>
        <TextField
          fullWidth
          required
          label="シナリオタイトル"
          error={!title && isValidError}
          helperText={
            !title && isValidError ? 'シナリオタイトルは必須です' : ''
          }
          value={title}
          onChange={(e) => dispatch(setRecordTitle(e.target.value))}
        />
      </Box>
    </>
  );
};
