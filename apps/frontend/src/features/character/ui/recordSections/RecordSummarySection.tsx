import { trophyList } from '@lostrpg/core/game-data/character';
import { Box, MenuItem, TextField, Typography } from '@mui/material';
import React from 'react';
import { updateRecord } from '@lostrpg/frontend/entities/record';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';

export const RecordSummarySection: React.FC = () => {
  const dispatch = useAppDispatch();
  const memo = useAppSelector((state) => state.record.memo);
  const exp = useAppSelector((state) => state.record.exp);
  const trophy = useAppSelector((state) => state.record.trophy);

  return (
    <Box my={3}>
      <Typography variant="h6" gutterBottom>
        セッション結果
      </Typography>
      <Box display="flex" gap={2} mb={2}>
        <TextField
          type="number"
          label="獲得経験点"
          value={exp}
          onChange={(e) =>
            dispatch(updateRecord({ exp: Number(e.target.value) }))
          }
          sx={{ width: 150 }}
        />
        <TextField
          select
          label="取得称号"
          value={trophy || ''}
          onChange={(e) => dispatch(updateRecord({ trophy: e.target.value }))}
          sx={{ minWidth: 200 }}
          helperText={trophyList.find((t) => t.name === trophy)?.description}
        >
          <MenuItem value="">なし</MenuItem>
          {trophyList.map((t) => (
            <MenuItem key={t.id} value={t.name}>
              {t.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Box my={2}>
        <TextField
          fullWidth
          multiline
          minRows={4}
          label="メモ・感想"
          value={memo || ''}
          onChange={(e) => dispatch(updateRecord({ memo: e.target.value }))}
        />
      </Box>
    </Box>
  );
};
