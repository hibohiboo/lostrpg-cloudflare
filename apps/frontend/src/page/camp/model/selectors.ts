import { createSelector } from '@reduxjs/toolkit';
import { campApi } from '@lostrpg/frontend/entities/camp';
import type { RootState } from '@lostrpg/frontend/app/store';

// Base selectors
export const selectCampListPageState = (state: RootState) => state.campListPage;

export const selectSearchName = createSelector(
  [selectCampListPageState],
  (campListPage) => campListPage.searchName,
);

export const selectDisplayCount = createSelector(
  [selectCampListPageState],
  (campListPage) => campListPage.displayCount,
);

// RTK QueryからcampsデータをstateとmemoizeするSelector
const selectCampListQueryResult = campApi.endpoints.getCampList.select();

export const selectCamps = createSelector(
  [selectCampListQueryResult],
  (result) => result.data ?? [],
);

// displayedCampsを計算で求める
export const selectDisplayedCamps = createSelector(
  [selectCamps, selectSearchName, selectDisplayCount],
  (camps, searchName, displayCount) => {
    if (searchName.trim() === '') {
      return camps.slice(0, displayCount);
    }
    return camps.filter((camp) =>
      camp.name.toLowerCase().includes(searchName.toLowerCase()),
    );
  },
);
