import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Grid,
  Link as MuiLink,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';

interface Prop {
  list: { name: string; id: string; imageUrl?: string }[];
  isLoading: boolean;
  isLoadingMore?: boolean;
  searchName: string;
  setSearchName: (name: string) => void;
  handleLoadMore: () => void;
  hasMore: boolean;
  itemsPerPage: number;
  title: string;
  createPath: string;
  detailPathPrefix: string;
  fallbackIcon?: string;
}

const ListPage: React.FC<Prop> = (props) => {
  const {
    list,
    isLoading,
    isLoadingMore = false,
    searchName,
    setSearchName,
    handleLoadMore,
    hasMore,
    itemsPerPage,
    title,
    createPath,
    detailPathPrefix,
    fallbackIcon = '❓',
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
            label="名前で絞り込み"
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
              {list.length > 0 ? (
                <Grid container spacing={3}>
                  {list.map((camp) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={camp.id}>
                      <Card
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 4,
                          },
                        }}
                      >
                        <CardActionArea
                          component="a"
                          href={`${detailPathPrefix}/${camp.id}`}
                          sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'stretch',
                            justifyContent: 'flex-start',
                          }}
                        >
                          {camp.imageUrl ? (
                            <CardMedia
                              component="img"
                              height="140"
                              image={camp.imageUrl}
                              alt={camp.name}
                              sx={{ objectFit: 'cover' }}
                            />
                          ) : (
                            <Box
                              height={140}
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              bgcolor="grey.100"
                              color="grey.400"
                            >
                              <Typography
                                variant="h3"
                                sx={{
                                  filter:
                                    fallbackIcon === '🎒'
                                      ? 'hue-rotate(120deg)'
                                      : undefined,
                                }}
                              >
                                {fallbackIcon}
                              </Typography>
                            </Box>
                          )}
                          <CardContent>
                            <Typography
                              gutterBottom
                              variant="h6"
                              component="div"
                              sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                color: 'text.primary',
                              }}
                            >
                              {camp.name}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 2 }}
                >
                  データが見つかりませんでした
                </Typography>
              )}

              {/* もっと読み込むボタン */}
              {hasMore && (
                <Box mt={4} display="flex" justifyContent="center">
                  <Button
                    variant="outlined"
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    startIcon={
                      isLoadingMore ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : undefined
                    }
                  >
                    {isLoadingMore ? '読み込み中...' : `次の${itemsPerPage}件`}
                  </Button>
                </Box>
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
