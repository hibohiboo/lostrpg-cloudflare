import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from '@mui/material';
import React, { useState } from 'react';
import { BackboneCard } from './BackboneCard';
import type { Backbone } from '../../model/types';

type BackboneSelectionModalProps = {
  open: boolean;
  onClose: () => void;
  backbones: readonly Backbone[];
  onSelect: (backbone: Backbone) => void;
  title?: string;
};

export const BackboneSelectionModal: React.FC<BackboneSelectionModalProps> = ({
  open,
  onClose,
  backbones,
  onSelect,
  title = '背景選択',
}) => {
  const [searchText, setSearchText] = useState('');

  const filteredBackbones = backbones.filter((backbone) => {
    const search = searchText.toLowerCase();
    return (
      backbone.name.toLowerCase().includes(search) ||
      backbone.type.toLowerCase().includes(search) ||
      backbone.effect.toLowerCase().includes(search)
    );
  });

  const handleSelect = (backbone: Backbone) => {
    onSelect(backbone);
    onClose();
    setSearchText('');
  };

  const handleClose = () => {
    onClose();
    setSearchText('');
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {title}
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="背景を検索"
          variant="outlined"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{ mb: 2 }}
          autoFocus
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
          }}
        >
          {filteredBackbones.map((backbone, index) => (
            <BackboneCard
              key={`${backbone.name}-${index}`}
              backbone={backbone}
              onSelect={handleSelect}
            />
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};
