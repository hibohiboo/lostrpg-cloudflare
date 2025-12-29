import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';
import { store } from '@lostrpg/frontend/app/store';
import {
  useDeleteCharacterMutation,
  useUpdateCharacterMutation,
} from '@lostrpg/frontend/entities/character';
import { useEditFormHooks } from '@lostrpg/frontend/features/character';

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
  const [updateCharacter] = useUpdateCharacterMutation();
  const [deleteCharacter] = useDeleteCharacterMutation();
  const editForm = useEditFormHooks();
  const { setIsValidError, handleImageUpload } = editForm;

  const handleSave = useCallback(async () => {
    // 最新のstateを取得（クロージャーに閉じ込めない）
    const { character } = store.getState();

    if (!character.name) {
      setIsValidError(true);
      window.scrollTo(0, 0);
      return;
    }
    if (!id) return;

    try {
      // 画像がある場合は先にアップロード
      const imageUrl = await handleImageUpload(id, character.password);

      // キャラクター更新データを準備
      const updateData = {
        playerName: character.playerName,
        name: character.name,
        campId: character.campId,
        imageUrl: imageUrl || character.imageUrl,
        classes: character.classes,
        specialties: character.specialties,
        gaps: character.gaps,
        damagedSpecialties: character.damagedSpecialties,
        abilities: character.abilities,
        staminaBase: character.staminaBase,
        stamina: character.stamina,
        willPowerBase: character.willPowerBase,
        willPower: character.willPower,
        carryingCapacity: character.carryingCapacity,
        items: character.items
          .filter((item) => item.id)
          .map((item) => ({
            ...item,
            id: item.id!,
            number: item.number || 1,
          })),
        equipments: character.equipment.map((eq) => ({
          id: eq.id,
          number: 1,
          name: eq.name,
          j: eq.j,
          weight: eq.weight,
          type: eq.type,
          area: eq.area,
          specialty: eq.specialty,
          target: eq.target,
          trait: eq.trait,
          effect: eq.effect,
        })),
        bags: character.bags.map((bag) => ({
          ...bag,
          items: bag.items
            .filter((item) => item.id)
            .map((item) => ({
              ...item,
              id: item.id!,
              number: item.number || 1,
            })),
        })),
        statusAilments: character.statusAilments
          .filter((ailment) => ailment.isChecked)
          .map((ailment) => ailment.name),
        backbones: character.backbones,
        unusedExperience: character.unusedExperience,
        totalExperience: character.totalExperience,
        summary: character.summary,
        appearance: character.appearance,
        freeWriting: character.freeWriting,
        quote: character.quote,
        subbliments: {
          useStrangeField: character.useStrangeField,
          useDragonPlain: character.useDragonPlain,
        },
        password: character.password,
      };

      // imageUrlを含めて更新
      await updateCharacter({
        id,
        data: updateData,
      }).unwrap();

      navigate(`/character/${id}`);
    } catch (error) {
      handleUpdateError(error);
    }
  }, [id, updateCharacter, navigate, setIsValidError, handleImageUpload]);

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
