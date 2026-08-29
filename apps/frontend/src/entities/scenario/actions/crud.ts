/* eslint-disable consistent-return */
import { CreateScenarioRequest, UpdateScenarioRequest } from '@lostrpg/schemas';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { scenarioApi } from '../api/api';
import { Scenario } from '../model/scenario';

export const createScenarioAction = createAsyncThunk<
  { id: string },
  { data: CreateScenarioRequest },
  { rejectValue: FetchBaseQueryError }
>('scenario/create', async ({ data }, { dispatch, rejectWithValue }) => {
  try {
    const result = await dispatch(
      scenarioApi.endpoints.createScenario.initiate(data),
    ).unwrap();

    return result;
  } catch (e) {
    return rejectWithValue(e as FetchBaseQueryError);
  }
});

export const updateScenarioAction = createAsyncThunk<
  void,
  { id: string; data: UpdateScenarioRequest },
  { rejectValue: FetchBaseQueryError }
>('scenario/update', async ({ id, data }, { dispatch, rejectWithValue }) => {
  try {
    await dispatch(
      scenarioApi.endpoints.updateScenario.initiate({ id, data }),
    ).unwrap();
  } catch (e) {
    return rejectWithValue(e as FetchBaseQueryError);
  }
});

export const deleteScenarioAction = createAsyncThunk<
  void,
  { id: string },
  { rejectValue: FetchBaseQueryError }
>('scenario/delete', async ({ id }, { dispatch, rejectWithValue }) => {
  try {
    await dispatch(scenarioApi.endpoints.deleteScenario.initiate(id)).unwrap();
  } catch (e) {
    return rejectWithValue(e as FetchBaseQueryError);
  }
});
export const getScenarioAction = createAsyncThunk<
  Scenario | undefined,
  { id: string },
  { rejectValue: FetchBaseQueryError }
>('scenario/get', async ({ id }, { dispatch, rejectWithValue }) => {
  try {
    const { data } = await dispatch(
      scenarioApi.endpoints.getScenario.initiate(id),
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data as any).data;
  } catch (e) {
    return rejectWithValue(e as FetchBaseQueryError);
  }
});
