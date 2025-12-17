import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Facility } from '@lostrpg/frontend/entities/facility';
import { Item } from '@lostrpg/frontend/entities/item';

export interface CampFormData {
  playerName: string;
  name: string;
  imageUrl: string;
  facilities: Facility[];
  items: Item[];
  unusedCampPoint: number;
  totalCampPoint: number;
  summary: string;
  freeWriting: string;
}

const initialState: CampFormData = {
  playerName: '',
  name: '',
  imageUrl: '',
  facilities: [],
  items: [],
  unusedCampPoint: 0,
  totalCampPoint: 0,
  summary: '',
  freeWriting: '',
};

export const campSlice = createSlice({
  name: 'camp',
  initialState,
  reducers: {
    setCamp: (_, action: PayloadAction<CampFormData>) => action.payload,
    updateCamp: (state, action: PayloadAction<Partial<CampFormData>>) => {
      Object.assign(state, action.payload);
    },
    addFacility: (state, action: PayloadAction<Facility>) => {
      state.facilities.push(action.payload);
    },
    addItem: (state, action: PayloadAction<Item>) => {
      state.items.push(action.payload);
    },
    deleteFacility: (state, action: PayloadAction<string>) => {
      state.facilities = state.facilities.filter(
        (f) => f.id !== action.payload,
      );
    },
    deleteItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    updateFacility: (state, action: PayloadAction<Facility>) => {
      const index = state.facilities.findIndex(
        (f) => f.id === action.payload.id,
      );
      if (index !== -1) {
        state.facilities[index] = action.payload;
      }
    },
    updateItem: (state, action: PayloadAction<Item>) => {
      const index = state.items.findIndex((i) => i.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    resetCamp: () => initialState,
  },
});

export const {
  setCamp,
  updateCamp,
  addFacility,
  addItem,
  deleteFacility,
  deleteItem,
  updateFacility,
  updateItem,
  resetCamp,
} = campSlice.actions;

export default campSlice.reducer;
