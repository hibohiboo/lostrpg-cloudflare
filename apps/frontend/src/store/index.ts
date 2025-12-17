import { configureStore } from '@reduxjs/toolkit';
import { campReducer } from '@lostrpg/frontend/features/camp';

export const store = configureStore({
  reducer: {
    camp: campReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
