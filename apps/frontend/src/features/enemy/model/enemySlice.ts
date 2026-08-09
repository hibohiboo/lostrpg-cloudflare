import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  CreateEnemyRequest,
  EnemyAbility,
  EnemyGap,
} from '@lostrpg/schemas/validation/enemy';

export type EnemyFormData = CreateEnemyRequest;

const initialState: EnemyFormData = {
  name: '',
  appearance: '',
  type: undefined,
  level: 1,
  specialties: [],
  gaps: [],
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
    toggleSpecialty: (state, action: PayloadAction<string>) => {
      const index = state.specialties.indexOf(action.payload);
      if (index !== -1) {
        state.specialties.splice(index, 1);
      } else {
        state.specialties.push(action.payload);
      }
    },
    toggleGap: (state, action: PayloadAction<EnemyGap>) => {
      const index = state.gaps.indexOf(action.payload);
      if (index !== -1) {
        state.gaps.splice(index, 1);
      } else {
        state.gaps.push(action.payload);
      }
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
  toggleSpecialty,
  toggleGap,
  addAbility,
  updateAbility,
  deleteAbility,
  resetEnemy,
} = enemySlice.actions;

export default enemySlice.reducer;
