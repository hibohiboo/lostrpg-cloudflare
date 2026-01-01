import { Box, TextField, Typography } from '@mui/material';
import React from 'react';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';
import { setPassword } from '../../model/characterFormSlice';

export const PasswordSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const password = useAppSelector((state) => state.characterForm.password);

  return (
    <Box my={3}>
      <Typography variant="h6" gutterBottom>
        認証
      </Typography>
      <Box my={2}>
        <TextField
          fullWidth
          type="password"
          label="パスワード"
          value={password}
          onChange={(e) => dispatch(setPassword(e.target.value))}
          helperText="キャラクターがパスワード保護されている場合はそのパスワードを入力してください。"
        />
      </Box>
    </Box>
  );
};
