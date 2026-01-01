/* eslint-disable consistent-return */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { recordApi } from '../api/api';
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
 * 新規レコード作成Thunk
 */
export const createRecordThunk = createAsyncThunk<
  void,
  { characterId: string },
  { rejectValue: ValidationErrorType }
>(
  'record/create',
  async ({ characterId }, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    const { character, record } = state;
    const { password } = state.characterForm;

    // バリデーション: 必須フィールドをチェック
    if (!character.name) {
      return rejectWithValue({
        type: 'validation',
        message: 'キャラクター名は必須です',
      });
    }

    if (!record.title) {
      return rejectWithValue({
        type: 'validation',
        message: 'シナリオ名は必須です',
      });
    }

    // レコード作成
    await dispatch(
      recordApi.endpoints.createRecord.initiate({
        characterId,
        data: {
          name: record.title, // シナリオ名をレコード名として使用
          character,
          record,
          password: password || undefined,
        },
      }),
    ).unwrap();
  },
);

/**
 * レコード更新Thunk
 */
export const updateRecordThunk = createAsyncThunk<
  void,
  { characterId: string; recordId: string },
  { rejectValue: ValidationErrorType | FetchBaseQueryError }
>(
  'record/update',
  async (
    { characterId, recordId },
    { getState, dispatch, rejectWithValue },
  ) => {
    const state = getState() as RootState;
    const { character, record } = state;
    const { password } = state.characterForm;

    // バリデーション: 必須フィールドをチェック
    if (!character.name) {
      return rejectWithValue({
        type: 'validation',
        message: 'キャラクター名は必須です',
      });
    }

    if (!record.title) {
      return rejectWithValue({
        type: 'validation',
        message: 'シナリオ名は必須です',
      });
    }

    try {
      // レコード更新
      await dispatch(
        recordApi.endpoints.updateRecord.initiate({
          characterId,
          id: recordId,
          data: {
            name: record.title, // シナリオ名をレコード名として使用
            character,
            record,
            password: password || undefined,
          },
        }),
      ).unwrap();
    } catch (e) {
      return rejectWithValue(e as FetchBaseQueryError);
    }
  },
);
