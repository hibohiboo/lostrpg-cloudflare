import { items } from '@lostrpg/core/game-data/item';
import {
  specialtiesTableGaps,
  bodyParts,
  specialtyRows,
} from '@lostrpg/core/game-data/speciality';
import { CharacterItem, Equipment } from '@lostrpg/schemas/validation/items';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// 身体部位の位置を見つける
const findBodyPartPosition = (
  bodyPartName: string,
): { row: number; col: number } | null => {
  for (let col = 0; col < specialtyRows.length; col += 1) {
    for (let row = 0; row < specialtyRows[col].length; row += 1) {
      if (specialtyRows[col][row].name === bodyPartName) {
        return { row, col };
      }
    }
  }
  return null;
};

// 周囲8マスのオフセット
const SURROUNDING_OFFSETS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

// 身体部位の周囲8マスの特技を取得する
const getSurroundingSpecialties = (bodyPartName: string): string[] => {
  const position = findBodyPartPosition(bodyPartName);
  if (!position) return [];

  const surrounding: string[] = [];

  SURROUNDING_OFFSETS.forEach(([colOffset, rowOffset]) => {
    const newCol = position.col + colOffset;
    const newRow = position.row + rowOffset;

    if (
      newCol >= 0 &&
      newCol < specialtyRows.length &&
      newRow >= 0 &&
      newRow < specialtyRows[newCol].length
    ) {
      const specialty = specialtyRows[newCol][newRow];
      if (!bodyParts.includes(specialty.name)) {
        surrounding.push(specialty.name);
      }
    }
  });

  return surrounding;
};

export type Gap = (typeof specialtiesTableGaps)[number];

export interface CharacterClass {
  id: string;
  name: string;
}

export interface Ability {
  name: string;
  group: string;
  type: string;
  recoil: string;
  specialty: string;
  target: string;
  effect: string;
}

export interface Bag {
  id: string;
  name: string;
  capacity: number;
  items: CharacterItem[];
}

export interface StatusAilment {
  id: string;
  name: string;
  effect: string;
  isChecked: boolean;
}

export interface Backbone {
  id: string;
  name: string;
  type: string;
  effect: string;
}

export interface CharacterFormData {
  playerName: string;
  name: string;
  campId: string;
  imageUrl: string;
  classes: CharacterClass[];
  specialties: string[];
  gaps: Gap[];
  damagedSpecialties: string[];
  abilities: Ability[];
  staminaBase: number;
  stamina: number;
  willPowerBase: number;
  willPower: number;
  carryingCapacity: number;
  items: CharacterItem[];
  equipment: Equipment[];
  bags: Bag[];
  statusAilments: StatusAilment[];
  backbones: Backbone[];
  unusedExperience: number;
  totalExperience: number;
  summary: string;
  appearance: string;
  freeWriting: string;
  quote: string;
  useStrangeField: boolean;
  useDragonPlain: boolean;
  password?: string;
}

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
  equipment: [],
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
  statusAilments: [
    {
      id: '1',
      name: '毒',
      effect: 'ラウンド終了時に2D6ダメージ',
      isChecked: false,
    },
    { id: '2', name: '呪い', effect: '判定-1D6', isChecked: false },
    { id: '3', name: '気絶', effect: '行動不能', isChecked: false },
  ],
  backbones: [],
  unusedExperience: 0,
  totalExperience: 0,
  summary: '',
  appearance: '',
  freeWriting: '',
  quote: '',
  useStrangeField: false,
  useDragonPlain: false,
};

export const characterSlice = createSlice({
  name: 'character',
  initialState,
  reducers: {
    setCharacter: (_, action: PayloadAction<CharacterFormData>) =>
      action.payload,
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
      const specialtyName = action.payload;
      const index = state.damagedSpecialties.indexOf(specialtyName);
      const isBodyPart = bodyParts.includes(specialtyName);

      if (index !== -1) {
        // ダメージを削除
        state.damagedSpecialties.splice(index, 1);

        // 身体部位の場合、周囲8マスの特技からもダメージを削除
        if (isBodyPart) {
          const surrounding = getSurroundingSpecialties(specialtyName);

          // 他のダメージを受けている身体部位の周囲8マスを集計
          const otherDamagedBodyParts = state.damagedSpecialties.filter(
            (s) => bodyParts.includes(s) && s !== specialtyName,
          );
          const protectedSpecialties = new Set<string>();
          otherDamagedBodyParts.forEach((bodyPart) => {
            getSurroundingSpecialties(bodyPart).forEach((s) =>
              protectedSpecialties.add(s),
            );
          });

          // 他の身体部位の影響を受けていない特技のみダメージを削除
          surrounding.forEach((surroundingSpecialty) => {
            if (!protectedSpecialties.has(surroundingSpecialty)) {
              const surroundingIndex =
                state.damagedSpecialties.indexOf(surroundingSpecialty);
              if (surroundingIndex !== -1) {
                state.damagedSpecialties.splice(surroundingIndex, 1);
              }
            }
          });
        }
      } else {
        // ダメージを追加
        state.damagedSpecialties.push(specialtyName);

        // 身体部位の場合、周囲8マスの特技にもダメージを追加
        if (isBodyPart) {
          const surrounding = getSurroundingSpecialties(specialtyName);
          surrounding.forEach((surroundingSpecialty) => {
            if (!state.damagedSpecialties.includes(surroundingSpecialty)) {
              state.damagedSpecialties.push(surroundingSpecialty);
            }
          });
        }
      }
    },
    addAbility: (state, action: PayloadAction<Ability>) => {
      state.abilities.push(action.payload);
    },
    updateAbility: (state, action: PayloadAction<Ability>) => {
      const index = state.abilities.findIndex(
        (a) => a.name === action.payload.name,
      );
      if (index !== -1) {
        state.abilities[index] = action.payload;
      }
    },
    deleteAbility: (state, action: PayloadAction<Ability>) => {
      state.abilities = state.abilities.filter(
        (a) => a.name !== action.payload.name,
      );
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
      state.equipment.push(action.payload);
    },
    updateEquipment: (state, action: PayloadAction<Equipment>) => {
      const index = state.equipment.findIndex(
        (e) => e.id === action.payload.id,
      );
      if (index !== -1) {
        state.equipment[index] = action.payload;
      }
    },
    deleteEquipment: (state, action: PayloadAction<string>) => {
      state.equipment = state.equipment.filter((e) => e.id !== action.payload);
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
      const ailment = state.statusAilments.find((a) => a.id === action.payload);
      if (ailment) {
        ailment.isChecked = !ailment.isChecked;
      }
    },
    addBackbone: (state, action: PayloadAction<Backbone>) => {
      state.backbones.push(action.payload);
    },
    updateBackbone: (state, action: PayloadAction<Backbone>) => {
      const index = state.backbones.findIndex(
        (b) => b.id === action.payload.id,
      );
      if (index !== -1) {
        state.backbones[index] = action.payload;
      }
    },
    deleteBackbone: (state, action: PayloadAction<string>) => {
      state.backbones = state.backbones.filter((b) => b.id !== action.payload);
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
  resetCharacter,
} = characterSlice.actions;

export default characterSlice.reducer;
