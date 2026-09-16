import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@lostrpg/frontend/app/store';

export const selectMotherlessCharacterListPageState = (state: RootState) =>
  state.motherlessCharacterListPage;

export const selectSearchInput = createSelector(
  [selectMotherlessCharacterListPageState],
  (page) => page.searchInput,
);

export const selectAppliedSearchName = createSelector(
  [selectMotherlessCharacterListPageState],
  (page) => page.appliedSearchName,
);

export const selectOffset = createSelector(
  [selectMotherlessCharacterListPageState],
  (page) => page.offset,
);
