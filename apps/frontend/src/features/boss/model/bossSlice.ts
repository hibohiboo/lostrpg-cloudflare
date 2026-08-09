import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  BossAbility,
  CreateBossRequest,
} from '@lostrpg/schemas/validation/boss';

export type BossFormData = CreateBossRequest;

// 体力・気力の初期計算式（ヌシの作成ルール）
// 体力: レベル×5点 / 気力: [10+レベル]点
export const calcBossStamina = (level: number) => level * 5;
export const calcBossWillPower = (level: number) => 10 + level;

const initialState: BossFormData = {
  name: '',
  appearance: '',
  level: 1,
  abilities: [],
  stamina: calcBossStamina(1),
  willPower: calcBossWillPower(1),
  imageUrl: '',
  creator: '',
  password: '',
};

export const bossSlice = createSlice({
  name: 'boss',
  initialState,
  reducers: {
    setBoss: (_, action: PayloadAction<BossFormData>) => action.payload,
    updateBoss: (state, action: PayloadAction<Partial<BossFormData>>) => {
      Object.assign(state, action.payload);
    },
    // レベル変更時に体力・気力をルール通りの値へ再計算する
    setLevel: (state, action: PayloadAction<number>) => {
      state.level = action.payload;
      state.stamina = calcBossStamina(action.payload);
      state.willPower = calcBossWillPower(action.payload);
    },
    addAbility: (state, action: PayloadAction<BossAbility>) => {
      state.abilities.push(action.payload);
    },
    updateAbility: (state, action: PayloadAction<BossAbility>) => {
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
    resetBoss: () => initialState,
  },
});

export const {
  setBoss,
  updateBoss,
  setLevel,
  addAbility,
  updateAbility,
  deleteAbility,
  resetBoss,
} = bossSlice.actions;

export default bossSlice.reducer;
