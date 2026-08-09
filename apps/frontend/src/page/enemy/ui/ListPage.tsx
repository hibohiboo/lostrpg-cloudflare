import SearchIcon from '@mui/icons-material/Search';
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Link as MuiLink,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { Link, useNavigate } from 'react-router';
import { ENEMY_TYPES } from '@lostrpg/frontend/entities/enemy';
import { useListPageHooks } from '../hooks/useListPageHooks';

const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    list,
    isLoading,
    isLoadingMore,
    searchName,
    setSearchName,
    handleSearchSubmit,
    typeFilter,
    setTypeFilter,
    levelSortOrder,
    handleToggleLevelSort,
    handleLoadMore,
    hasMore,
    itemsPerPage,
  } = useListPageHooks();

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          エネミー一覧
        </Typography>

        <Box sx={{ mt: 2 }}>
          <MuiLink component={Link} to="/enemy/create" underline="hover">
            作成
          </MuiLink>
        </Box>

        {/* 検索フォーム（ボタン押下 or Enterで検索を実行） */}
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearchSubmit();
          }}
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            mt: 2,
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: 1,
              maxWidth: 400,
              flexGrow: 1,
            }}
          >
            <TextField
              label="名前で絞り込み"
              variant="standard"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              fullWidth
              size="small"
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

          {/* タイプで絞り込み（選択と同時に確定） */}
          <TextField
            select
            label="タイプで絞り込み"
            variant="standard"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            size="small"
            sx={{ width: 180 }}
          >
            <MenuItem value="">すべて</MenuItem>
            {ENEMY_TYPES.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* 一覧 */}
        <Box sx={{ mt: 3 }}>
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          )}

          {!isLoading && (
            <>
              {list.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ width: 48 }} />
                        <TableCell sx={{ fontWeight: 600 }}>名前</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          <TableSortLabel
                            active={levelSortOrder !== null}
                            direction={levelSortOrder ?? 'asc'}
                            onClick={handleToggleLevelSort}
                          >
                            レベル
                          </TableSortLabel>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>タイプ</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          体力
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          気力
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>特技</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                          アビリティ
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {list.map((enemy) => (
                        <TableRow
                          key={enemy.id}
                          hover
                          onClick={() => navigate(`/enemy/${enemy.id}`)}
                          sx={{ cursor: 'pointer' }}
                        >
                          <TableCell>
                            {enemy.imageUrl ? (
                              <Avatar
                                src={enemy.imageUrl}
                                alt={enemy.name}
                                variant="rounded"
                                sx={{ width: 32, height: 32 }}
                              />
                            ) : (
                              <Avatar
                                variant="rounded"
                                sx={{
                                  width: 32,
                                  height: 32,
                                  bgcolor: 'grey.100',
                                  fontSize: '1rem',
                                }}
                              >
                                👾
                              </Avatar>
                            )}
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                            {enemy.name}
                          </TableCell>
                          <TableCell align="right">{enemy.level}</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>
                            {enemy.type ?? '-'}
                          </TableCell>
                          <TableCell align="right">{enemy.stamina}</TableCell>
                          <TableCell align="right">{enemy.willPower}</TableCell>
                          <TableCell sx={{ minWidth: 200 }}>
                            {enemy.specialties.length > 0 ? (
                              <Box
                                sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}
                              >
                                {enemy.specialties.map((s) => (
                                  <Chip
                                    key={s}
                                    label={s}
                                    size="small"
                                    variant="outlined"
                                  />
                                ))}
                              </Box>
                            ) : (
                              '-'
                            )}
                          </TableCell>
                          <TableCell sx={{ minWidth: 200 }}>
                            {enemy.abilities.length > 0 ? (
                              <Box
                                sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}
                              >
                                {enemy.abilities.map((a) => (
                                  <Chip
                                    key={a}
                                    label={a}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                  />
                                ))}
                              </Box>
                            ) : (
                              '-'
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  データが見つかりませんでした
                </Typography>
              )}

              {/* もっと読み込むボタン */}
              {hasMore && (
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
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
        <Box sx={{ mt: 4 }}>
          <MuiLink href="/" underline="hover">
            戻る
          </MuiLink>
        </Box>
      </Box>
    </Container>
  );
};

export default ListPage;
