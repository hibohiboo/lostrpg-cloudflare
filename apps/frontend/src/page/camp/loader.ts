import { Camp, getCampAction } from '@lostrpg/frontend/entities/camp';
import { setCamp } from '@lostrpg/frontend/features/camp';
import type { LoaderFunctionArgs } from 'react-router';

const getCamp = async (dispatch: AppDispatch, id?: string) => {
  if (!id) {
    throw new Error('IDが指定されていません');
  }

  const camp = await dispatch(getCampAction({ id })).unwrap();

  if (!camp) {
    throw new Error('データが見つかりません');
  }

  return camp;
};

export const createCampDetailLoader =
  (dispatch: AppDispatch) =>
  async ({ params }: LoaderFunctionArgs): Promise<Camp> => {
    const { id } = params;
    const camp = await getCamp(dispatch, id);

    return camp;
  };

export const createCampEditLoader =
  (dispatch: AppDispatch) =>
  async ({ params }: LoaderFunctionArgs): Promise<Camp> => {
    const { id } = params;
    const camp = await getCamp(dispatch, id);
    dispatch(setCamp(camp));
    console.log(id, camp);
    return camp;
  };
