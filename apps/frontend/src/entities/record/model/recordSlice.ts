import { Record } from '@lostrpg/schemas';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { format } from 'date-fns';

const initialState: Record = {
  title: '',
  date: format(new Date(), 'yyyy-MM-dd'),
  gm: '',
};

export const recordSlice = createSlice({
  name: 'record',
  initialState,
  reducers: {
    setRecord: (_, action: PayloadAction<Record>) => action.payload,
    updateRecord: (state, action: PayloadAction<Partial<Record>>) => {
      Object.assign(state, action.payload);
    },
    setRecordTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    resetRecord: () => initialState,
  },
});

export const { setRecordTitle, updateRecord } = recordSlice.actions;
