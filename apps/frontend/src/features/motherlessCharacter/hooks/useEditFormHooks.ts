import { useState } from 'react';
import { useUploadMotherlessCharacterImageMutation } from '@lostrpg/frontend/entities/motherlessCharacter';

export const useEditFormHooks = () => {
  const [uploadImage] = useUploadMotherlessCharacterImageMutation();

  const [isValidError, setIsValidError] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

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

  return {
    isValidError,
    previewUrl,
    setIsValidError,
    handleImageChange,
    handleImageUpload,
  };
};

export type EditFormViewModel = ReturnType<typeof useEditFormHooks>;
