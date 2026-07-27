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
  InputAdornment,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useDebouncedValue } from '@lostrpg/frontend/shared/lib/hooks';
import { useGetCampListQuery } from '../../api/api';

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 400;

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
  const [searchText, setSearchText] = useState('');
  const [offset, setOffset] = useState(0);
  const debouncedSearchText = useDebouncedValue(searchText, SEARCH_DEBOUNCE_MS);

  // 検索語が確定したら表示ページを先頭に戻す（レンダー中に状態を調整する公式パターン）
  const [committedSearchText, setCommittedSearchText] =
    useState(debouncedSearchText);
  if (debouncedSearchText !== committedSearchText) {
    setCommittedSearchText(debouncedSearchText);
    setOffset(0);
  }

  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetCampListQuery(
    { offset, limit: PAGE_SIZE, name: debouncedSearchText },
    { skip: !open },
  );
  const { data: camps = [], hasMore = false } = response ?? {};

  const handleSelect = (campId: string) => {
    onSelect(campId);
    onClose();
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
        <TextField
          fullWidth
          label="キャンプ名で絞り込み"
          variant="outlined"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{ mt: 2, mb: 2 }}
          autoFocus
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            },
          }}
        />
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
