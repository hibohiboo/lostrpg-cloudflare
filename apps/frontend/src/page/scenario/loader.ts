import { Scenario, getScenarioAction } from '@lostrpg/frontend/entities/scenario';
import { resetScenario, setScenario } from '@lostrpg/frontend/features/scenario';
import type { LoaderFunctionArgs } from 'react-router';

const getScenario = async (dispatch: AppDispatch, id?: string) => {
  if (!id) {
    throw new Error('IDが指定されていません');
  }

  const scenario = await dispatch(getScenarioAction({ id })).unwrap();

  if (!scenario) {
    throw new Error('データが見つかりません');
  }

  return scenario;
};

export const createScenarioLoader =
  (dispatch: AppDispatch) =>
  async ({ params }: LoaderFunctionArgs): Promise<Scenario> => {
    const { id } = params;
    const scenario = await getScenario(dispatch, id);
    dispatch(setScenario(scenario));
    return scenario;
  };

// 新規作成ページを開いたとき、前に編集していたデータが残らないようにリセットする
export const createScenarioCreateLoader = (dispatch: AppDispatch) => () => {
  dispatch(resetScenario());
  return null;
};
