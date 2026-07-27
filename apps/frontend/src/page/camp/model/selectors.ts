import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@lostrpg/frontend/app/store';

// Base selectors
export const selectCampListPageState = (state: RootState) => state.campListPage;

export const selectSearchName = createSelector(
  [selectCampListPageState],
  (campListPage) => campListPage.searchName,
);

export const selectOffset = createSelector(
  [selectCampListPageState],
  (campListPage) => campListPage.offset,
);
