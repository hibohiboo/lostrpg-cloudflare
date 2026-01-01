import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useCreateRecordMutation } from '@lostrpg/frontend/entities/record';
import { useEditFormHooks } from '@lostrpg/frontend/features/character';
import { handleSaveError } from '@lostrpg/frontend/shared/lib/error';
import { useAppSelector } from '@lostrpg/frontend/shared/lib/store';

export const useCreatePageHooks = () => {
  const navigate = useNavigate();
  const editForm = useEditFormHooks();
  const { setIsValidError } = editForm;
  const { id } = useParams();
  const [createRecord] = useCreateRecordMutation();

  // Reduxストアからキャラクターデータとレコードデータを取得
  const character = useAppSelector((state) => state.character);
  const record = useAppSelector((state) => state.record);
  const password = useAppSelector((state) => state.characterForm.password);

  const handleSave = useCallback(async () => {
    if (!id) {
      handleSaveError(new Error('Character ID is required'));
      return;
    }

    // バリデーション: 必須フィールドをチェック
    if (!character.name || !record.title) {
      setIsValidError(true);
      window.scrollTo(0, 0);
      return;
    }

    try {
      const result = await createRecord({
        characterId: id,
        data: {
          name: record.title, // シナリオ名をレコード名として使用
          character,
          record,
          password: password || undefined,
        },
      }).unwrap();

      // 作成されたレコードのページに遷移
      navigate(result.url);
    } catch (error) {
      // エラーハンドリング
      handleSaveError(error);
    }
  }, [createRecord, id, character, record, password, navigate, setIsValidError]);

  const handleDelete = undefined;

  return {
    ...editForm,
    handleSave,
    handleDelete,
    prevPath: `/character/${id}`,
  };
};
