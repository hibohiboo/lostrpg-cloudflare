import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface EnemyListItem {
  id: string;
  name: string;
  imageUrl?: string;
}

export type EnemyListSortOrder = 'asc' | 'desc' | null;

export interface EnemyListPageState {
  searchInput: string;
  appliedSearchName: string;
  typeFilter: string;
  levelSortOrder: EnemyListSortOrder;
  offset: number;
}

const ITEMS_PER_PAGE = 20;

const initialState: EnemyListPageState = {
  searchInput: '',
  appliedSearchName: '',
  typeFilter: '',
  levelSortOrder: 'asc', // 初期表示はレベル昇順
  offset: 0,
};

export const enemyListPageSlice = createSlice({
  name: 'enemyListPage',
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
    // タイプでの絞り込みは選択と同時に確定する
    setTypeFilter: (state, action: PayloadAction<string>) => {
      state.typeFilter = action.payload;
      state.offset = 0;
    },
    // レベル列ヘッダー押下で 昇順 → 降順 → 解除 の順に切り替える
    toggleLevelSort: (state) => {
      const nextSortOrder: Record<
        NonNullable<EnemyListSortOrder> | 'null',
        EnemyListSortOrder
      > = {
        null: 'asc',
        asc: 'desc',
        desc: null,
      };
      state.levelSortOrder = nextSortOrder[state.levelSortOrder ?? 'null'];
      state.offset = 0;
    },
    setOffset: (state, action: PayloadAction<number>) => {
      state.offset = action.payload;
    },
    resetListPage: () => initialState,
  },
});

export const {
  setSearchInput,
  submitSearch,
  setTypeFilter,
  toggleLevelSort,
  setOffset,
  resetListPage,
} = enemyListPageSlice.actions;

export default enemyListPageSlice.reducer;

// Constants
export const ITEMS_PER_PAGE_CONSTANT = ITEMS_PER_PAGE;
