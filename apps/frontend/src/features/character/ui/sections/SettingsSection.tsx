import { Box, Checkbox, FormControlLabel, TextField } from '@mui/material';
import React from 'react';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';
import { updateCharacter } from '../../model/characterSlice';

export const SettingsSection: React.FC = () => {
  const dispatch = useAppDispatch();

  const password = useAppSelector((state) => state.character.password);
  const hideFromList = useAppSelector(
    (state) => state.character.hideFromList,
  );

  return (
    <>
      <Box sx={{ my: 2 }}>
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

        {/* 一覧に表示しない */}
        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={hideFromList ?? false}
                onChange={(e) =>
                  dispatch(
                    updateCharacter({ hideFromList: e.target.checked }),
                  )
                }
              />
            }
            label="一覧に表示しない"
          />
        </Box>
      </Box>
    </>
  );
};
