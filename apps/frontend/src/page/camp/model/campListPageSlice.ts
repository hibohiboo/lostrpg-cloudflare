import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Camp {
  id: string;
  name: string;
}

export interface CampListPageState {
  searchName: string;
  displayCount: number;
}

const ITEMS_PER_PAGE = 5;

const initialState: CampListPageState = {
  searchName: '',
  displayCount: ITEMS_PER_PAGE,
};

export const campListPageSlice = createSlice({
  name: 'campListPage',
  initialState,
  reducers: {
    setSearchName: (state, action: PayloadAction<string>) => {
      state.searchName = action.payload;
    },
    setDisplayCount: (state, action: PayloadAction<number>) => {
      state.displayCount = action.payload;
    },
    incrementDisplayCount: (state) => {
      state.displayCount += ITEMS_PER_PAGE;
    },
    resetListPage: () => initialState,
  },
});

export const {
  setSearchName,
  setDisplayCount,
  incrementDisplayCount,
  resetListPage,
} = campListPageSlice.actions;

export default campListPageSlice.reducer;

// Constants
export const ITEMS_PER_PAGE_CONSTANT = ITEMS_PER_PAGE;
