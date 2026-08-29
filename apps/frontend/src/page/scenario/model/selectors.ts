import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@lostrpg/frontend/app/store';

// Base selectors
export const selectScenarioListPageState = (state: RootState) =>
  state.scenarioListPage;

export const selectSearchInput = createSelector(
  [selectScenarioListPageState],
  (scenarioListPage) => scenarioListPage.searchInput,
);

export const selectAppliedSearchName = createSelector(
  [selectScenarioListPageState],
  (scenarioListPage) => scenarioListPage.appliedSearchName,
);

export const selectOffset = createSelector(
  [selectScenarioListPageState],
  (scenarioListPage) => scenarioListPage.offset,
);
