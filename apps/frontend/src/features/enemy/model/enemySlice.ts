import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  CreateEnemyRequest,
  EnemyAbility,
} from '@lostrpg/schemas/validation/enemy';

export type EnemyFormData = CreateEnemyRequest;

const initialState: EnemyFormData = {
  name: '',
  appearance: '',
  type: undefined,
  level: 1,
  abilities: [],
  stamina: 5,
  willPower: 10,
  dropItems: ['', '', '', '', '', ''],
  imageUrl: '',
  password: '',
};

export const enemySlice = createSlice({
  name: 'enemy',
  initialState,
  reducers: {
    setEnemy: (_, action: PayloadAction<EnemyFormData>) => action.payload,
    updateEnemy: (state, action: PayloadAction<Partial<EnemyFormData>>) => {
      Object.assign(state, action.payload);
    },
    setDropItem: (
      state,
      action: PayloadAction<{ index: number; value: string }>,
    ) => {
      state.dropItems[action.payload.index] = action.payload.value;
    },
    addAbility: (state, action: PayloadAction<EnemyAbility>) => {
      state.abilities.push(action.payload);
    },
    updateAbility: (state, action: PayloadAction<EnemyAbility>) => {
      const index = state.abilities.findIndex(
        (a) => a.id === action.payload.id,
      );
      if (index !== -1) {
        state.abilities[index] = action.payload;
      }
    },
    deleteAbility: (state, action: PayloadAction<string>) => {
      state.abilities = state.abilities.filter((a) => a.id !== action.payload);
    },
    resetEnemy: () => initialState,
  },
});

export const {
  setEnemy,
  updateEnemy,
  setDropItem,
  addAbility,
  updateAbility,
  deleteAbility,
  resetEnemy,
} = enemySlice.actions;

export default enemySlice.reducer;
