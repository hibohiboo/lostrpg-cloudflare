import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@lostrpg/frontend/app/store';

// Base selectors
export const selectCampListPageState = (state: RootState) => state.campListPage;

export const selectSearchInput = createSelector(
  [selectCampListPageState],
  (campListPage) => campListPage.searchInput,
);

export const selectAppliedSearchName = createSelector(
  [selectCampListPageState],
  (campListPage) => campListPage.appliedSearchName,
);

export const selectOffset = createSelector(
  [selectCampListPageState],
  (campListPage) => campListPage.offset,
);
