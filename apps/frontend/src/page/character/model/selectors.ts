import { createSelector } from '@reduxjs/toolkit';
import { characterApi } from '@lostrpg/frontend/entities/character';
import type { RootState } from '@lostrpg/frontend/app/store';

// Base selectors
export const selectCharacterListPageState = (state: RootState) =>
  state.characterListPage;

export const selectSearchName = createSelector(
  [selectCharacterListPageState],
  (characterListPage) => characterListPage.searchName,
);

export const selectDisplayCount = createSelector(
  [selectCharacterListPageState],
  (characterListPage) => characterListPage.displayCount,
);

// RTK QueryからcharactersデータをstateとmemoizeするSelector
const selectCharacterListQueryResult =
  characterApi.endpoints.getCharacterList.select();

export const selectCharacters = createSelector(
  [selectCharacterListQueryResult],
  (result) => result.data ?? [],
);

// displayedCharactersを計算で求める
export const selectDisplayedCharacters = createSelector(
  [selectCharacters, selectSearchName, selectDisplayCount],
  (characters, searchName, displayCount) => {
    if (searchName.trim() === '') {
      return characters.slice(0, displayCount);
    }
    return characters.filter((character) =>
      character.name.toLowerCase().includes(searchName.toLowerCase()),
    );
  },
);
