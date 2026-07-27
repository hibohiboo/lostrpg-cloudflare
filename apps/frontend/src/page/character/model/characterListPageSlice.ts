import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Character {
  id: string;
  name: string;
  imageUrl?: string;
}

export interface CharacterListPageState {
  searchName: string;
  offset: number;
}

const ITEMS_PER_PAGE = 20;

const initialState: CharacterListPageState = {
  searchName: '',
  offset: 0,
};

export const characterListPageSlice = createSlice({
  name: 'characterListPage',
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
  characterListPageSlice.actions;

export default characterListPageSlice.reducer;

// Constants
export const ITEMS_PER_PAGE_CONSTANT = ITEMS_PER_PAGE;
