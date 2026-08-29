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
import { useGetEnemyListQuery } from '../../api/api';

const PAGE_SIZE = 20;

type EnemySelectionModalProps = {
  open: boolean;
  onClose: () => void;
  selectedEnemyId: string;
  onSelect: (enemyId: string, enemyName: string) => void;
};

export const EnemySelectionModal: React.FC<EnemySelectionModalProps> = ({
  open,
  onClose,
  selectedEnemyId,
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
  } = useGetEnemyListQuery(
    { offset, limit: PAGE_SIZE, name: appliedSearchName },
    { skip: !open },
  );
  const { data: enemies = [], hasMore = false } = response ?? {};

  const handleSelect = (enemyId: string, enemyName: string) => {
    onSelect(enemyId, enemyName);
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
          エネミーを選択
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
            label="エネミー名で絞り込み"
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
            selected={selectedEnemyId === ''}
            onClick={() => handleSelect('', '')}
          >
            <ListItemText primary="未選択" />
          </ListItemButton>
          <Divider />
          {enemies.map((enemy) => (
            <ListItemButton
              key={enemy.id}
              selected={enemy.id === selectedEnemyId}
              onClick={() => handleSelect(enemy.id, enemy.name)}
            >
              <ListItemAvatar>
                <Avatar src={enemy.imageUrl} variant="rounded">
                  👾
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={enemy.name}
                secondary={[
                  enemy.type,
                  enemy.level ? `Lv.${enemy.level}` : undefined,
                ]
                  .filter(Boolean)
                  .join(' / ')}
              />
            </ListItemButton>
          ))}
        </List>

        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        )}

        {!isLoading && enemies.length === 0 && (
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
