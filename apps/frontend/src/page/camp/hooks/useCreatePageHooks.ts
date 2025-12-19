import { useNavigate } from 'react-router';
import {
  createCampAction,
  updateCampAction,
} from '@lostrpg/frontend/entities/camp';
import { useEditFormHooks } from '@lostrpg/frontend/features/camp';
import { useAppDispatch } from '@lostrpg/frontend/shared/lib/store';

const handleCreateError = (error: unknown) => {
  console.warn(error);
  alert('保存中にエラーが発生しました。もう一度お試しください。');
};

export const useCreatePageHooks = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const editForm = useEditFormHooks();
  const { camp, setIsValidError, handleImageUpload } = editForm;

  const handleSave = async () => {
    if (!camp.name) {
      setIsValidError(true);
      window.scrollTo(0, 0);
      return;
    }

    try {
      // まずキャンプを作成
      const { id } = await dispatch(createCampAction({ data: camp })).unwrap();

      // 画像がある場合はアップロード
      const imageUrl = await handleImageUpload(id, camp.password);

      // imageUrlがある場合は更新
      if (imageUrl) {
        await dispatch(
          updateCampAction({ id, data: { ...camp, imageUrl } }),
        ).unwrap();
      }

      navigate(`/camp/${id}`);
    } catch (error) {
      handleCreateError(error);
    }
  };

  const handleDelete = undefined;

  return {
    ...editForm,
    handleSave,
    handleDelete,
  };
};
