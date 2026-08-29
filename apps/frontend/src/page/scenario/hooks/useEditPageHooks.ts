import { useNavigate, useParams } from 'react-router';
import {
  deleteScenarioAction,
  updateScenarioAction,
} from '@lostrpg/frontend/entities/scenario';
import { useEditFormHooks } from '@lostrpg/frontend/features/scenario';
import { handleSaveError } from '@lostrpg/frontend/shared/lib/error';
import { useAppDispatch } from '@lostrpg/frontend/shared/lib/store';

export const useEditPageHooks = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const editForm = useEditFormHooks();
  const { scenario, setIsValidError, handleImageUpload } = editForm;

  const handleSave = async () => {
    if (!scenario.name) {
      setIsValidError(true);
      window.scrollTo(0, 0);
      return;
    }
    if (!id) return;

    try {
      // 画像がある場合は先にアップロード
      const imageUrl = await handleImageUpload(id, scenario.password);

      // imageUrlを含めて更新
      await dispatch(
        updateScenarioAction({
          id,
          data: imageUrl ? { ...scenario, imageUrl } : scenario,
        }),
      ).unwrap();

      navigate(`/scenario/${id}`);
    } catch (error) {
      handleSaveError(error);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm('本当に削除しますか？')) return;

    await dispatch(deleteScenarioAction({ id })).unwrap();
    navigate('/scenario');
  };
  return {
    ...editForm,
    handleSave,
    handleDelete,
  };
};
