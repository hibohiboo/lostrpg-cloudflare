import { useState } from 'react';
import { useUploadBossImageMutation } from '@lostrpg/frontend/entities/boss';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';
import {
  setBoss,
  setLevel,
  addAbility,
  updateAbility,
  deleteAbility,
} from '../model/bossSlice';
import type { BossAbility } from '@lostrpg/frontend/entities/boss';

export const useEditFormHooks = () => {
  const dispatch = useAppDispatch();
  const boss = useAppSelector((state) => state.boss);
  const [uploadImage] = useUploadBossImageMutation();

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

  const handleLevelChange = (level: number) => {
    dispatch(setLevel(Number.isNaN(level) ? 1 : level));
  };

  const handleAbilityAdd = (ability: BossAbility) => {
    dispatch(addAbility(ability));
  };

  const handleAbilityUpdate = (ability: BossAbility) => {
    dispatch(updateAbility(ability));
    return ability;
  };

  const handleAbilityDelete = (id: string) => {
    dispatch(deleteAbility(id));
  };

  return {
    boss,
    isValidError,
    previewUrl,
    setIsValidError,
    setBoss: (data: typeof boss) => dispatch(setBoss(data)),
    handleLevelChange,
    handleImageChange,
    handleImageUpload,
    handleAbilityAdd,
    handleAbilityUpdate,
    handleAbilityDelete,
  };
};

export type EditFormViewModel = ReturnType<typeof useEditFormHooks>;
