import { useState } from 'react';
import { useUploadEnemyImageMutation } from '@lostrpg/frontend/entities/enemy';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';
import {
  setEnemy,
  setDropItem,
  toggleSpecialty,
  toggleGap,
  addAbility,
  updateAbility,
  deleteAbility,
} from '../model/enemySlice';
import type { EnemyAbility, EnemyGap } from '@lostrpg/frontend/entities/enemy';

export const useEditFormHooks = () => {
  const dispatch = useAppDispatch();
  const enemy = useAppSelector((state) => state.enemy);
  const [uploadImage] = useUploadEnemyImageMutation();

  const [isValidError, setIsValidError] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  // 画像変更ハンドラー
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 画像アップロードハンドラー
  const handleImageUpload = async (
    id: string,
    password: string | undefined | null,
  ): Promise<string | null> => {
    if (!imageFile) return null;

    const result = await uploadImage({
      id,
      image: imageFile,
      password: password || '',
    }).unwrap();

    return result.imageUrl;
  };

  const handleDropItemChange = (index: number, value: string) => {
    dispatch(setDropItem({ index, value }));
  };

  const handleSpecialtyToggle = (specialty: string) => {
    dispatch(toggleSpecialty(specialty));
  };

  const handleGapToggle = (gap: string) => {
    dispatch(toggleGap(gap as EnemyGap));
  };

  const handleAbilityAdd = (ability: EnemyAbility) => {
    dispatch(addAbility(ability));
  };

  const handleAbilityUpdate = (ability: EnemyAbility) => {
    dispatch(updateAbility(ability));
    return ability;
  };

  const handleAbilityDelete = (id: string) => {
    dispatch(deleteAbility(id));
  };

  return {
    enemy,
    isValidError,
    previewUrl,
    setIsValidError,
    setEnemy: (data: typeof enemy) => dispatch(setEnemy(data)),
    handleImageChange,
    handleImageUpload,
    handleDropItemChange,
    handleSpecialtyToggle,
    handleGapToggle,
    handleAbilityAdd,
    handleAbilityUpdate,
    handleAbilityDelete,
  };
};

export type EditFormViewModel = ReturnType<typeof useEditFormHooks>;
