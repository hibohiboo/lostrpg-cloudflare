import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@lostrpg/frontend/app/store';

// Base selectors
export const selectEnemyListPageState = (state: RootState) =>
  state.enemyListPage;

export const selectSearchInput = createSelector(
  [selectEnemyListPageState],
  (enemyListPage) => enemyListPage.searchInput,
);

export const selectAppliedSearchName = createSelector(
  [selectEnemyListPageState],
  (enemyListPage) => enemyListPage.appliedSearchName,
);

export const selectOffset = createSelector(
  [selectEnemyListPageState],
  (enemyListPage) => enemyListPage.offset,
);
