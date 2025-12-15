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
import React, { useEffect, useState } from 'react';

// ダミーデータの型定義
interface Camp {
  id: string;
  name: string;
}

// ダミーデータ
const DUMMY_CAMPS: Camp[] = [
  { id: '1', name: 'ドラゴンの洞窟キャンプ' },
  { id: '2', name: '妖精の森ベースキャンプ' },
  { id: '3', name: '古代遺跡探索拠点' },
  { id: '4', name: '山岳地帯前線基地' },
  { id: '5', name: '海辺の休息所' },
  { id: '6', name: '魔法学院キャンプ' },
  { id: '7', name: '商人ギルドの宿場' },
  { id: '8', name: '冒険者の酒場付近' },
  { id: '9', name: '王都近郊野営地' },
  { id: '10', name: '辺境の監視所' },
];

const ListPage: React.FC = () => {
  const [camps, setCamps] = useState<Camp[]>([]);
  const [displayedCamps, setDisplayedCamps] = useState<Camp[]>([]);
  const [searchName, setSearchName] = useState('');
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(5);
  const ITEMS_PER_PAGE = 5;

  // 初回読み込み
  useEffect(() => {
    // ダミーデータを読み込む（実際はAPI呼び出し）
    setTimeout(() => {
      setCamps(DUMMY_CAMPS);
      setDisplayedCamps(DUMMY_CAMPS.slice(0, displayCount));
      setLoading(false);
    }, 500);
  }, [displayCount]);

  // 検索処理
  const handleSearch = () => {
    if (searchName.trim() === '') {
      setDisplayedCamps(camps.slice(0, displayCount));
    } else {
      const filtered = camps.filter((camp) =>
        camp.name.toLowerCase().includes(searchName.toLowerCase()),
      );
      setDisplayedCamps(filtered);
    }
  };

  // もっと読み込む
  const handleLoadMore = () => {
    const newCount = displayCount + ITEMS_PER_PAGE;
    setDisplayCount(newCount);
    setDisplayedCamps(camps.slice(0, newCount));
  };

  // エンターキーで検索
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const hasMore = displayCount < camps.length && searchName === '';

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
          {loading && (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          )}

          {!loading && (
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
              {displayedCamps.length === 0 && !loading && (
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
