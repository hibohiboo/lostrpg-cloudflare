import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import React, { useState } from 'react';
import { TrophyCard, type Trophy } from './TrophyCard';

type Props = {
  open: boolean;
  onClose: () => void;
  trophies: readonly Trophy[];
  onSelect: (trophy: Trophy) => void;
  title: string;
};

export const TrophySelectionModal: React.FC<Props> = ({
  open,
  onClose,
  trophies,
  onSelect,
  title,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTrophies = trophies.filter((trophy) =>
    trophy.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSelect = (trophy: Trophy) => {
    onSelect(trophy);
    onClose();
    setSearchTerm('');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="検索"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          margin="normal"
        />
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 2,
            mt: 2,
          }}
        >
          {filteredTrophies.map((trophy) => (
            <TrophyCard
              key={trophy.id}
              trophy={trophy}
              onClick={() => handleSelect(trophy)}
            />
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};
