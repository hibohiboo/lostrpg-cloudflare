import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { useGetCampListQuery } from '@lostrpg/frontend/entities/camp';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';
import { setCampId, updateCharacter } from '../../model/characterSlice';

export const CharacterBasicSection: React.FC<{
  isValidError: boolean;
  onImageChange: (file: File | null) => void;
  previewUrl: string;
}> = ({ isValidError, onImageChange, previewUrl }) => {
  const dispatch = useAppDispatch();
  const playerName = useAppSelector((state) => state.character.playerName);
  const campId = useAppSelector((state) => state.character.campId);
  const name = useAppSelector((state) => state.character.name);
  const { data: camps = [] } = useGetCampListQuery();
  const useStrangeField = useAppSelector(
    (state) => state.character.supplements.useStrangeField,
  );
  const useDragonPlain = useAppSelector(
    (state) => state.character.supplements.useDragonPlain,
  );

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

      <Box my={3}>
        <Typography variant="h6" gutterBottom>
          使用サプリメント
        </Typography>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={useStrangeField}
                onChange={(e) =>
                  dispatch(
                    updateCharacter({
                      supplements: {
                        useStrangeField: e.target.checked,
                        useDragonPlain,
                      },
                    }),
                  )
                }
              />
            }
            label="終末列島百景"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={useDragonPlain}
                onChange={(e) =>
                  dispatch(
                    updateCharacter({
                      supplements: {
                        useStrangeField,
                        useDragonPlain: e.target.checked,
                      },
                    }),
                  )
                }
              />
            }
            label="関ヶ原暴竜平原"
          />
        </Box>
      </Box>
      <FormControl>
        <InputLabel id="camp-select-label">キャンプ</InputLabel>
        <Select
          value={campId}
          labelId="camp-select-label"
          label="キャンプ"
          onChange={(e: SelectChangeEvent) => {
            const { value } = e.target;
            dispatch(setCampId(value));
          }}
          sx={{ minWidth: 200, mb: 2 }}
        >
          <MenuItem value={''}>未選択</MenuItem>
          {camps.map((c) => (
            <MenuItem value={c.id} key={c.id}>
              {c.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* キャラクター名（必須） */}
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
