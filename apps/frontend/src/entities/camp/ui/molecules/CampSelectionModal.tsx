import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useGetCampListQuery } from '../../api/api';

const PAGE_SIZE = 20;

type CampSelectionModalProps = {
  open: boolean;
  onClose: () => void;
  selectedCampId: string;
  onSelect: (campId: string) => void;
};

export const CampSelectionModal: React.FC<CampSelectionModalProps> = ({
  open,
  onClose,
  selectedCampId,
  onSelect,
}) => {
  // Dialogは閉じると内容がアンマウントされるため、開くたびに検索語・ページ位置は初期状態に戻る
  const [searchInput, setSearchInput] = useState('');
  const [appliedSearchName, setAppliedSearchName] = useState('');
  const [offset, setOffset] = useState(0);

  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetCampListQuery(
    { offset, limit: PAGE_SIZE, name: appliedSearchName },
    { skip: !open },
  );
  const { data: camps = [], hasMore = false } = response ?? {};

  const handleSelect = (campId: string) => {
    onSelect(campId);
    onClose();
  };

  // 検索ボタン押下 or Enterで検索を確定する（DBアクセスを増やさないよう入力のたびには検索しない）
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSearchName(searchInput);
    setOffset(0);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          キャンプを選択
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSearchSubmit}
          display="flex"
          alignItems="flex-end"
          gap={1}
          sx={{ mt: 2, mb: 2 }}
        >
          <TextField
            label="キャンプ名で絞り込み"
            variant="standard"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            fullWidth
            size="small"
            autoFocus
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ minWidth: 'auto', px: 2 }}
          >
            <SearchIcon />
          </Button>
        </Box>
        <List disablePadding>
          <ListItemButton
            selected={selectedCampId === ''}
            onClick={() => handleSelect('')}
          >
            <ListItemText primary="未選択" />
          </ListItemButton>
          <Divider />
          {camps.map((camp) => (
            <ListItemButton
              key={camp.id}
              selected={camp.id === selectedCampId}
              onClick={() => handleSelect(camp.id)}
            >
              <ListItemAvatar>
                <Avatar src={camp.imageUrl} variant="rounded">
                  ⛺
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={camp.name} />
            </ListItemButton>
          ))}
        </List>

        {isLoading && (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        )}

        {!isLoading && camps.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            データが見つかりませんでした
          </Typography>
        )}

        {hasMore && (
          <Box mt={2} display="flex" justifyContent="center">
            <Button
              variant="outlined"
              disabled={isFetching}
              onClick={() => setOffset((prev) => prev + PAGE_SIZE)}
            >
              次の{PAGE_SIZE}件
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};
