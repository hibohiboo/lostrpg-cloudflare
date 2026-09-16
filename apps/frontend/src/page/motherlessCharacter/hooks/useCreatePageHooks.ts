import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import {
  createMotherlessCharacterThunk,
  isValidationError,
} from '@lostrpg/frontend/entities/motherlessCharacter';
import { useEditFormHooks } from '@lostrpg/frontend/features/motherlessCharacter';
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
        createMotherlessCharacterThunk({ handleImageUpload }),
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
  }, [dispatch, navigate, setIsValidError, handleImageUpload]);

  const handleDelete = undefined;

  return {
    ...editForm,
    handleSave,
    handleDelete,
  };
};
