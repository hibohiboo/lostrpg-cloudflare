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

interface Prop {
  list: { name: string; id: string }[];
  isLoading: boolean;
  searchName: string;
  setSearchName: (name: string) => void;
  handleLoadMore: () => void;
  hasMore: boolean;
  itemsPerPage: number;
  title: string;
  createPath: string;
  detailPathPrefix: string;
  listName: string;
}

const ListPage: React.FC<Prop> = (props) => {
  const {
    list,
    isLoading,
    searchName,
    setSearchName,
    handleLoadMore,
    hasMore,
    itemsPerPage,
    title,
    createPath,
    detailPathPrefix,
    listName,
  } = props;

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h2" gutterBottom>
          {title}
        </Typography>

        {/* 認証リンク */}
        <Box mt={2}>
          <MuiLink href={createPath} underline="hover">
            作成
          </MuiLink>
        </Box>

        {/* 検索フォーム */}
        <Box display="flex" alignItems="flex-end" mt={2} gap={1} maxWidth={400}>
          <TextField
            label="名前"
            variant="standard"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            fullWidth
            size="small"
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ minWidth: 'auto', px: 2 }}
          >
            <SearchIcon />
          </Button>
        </Box>

        {/* 一覧 */}
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
                  <ListSubheader component="div">{listName}</ListSubheader>
                }
              >
                {list.map((camp) => (
                  <ListItemButton
                    key={camp.id}
                    component="a"
                    href={`${detailPathPrefix}/${camp.id}`}
                  >
                    <ListItemText primary={camp.name} />
                  </ListItemButton>
                ))}
              </List>

              {/* もっと読み込むボタン */}
              {hasMore && (
                <Box mt={2}>
                  <Button variant="outlined" onClick={handleLoadMore}>
                    次の{itemsPerPage}件
                  </Button>
                </Box>
              )}

              {/* 結果が0件の場合 */}
              {list.length === 0 && !isLoading && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 2 }}
                >
                  データが見つかりませんでした
                </Typography>
              )}
            </>
          )}
        </Box>

        {/* 戻るリンク */}
        <Box mt={4}>
          <MuiLink href="/" underline="hover">
            戻る
          </MuiLink>
        </Box>
      </Box>
    </Container>
  );
};

export default ListPage;
