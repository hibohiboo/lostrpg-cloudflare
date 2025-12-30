import { useState } from 'react';
import { useUploadCampImageMutation } from '@lostrpg/frontend/entities/camp';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';
import {
  setCamp,
  addFacility,
  addItem,
  deleteFacility,
  deleteItem,
  updateFacility,
  updateItem,
} from '../model/campSlice';
import type { Facility } from '@lostrpg/frontend/entities/facility';
import type { Item } from '@lostrpg/frontend/entities/item';

export const useEditFormHooks = () => {
  const dispatch = useAppDispatch();
  const [uploadImage] = useUploadCampImageMutation();

  const camp = useAppSelector((state) => state.camp);

  const [isValidError, setIsValidError] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [equipmentSelect, setEquipmentSelect] = useState('');
  const [personalitySelect, setPersonalitySelect] = useState('');

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

  // 設備追加ハンドラー
  const handleEquipmentAdd = (item: Facility) => {
    dispatch(addFacility(item));
    setEquipmentSelect('');
  };

  // 人材追加ハンドラー
  const handlePersonalityAdd = (item: Facility) => {
    dispatch(addFacility(item));
    setPersonalitySelect('');
  };

  // アイテム追加ハンドラー
  const handleItemAdd = (item: Item) => {
    dispatch(addItem(item));
  };

  // 施設削除ハンドラー
  const handleFacilityDelete = (id: string) => {
    dispatch(deleteFacility(id));
  };

  // アイテム削除ハンドラー
  const handleItemDelete = (id: string) => {
    dispatch(deleteItem(id));
  };

  // 施設更新ハンドラー
  const handleFacilityUpdate = (newRow: Facility) => {
    dispatch(updateFacility(newRow));
    return newRow;
  };

  // アイテム更新ハンドラー
  const handleItemUpdate = (newRow: Item) => {
    dispatch(updateItem(newRow));
    return newRow;
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
    camp,
    isValidError,
    previewUrl,
    imageFile,
    equipmentSelect,
    personalitySelect,
    setIsValidError,
    setCamp: (data: typeof camp) => dispatch(setCamp(data)),
    handleImageChange,
    handleEquipmentAdd,
    handlePersonalityAdd,
    handleItemAdd,
    handleFacilityDelete,
    handleItemDelete,
    handleFacilityUpdate,
    handleItemUpdate,
    handleImageUpload,
  };
};

export type EditFormViewModel = ReturnType<typeof useEditFormHooks>;
