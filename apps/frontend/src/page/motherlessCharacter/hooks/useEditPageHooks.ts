import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  updateMotherlessCharacterThunk,
  useDeleteMotherlessCharacterMutation,
  isValidationError,
} from '@lostrpg/frontend/entities/motherlessCharacter';
import { useEditFormHooks } from '@lostrpg/frontend/features/motherlessCharacter';
import { handleSaveError } from '@lostrpg/frontend/shared/lib/error';
import { useAppDispatch } from '@lostrpg/frontend/shared/lib/store';

export const useEditPageHooks = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const [deleteCharacter] = useDeleteMotherlessCharacterMutation();
  const editForm = useEditFormHooks();
  const { setIsValidError, handleImageUpload } = editForm;

  const handleSave = useCallback(async () => {
    if (!id) return;

    try {
      await dispatch(
        updateMotherlessCharacterThunk({ id, handleImageUpload }),
      ).unwrap();

      navigate(`/motherless/characters/${id}`);
    } catch (error) {
      if (isValidationError(error)) {
        setIsValidError(true);
        window.scrollTo(0, 0);
        return;
      }
      handleSaveError(error);
    }
  }, [id, dispatch, navigate, setIsValidError, handleImageUpload]);

  const handleDelete = useCallback(async () => {
    if (!id) return;
    if (!window.confirm('本当に削除しますか？')) return;

    await deleteCharacter(id).unwrap();
    navigate('/motherless/characters');
  }, [id, deleteCharacter, navigate]);

  return {
    ...editForm,
    handleSave,
    handleDelete,
  };
};
