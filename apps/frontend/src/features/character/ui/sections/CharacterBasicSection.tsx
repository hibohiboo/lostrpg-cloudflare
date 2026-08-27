import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import {
  CampSelectionModal,
  useGetCampQuery,
} from '@lostrpg/frontend/entities/camp';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';
import { ImageUploadField } from '@lostrpg/frontend/shared/ui';
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
  const imageUrl = useAppSelector((state) => state.character.imageUrl);
  const useStrangeField = useAppSelector(
    (state) => state.character.supplements.useStrangeField,
  );
  const useDragonPlain = useAppSelector(
    (state) => state.character.supplements.useDragonPlain,
  );
  const hideFromList = useAppSelector(
    (state) => state.character.hideFromList,
  );

  const [isCampModalOpen, setCampModalOpen] = useState(false);
  const currentCampId = campId ?? '';
  // 選択中のキャンプ名を表示するためだけに1件取得する
  const { data: selectedCamp } = useGetCampQuery(currentCampId, {
    skip: !currentCampId,
  });
  // RTK Queryはskipに切り替わった後も直前の取得結果を保持し続けるため、
  // currentCampIdの有無で表示を明示的に出し分ける
  const selectedCampName = currentCampId ? selectedCamp?.name : undefined;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageChange(file);
    }
  };

  return (
    <>
      {/* プレイヤー名 */}
      <Box sx={{ my: 2 }}>
        <TextField
          fullWidth
          label="プレイヤー名"
          value={playerName}
          onChange={(e) =>
            dispatch(updateCharacter({ playerName: e.target.value }))
          }
        />
      </Box>

      <Box sx={{ my: 3 }}>
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
      <Box sx={{ my: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          キャンプ
        </Typography>
        <Button
          variant="outlined"
          onClick={() => setCampModalOpen(true)}
          sx={{ minWidth: 200 }}
        >
          {selectedCampName ?? '未選択'}
        </Button>
        <CampSelectionModal
          open={isCampModalOpen}
          onClose={() => setCampModalOpen(false)}
          selectedCampId={currentCampId}
          onSelect={(value) => dispatch(setCampId(value))}
        />
      </Box>

      {/* キャラクター名（必須） */}
      <Box sx={{ my: 2 }}>
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
      <ImageUploadField
        previewUrl={previewUrl}
        currentImageUrl={imageUrl}
        onImageChange={handleImageChange}
        containerHeight="auto"
        imageStyle={{ width: '100%', display: 'block' }}
      />

      {/* 一覧に表示しない */}
      <Box sx={{ my: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={hideFromList ?? false}
              onChange={(e) =>
                dispatch(updateCharacter({ hideFromList: e.target.checked }))
              }
            />
          }
          label="一覧に表示しない"
        />
      </Box>
    </>
  );
};
