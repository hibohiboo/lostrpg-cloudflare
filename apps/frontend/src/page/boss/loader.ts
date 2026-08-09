import { getBossAction } from '@lostrpg/frontend/entities/boss';
import { setBoss } from '@lostrpg/frontend/features/boss';
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
