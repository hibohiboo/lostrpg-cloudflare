import { items } from '@lostrpg/core/game-data/item';
import {
  Ability,
  Backbone,
  Bag,
  CharacterClass,
  CreateCharacterRequest,
  Gap,
} from '@lostrpg/schemas/validation/character';
import { CharacterItem, Equipment } from '@lostrpg/schemas/validation/items';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { toggleDamagedSpecialtyList } from '@lostrpg/frontend/shared/lib/specialty';

export type CharacterFormData = CreateCharacterRequest;

const initialState: CharacterFormData = {
  playerName: '',
  name: '',
  campId: '',
  imageUrl: '',
  classes: [],
  specialties: [],
  gaps: [],
  damagedSpecialties: [],
  abilities: [],
  staminaBase: 5,
  stamina: 10,
  willPowerBase: 10,
  willPower: 10,
  carryingCapacity: 5,
  items: [
    {
      id: 'item-initial-backpack',
      number: 1,
      ...items.find((x) => x.name === 'リュックサック')!,
    },
  ],
  equipments: [],
  bags: [
    {
      id: 'bag-initial',
      name: 'リュックサック',
      capacity: 10,
      items: [
        {
          id: 'item-initial-jerky',
          number: 10,
          ...items.find((x) => x.name === 'ジャーキー')!,
        },
      ],
    },
  ],
  statusAilments: [],
  backbones: [],
  trophies: [],
  unusedExperience: 0,
  totalExperience: 0,
  summary: '',
  appearance: '',
  freeWriting: '',
  quote: '',
  supplements: {
    useStrangeField: false,
    useDragonPlain: false,
  },
};

// APIから取得したデータにデフォルト値を適用

const applyDefaults = (
  data: Partial<CharacterFormData>,
   
): CharacterFormData => ({
  ...initialState,
  ...data,
  classes: data.classes ?? [],
  specialties: data.specialties ?? [],
  gaps: data.gaps ?? [],
  damagedSpecialties: data.damagedSpecialties ?? [],
  abilities: data.abilities ?? [],
  equipments: data.equipments ?? [],
  backbones: data.backbones ?? [],
  trophies: data.trophies ?? [],
  items: data.items ?? initialState.items,
  bags: data.bags ?? initialState.bags,
  statusAilments: data.statusAilments ?? initialState.statusAilments,
  supplements: data.supplements ?? initialState.supplements,
});

export const characterSlice = createSlice({
  name: 'character',
  initialState,
  reducers: {
    setCharacter: (_, action: PayloadAction<CharacterFormData>) =>
      applyDefaults(action.payload),
    updateCharacter: (
      state,
      action: PayloadAction<Partial<CharacterFormData>>,
    ) => {
      Object.assign(state, action.payload);
    },
    addClass: (state, action: PayloadAction<CharacterClass>) => {
      state.classes.push(action.payload);
    },
    deleteClass: (state, action: PayloadAction<string>) => {
      state.classes = state.classes.filter((c) => c.id !== action.payload);
    },
    toggleSpecialty: (state, action: PayloadAction<string>) => {
      const index = state.specialties.indexOf(action.payload);
      if (index !== -1) {
        state.specialties.splice(index, 1);
      } else {
        state.specialties.push(action.payload);
      }
    },
    toggleGap: (state, action: PayloadAction<Gap>) => {
      const index = state.gaps.indexOf(action.payload);
      if (index !== -1) {
        state.gaps.splice(index, 1);
      } else {
        state.gaps.push(action.payload);
      }
    },
    toggleDamagedSpecialty: (state, action: PayloadAction<string>) => {
      state.damagedSpecialties = toggleDamagedSpecialtyList(
        state.damagedSpecialties,
        action.payload,
      );
    },
    addAbility: (state, action: PayloadAction<Ability>) => {
      state.abilities.push(action.payload);
    },
    updateAbility: (state, action: PayloadAction<Ability>) => {
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
    addItem: (state, action: PayloadAction<CharacterItem>) => {
      state.items.push(action.payload);
    },
    updateItem: (state, action: PayloadAction<CharacterItem>) => {
      const index = state.items.findIndex((i) => i.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    addEquipment: (state, action: PayloadAction<Equipment>) => {
      state.equipments.push(action.payload);
    },
    updateEquipment: (state, action: PayloadAction<Equipment>) => {
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
    addBag: (state, action: PayloadAction<Bag>) => {
      state.bags.push(action.payload);
    },
    updateBag: (state, action: PayloadAction<Bag>) => {
      const index = state.bags.findIndex((b) => b.id === action.payload.id);
      if (index !== -1) {
        state.bags[index] = action.payload;
      }
    },
    deleteBag: (state, action: PayloadAction<string>) => {
      state.bags = state.bags.filter((b) => b.id !== action.payload);
    },
    toggleStatusAilment: (state, action: PayloadAction<string>) => {
      const index = state.statusAilments.indexOf(action.payload);
      if (index !== -1) {
        state.statusAilments.splice(index, 1);
      } else {
        state.statusAilments.push(action.payload);
      }
    },
    addBackbone: (state, action: PayloadAction<Backbone>) => {
      state.backbones.push(action.payload);
    },
    updateBackbone: (state, action: PayloadAction<Backbone>) => {
      const index = state.backbones.findIndex(
        (b) => b.name === action.payload.name,
      );
      if (index !== -1) {
        state.backbones[index] = action.payload;
      }
    },
    deleteBackbone: (state, action: PayloadAction<Backbone>) => {
      state.backbones = state.backbones.filter(
        (b) => b.name !== action.payload.name,
      );
    },
    addTrophy: (state, action: PayloadAction<string>) => {
      if (!state.trophies.includes(action.payload)) {
        state.trophies.push(action.payload);
      }
    },
    deleteTrophy: (state, action: PayloadAction<string>) => {
      state.trophies = state.trophies.filter((t) => t !== action.payload);
    },
    setCampId: (state, action: PayloadAction<string | undefined>) => {
      state.campId = action.payload;
    },
    clearAllDamage: (state) => {
      state.damagedSpecialties = [];
    },
    resetCharacter: () => initialState,
  },
});

export const {
  setCharacter,
  updateCharacter,
  addClass,
  deleteClass,
  toggleSpecialty,
  toggleGap,
  toggleDamagedSpecialty,
  clearAllDamage,
  addAbility,
  updateAbility,
  deleteAbility,
  addItem,
  updateItem,
  deleteItem,
  addEquipment,
  updateEquipment,
  deleteEquipment,
  addBag,
  updateBag,
  deleteBag,
  toggleStatusAilment,
  addBackbone,
  updateBackbone,
  deleteBackbone,
  addTrophy,
  setCampId,
  deleteTrophy,
  resetCharacter,
} = characterSlice.actions;

export default characterSlice.reducer;
