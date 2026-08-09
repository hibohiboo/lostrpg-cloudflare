import { useGetBossListQuery } from '@lostrpg/frontend/entities/boss';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';
import {
  selectSearchInput,
  selectAppliedSearchName,
  selectOffset,
  setSearchInput,
  submitSearch,
  setOffset,
  ITEMS_PER_PAGE_CONSTANT,
} from '../model';

export const useListPageHooks = () => {
  const dispatch = useAppDispatch();
  const searchInput = useAppSelector(selectSearchInput);
  const appliedSearchName = useAppSelector(selectAppliedSearchName);
  const offset = useAppSelector(selectOffset);
  const ITEMS_PER_PAGE = ITEMS_PER_PAGE_CONSTANT;

  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetBossListQuery({
    offset,
    limit: ITEMS_PER_PAGE,
    name: appliedSearchName,
  });
  const { data: list = [], hasMore = false } = response ?? {};

  const isInitialLoading = isLoading || (offset === 0 && isFetching);
  const isLoadingMore = offset > 0 && isFetching;

  // もっと読み込む
  const handleLoadMore = () => {
    dispatch(setOffset(offset + ITEMS_PER_PAGE));
  };

  const handleSetSearchName = (value: string) => {
    dispatch(setSearchInput(value));
  };

  // 検索ボタン押下 or Enterで検索を確定する
  const handleSearchSubmit = () => {
    dispatch(submitSearch());
  };

  return {
    list,
    isLoading: isInitialLoading,
    isLoadingMore,
    searchName: searchInput,
    setSearchName: handleSetSearchName,
    handleSearchSubmit,
    handleLoadMore,
    hasMore,
    itemsPerPage: ITEMS_PER_PAGE,
  };
};
