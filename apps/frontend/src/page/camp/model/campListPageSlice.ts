import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Camp {
  id: string;
  name: string;
  imageUrl?: string;
}

export interface CampListPageState {
  searchName: string;
  offset: number;
}

const ITEMS_PER_PAGE = 20;

const initialState: CampListPageState = {
  searchName: '',
  offset: 0,
};

export const campListPageSlice = createSlice({
  name: 'campListPage',
  initialState,
  reducers: {
    setSearchName: (state, action: PayloadAction<string>) => {
      state.searchName = action.payload;
    },
    setOffset: (state, action: PayloadAction<number>) => {
      state.offset = action.payload;
    },
    resetListPage: () => initialState,
  },
});

export const { setSearchName, setOffset, resetListPage } =
  campListPageSlice.actions;

export default campListPageSlice.reducer;

// Constants
export const ITEMS_PER_PAGE_CONSTANT = ITEMS_PER_PAGE;
