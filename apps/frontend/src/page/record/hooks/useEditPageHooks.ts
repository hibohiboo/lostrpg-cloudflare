import { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  useGetRecordQuery,
  useUpdateRecordMutation,
  setRecord,
} from '@lostrpg/frontend/entities/record';
import {
  setCharacter,
  useEditFormHooks,
} from '@lostrpg/frontend/features/character';
import { handleSaveError } from '@lostrpg/frontend/shared/lib/error';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';

export const useEditPageHooks = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const editForm = useEditFormHooks();
  const { setIsValidError } = editForm;
  const { id: characterId, recordId } = useParams();
  const [updateRecord] = useUpdateRecordMutation();

  // レコードデータを取得
  const { data: recordData, isLoading } = useGetRecordQuery(
    { characterId: characterId!, id: recordId! },
    { skip: !characterId || !recordId },
  );

  // レコードデータをReduxストアに設定
  useEffect(() => {
    if (recordData) {
      // characterデータをストアに設定
      if (recordData.character) {
        dispatch(setCharacter(recordData.character));
      }
      // recordデータをストアに設定
      if (recordData.record) {
        dispatch(setRecord(recordData.record));
      }
    }
  }, [recordData, dispatch]);

  // Reduxストアからキャラクターデータとレコードデータを取得
  const character = useAppSelector((state) => state.character);
  const record = useAppSelector((state) => state.record);
  const password = useAppSelector((state) => state.characterForm.password);

  const handleSave = useCallback(async () => {
    if (!characterId || !recordId) {
      handleSaveError(new Error('Character ID and Record ID are required'));
      return;
    }

    // バリデーション: 必須フィールドをチェック
    if (!character.name || !record.title) {
      setIsValidError(true);
      window.scrollTo(0, 0);
      return;
    }

    try {
      await updateRecord({
        characterId,
        id: recordId,
        data: {
          name: record.title, // シナリオ名をレコード名として使用
          character,
          record,
          password: password || undefined,
        },
      }).unwrap();

      // キャラクターページに戻る
      navigate(`/character/${characterId}`);
    } catch (error) {
      // エラーハンドリング
      handleSaveError(error);
    }
  }, [
    updateRecord,
    characterId,
    recordId,
    character,
    record,
    password,
    navigate,
    setIsValidError,
  ]);

  const handleDelete = undefined;

  return {
    ...editForm,
    handleSave,
    handleDelete,
    prevPath: `/character/${characterId}`,
    isLoading,
  };
};
