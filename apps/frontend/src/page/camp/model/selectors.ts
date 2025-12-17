import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@lostrpg/frontend/app/store';

// Base selectors
export const selectCampListPageState = (state: RootState) => state.campListPage;

// Memoized selectors
export const selectDisplayedCamps = createSelector(
  [selectCampListPageState],
  (campListPage) => campListPage.displayedCamps,
);

export const selectSearchName = createSelector(
  [selectCampListPageState],
  (campListPage) => campListPage.searchName,
);

export const selectDisplayCount = createSelector(
  [selectCampListPageState],
  (campListPage) => campListPage.displayCount,
);
