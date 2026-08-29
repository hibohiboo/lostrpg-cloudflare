import { configureStore } from '@reduxjs/toolkit';
import { bossApi } from '@lostrpg/frontend/entities/boss';
import { campApi } from '@lostrpg/frontend/entities/camp';
import { characterApi } from '@lostrpg/frontend/entities/character';
import { enemyApi } from '@lostrpg/frontend/entities/enemy';
import { recordApi } from '@lostrpg/frontend/entities/record';
import { scenarioApi } from '@lostrpg/frontend/entities/scenario';
import { rootReducer } from './rootReducer';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      campApi.middleware,
      characterApi.middleware,
      recordApi.middleware,
      bossApi.middleware,
      enemyApi.middleware,
      scenarioApi.middleware,
    ),
});

// 以下の２つの型は`vite-env.d.ts`を経て、暗黙的に `share/store/index.ts` などで利用される : https://feature-sliced.design/docs/guides/examples/types
/* same content as in the code block before… */
// tsconfigで strict: false にするとRootStateがanyになる
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
