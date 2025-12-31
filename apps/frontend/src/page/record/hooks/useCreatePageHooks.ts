import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import {
  createCharacterThunk,
  isValidationError,
} from '@lostrpg/frontend/entities/character';
import { useEditFormHooks } from '@lostrpg/frontend/features/character';
import { handleSaveError } from '@lostrpg/frontend/shared/lib/error';
import { useAppDispatch } from '@lostrpg/frontend/shared/lib/store';

export const useCreatePageHooks = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const editForm = useEditFormHooks();
  const { setIsValidError, handleImageUpload } = editForm;

  const handleSave = useCallback(async () => {
    try {
      const { id } = await dispatch(
        createCharacterThunk({ handleImageUpload }),
      ).unwrap();

      navigate(`/character/${id}`);
    } catch (error) {
      // バリデーションエラーの場合はUIステートを更新
      if (isValidationError(error)) {
        setIsValidError(true);
        window.scrollTo(0, 0);
        return;
      }
      handleSaveError(error);
    }
  }, [dispatch, navigate, setIsValidError, handleImageUpload]);

  const handleDelete = undefined;

  return {
    ...editForm,
    handleSave,
    handleDelete,
  };
};
