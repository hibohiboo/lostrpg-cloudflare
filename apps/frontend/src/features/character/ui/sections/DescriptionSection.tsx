import { Box, TextField } from '@mui/material';
import React from 'react';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';
import { updateCharacter } from '../../model/characterSlice';

export const DescriptionSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const summary = useAppSelector((state) => state.character.summary);
  const appearance = useAppSelector((state) => state.character.appearance);
  const freeWriting = useAppSelector((state) => state.character.freeWriting);
  const quote = useAppSelector((state) => state.character.quote);

  return (
    <>
      <Box my={2}>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="概要"
          value={summary}
          onChange={(e) =>
            dispatch(updateCharacter({ summary: e.target.value }))
          }
        />
      </Box>

      <Box my={2}>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="容姿"
          value={appearance}
          onChange={(e) =>
            dispatch(updateCharacter({ appearance: e.target.value }))
          }
        />
      </Box>

      <Box my={2}>
        <TextField
          fullWidth
          multiline
          rows={5}
          label="設定"
          value={freeWriting}
          onChange={(e) =>
            dispatch(updateCharacter({ freeWriting: e.target.value }))
          }
        />
      </Box>

      <Box my={2}>
        <TextField
          fullWidth
          label="セリフ"
          value={quote}
          onChange={(e) => dispatch(updateCharacter({ quote: e.target.value }))}
        />
      </Box>
    </>
  );
};
