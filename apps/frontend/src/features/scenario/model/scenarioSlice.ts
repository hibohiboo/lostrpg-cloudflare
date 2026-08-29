import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Scenario } from '@lostrpg/frontend/entities/scenario';

export type ScenarioFormData = Scenario;

const initialState: ScenarioFormData = {
  name: '',
  imageUrl: '',
  players: '',
  time: '',
  limit: '',
  caution: '',
  summary: '',
  content: '',
  phases: [],
  encounterTable: { mode: 'default', tables: [], enemies: [] },
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
