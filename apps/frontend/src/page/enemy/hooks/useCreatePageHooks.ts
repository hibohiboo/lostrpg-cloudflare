import { useNavigate } from 'react-router';
import {
  createEnemyAction,
  updateEnemyAction,
} from '@lostrpg/frontend/entities/enemy';
import { useEditFormHooks } from '@lostrpg/frontend/features/enemy';
import { handleSaveError } from '@lostrpg/frontend/shared/lib/error';
import { useAppDispatch } from '@lostrpg/frontend/shared/lib/store';

export const useCreatePageHooks = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const editForm = useEditFormHooks();
  const { enemy, setIsValidError, handleImageUpload } = editForm;

  const handleSave = async () => {
    if (!enemy.name) {
      setIsValidError(true);
      window.scrollTo(0, 0);
      return;
    }

    try {
      // まずエネミーを作成
      const { id } = await dispatch(
        createEnemyAction({ data: enemy }),
      ).unwrap();

      // 画像がある場合はアップロード
      const imageUrl = await handleImageUpload(id, enemy.password);

      // imageUrlがある場合は更新
      if (imageUrl) {
        await dispatch(
          updateEnemyAction({ id, data: { ...enemy, imageUrl } }),
        ).unwrap();
      }

      navigate(`/enemy/${id}`);
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
