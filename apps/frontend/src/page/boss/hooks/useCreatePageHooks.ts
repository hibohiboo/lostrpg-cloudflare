import { useNavigate } from 'react-router';
import {
  createBossAction,
  updateBossAction,
} from '@lostrpg/frontend/entities/boss';
import { useEditFormHooks } from '@lostrpg/frontend/features/boss';
import { handleSaveError } from '@lostrpg/frontend/shared/lib/error';
import { useAppDispatch } from '@lostrpg/frontend/shared/lib/store';

export const useCreatePageHooks = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const editForm = useEditFormHooks();
  const { boss, setIsValidError, handleImageUpload } = editForm;

  const handleSave = async () => {
    if (!boss.name) {
      setIsValidError(true);
      window.scrollTo(0, 0);
      return;
    }

    try {
      // まずヌシを作成
      const { id } = await dispatch(createBossAction({ data: boss })).unwrap();

      // 画像がある場合はアップロード
      const imageUrl = await handleImageUpload(id, boss.password);

      // imageUrlがある場合は更新
      if (imageUrl) {
        await dispatch(
          updateBossAction({ id, data: { ...boss, imageUrl } }),
        ).unwrap();
      }

      navigate(`/boss/${id}`);
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
