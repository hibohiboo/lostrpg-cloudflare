import { useNavigate } from 'react-router';
import { createBossAction } from '@lostrpg/frontend/entities/boss';
import { useEditFormHooks } from '@lostrpg/frontend/features/boss';
import { handleSaveError } from '@lostrpg/frontend/shared/lib/error';
import { useAppDispatch } from '@lostrpg/frontend/shared/lib/store';

export const useCreatePageHooks = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const editForm = useEditFormHooks();
  const { boss, setIsValidError } = editForm;

  const handleSave = async () => {
    if (!boss.name) {
      setIsValidError(true);
      window.scrollTo(0, 0);
      return;
    }

    try {
      const { id } = await dispatch(createBossAction({ data: boss })).unwrap();

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
