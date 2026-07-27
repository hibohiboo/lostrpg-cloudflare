import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@lostrpg/frontend/app/store';

// Base selectors
export const selectCharacterListPageState = (state: RootState) =>
  state.characterListPage;

export const selectSearchInput = createSelector(
  [selectCharacterListPageState],
  (characterListPage) => characterListPage.searchInput,
);

export const selectAppliedSearchName = createSelector(
  [selectCharacterListPageState],
  (characterListPage) => characterListPage.appliedSearchName,
);

export const selectOffset = createSelector(
  [selectCharacterListPageState],
  (characterListPage) => characterListPage.offset,
);
