import { setCharacter } from '@lostrpg/frontend/features/character';
import type { LoaderFunctionArgs } from 'react-router';

const getCharacter = async (id?: string) => {
  if (!id) {
    throw new Error('IDが指定されていません');
  }

  // RTK Queryを使用する場合、loaderではなくコンポーネント内でuseGetCharacterQueryを使用することを推奨
  // ここでは仮実装として、fetchを使用してデータを取得します
  const response = await fetch(`/api/characters/${id}`);

  if (!response.ok) {
    throw new Error('データが見つかりません');
  }

  const character = await response.json();

  return character;
};

export const createCharacterDetailLoader =
  (dispatch: AppDispatch) =>
  async ({ params }: LoaderFunctionArgs) => {
    const { id } = params;
    const character = await getCharacter(id);
    dispatch(setCharacter(character));
    return character;
  };

export const createCharacterEditLoader =
  (dispatch: AppDispatch) =>
  async ({ params }: LoaderFunctionArgs) => {
    const { id } = params;
    const character = await getCharacter(id);
    dispatch(setCharacter(character));
    console.log(id, character);
    return character;
  };
