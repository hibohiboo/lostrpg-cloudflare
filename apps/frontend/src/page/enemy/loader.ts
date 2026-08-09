import { getEnemyAction } from '@lostrpg/frontend/entities/enemy';
import { setEnemy } from '@lostrpg/frontend/features/enemy';
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
