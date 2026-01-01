import { Record } from '@lostrpg/schemas';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { format } from 'date-fns';

const initialState: Record = {
  title: '',
  date: format(new Date(), 'yyyy-MM-dd'),
  gm: '',
  expCheckPoints: [],
  parties: [],
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
    addPartyMember: (state) => {
      state.parties.push({ name: '', memo: '', trophy: '' });
    },
    removePartyMember: (state, action: PayloadAction<number>) => {
      state.parties.splice(action.payload, 1);
    },
    updatePartyMember: (
      state,
      action: PayloadAction<{
        index: number;
        data: Partial<Record['parties'][0]>;
      }>,
    ) => {
      const { index, data } = action.payload;
      if (state.parties[index]) {
        state.parties[index] = { ...state.parties[index], ...data };
      }
    },
    resetRecord: () => initialState,
  },
});

export const {
  setRecordTitle,
  updateRecord,
  toggleExpCheckPoint,
  addPartyMember,
  removePartyMember,
  updatePartyMember,
} = recordSlice.actions;
