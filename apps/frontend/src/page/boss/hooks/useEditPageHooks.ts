import { useNavigate, useParams } from 'react-router';
import { deleteBossAction, updateBossAction } from '@lostrpg/frontend/entities/boss';
import { useEditFormHooks } from '@lostrpg/frontend/features/boss';
import { handleSaveError } from '@lostrpg/frontend/shared/lib/error';
import { useAppDispatch } from '@lostrpg/frontend/shared/lib/store';

export const useEditPageHooks = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const editForm = useEditFormHooks();
  const { boss, setIsValidError, handleImageUpload } = editForm;

  const handleSave = async () => {
    if (!boss.name) {
      setIsValidError(true);
      window.scrollTo(0, 0);
      return;
    }
    if (!id) return;

    try {
      // 画像がある場合は先にアップロード
      const imageUrl = await handleImageUpload(id, boss.password);

      // imageUrlを含めて更新
      await dispatch(
        updateBossAction({ id, data: imageUrl ? { ...boss, imageUrl } : boss }),
      ).unwrap();

      navigate(`/boss/${id}`);
    } catch (error) {
      handleSaveError(error);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm('本当に削除しますか？')) return;

    await dispatch(deleteBossAction({ id })).unwrap();
    navigate('/boss');
  };

  return {
    ...editForm,
    handleSave,
    handleDelete,
  };
};
