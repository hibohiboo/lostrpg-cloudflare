import { useState } from 'react';
import { useUploadScenarioImageMutation } from '@lostrpg/frontend/entities/scenario';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';
import { setScenario } from '../model/scenarioSlice';

export const useEditFormHooks = () => {
  const dispatch = useAppDispatch();
  const [uploadImage] = useUploadScenarioImageMutation();

  const scenario = useAppSelector((state) => state.scenario);

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
    scenario,
    isValidError,
    previewUrl,
    imageFile,
    setIsValidError,
    setScenario: (data: typeof scenario) => dispatch(setScenario(data)),
    handleImageChange,
    handleImageUpload,
  };
};

export type EditFormViewModel = ReturnType<typeof useEditFormHooks>;
