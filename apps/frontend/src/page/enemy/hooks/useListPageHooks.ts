import { useGetEnemyListQuery } from '@lostrpg/frontend/entities/enemy';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';
import {
  selectSearchInput,
  selectAppliedSearchName,
  selectTypeFilter,
  selectLevelSortOrder,
  selectOffset,
  setSearchInput,
  submitSearch,
  setTypeFilter,
  toggleLevelSort,
  setOffset,
  ITEMS_PER_PAGE_CONSTANT,
} from '../model';

export const useListPageHooks = () => {
  const dispatch = useAppDispatch();
  const searchInput = useAppSelector(selectSearchInput);
  const appliedSearchName = useAppSelector(selectAppliedSearchName);
  const typeFilter = useAppSelector(selectTypeFilter);
  const levelSortOrder = useAppSelector(selectLevelSortOrder);
  const offset = useAppSelector(selectOffset);
  const ITEMS_PER_PAGE = ITEMS_PER_PAGE_CONSTANT;

  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetEnemyListQuery({
    offset,
    limit: ITEMS_PER_PAGE,
    name: appliedSearchName,
    type: typeFilter || undefined,
    ...(levelSortOrder
      ? { sortBy: 'level' as const, sortOrder: levelSortOrder }
      : {}),
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

  // タイプで絞り込む（選択と同時に確定）
  const handleSetTypeFilter = (value: string) => {
    dispatch(setTypeFilter(value));
  };

  // レベル列ヘッダー押下でソート順を切り替える
  const handleToggleLevelSort = () => {
    dispatch(toggleLevelSort());
  };

  return {
    list,
    isLoading: isInitialLoading,
    isLoadingMore,
    searchName: searchInput,
    setSearchName: handleSetSearchName,
    handleSearchSubmit,
    typeFilter,
    setTypeFilter: handleSetTypeFilter,
    levelSortOrder,
    handleToggleLevelSort,
    handleLoadMore,
    hasMore,
    itemsPerPage: ITEMS_PER_PAGE,
  };
};
