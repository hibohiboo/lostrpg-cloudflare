import { createAsyncThunk } from '@reduxjs/toolkit';
import { characterApi } from '../api/api';
import type { RootState } from '@lostrpg/frontend/app/store';

/**
 * バリデーションエラーの型定義
 */
export type ValidationErrorType = {
  type: 'validation';
  message: string;
};

/**
 * バリデーションエラーの型ガード
 */
export const isValidationError = (
  error: unknown,
): error is ValidationErrorType =>
  typeof error === 'object' &&
  error !== null &&
  'type' in error &&
  error.type === 'validation';

/**
 * 新規キャラクター作成Thunk
 */
export const createCharacterThunk = createAsyncThunk<
  { id: string },
  {
    handleImageUpload: (
      id: string,
      password: string | undefined,
    ) => Promise<string | null>;
  },
  { rejectValue: ValidationErrorType }
>(
  'character/create',
  async ({ handleImageUpload }, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    const { character } = state;

    // バリデーション
    if (!character.name) {
      return rejectWithValue({
        type: 'validation',
        message: 'キャラクター名は必須です',
      });
    }

    // キャラクター作成
    const result = await dispatch(
      characterApi.endpoints.createCharacter.initiate({
        playerName: character.playerName,
        name: character.name,
        campId: character.campId,
        imageUrl: character.imageUrl,
        classes: character.classes,
        specialties: character.specialties,
        gaps: character.gaps as ('A' | 'B' | 'C' | 'D' | 'E')[],
        damagedSpecialties: character.damagedSpecialties,
        abilities: character.abilities,
        staminaBase: character.staminaBase,
        stamina: character.stamina,
        willPowerBase: character.willPowerBase,
        willPower: character.willPower,
        carryingCapacity: character.carryingCapacity,
        items: character.items
          .filter((item) => item.id)
          .map((item) => ({
            ...item,
            id: item.id!,
            number: item.number || 1,
          })),
        equipments: character.equipment,
        bags: character.bags.map((bag) => ({
          ...bag,
          items: bag.items
            .filter((item) => item.id)
            .map((item) => ({
              ...item,
              id: item.id!,
              number: item.number || 1,
            })),
        })),
        statusAilments: character.statusAilments
          .filter((ailment) => ailment.isChecked)
          .map((ailment) => ailment.name),
        backbones: character.backbones,
        unusedExperience: character.unusedExperience,
        totalExperience: character.totalExperience,
        summary: character.summary,
        appearance: character.appearance,
        freeWriting: character.freeWriting,
        quote: character.quote,
        supplements: {
          useStrangeField: character.useStrangeField,
          useDragonPlain: character.useDragonPlain,
        },
        password: character.password,
      }),
    ).unwrap();

    const { id } = result;

    // 画像アップロード
    const imageUrl = await handleImageUpload(id, character.password);

    // 画像URLがある場合は更新
    if (imageUrl) {
      await dispatch(
        characterApi.endpoints.updateCharacter.initiate({
          id,
          data: { imageUrl },
        }),
      ).unwrap();
    }

    return { id };
  },
);

/**
 * キャラクター更新Thunk
 */
export const updateCharacterThunk = createAsyncThunk<
  { id: string },
  {
    id: string;
    handleImageUpload: (
      id: string,
      password: string | undefined,
    ) => Promise<string | null>;
  },
  { rejectValue: ValidationErrorType }
>(
  'character/update',
  async (
    { id, handleImageUpload },
    { getState, dispatch, rejectWithValue },
  ) => {
    const state = getState() as RootState;
    const { character } = state;

    // バリデーション
    if (!character.name) {
      return rejectWithValue({
        type: 'validation',
        message: 'キャラクター名は必須です',
      });
    }

    // 画像アップロード
    const imageUrl = await handleImageUpload(id, character.password);

    // キャラクター更新データを準備
    const updateData = {
      playerName: character.playerName,
      name: character.name,
      campId: character.campId,
      imageUrl: imageUrl || character.imageUrl,
      classes: character.classes,
      specialties: character.specialties,
      gaps: character.gaps as ('A' | 'B' | 'C' | 'D' | 'E')[],
      damagedSpecialties: character.damagedSpecialties,
      abilities: character.abilities,
      staminaBase: character.staminaBase,
      stamina: character.stamina,
      willPowerBase: character.willPowerBase,
      willPower: character.willPower,
      carryingCapacity: character.carryingCapacity,
      items: character.items
        .filter((item) => item.id)
        .map((item) => ({
          ...item,
          id: item.id!,
          number: item.number || 1,
        })),
      equipments: character.equipment,
      bags: character.bags.map((bag) => ({
        ...bag,
        items: bag.items
          .filter((item) => item.id)
          .map((item) => ({
            ...item,
            id: item.id!,
            number: item.number || 1,
          })),
      })),
      statusAilments: character.statusAilments
        .filter((ailment) => ailment.isChecked)
        .map((ailment) => ailment.name),
      backbones: character.backbones,
      unusedExperience: character.unusedExperience,
      totalExperience: character.totalExperience,
      summary: character.summary,
      appearance: character.appearance,
      freeWriting: character.freeWriting,
      quote: character.quote,
      supplements: {
        useStrangeField: character.useStrangeField,
        useDragonPlain: character.useDragonPlain,
      },
      password: character.password,
    };

    // キャラクター更新
    await dispatch(
      characterApi.endpoints.updateCharacter.initiate({
        id,
        data: updateData,
      }),
    ).unwrap();

    return { id };
  },
);
