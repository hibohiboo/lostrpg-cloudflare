import { useGetCharacterListQuery } from '@lostrpg/frontend/entities/character';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';
import {
  selectDisplayedCharacters,
  selectSearchName,
  selectDisplayCount,
  selectCharacters,
  setSearchName,
  setDisplayCount,
  ITEMS_PER_PAGE_CONSTANT,
} from '../model';

export const useListPageHooks = () => {
  const dispatch = useAppDispatch();
  const displayedCharacters = useAppSelector(selectDisplayedCharacters);
  const searchName = useAppSelector(selectSearchName);
  const displayCount = useAppSelector(selectDisplayCount);
  const characters = useAppSelector(selectCharacters);
  const ITEMS_PER_PAGE = ITEMS_PER_PAGE_CONSTANT;
  const { isLoading } = useGetCharacterListQuery();

  // もっと読み込む
  const handleLoadMore = () => {
    const newCount = displayCount + ITEMS_PER_PAGE;
    dispatch(setDisplayCount(newCount));
  };

  const handleSetSearchName = (value: string) => {
    dispatch(setSearchName(value));
  };

  const hasMore = displayCount < characters.length && searchName === '';
  return {
    list: displayedCharacters,
    isLoading,
    searchName,
    setSearchName: handleSetSearchName,
    handleLoadMore,
    hasMore,
    itemsPerPage: ITEMS_PER_PAGE,
  };
};
