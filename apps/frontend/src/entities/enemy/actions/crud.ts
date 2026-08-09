/* eslint-disable consistent-return */
import { CreateEnemyRequest, UpdateEnemyRequest } from '@lostrpg/schemas';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { enemyApi } from '../api/api';

export const createEnemyAction = createAsyncThunk<
  { id: string },
  { data: CreateEnemyRequest },
  { rejectValue: FetchBaseQueryError }
>('enemy/create', async ({ data }, { dispatch, rejectWithValue }) => {
  try {
    const result = await dispatch(
      enemyApi.endpoints.createEnemy.initiate(data),
    ).unwrap();

    return result;
  } catch (e) {
    return rejectWithValue(e as FetchBaseQueryError);
  }
});

export const updateEnemyAction = createAsyncThunk<
  void,
  { id: string; data: UpdateEnemyRequest },
  { rejectValue: FetchBaseQueryError }
>('enemy/update', async ({ id, data }, { dispatch, rejectWithValue }) => {
  try {
    await dispatch(
      enemyApi.endpoints.updateEnemy.initiate({ id, data }),
    ).unwrap();
  } catch (e) {
    return rejectWithValue(e as FetchBaseQueryError);
  }
});

export const deleteEnemyAction = createAsyncThunk<
  void,
  { id: string },
  { rejectValue: FetchBaseQueryError }
>('enemy/delete', async ({ id }, { dispatch, rejectWithValue }) => {
  try {
    await dispatch(enemyApi.endpoints.deleteEnemy.initiate(id)).unwrap();
  } catch (e) {
    return rejectWithValue(e as FetchBaseQueryError);
  }
});

export const getEnemyAction = createAsyncThunk<
  CreateEnemyRequest | undefined,
  { id: string },
  { rejectValue: FetchBaseQueryError }
>('enemy/get', async ({ id }, { dispatch, rejectWithValue }) => {
  try {
    const { data } = await dispatch(enemyApi.endpoints.getEnemy.initiate(id));
    return data?.data;
  } catch (e) {
    return rejectWithValue(e as FetchBaseQueryError);
  }
});
