import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Character {
  id: string;
  name: string;
}

export interface CharacterListPageState {
  searchName: string;
  displayCount: number;
}

const ITEMS_PER_PAGE = 5;

const initialState: CharacterListPageState = {
  searchName: '',
  displayCount: ITEMS_PER_PAGE,
};

export const characterListPageSlice = createSlice({
  name: 'characterListPage',
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
} = characterListPageSlice.actions;

export default characterListPageSlice.reducer;

// Constants
export const ITEMS_PER_PAGE_CONSTANT = ITEMS_PER_PAGE;
