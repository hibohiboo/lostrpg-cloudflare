import { Box, TextField } from '@mui/material';
import React from 'react';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';
import { updateMotherlessCharacter } from '../../model/characterSlice';

export const DescriptionSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const summary = useAppSelector(
    (state) => state.motherlessCharacter.summary,
  );
  const appearance = useAppSelector(
    (state) => state.motherlessCharacter.appearance,
  );
  const freeWriting = useAppSelector(
    (state) => state.motherlessCharacter.freeWriting,
  );
  const quote = useAppSelector((state) => state.motherlessCharacter.quote);

  return (
    <>
      <Box sx={{ my: 2 }}>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="概要"
          value={summary}
          onChange={(e) =>
            dispatch(updateMotherlessCharacter({ summary: e.target.value }))
          }
        />
      </Box>

      <Box sx={{ my: 2 }}>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="容姿"
          value={appearance}
          onChange={(e) =>
            dispatch(
              updateMotherlessCharacter({ appearance: e.target.value }),
            )
          }
        />
      </Box>

      <Box sx={{ my: 2 }}>
        <TextField
          fullWidth
          multiline
          rows={5}
          label="設定"
          value={freeWriting}
          onChange={(e) =>
            dispatch(
              updateMotherlessCharacter({ freeWriting: e.target.value }),
            )
          }
        />
      </Box>

      <Box sx={{ my: 2 }}>
        <TextField
          fullWidth
          label="セリフ"
          value={quote}
          onChange={(e) =>
            dispatch(updateMotherlessCharacter({ quote: e.target.value }))
          }
        />
      </Box>
    </>
  );
};
