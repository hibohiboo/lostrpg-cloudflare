import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@lostrpg/frontend/app/store';

// Base selectors
export const selectBossListPageState = (state: RootState) =>
  state.bossListPage;

export const selectSearchInput = createSelector(
  [selectBossListPageState],
  (bossListPage) => bossListPage.searchInput,
);

export const selectAppliedSearchName = createSelector(
  [selectBossListPageState],
  (bossListPage) => bossListPage.appliedSearchName,
);

export const selectOffset = createSelector(
  [selectBossListPageState],
  (bossListPage) => bossListPage.offset,
);
