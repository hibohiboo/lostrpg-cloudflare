import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Grid,
  IconButton,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ItemBase } from '@lostrpg/schemas/validation/items';
import React, { useState } from 'react';
import { ItemCard } from './ItemCard';

type ItemSelectionModalProps = {
  open: boolean;
  onClose: () => void;
  items: readonly ItemBase[];
  onSelect: (item: ItemBase) => void;
  title?: string;
};

export const ItemSelectionModal: React.FC<ItemSelectionModalProps> = ({
  open,
  onClose,
  items,
  onSelect,
  title = 'アイテム選択',
}) => {
  const [searchText, setSearchText] = useState('');

  const filteredItems = items.filter((item) => {
    const search = searchText.toLowerCase();
    return (
      item.name.toLowerCase().includes(search) ||
      item.type.toLowerCase().includes(search) ||
      item.effect.toLowerCase().includes(search) ||
      item.trait.toLowerCase().includes(search)
    );
  });

  const handleSelect = (item: ItemBase) => {
    onSelect(item);
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {title}
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="アイテムを検索"
          variant="outlined"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{ mb: 2 }}
          autoFocus
        />
        <Grid container spacing={2}>
          {filteredItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.name}>
              <ItemCard item={item} onSelect={handleSelect} />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
