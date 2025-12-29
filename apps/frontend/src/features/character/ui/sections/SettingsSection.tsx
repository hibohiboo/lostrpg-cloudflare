import { Box, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';
import React from 'react';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';
import { updateCharacter } from '../../model/characterSlice';

export const SettingsSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const useStrangeField = useAppSelector(
    (state) => state.character.useStrangeField
  );
  const useDragonPlain = useAppSelector(
    (state) => state.character.useDragonPlain
  );
  const password = useAppSelector((state) => state.character.password);

  return (
    <>
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
                    updateCharacter({ useStrangeField: e.target.checked })
                  )
                }
              />
            }
            label="ストレンジフィールド"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={useDragonPlain}
                onChange={(e) =>
                  dispatch(
                    updateCharacter({ useDragonPlain: e.target.checked })
                  )
                }
              />
            }
            label="竜の平原"
          />
        </Box>
      </Box>

      <Box my={2}>
        <TextField
          fullWidth
          type="password"
          label="パスワード（任意）"
          value={password || ''}
          onChange={(e) =>
            dispatch(updateCharacter({ password: e.target.value }))
          }
          helperText="パスワードを設定すると、キャラクターの編集にパスワードが必要になります"
        />
      </Box>
    </>
  );
};
