import { Box, Button, InputLabel, TextField, Typography } from '@mui/material';
import React from 'react';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';
import { updateCharacter } from '../../model/characterSlice';

export const CharacterBasicSection: React.FC<{
  isValidError: boolean;
  onImageChange: (file: File | null) => void;
  previewUrl: string;
}> = ({ isValidError, onImageChange, previewUrl }) => {
  const dispatch = useAppDispatch();
  const playerName = useAppSelector((state) => state.character.playerName);
  const name = useAppSelector((state) => state.character.name);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageChange(file);
    }
  };

  return (
    <>
      {/* プレイヤー名 */}
      <Box my={2}>
        <TextField
          fullWidth
          label="プレイヤー名"
          value={playerName}
          onChange={(e) =>
            dispatch(updateCharacter({ playerName: e.target.value }))
          }
        />
      </Box>

      {/* キャラクター名（必須） */}
      <Box my={2}>
        <TextField
          fullWidth
          required
          label="キャラクター名"
          error={!name && isValidError}
          helperText={!name && isValidError ? 'キャラクター名は必須です' : ''}
          value={name}
          onChange={(e) =>
            dispatch(updateCharacter({ name: e.target.value }))
          }
        />
      </Box>

      {/* 画像アップロード */}
      <Box my={2}>
        <InputLabel>画像</InputLabel>
        <Box
          border={1}
          borderColor="grey.300"
          borderRadius={1}
          p={2}
          mt={1}
          sx={{ maxWidth: 480, minHeight: 100, overflow: 'hidden' }}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="プレビュー"
              style={{ width: '100%', display: 'block' }}
            />
          ) : (
            <Typography color="text.secondary">画像未選択</Typography>
          )}
        </Box>
        <Button component="label" variant="outlined" sx={{ mt: 1 }}>
          画像を選択
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />
        </Button>
      </Box>
    </>
  );
};
