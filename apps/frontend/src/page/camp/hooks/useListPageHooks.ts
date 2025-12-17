import { useState } from 'react';
import { useGetCampListQuery } from '@lostrpg/frontend/entities/camp';

interface Camp {
  id: string;
  name: string;
}

export const useListPageHooks = () => {
  const [displayedCamps, setDisplayedCamps] = useState<Camp[]>([]);
  const [searchName, setSearchName] = useState('');
  const [displayCount, setDisplayCount] = useState(5);
  const ITEMS_PER_PAGE = 5;
  const { data: camps = [], isLoading } = useGetCampListQuery();

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
  return {
    displayedCamps,
    isLoading,
    searchName,
    setSearchName,
    handleSearch,
    handleLoadMore,
    handleKeyPress,
    hasMore,
    ITEMS_PER_PAGE,
  };
};
