import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  selectedSpecialty: '',
};

export const characterFormSlice = createSlice({
  name: 'characterForm',
  initialState,
  reducers: {
    updateCharacterForm: (
      state,
      action: PayloadAction<Partial<typeof initialState>>,
    ) => {
      Object.assign(state, action.payload);
    },
    resetRecord: () => initialState,
  },
});

export const { updateCharacterForm } = characterFormSlice.actions;
