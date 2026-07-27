import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Character {
  id: string;
  name: string;
  imageUrl?: string;
}

export interface CharacterListPageState {
  searchInput: string;
  appliedSearchName: string;
  offset: number;
}

const ITEMS_PER_PAGE = 20;

const initialState: CharacterListPageState = {
  searchInput: '',
  appliedSearchName: '',
  offset: 0,
};

export const characterListPageSlice = createSlice({
  name: 'characterListPage',
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
  characterListPageSlice.actions;

export default characterListPageSlice.reducer;

// Constants
export const ITEMS_PER_PAGE_CONSTANT = ITEMS_PER_PAGE;
