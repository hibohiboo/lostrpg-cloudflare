/* eslint-disable complexity */
import { Box, TextField } from '@mui/material';
import React from 'react';
import {
  setRecordTitle,
  updateRecord,
} from '@lostrpg/frontend/entities/record';
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
  const name = useAppSelector((state) => state.character.name);
  const title = useAppSelector((state) => state.record.title);
  const date = useAppSelector((state) => state.record.date);
  const gm = useAppSelector((state) => state.record.gm);

  return (
    <>
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

      <Box my={2}>
        <TextField
          fullWidth
          required
          label="シナリオ名"
          error={!title && isValidError}
          helperText={!title && isValidError ? 'シナリオ名は必須です' : ''}
          value={title}
          onChange={(e) => dispatch(setRecordTitle(e.target.value))}
        />
      </Box>
      <Box my={2}>
        <TextField
          fullWidth
          label="ゲームマスター名"
          value={gm}
          onChange={(e) => dispatch(updateRecord({ gm: e.target.value }))}
        />
      </Box>
      <Box my={2}>
        <TextField
          fullWidth
          label="日付"
          value={date}
          onChange={(e) => dispatch(updateRecord({ date: e.target.value }))}
        />
      </Box>
    </>
  );
};
