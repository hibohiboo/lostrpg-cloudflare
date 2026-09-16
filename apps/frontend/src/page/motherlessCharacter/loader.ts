import { motherlessCharacterApi } from '@lostrpg/frontend/entities/motherlessCharacter';
import {
  resetMotherlessCharacter,
  setMotherlessCharacter,
} from '@lostrpg/frontend/features/motherlessCharacter';
import type { LoaderFunctionArgs } from 'react-router';

export const createMotherlessCharacterLoader =
  (dispatch: AppDispatch) =>
  async ({ params }: LoaderFunctionArgs) => {
    const { id } = params;
    if (!id) throw new Error('id が指定されていません');
    const ret = await dispatch(
      motherlessCharacterApi.endpoints.getMotherlessCharacter.initiate(id),
    );
    if (ret.error) {
      throw new Error('データが見つかりません');
    }
    const { data } = ret;
    if (!data) {
      throw new Error('データが見つかりません');
    }
    const character = data.data;
    dispatch(setMotherlessCharacter(character));
    return character;
  };

// 新規作成ページを開いたとき、前に編集していたデータが残らないようにリセットする
export const createMotherlessCharacterCreateLoader =
  (dispatch: AppDispatch) => () => {
    dispatch(resetMotherlessCharacter());
    return null;
  };
