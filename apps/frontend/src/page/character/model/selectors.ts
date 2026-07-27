import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@lostrpg/frontend/app/store';

// Base selectors
export const selectCharacterListPageState = (state: RootState) =>
  state.characterListPage;

export const selectSearchName = createSelector(
  [selectCharacterListPageState],
  (characterListPage) => characterListPage.searchName,
);

export const selectOffset = createSelector(
  [selectCharacterListPageState],
  (characterListPage) => characterListPage.offset,
);
