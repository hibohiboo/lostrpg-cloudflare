import { useState } from 'react';
import { useNavigate } from 'react-router';
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
  const navigate = useNavigate();

  const camp = useAppSelector((state) => state.camp);

  const [isValidError, setIsValidError] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [equipmentSelect, setEquipmentSelect] = useState('');
  const [personalitySelect, setPersonalitySelect] = useState('');
  const [itemSelect, setItemSelect] = useState('');

  // 画像変更ハンドラー
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
    setItemSelect('');
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

  return {
    camp,
    isValidError,
    previewUrl,
    equipmentSelect,
    personalitySelect,
    itemSelect,
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
  };
};

export type EditFormViewModel = ReturnType<typeof useEditFormHooks>;
