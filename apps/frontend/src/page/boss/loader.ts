import { getBossAction } from '@lostrpg/frontend/entities/boss';
import { resetBoss, setBoss } from '@lostrpg/frontend/features/boss';
import type { LoaderFunctionArgs } from 'react-router';

export const createBossLoader =
  (dispatch: AppDispatch) =>
  async ({ params }: LoaderFunctionArgs) => {
    const { id } = params;
    if (!id) throw new Error('id が指定されていません');

    const boss = await dispatch(getBossAction({ id })).unwrap();
    if (!boss) {
      throw new Error('データが見つかりません');
    }

    dispatch(setBoss(boss));
    return boss;
  };

// 新規作成ページを開いたとき、前に編集していたデータが残らないようにリセットする
export const createBossCreateLoader = (dispatch: AppDispatch) => () => {
  dispatch(resetBoss());
  return null;
};
