import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { store } from '@lostrpg/frontend/app/store';
import {
  useCreateCharacterMutation,
  useUpdateCharacterMutation,
} from '@lostrpg/frontend/entities/character';
import { useEditFormHooks } from '@lostrpg/frontend/features/character';

const handleCreateError = (error: unknown) => {
  console.warn(error);
  alert('保存中にエラーが発生しました。もう一度お試しください。');
};

export const useCreatePageHooks = () => {
  const navigate = useNavigate();
  const [createCharacter] = useCreateCharacterMutation();
  const [updateCharacter] = useUpdateCharacterMutation();
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

    try {
      // まずキャラクターを作成
      const result = await createCharacter({
        playerName: character.playerName,
        name: character.name,
        campId: character.campId,
        imageUrl: character.imageUrl,
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
      }).unwrap();

      const { id } = result;

      // 画像がある場合はアップロード
      const imageUrl = await handleImageUpload(id, character.password);

      // imageUrlがある場合は更新
      if (imageUrl) {
        await updateCharacter({
          id,
          data: { imageUrl },
        }).unwrap();
      }

      navigate(`/character/${id}`);
    } catch (error) {
      handleCreateError(error);
    }
  }, [createCharacter, updateCharacter, navigate, setIsValidError, handleImageUpload]);

  const handleDelete = undefined;

  return {
    ...editForm,
    handleSave,
    handleDelete,
  };
};
