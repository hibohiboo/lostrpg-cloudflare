import { characterApi } from '@lostrpg/frontend/entities/character';
import { recordApi, setRecord } from '@lostrpg/frontend/entities/record';
import { setCharacter } from '@lostrpg/frontend/features/character';
import type { LoaderFunctionArgs } from 'react-router';

export const createCharacterLoader =
  (dispatch: AppDispatch) =>
  async ({ params }: LoaderFunctionArgs) => {
    const { id } = params;
    if (!id) throw new Error('id が指定されていません');
    const ret = await dispatch(
      characterApi.endpoints.getCharacter.initiate(id),
    );
    if (ret.error) {
      throw new Error('データが見つかりません');
    }
    const { data } = ret;
    if (!data) {
      throw new Error('データが見つかりません');
    }
    const character = data.data;
    dispatch(setCharacter(character));
    return character;
  };
export const createRecordLoader =
  (dispatch: AppDispatch) =>
  async ({ params }: LoaderFunctionArgs) => {
    const { chracterId, id } = params;
    if (!id || chracterId) throw new Error('id が指定されていません');
    const ret = await dispatch(recordApi.endpoints.getRecord.initiate(id));
    if (ret.error) {
      throw new Error('データが見つかりません');
    }
    const { data } = ret;
    if (!data) {
      throw new Error('データが見つかりません');
    }
    const { character, record } = data.data;
    dispatch(setCharacter(character));
    dispatch(setRecord(record));

    return character;
  };
