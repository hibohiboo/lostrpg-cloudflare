import { useState } from 'react';
import { useUploadCharacterImageMutation } from '@lostrpg/frontend/entities/character';
import { useAppSelector } from '@lostrpg/frontend/shared/lib/store';

export const useEditFormHooks = () => {
  const [uploadImage] = useUploadCharacterImageMutation();

  // Redux stateからcharacterを取得（ページレベルのhooksで使用される）
  const character = useAppSelector((state) => state.character);

  // 画像管理
  const [isValidError, setIsValidError] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  // 画像変更ハンドラー
  const handleImageChange = (file: File | null) => {
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
    password: string | undefined,
  ): Promise<string | null> => {
    if (!imageFile) return null;

    const result = await uploadImage({
      id,
      image: imageFile,
      password: password || '',
    }).unwrap();

    return result.imageUrl;
  };

  return {
    character,
    isValidError,
    previewUrl,
    setIsValidError,
    handleImageChange,
    handleImageUpload,
  };
};

export type EditFormViewModel = ReturnType<typeof useEditFormHooks>;
