import { combineReducers, type UnknownAction } from '@reduxjs/toolkit';
import { campApi } from '@lostrpg/frontend/entities/camp';
import { characterApi } from '@lostrpg/frontend/entities/character';
import { recordSlice } from '@lostrpg/frontend/entities/record';
import { campSlice } from '@lostrpg/frontend/features/camp';
import { characterSlice } from '@lostrpg/frontend/features/character';
import { campListPageSlice } from '@lostrpg/frontend/page/camp/model';
import { characterListPageSlice } from '@lostrpg/frontend/page/character/model';

const combinedReducer = combineReducers({
  [campSlice.reducerPath]: campSlice.reducer,
  [campApi.reducerPath]: campApi.reducer,
  [characterApi.reducerPath]: characterApi.reducer,
  [characterSlice.reducerPath]: characterSlice.reducer,
  [campListPageSlice.reducerPath]: campListPageSlice.reducer,
  [characterListPageSlice.reducerPath]: characterListPageSlice.reducer,
  [recordSlice.reducerPath]: recordSlice.reducer,
});

type CombinedState = ReturnType<typeof combinedReducer>;

export const rootReducer = (
  state: CombinedState | undefined,
  action: UnknownAction,
) => combinedReducer(state, action);

export type RootReducer = typeof rootReducer;
