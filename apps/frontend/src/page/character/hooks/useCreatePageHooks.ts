import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import {
  createCharacterThunk,
  ValidationError,
} from '@lostrpg/frontend/entities/character';
import { useEditFormHooks } from '@lostrpg/frontend/features/character';
import { useAppDispatch } from '@lostrpg/frontend/shared/lib/store';

const handleCreateError = (error: unknown) => {
  console.warn(error);
  alert('保存中にエラーが発生しました。もう一度お試しください。');
};

export const useCreatePageHooks = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const editForm = useEditFormHooks();
  const { setIsValidError, handleImageUpload } = editForm;

  const handleSave = useCallback(async () => {
    try {
      const { id } = await dispatch(
        createCharacterThunk({ handleImageUpload })
      ).unwrap();

      navigate(`/character/${id}`);
    } catch (error) {
      // バリデーションエラーの場合はUIステートを更新
      if (error instanceof ValidationError) {
        setIsValidError(true);
        window.scrollTo(0, 0);
        return;
      }
      handleCreateError(error);
    }
  }, [dispatch, navigate, setIsValidError, handleImageUpload]);

  const handleDelete = undefined;

  return {
    ...editForm,
    handleSave,
    handleDelete,
  };
};
