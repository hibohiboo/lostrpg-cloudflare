import { CreateCampRequest } from '@lostrpg/schemas';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { campApi } from '../api/api';

export const createCampAction = createAsyncThunk<
  { id: string },
  { data: CreateCampRequest }
>('camp/create', async ({ data }, { dispatch }) => {
  const result = await dispatch(
    campApi.endpoints.createCamp.initiate(data)
  ).unwrap();

  return result;
});
