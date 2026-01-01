import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  selectedSpecialty: '',
  password: '',
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
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    resetRecord: () => initialState,
  },
});

export const { updateCharacterForm, setPassword } = characterFormSlice.actions;
