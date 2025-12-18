import { CreateCampRequest, UpdateCampRequest } from '@lostrpg/schemas';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { campApi } from '../api/api';
import { Camp } from '../model/camp';

export const createCampAction = createAsyncThunk<
  { id: string },
  { data: CreateCampRequest }
>('camp/create', async ({ data }, { dispatch }) => {
  const result = await dispatch(
    campApi.endpoints.createCamp.initiate(data),
  ).unwrap();

  return result;
});

export const updateCampAction = createAsyncThunk<
  void,
  { id: string; data: UpdateCampRequest }
>('camp/update', async ({ id, data }, { dispatch }) => {
  await dispatch(campApi.endpoints.updateCamp.initiate({ id, data })).unwrap();
});

export const deleteCampAction = createAsyncThunk<void, { id: string }>(
  'camp/delete',
  async ({ id }, { dispatch }) => {
    await dispatch(campApi.endpoints.deleteCamp.initiate(id)).unwrap();
  },
);
export const getCampAction = createAsyncThunk<Camp | undefined, { id: string }>(
  'camp/get',
  async ({ id }, { dispatch }) => {
    const { data } = await dispatch(campApi.endpoints.getCamp.initiate(id));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data as any).data;
  },
);
