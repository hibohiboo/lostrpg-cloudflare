import { combineReducers, type UnknownAction } from '@reduxjs/toolkit';
import { bossApi } from '@lostrpg/frontend/entities/boss';
import { campApi } from '@lostrpg/frontend/entities/camp';
import { characterApi } from '@lostrpg/frontend/entities/character';
import { enemyApi } from '@lostrpg/frontend/entities/enemy';
import { recordSlice, recordApi } from '@lostrpg/frontend/entities/record';
import { scenarioApi } from '@lostrpg/frontend/entities/scenario';
import { bossSlice } from '@lostrpg/frontend/features/boss';
import { campSlice } from '@lostrpg/frontend/features/camp';
import {
  characterFormSlice,
  characterSlice,
} from '@lostrpg/frontend/features/character';
import { enemySlice } from '@lostrpg/frontend/features/enemy';
import { scenarioSlice } from '@lostrpg/frontend/features/scenario';
import { bossListPageSlice } from '@lostrpg/frontend/page/boss/model';
import { campListPageSlice } from '@lostrpg/frontend/page/camp/model';
import { characterListPageSlice } from '@lostrpg/frontend/page/character/model';
import { enemyListPageSlice } from '@lostrpg/frontend/page/enemy/model';
import { scenarioListPageSlice } from '@lostrpg/frontend/page/scenario/model';

const combinedReducer = combineReducers({
  [campSlice.reducerPath]: campSlice.reducer,
  [campApi.reducerPath]: campApi.reducer,
  [characterApi.reducerPath]: characterApi.reducer,
  [recordApi.reducerPath]: recordApi.reducer,
  [characterSlice.reducerPath]: characterSlice.reducer,
  [campListPageSlice.reducerPath]: campListPageSlice.reducer,
  [characterListPageSlice.reducerPath]: characterListPageSlice.reducer,
  [recordSlice.reducerPath]: recordSlice.reducer,
  [characterFormSlice.reducerPath]: characterFormSlice.reducer,
  [bossSlice.reducerPath]: bossSlice.reducer,
  [bossApi.reducerPath]: bossApi.reducer,
  [bossListPageSlice.reducerPath]: bossListPageSlice.reducer,
  [enemySlice.reducerPath]: enemySlice.reducer,
  [enemyApi.reducerPath]: enemyApi.reducer,
  [enemyListPageSlice.reducerPath]: enemyListPageSlice.reducer,
  [scenarioSlice.reducerPath]: scenarioSlice.reducer,
  [scenarioApi.reducerPath]: scenarioApi.reducer,
  [scenarioListPageSlice.reducerPath]: scenarioListPageSlice.reducer,
});

type CombinedState = ReturnType<typeof combinedReducer>;

export const rootReducer = (
  state: CombinedState | undefined,
  action: UnknownAction,
) => combinedReducer(state, action);

export type RootReducer = typeof rootReducer;
