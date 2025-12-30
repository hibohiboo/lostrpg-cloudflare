import { trophyList } from '@lostrpg/core/game-data/character';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';
import { TrophySelectionModal } from '@lostrpg/frontend/shared/ui/components/molecules/TrophySelectionModal';
import { addTrophy, deleteTrophy } from '../../model/characterSlice';
import type { Trophy } from '@lostrpg/frontend/shared/ui/components/molecules/TrophyCard';

export const TrophiesSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const trophies = useAppSelector((state) => state.character.trophies);
  const useStrangeField = useAppSelector(
    (state) => state.character.useStrangeField,
  );
  const [modalOpen, setModalOpen] = useState(false);
  const handleAdd = (trophy: Trophy) => {
    dispatch(addTrophy(trophy.name));
  };

  const handleDelete = (trophy: string) => {
    dispatch(deleteTrophy(trophy));
  };
  if (!useStrangeField) {
    return null;
  }
  return (
    <Box my={3}>
      <Typography variant="h6" gutterBottom>
        称号
      </Typography>
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => setModalOpen(true)}
        sx={{ mb: 2 }}
      >
        追加
      </Button>

      {trophies.length > 0 ? (
        <List>
          {trophies.map((trophy) => (
            <ListItem
              key={trophy}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDelete(trophy)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={trophy} />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="text.secondary">
          なし
        </Typography>
      )}

      <TrophySelectionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        trophies={trophyList}
        onSelect={handleAdd}
        title="トロフィーを選択"
      />
    </Box>
  );
};
