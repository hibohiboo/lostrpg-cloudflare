import { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  useGetRecordQuery,
  updateRecordThunk,
  isValidationError,
  setRecord,
} from '@lostrpg/frontend/entities/record';
import {
  setCharacter,
  useEditFormHooks,
} from '@lostrpg/frontend/features/character';
import { handleSaveError } from '@lostrpg/frontend/shared/lib/error';
import { useAppDispatch } from '@lostrpg/frontend/shared/lib/store';

export const useEditPageHooks = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const editForm = useEditFormHooks();
  const { setIsValidError } = editForm;
  const { id: characterId, recordId } = useParams();

  // レコードデータを取得
  const { data: recordData, isLoading } = useGetRecordQuery(recordId!, {
    skip: !recordId,
  });

  // レコードデータをReduxストアに設定
  useEffect(() => {
    if (recordData?.data) {
      // characterデータをストアに設定
      if (recordData.data.character) {
        dispatch(setCharacter(recordData.data.character));
      }
      // recordデータをストアに設定
      if (recordData.data.record) {
        dispatch(setRecord(recordData.data.record));
      }
    }
  }, [recordData, dispatch]);

  const handleSave = useCallback(async () => {
    if (!characterId || !recordId) {
      handleSaveError(new Error('Character ID and Record ID are required'));
      return;
    }

    try {
      await dispatch(
        updateRecordThunk({ characterId, recordId }),
      ).unwrap();

      // キャラクターページに戻る
      navigate(`/character/${characterId}`);
    } catch (error) {
      // バリデーションエラーの場合はUIステートを更新
      if (isValidationError(error)) {
        setIsValidError(true);
        window.scrollTo(0, 0);
        return;
      }
      handleSaveError(error);
    }
  }, [dispatch, characterId, recordId, navigate, setIsValidError]);

  const handleDelete = undefined;
  return {
    ...editForm,
    handleSave,
    handleDelete,
    prevPath: `/character/${characterId}`,
    isLoading,
  };
};
