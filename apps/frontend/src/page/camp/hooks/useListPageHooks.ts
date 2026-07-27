import { useEffect } from 'react';
import { useGetCampListQuery } from '@lostrpg/frontend/entities/camp';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';
import {
  selectSearchName,
  selectOffset,
  setSearchName,
  setOffset,
  ITEMS_PER_PAGE_CONSTANT,
} from '../model';
import { useDebouncedValue } from './useDebouncedValue';

const SEARCH_DEBOUNCE_MS = 400;

export const useListPageHooks = () => {
  const dispatch = useAppDispatch();
  const searchName = useAppSelector(selectSearchName);
  const offset = useAppSelector(selectOffset);
  const ITEMS_PER_PAGE = ITEMS_PER_PAGE_CONSTANT;

  // 検索語は入力のたびにAPIを叩かないよう、確定した値だけをクエリに渡す
  const appliedSearchName = useDebouncedValue(searchName, SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    dispatch(setOffset(0));
  }, [appliedSearchName, dispatch]);

  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetCampListQuery({
    offset,
    limit: ITEMS_PER_PAGE,
    name: appliedSearchName,
  });
  const { data: list = [], hasMore = false } = response ?? {};

  const isInitialLoading = isLoading || (offset === 0 && isFetching);

  // もっと読み込む
  const handleLoadMore = () => {
    dispatch(setOffset(offset + ITEMS_PER_PAGE));
  };

  const handleSetSearchName = (value: string) => {
    dispatch(setSearchName(value));
  };

  return {
    list,
    isLoading: isInitialLoading,
    searchName,
    setSearchName: handleSetSearchName,
    handleLoadMore,
    hasMore,
    itemsPerPage: ITEMS_PER_PAGE,
  };
};
