import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  createRecordThunk,
  isValidationError,
} from '@lostrpg/frontend/entities/record';
import { useEditFormHooks } from '@lostrpg/frontend/features/character';
import { handleSaveError } from '@lostrpg/frontend/shared/lib/error';
import { useAppDispatch } from '@lostrpg/frontend/shared/lib/store';

export const useCreatePageHooks = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const editForm = useEditFormHooks();
  const { setIsValidError } = editForm;
  const { id } = useParams();

  const handleSave = useCallback(async () => {
    if (!id) {
      handleSaveError(new Error('Character ID is required'));
      return;
    }

    try {
      await dispatch(createRecordThunk({ characterId: id })).unwrap();

      // キャラクターページに戻る
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
  }, [dispatch, id, navigate, setIsValidError]);

  const handleDelete = undefined;

  return {
    ...editForm,
    handleSave,
    handleDelete,
    prevPath: `/character/${id}`,
  };
};
