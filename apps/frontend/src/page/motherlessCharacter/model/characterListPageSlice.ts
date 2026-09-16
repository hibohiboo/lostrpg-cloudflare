import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MotherlessCharacterListPageState {
  searchInput: string;
  appliedSearchName: string;
  offset: number;
}

const ITEMS_PER_PAGE = 20;

const initialState: MotherlessCharacterListPageState = {
  searchInput: '',
  appliedSearchName: '',
  offset: 0,
};

export const motherlessCharacterListPageSlice = createSlice({
  name: 'motherlessCharacterListPage',
  initialState,
  reducers: {
    setSearchInput: (state, action: PayloadAction<string>) => {
      state.searchInput = action.payload;
    },
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
  motherlessCharacterListPageSlice.actions;

export default motherlessCharacterListPageSlice.reducer;

export const ITEMS_PER_PAGE_CONSTANT = ITEMS_PER_PAGE;
