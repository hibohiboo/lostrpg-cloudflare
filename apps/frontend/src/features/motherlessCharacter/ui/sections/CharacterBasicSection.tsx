import { Box, TextField } from '@mui/material';
import React from 'react';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';
import { ImageUploadField } from '@lostrpg/frontend/shared/ui';
import { updateMotherlessCharacter } from '../../model/characterSlice';

export const CharacterBasicSection: React.FC<{
  isValidError: boolean;
  onImageChange: (file: File | null) => void;
  previewUrl: string;
}> = ({ isValidError, onImageChange, previewUrl }) => {
  const dispatch = useAppDispatch();
  const playerName = useAppSelector(
    (state) => state.motherlessCharacter.playerName,
  );
  const name = useAppSelector((state) => state.motherlessCharacter.name);
  const level = useAppSelector((state) => state.motherlessCharacter.level);
  const imageUrl = useAppSelector(
    (state) => state.motherlessCharacter.imageUrl,
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageChange(file);
    }
  };

  return (
    <>
      <Box sx={{ my: 2 }}>
        <TextField
          fullWidth
          label="プレイヤー名"
          value={playerName}
          onChange={(e) =>
            dispatch(updateMotherlessCharacter({ playerName: e.target.value }))
          }
        />
      </Box>

      <Box sx={{ my: 2 }}>
        <TextField
          fullWidth
          required
          label="キャラクター名"
          error={!name && isValidError}
          helperText={!name && isValidError ? 'キャラクター名は必須です' : ''}
          value={name}
          onChange={(e) =>
            dispatch(updateMotherlessCharacter({ name: e.target.value }))
          }
        />
      </Box>

      <Box sx={{ my: 2 }}>
        <TextField
          type="number"
          label="Lv"
          value={level}
          onChange={(e) =>
            dispatch(
              updateMotherlessCharacter({ level: Number(e.target.value) }),
            )
          }
          sx={{ width: 120 }}
        />
      </Box>

      <ImageUploadField
        previewUrl={previewUrl}
        currentImageUrl={imageUrl}
        onImageChange={handleImageChange}
        containerHeight="auto"
        imageStyle={{ width: '100%', display: 'block' }}
      />
    </>
  );
};
