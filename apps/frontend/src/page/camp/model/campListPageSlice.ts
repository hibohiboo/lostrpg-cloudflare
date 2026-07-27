import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Camp {
  id: string;
  name: string;
  imageUrl?: string;
}

export interface CampListPageState {
  searchInput: string;
  appliedSearchName: string;
  offset: number;
}

const ITEMS_PER_PAGE = 20;

const initialState: CampListPageState = {
  searchInput: '',
  appliedSearchName: '',
  offset: 0,
};

export const campListPageSlice = createSlice({
  name: 'campListPage',
  initialState,
  reducers: {
    setSearchInput: (state, action: PayloadAction<string>) => {
      state.searchInput = action.payload;
    },
    // 検索ボタン押下 or Enterで確定するまではAPIに問い合わせない
    submitSearch: (state) => {
      state.appliedSearchName = state.searchInput;
      state.offset = 0;
    },
    setOffset: (state, action: PayloadAction<number>) => {
      state.offset = action.payload;
    },
    resetListPage: () => initialState,
  },
});

export const { setSearchInput, submitSearch, setOffset, resetListPage } =
  campListPageSlice.actions;

export default campListPageSlice.reducer;

// Constants
export const ITEMS_PER_PAGE_CONSTANT = ITEMS_PER_PAGE;
