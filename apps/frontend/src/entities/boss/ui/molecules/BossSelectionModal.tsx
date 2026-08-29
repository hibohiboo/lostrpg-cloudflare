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
import { useGetBossListQuery } from '../../api/api';

const PAGE_SIZE = 20;

type BossSelectionModalProps = {
  open: boolean;
  onClose: () => void;
  selectedBossId: string;
  onSelect: (bossId: string, bossName: string) => void;
};

export const BossSelectionModal: React.FC<BossSelectionModalProps> = ({
  open,
  onClose,
  selectedBossId,
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
  } = useGetBossListQuery(
    { offset, limit: PAGE_SIZE, name: appliedSearchName },
    { skip: !open },
  );
  const { data: bosses = [], hasMore = false } = response ?? {};

  const handleSelect = (bossId: string, bossName: string) => {
    onSelect(bossId, bossName);
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
          ヌシを選択
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, mt: 2, mb: 2 }}
        >
          <TextField
            label="ヌシ名で絞り込み"
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
            selected={selectedBossId === ''}
            onClick={() => handleSelect('', '')}
          >
            <ListItemText primary="未選択" />
          </ListItemButton>
          <Divider />
          {bosses.map((boss) => (
            <ListItemButton
              key={boss.id}
              selected={boss.id === selectedBossId}
              onClick={() => handleSelect(boss.id, boss.name)}
            >
              <ListItemAvatar>
                <Avatar src={boss.imageUrl} variant="rounded">
                  👹
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={boss.name} />
            </ListItemButton>
          ))}
        </List>

        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        )}

        {!isLoading && bosses.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            データが見つかりませんでした
          </Typography>
        )}

        {hasMore && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
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
