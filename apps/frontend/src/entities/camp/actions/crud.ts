import { CreateCampRequest, UpdateCampRequest } from '@lostrpg/schemas';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { campApi } from '../api/api';
import { Camp } from '../model/camp';

export const createCampAction = createAsyncThunk<
  { id: string },
  { data: CreateCampRequest },
  { rejectValue: FetchBaseQueryError }
>('camp/create', async ({ data }, { dispatch, rejectWithValue }) => {
  try {
    const result = await dispatch(
      campApi.endpoints.createCamp.initiate(data),
    ).unwrap();

    return result;
  } catch (e) {
    return rejectWithValue(e as FetchBaseQueryError);
  }
});

export const updateCampAction = createAsyncThunk<
  void,
  { id: string; data: UpdateCampRequest },
  { rejectValue: FetchBaseQueryError }
>('camp/update', async ({ id, data }, { dispatch, rejectWithValue }) => {
  try {
    await dispatch(
      campApi.endpoints.updateCamp.initiate({ id, data }),
    ).unwrap();
  } catch (e) {
    return rejectWithValue(e as FetchBaseQueryError);
  }
});

export const deleteCampAction = createAsyncThunk<
  void,
  { id: string },
  { rejectValue: FetchBaseQueryError }
>(
  'camp/delete',
  async ({ id }, { dispatch, rejectWithValue }) => {
    try {
      await dispatch(campApi.endpoints.deleteCamp.initiate(id)).unwrap();
    } catch (e) {
      return rejectWithValue(e as FetchBaseQueryError);
    }
  },
);
export const getCampAction = createAsyncThunk<
  Camp | undefined,
  { id: string },
  { rejectValue: FetchBaseQueryError }
>(
  'camp/get',
  async ({ id }, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await dispatch(campApi.endpoints.getCamp.initiate(id));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (data as any).data;
    } catch (e) {
      return rejectWithValue(e as FetchBaseQueryError);
    }
  },
);
