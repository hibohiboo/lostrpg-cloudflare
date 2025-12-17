import { useGetCampListQuery } from '@lostrpg/frontend/entities/camp';
import { useAppDispatch, useAppSelector } from '@lostrpg/frontend/shared/lib/store';
import {
  selectDisplayedCamps,
  selectSearchName,
  selectDisplayCount,
  setDisplayedCamps,
  setSearchName,
  setDisplayCount,
  ITEMS_PER_PAGE_CONSTANT,
} from '../model';

export const useListPageHooks = () => {
  const dispatch = useAppDispatch();
  const displayedCamps = useAppSelector(selectDisplayedCamps);
  const searchName = useAppSelector(selectSearchName);
  const displayCount = useAppSelector(selectDisplayCount);
  const ITEMS_PER_PAGE = ITEMS_PER_PAGE_CONSTANT;
  const { data: camps = [], isLoading } = useGetCampListQuery();

  // 検索処理
  const handleSearch = () => {
    if (searchName.trim() === '') {
      dispatch(setDisplayedCamps(camps.slice(0, displayCount)));
    } else {
      const filtered = camps.filter((camp) =>
        camp.name.toLowerCase().includes(searchName.toLowerCase()),
      );
      dispatch(setDisplayedCamps(filtered));
    }
  };

  // もっと読み込む
  const handleLoadMore = () => {
    const newCount = displayCount + ITEMS_PER_PAGE;
    dispatch(setDisplayCount(newCount));
    dispatch(setDisplayedCamps(camps.slice(0, newCount)));
  };

  // エンターキーで検索
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 検索名を更新する関数
  const handleSetSearchName = (value: string) => {
    dispatch(setSearchName(value));
  };

  const hasMore = displayCount < camps.length && searchName === '';
  return {
    displayedCamps,
    isLoading,
    searchName,
    setSearchName: handleSetSearchName,
    handleSearch,
    handleLoadMore,
    handleKeyPress,
    hasMore,
    ITEMS_PER_PAGE,
  };
};
