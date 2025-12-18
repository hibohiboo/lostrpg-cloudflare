import { useNavigate, useParams } from 'react-router';
import {
  deleteCampAction,
  updateCampAction,
} from '@lostrpg/frontend/entities/camp';
import { useEditFormHooks } from '@lostrpg/frontend/features/camp';
import { useAppDispatch } from '@lostrpg/frontend/shared/lib/store';

const handleUpdateError = (error: unknown) => {
  console.log('error', error);
  // パスワードエラーまたは認証エラーの場合
  if (
    error &&
    typeof error === 'object' &&
    'status' in error &&
    error.status === 401
  ) {
    alert('パスワードが正しくありません。もう一度お試しください。');
  } else {
    // その他のエラー
    alert('保存中にエラーが発生しました。もう一度お試しください。');
  }
};

export const useEditPageHooks = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const editForm = useEditFormHooks();
  const { camp, setIsValidError } = editForm;

  const handleSave = async () => {
    if (!camp.name) {
      setIsValidError(true);
      window.scrollTo(0, 0);
      return;
    }
    if (!id) return;

    try {
      await dispatch(updateCampAction({ id, data: camp })).unwrap();
      navigate(`/camp/${id}`);
    } catch (error) {
      handleUpdateError(error);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm('本当に削除しますか？')) return;

    await dispatch(deleteCampAction({ id })).unwrap();
    navigate('/camp');
  };
  return {
    ...editForm,
    handleSave,
    handleDelete,
  };
};
