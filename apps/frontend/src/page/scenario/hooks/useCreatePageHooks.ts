import { useNavigate } from 'react-router';
import {
  createScenarioAction,
  updateScenarioAction,
} from '@lostrpg/frontend/entities/scenario';
import { useEditFormHooks } from '@lostrpg/frontend/features/scenario';
import { handleSaveError } from '@lostrpg/frontend/shared/lib/error';
import { useAppDispatch } from '@lostrpg/frontend/shared/lib/store';

export const useCreatePageHooks = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const editForm = useEditFormHooks();
  const { scenario, setIsValidError, handleImageUpload } = editForm;

  const handleSave = async () => {
    if (!scenario.name) {
      setIsValidError(true);
      window.scrollTo(0, 0);
      return;
    }

    try {
      // まずシナリオを作成
      const { id } = await dispatch(
        createScenarioAction({ data: scenario }),
      ).unwrap();

      // 画像がある場合はアップロード
      const imageUrl = await handleImageUpload(id, scenario.password);

      // imageUrlがある場合は更新
      if (imageUrl) {
        await dispatch(
          updateScenarioAction({ id, data: { ...scenario, imageUrl } }),
        ).unwrap();
      }

      navigate(`/scenario/${id}`);
    } catch (error) {
      handleSaveError(error);
    }
  };

  const handleDelete = undefined;

  return {
    ...editForm,
    handleSave,
    handleDelete,
  };
};
