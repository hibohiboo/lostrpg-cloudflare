import { useGetCampListQuery } from '@lostrpg/frontend/entities/camp';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';
import {
  selectDisplayedCamps,
  selectSearchName,
  selectDisplayCount,
  selectCamps,
  setSearchName,
  setDisplayCount,
  ITEMS_PER_PAGE_CONSTANT,
} from '../model';

export const useListPageHooks = () => {
  const dispatch = useAppDispatch();
  const displayedCamps = useAppSelector(selectDisplayedCamps);
  const searchName = useAppSelector(selectSearchName);
  const displayCount = useAppSelector(selectDisplayCount);
  const camps = useAppSelector(selectCamps);
  const ITEMS_PER_PAGE = ITEMS_PER_PAGE_CONSTANT;
  const { isLoading } = useGetCampListQuery();

  // もっと読み込む
  const handleLoadMore = () => {
    const newCount = displayCount + ITEMS_PER_PAGE;
    dispatch(setDisplayCount(newCount));
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
    handleLoadMore,
    hasMore,
    ITEMS_PER_PAGE,
  };
};
