import { getEnemyAction } from '@lostrpg/frontend/entities/enemy';
import { resetEnemy, setEnemy } from '@lostrpg/frontend/features/enemy';
import type { LoaderFunctionArgs } from 'react-router';

export const createEnemyLoader =
  (dispatch: AppDispatch) =>
  async ({ params }: LoaderFunctionArgs) => {
    const { id } = params;
    if (!id) throw new Error('id が指定されていません');

    const enemy = await dispatch(getEnemyAction({ id })).unwrap();
    if (!enemy) {
      throw new Error('データが見つかりません');
    }

    dispatch(setEnemy(enemy));
    return enemy;
  };

// 新規作成ページを開いたとき、前に編集していたデータが残らないようにリセットする
export const createEnemyCreateLoader = (dispatch: AppDispatch) => () => {
  dispatch(resetEnemy());
  return null;
};
