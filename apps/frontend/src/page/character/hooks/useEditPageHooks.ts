import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  updateCharacterThunk,
  useDeleteCharacterMutation,
  ValidationError,
} from '@lostrpg/frontend/entities/character';
import { useEditFormHooks } from '@lostrpg/frontend/features/character';
import { useAppDispatch } from '@lostrpg/frontend/shared/lib/store';

const handleUpdateError = (error: unknown) => {
  console.warn(error);
  if (error) {
    const err = error as { originalStatus?: number };
    if (err.originalStatus === 401) {
      alert('パスワードが正しくありません。もう一度お試しください。');
      return;
    }
  }

  // その他のエラー
  alert('保存中にエラーが発生しました。もう一度お試しください。');
};

export const useEditPageHooks = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const [deleteCharacter] = useDeleteCharacterMutation();
  const editForm = useEditFormHooks();
  const { setIsValidError, handleImageUpload } = editForm;

  const handleSave = useCallback(async () => {
    if (!id) return;

    try {
      await dispatch(
        updateCharacterThunk({ id, handleImageUpload })
      ).unwrap();

      navigate(`/character/${id}`);
    } catch (error) {
      // バリデーションエラーの場合はUIステートを更新
      if (error instanceof ValidationError) {
        setIsValidError(true);
        window.scrollTo(0, 0);
        return;
      }
      handleUpdateError(error);
    }
  }, [id, dispatch, navigate, setIsValidError, handleImageUpload]);

  const handleDelete = useCallback(async () => {
    if (!id) return;
    if (!window.confirm('本当に削除しますか？')) return;

    await deleteCharacter(id).unwrap();
    navigate('/character');
  }, [id, deleteCharacter, navigate]);

  return {
    ...editForm,
    handleSave,
    handleDelete,
  };
};
