import { useNavigate, useParams } from 'react-router';
import {
  deleteEnemyAction,
  updateEnemyAction,
} from '@lostrpg/frontend/entities/enemy';
import { useEditFormHooks } from '@lostrpg/frontend/features/enemy';
import { handleSaveError } from '@lostrpg/frontend/shared/lib/error';
import { useAppDispatch } from '@lostrpg/frontend/shared/lib/store';

export const useEditPageHooks = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const editForm = useEditFormHooks();
  const { enemy, setIsValidError, handleImageUpload } = editForm;

  const handleSave = async () => {
    if (!enemy.name) {
      setIsValidError(true);
      window.scrollTo(0, 0);
      return;
    }
    if (!id) return;

    try {
      // 画像がある場合は先にアップロード
      const imageUrl = await handleImageUpload(id, enemy.password);

      // imageUrlを含めて更新
      await dispatch(
        updateEnemyAction({
          id,
          data: imageUrl ? { ...enemy, imageUrl } : enemy,
        }),
      ).unwrap();

      navigate(`/enemy/${id}`);
    } catch (error) {
      handleSaveError(error);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm('本当に削除しますか？')) return;

    await dispatch(deleteEnemyAction({ id })).unwrap();
    navigate('/enemy');
  };

  return {
    ...editForm,
    handleSave,
    handleDelete,
  };
};
