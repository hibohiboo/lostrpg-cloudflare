import { combineReducers, type UnknownAction } from '@reduxjs/toolkit';
import { campApi } from '@lostrpg/frontend/entities/camp';
import { campSlice } from '@lostrpg/frontend/features/camp';
import { campListPageSlice } from '@lostrpg/frontend/page/camp/model';

const combinedReducer = combineReducers({
  [campSlice.reducerPath]: campSlice.reducer,
  [campApi.reducerPath]: campApi.reducer,
  [campListPageSlice.reducerPath]: campListPageSlice.reducer,
});

type CombinedState = ReturnType<typeof combinedReducer>;

export const rootReducer = (
  state: CombinedState | undefined,
  action: UnknownAction,
) => combinedReducer(state, action);

export type RootReducer = typeof rootReducer;
