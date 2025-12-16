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
interface Character {
  id: string;
  name: string;
}

// ダミーデータ
const DUMMY_CHARACTERS: Character[] = [
  { id: '1', name: '戦士ハンス' },
  { id: '2', name: '魔法使いリナ' },
  { id: '3', name: '僧侶マリア' },
  { id: '4', name: '盗賊キッド' },
  { id: '5', name: '騎士アーサー' },
  { id: '6', name: '弓使いロビン' },
  { id: '7', name: '賢者ガンダルフ' },
  { id: '8', name: '吟遊詩人ルーク' },
  { id: '9', name: '剣士サスケ' },
  { id: '10', name: '召喚士ユウナ' },
];

const ListPage: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [displayedCharacters, setDisplayedCharacters] = useState<Character[]>(
    [],
  );
  const [searchName, setSearchName] = useState('');
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(5);
  const ITEMS_PER_PAGE = 5;

  // 初回読み込み
  useEffect(() => {
    // ダミーデータを読み込む（実際はAPI呼び出し）
    setTimeout(() => {
      setCharacters(DUMMY_CHARACTERS);
      setDisplayedCharacters(DUMMY_CHARACTERS.slice(0, displayCount));
      setLoading(false);
    }, 500);
  }, [displayCount]);

  // 検索処理
  const handleSearch = () => {
    if (searchName.trim() === '') {
      setDisplayedCharacters(characters.slice(0, displayCount));
    } else {
      const filtered = characters.filter((character) =>
        character.name.toLowerCase().includes(searchName.toLowerCase()),
      );
      setDisplayedCharacters(filtered);
    }
  };

  // もっと読み込む
  const handleLoadMore = () => {
    const newCount = displayCount + ITEMS_PER_PAGE;
    setDisplayCount(newCount);
    setDisplayedCharacters(characters.slice(0, newCount));
  };

  // エンターキーで検索
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const hasMore = displayCount < characters.length && searchName === '';

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h2" gutterBottom>
          キャラクター一覧
        </Typography>

        {/* 認証リンク */}
        <Box mt={2}>
          <MuiLink href="/character/create" underline="hover">
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

        {/* キャラクター一覧 */}
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
                  <ListSubheader component="div">
                    キャラクターリスト
                  </ListSubheader>
                }
              >
                {displayedCharacters.map((character) => (
                  <ListItemButton
                    key={character.id}
                    component="a"
                    href={`/lostrpg/public/ja/characters/${character.id}`}
                  >
                    <ListItemText primary={character.name} />
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
              {displayedCharacters.length === 0 && !loading && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 2 }}
                >
                  キャラクターが見つかりませんでした
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
