import {
  CreateMotherlessCharacterRequest,
  MotherlessAbilityScores,
  MotherlessClass,
  MotherlessEquipment,
  MotherlessItem,
  MotherlessSkill,
  MotherlessTrait,
} from '@lostrpg/schemas';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type MotherlessCharacterFormData = CreateMotherlessCharacterRequest;

const initialState: MotherlessCharacterFormData = {
  name: '',
  playerName: '',
  imageUrl: '',
  level: 1,
  trait: undefined,
  classes: [],
  totalExperience: 0,
  unusedExperience: 0,
  abilities: {
    strength: 0,
    sense: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
  },
  hp: 0,
  tp: 0,
  acquiredSkills: [],
  items: [],
  equipments: [],
  statusAilments: [],
  bodyDamages: [],
  freeWriting: '',
  quote: '',
  summary: '',
  appearance: '',
  hideFromList: false,
};

const applyDefaults = (
  data: Partial<MotherlessCharacterFormData>,
): MotherlessCharacterFormData => ({
  ...initialState,
  ...data,
  abilities: data.abilities ?? initialState.abilities,
  classes: data.classes ?? [],
  acquiredSkills: data.acquiredSkills ?? [],
  items: data.items ?? [],
  equipments: data.equipments ?? [],
  statusAilments: data.statusAilments ?? [],
  bodyDamages: data.bodyDamages ?? [],
});

export const motherlessCharacterSlice = createSlice({
  name: 'motherlessCharacter',
  initialState,
  reducers: {
    setMotherlessCharacter: (
      _,
      action: PayloadAction<MotherlessCharacterFormData>,
    ) => applyDefaults(action.payload),
    updateMotherlessCharacter: (
      state,
      action: PayloadAction<Partial<MotherlessCharacterFormData>>,
    ) => {
      Object.assign(state, action.payload);
    },
    setAbilityScore: (
      state,
      action: PayloadAction<{
        key: keyof MotherlessAbilityScores;
        value: number;
      }>,
    ) => {
      state.abilities[action.payload.key] = action.payload.value;
    },
    setTrait: (state, action: PayloadAction<MotherlessTrait | undefined>) => {
      state.trait = action.payload;
    },
    addClass: (state, action: PayloadAction<MotherlessClass>) => {
      if (!state.classes.some((c) => c.name === action.payload.name)) {
        state.classes.push(action.payload);
      }
    },
    deleteClass: (state, action: PayloadAction<string>) => {
      state.classes = state.classes.filter((c) => c.name !== action.payload);
    },
    addSkill: (state, action: PayloadAction<MotherlessSkill>) => {
      state.acquiredSkills.push(action.payload);
    },
    updateSkill: (state, action: PayloadAction<MotherlessSkill>) => {
      const index = state.acquiredSkills.findIndex(
        (s) => s.id === action.payload.id,
      );
      if (index !== -1) {
        state.acquiredSkills[index] = action.payload;
      }
    },
    deleteSkill: (state, action: PayloadAction<string>) => {
      state.acquiredSkills = state.acquiredSkills.filter(
        (s) => s.id !== action.payload,
      );
    },
    addItem: (state, action: PayloadAction<MotherlessItem>) => {
      state.items.push(action.payload);
    },
    updateItem: (state, action: PayloadAction<MotherlessItem>) => {
      const index = state.items.findIndex((i) => i.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    addEquipment: (state, action: PayloadAction<MotherlessEquipment>) => {
      state.equipments.push(action.payload);
    },
    updateEquipment: (state, action: PayloadAction<MotherlessEquipment>) => {
      const index = state.equipments.findIndex(
        (e) => e.id === action.payload.id,
      );
      if (index !== -1) {
        state.equipments[index] = action.payload;
      }
    },
    deleteEquipment: (state, action: PayloadAction<string>) => {
      state.equipments = state.equipments.filter(
        (e) => e.id !== action.payload,
      );
    },
    toggleStatusAilment: (state, action: PayloadAction<string>) => {
      const index = state.statusAilments.indexOf(action.payload);
      if (index !== -1) {
        state.statusAilments.splice(index, 1);
      } else {
        state.statusAilments.push(action.payload);
      }
    },
    toggleBodyDamage: (state, action: PayloadAction<string>) => {
      const index = state.bodyDamages.indexOf(action.payload);
      if (index !== -1) {
        state.bodyDamages.splice(index, 1);
      } else {
        state.bodyDamages.push(action.payload);
      }
    },
    resetMotherlessCharacter: () => initialState,
  },
});

export const {
  setMotherlessCharacter,
  updateMotherlessCharacter,
  setAbilityScore,
  setTrait,
  addClass,
  deleteClass,
  addSkill,
  updateSkill,
  deleteSkill,
  addItem,
  updateItem,
  deleteItem,
  addEquipment,
  updateEquipment,
  deleteEquipment,
  toggleStatusAilment,
  toggleBodyDamage,
  resetMotherlessCharacter,
} = motherlessCharacterSlice.actions;

export default motherlessCharacterSlice.reducer;
