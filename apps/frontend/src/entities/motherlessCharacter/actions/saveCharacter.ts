import { createAsyncThunk } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { motherlessCharacterApi } from '../api/api';
import type { RootState } from '@lostrpg/frontend/app/store';

export type ValidationErrorType = {
  type: 'validation';
  message: string;
};

export const isValidationError = (
  error: unknown,
): error is ValidationErrorType =>
  typeof error === 'object' &&
  error !== null &&
  'type' in error &&
  error.type === 'validation';

const buildRequestData = (character: RootState['motherlessCharacter']) => ({
  playerName: character.playerName,
  name: character.name,
  imageUrl: character.imageUrl,
  level: character.level,
  trait: character.trait,
  classes: character.classes,
  totalExperience: character.totalExperience,
  unusedExperience: character.unusedExperience,
  abilities: character.abilities,
  hp: character.hp,
  tp: character.tp,
  acquiredSkills: character.acquiredSkills,
  items: character.items,
  equipments: character.equipments,
  statusAilments: character.statusAilments,
  bodyDamages: character.bodyDamages,
  summary: character.summary,
  appearance: character.appearance,
  freeWriting: character.freeWriting,
  quote: character.quote,
  password: character.password,
  hideFromList: character.hideFromList,
});

export const createMotherlessCharacterThunk = createAsyncThunk<
  { id: string },
  {
    handleImageUpload: (
      id: string,
      password: string | undefined | null,
    ) => Promise<string | null>;
  },
  { rejectValue: ValidationErrorType }
>(
  'motherlessCharacter/create',
  async ({ handleImageUpload }, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    const { motherlessCharacter: character } = state;

    if (!character.name) {
      return rejectWithValue({
        type: 'validation',
        message: 'キャラクター名は必須です',
      });
    }

    const createCharacterData = buildRequestData(character);

    const result = await dispatch(
      motherlessCharacterApi.endpoints.createMotherlessCharacter.initiate(
        createCharacterData,
      ),
    ).unwrap();

    const { id } = result;

    const imageUrl = await handleImageUpload(id, character.password);

    if (imageUrl) {
      await dispatch(
        motherlessCharacterApi.endpoints.updateMotherlessCharacter.initiate({
          id,
          data: { ...createCharacterData, imageUrl },
        }),
      ).unwrap();
    }

    return { id };
  },
);

export const updateMotherlessCharacterThunk = createAsyncThunk<
  { id: string },
  {
    id: string;
    handleImageUpload: (
      id: string,
      password: string | undefined | null,
    ) => Promise<string | null>;
  },
  { rejectValue: ValidationErrorType | FetchBaseQueryError }
>(
  'motherlessCharacter/update',
  async (
    { id, handleImageUpload },
    { getState, dispatch, rejectWithValue },
  ) => {
    const state = getState() as RootState;
    const { motherlessCharacter: character } = state;

    if (!character.name) {
      return rejectWithValue({
        type: 'validation',
        message: 'キャラクター名は必須です',
      });
    }

    const imageUrl = await handleImageUpload(id, character.password);

    const updateData = {
      ...buildRequestData(character),
      imageUrl: imageUrl || character.imageUrl,
    };

    try {
      await dispatch(
        motherlessCharacterApi.endpoints.updateMotherlessCharacter.initiate({
          id,
          data: updateData,
        }),
      ).unwrap();
    } catch (e) {
      return rejectWithValue(e as FetchBaseQueryError);
    }

    return { id };
  },
);
