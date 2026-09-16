import { Box, Checkbox, FormControlLabel, TextField } from '@mui/material';
import React from 'react';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';
import { updateMotherlessCharacter } from '../../model/characterSlice';

export const SettingsSection: React.FC = () => {
  const dispatch = useAppDispatch();

  const password = useAppSelector(
    (state) => state.motherlessCharacter.password,
  );
  const hideFromList = useAppSelector(
    (state) => state.motherlessCharacter.hideFromList,
  );

  return (
    <Box sx={{ my: 2 }}>
      <TextField
        fullWidth
        type="password"
        label="パスワード（任意）"
        value={password || ''}
        onChange={(e) =>
          dispatch(updateMotherlessCharacter({ password: e.target.value }))
        }
        helperText="パスワードを設定すると、キャラクターの編集にパスワードが必要になります"
      />

      <Box sx={{ mt: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={hideFromList ?? false}
              onChange={(e) =>
                dispatch(
                  updateMotherlessCharacter({
                    hideFromList: e.target.checked,
                  }),
                )
              }
            />
          }
          label="一覧に表示しない"
        />
      </Box>
    </Box>
  );
};
