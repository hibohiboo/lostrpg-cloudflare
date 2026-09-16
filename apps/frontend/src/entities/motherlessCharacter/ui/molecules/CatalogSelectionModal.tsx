import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { CatalogCard } from './CatalogCard';

type Props<T extends { name: string }> = {
  open: boolean;
  onClose: () => void;
  catalog: readonly T[];
  onSelect: (entry: T) => void;
  title: string;
  getSearchText: (entry: T) => string;
  renderDetails: (entry: T) => React.ReactNode;
};

export const CatalogSelectionModal = <T extends { name: string }>({
  open,
  onClose,
  catalog,
  onSelect,
  title,
  getSearchText,
  renderDetails,
}: Props<T>) => {
  const [searchText, setSearchText] = useState('');

  const filtered = catalog.filter((entry) =>
    getSearchText(entry).toLowerCase().includes(searchText.toLowerCase()),
  );

  const handleSelect = (entry: T) => {
    onSelect(entry);
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
          label="検索"
          variant="outlined"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{ mb: 2 }}
          autoFocus
        />
        {catalog.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            スプレッドシートからデータを取得できませんでした
          </Typography>
        )}
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
          {filtered.map((entry, index) => (
            <CatalogCard key={`${entry.name}-${index}`} entry={entry} name={entry.name} onSelect={handleSelect}>
              {renderDetails(entry)}
            </CatalogCard>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};
