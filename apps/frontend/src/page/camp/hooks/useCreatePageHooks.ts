import { useNavigate } from 'react-router';
import {
  createCampAction,
  useEditFormHooks,
} from '@lostrpg/frontend/features/camp';
import { useAppDispatch } from '@lostrpg/frontend/shared/lib/store';

export const useCreatePageHooks = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const editForm = useEditFormHooks();
  const { camp, setIsValidError } = editForm;

  const handleSave = async () => {
    if (!camp.name) {
      setIsValidError(true);
      window.scrollTo(0, 0);
      return;
    }
    const { id } = await dispatch(createCampAction({ data: camp })).unwrap();

    navigate(`/camp/${id}`);
  };

  const handleDelete = undefined;

  return {
    ...editForm,
    handleSave,
    handleDelete,
  };
};
