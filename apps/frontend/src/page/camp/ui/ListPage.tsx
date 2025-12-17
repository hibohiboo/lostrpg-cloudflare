import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Link as MuiLink,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { useListPageHooks } from '../hooks/useListPageHooks';

const ListPage: React.FC = () => {
  const {
    displayedCamps,
    isLoading,
    searchName,
    setSearchName,
    handleSearch,
    handleLoadMore,
    handleKeyPress,
    hasMore,
    ITEMS_PER_PAGE,
  } = useListPageHooks();

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h2" gutterBottom>
          キャンプ一覧
        </Typography>

        {/* 認証リンク */}
        <Box mt={2}>
          <MuiLink href="/camp/create" underline="hover">
            作成
          </MuiLink>
        </Box>

        {/* 検索フォーム */}
        <Box display="flex" alignItems="flex-end" mt={2} gap={1} maxWidth={400}>
          <TextField
            label="キャンプ名"
            variant="standard"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onKeyDown={handleKeyPress}
            fullWidth
            size="small"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            sx={{ minWidth: 'auto', px: 2 }}
          >
            <SearchIcon />
          </Button>
        </Box>

        {/* キャンプ一覧 */}
        <Box mt={3}>
          {isLoading && (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          )}

          {!isLoading && (
            <>
              <List
                sx={{
                  width: '100%',
                  maxWidth: 360,
                  bgcolor: 'background.paper',
                }}
                subheader={
                  <ListSubheader component="div">キャンプリスト</ListSubheader>
                }
              >
                {displayedCamps.map((camp) => (
                  <ListItemButton
                    key={camp.id}
                    component="a"
                    href={`/lostrpg/public/ja/camp?id=${camp.id}`}
                  >
                    <ListItemText primary={camp.name} />
                  </ListItemButton>
                ))}
              </List>

              {/* もっと読み込むボタン */}
              {hasMore && (
                <Box mt={2}>
                  <Button variant="outlined" onClick={handleLoadMore}>
                    次の{ITEMS_PER_PAGE}件
                  </Button>
                </Box>
              )}

              {/* 結果が0件の場合 */}
              {displayedCamps.length === 0 && !isLoading && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 2 }}
                >
                  キャンプが見つかりませんでした
                </Typography>
              )}
            </>
          )}
        </Box>

        {/* 戻るリンク */}
        <Box mt={4}>
          <MuiLink href="/lostrpg" underline="hover">
            戻る
          </MuiLink>
        </Box>
      </Box>
    </Container>
  );
};

export default ListPage;
