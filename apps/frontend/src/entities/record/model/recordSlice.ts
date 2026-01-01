import { Record } from '@lostrpg/schemas';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { format } from 'date-fns';

const initialState: Record = {
  title: '',
  date: format(new Date(), 'yyyy-MM-dd'),
  gm: '',
  expCheckPoints: [],
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
    toggleExpCheckPoint: (state, action: PayloadAction<string>) => {
      const index = state.expCheckPoints?.indexOf(action.payload);
      if (index === undefined) {
        state.expCheckPoints = [action.payload];
      } else if (index === -1) {
        state.expCheckPoints?.push(action.payload);
      } else {
        state.expCheckPoints?.splice(index, 1);
      }
    },
    resetRecord: () => initialState,
  },
});

export const { setRecordTitle, updateRecord, toggleExpCheckPoint } =
  recordSlice.actions;
