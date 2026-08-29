import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Scenario } from '@lostrpg/frontend/entities/scenario';

export type ScenarioFormData = Scenario;

// 新規作成時、よく使う4フェイズ（キャンプ・探索・決戦・結果）をあらかじめ登録した状態で始める
const DEFAULT_CONTENT = [
  '## キャンプフェイズ',
  '',
  '## 探索フェイズ',
  '',
  '## 決戦フェイズ',
  '',
  '## 結果フェイズ',
].join('\n');

const initialState: ScenarioFormData = {
  name: '',
  imageUrl: '',
  players: '',
  time: '',
  limit: '',
  caution: '',
  summary: '',
  content: DEFAULT_CONTENT,
  phases: [],
  encounterTable: { mode: 'default', tables: [], enemies: [] },
  wanderTable: { mode: 'default', tables: [] },
  searchTable: { mode: 'default', tables: [] },
  restTable: { mode: 'default', tables: [] },
  bosses: [],
  items: [],
  creatorName: '',
  isPublish: false,
  hideFromList: false,
};

export const scenarioSlice = createSlice({
  name: 'scenario',
  initialState,
  reducers: {
    setScenario: (_, action: PayloadAction<ScenarioFormData>) =>
      action.payload,
    updateScenario: (
      state,
      action: PayloadAction<Partial<ScenarioFormData>>,
    ) => {
      Object.assign(state, action.payload);
    },
    resetScenario: () => initialState,
  },
});

export const { setScenario, updateScenario, resetScenario } =
  scenarioSlice.actions;

export default scenarioSlice.reducer;
