/* eslint-disable consistent-return */
import { CreateBossRequest, UpdateBossRequest } from '@lostrpg/schemas';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { bossApi } from '../api/api';

export const createBossAction = createAsyncThunk<
  { id: string },
  { data: CreateBossRequest },
  { rejectValue: FetchBaseQueryError }
>('boss/create', async ({ data }, { dispatch, rejectWithValue }) => {
  try {
    const result = await dispatch(
      bossApi.endpoints.createBoss.initiate(data),
    ).unwrap();

    return result;
  } catch (e) {
    return rejectWithValue(e as FetchBaseQueryError);
  }
});

export const updateBossAction = createAsyncThunk<
  void,
  { id: string; data: UpdateBossRequest },
  { rejectValue: FetchBaseQueryError }
>('boss/update', async ({ id, data }, { dispatch, rejectWithValue }) => {
  try {
    await dispatch(
      bossApi.endpoints.updateBoss.initiate({ id, data }),
    ).unwrap();
  } catch (e) {
    return rejectWithValue(e as FetchBaseQueryError);
  }
});

export const deleteBossAction = createAsyncThunk<
  void,
  { id: string },
  { rejectValue: FetchBaseQueryError }
>('boss/delete', async ({ id }, { dispatch, rejectWithValue }) => {
  try {
    await dispatch(bossApi.endpoints.deleteBoss.initiate(id)).unwrap();
  } catch (e) {
    return rejectWithValue(e as FetchBaseQueryError);
  }
});

export const getBossAction = createAsyncThunk<
  CreateBossRequest | undefined,
  { id: string },
  { rejectValue: FetchBaseQueryError }
>('boss/get', async ({ id }, { dispatch, rejectWithValue }) => {
  try {
    const { data } = await dispatch(bossApi.endpoints.getBoss.initiate(id));
    return data?.data;
  } catch (e) {
    return rejectWithValue(e as FetchBaseQueryError);
  }
});
