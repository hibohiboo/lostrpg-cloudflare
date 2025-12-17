import { CreateCampRequest } from '@lostrpg/schemas';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const createCampAction = createAsyncThunk<
  { id: string },
  { data: CreateCampRequest }
>('camp/create', async ({ data }) => {
  const response = await fetch('/api/camps', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const { id } = await response.json();

  return { id };
});
