import { classList } from '@lostrpg/core/game-data/character';
import { items } from '@lostrpg/core/game-data/item';
import { useState } from 'react';
import { useUploadCharacterImageMutation } from '@lostrpg/frontend/entities/character';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';
import {
  setCharacter,
  addClass,
  deleteClass,
  toggleSpecialty,
  toggleGap,
  toggleDamagedSpecialty,
  addItem,
  updateItem,
  deleteItem,
  addEquipment,
  updateEquipment,
  deleteEquipment,
  addBag,
  updateBag,
  deleteBag,
  toggleStatusAilment,
  addBackbone,
  updateBackbone,
  deleteBackbone,
} from '../model/characterSlice';
import type { CharacterFormData } from '../model/characterSlice';

type Gap = 'A' | 'B' | 'C' | 'D' | 'E';

interface CharacterClass {
  id: string;
  name: string;
}

interface Item {
  id?: string;
  name: string;
  number?: number;
  j: number;
  weight: number;
  type: string;
  area: string;
  specialty: string;
  target: string;
  trait: string;
  effect: string;
  equipedArea?: string;
}

interface Equipment {
  id: string;
  equipedArea: string;
  name: string;
  j: number;
  weight: number;
  type: string;
  area: string;
  specialty: string;
  target: string;
  trait: string;
  effect: string;
}

interface Bag {
  id: string;
  name: string;
  capacity: number;
  items: Item[];
}

interface Backbone {
  id: string;
  name: string;
  type: string;
  effect: string;
}

export const useEditFormHooks = () => {
  const dispatch = useAppDispatch();
  const [uploadImage] = useUploadCharacterImageMutation();

  const character = useAppSelector((state) => state.character);

  const [isValidError, setIsValidError] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [classSelect, setClassSelect] = useState('');
  const [itemSelect, setItemSelect] = useState('');
  const [equipmentArea, setEquipmentArea] = useState('');
  const [bagName, setBagName] = useState('');

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

  // クラス追加ハンドラー
  const handleClassAdd = (value: string) => {
    if (value) {
      const newClass: CharacterClass = {
        id: `class-${Date.now()}`,
        name: value,
      };
      dispatch(addClass(newClass));
      setClassSelect('');
    }
  };

  // クラス削除ハンドラー
  const handleClassDelete = (id: string) => {
    dispatch(deleteClass(id));
  };

  // 専門特技トグルハンドラー
  const handleSpecialtyToggle = (specialty: string) => {
    dispatch(toggleSpecialty(specialty));
  };

  // ギャップトグルハンドラー
  const handleGapToggle = (gap: Gap) => {
    dispatch(toggleGap(gap));
  };

  // ダメージトグルハンドラー
  const handleDamageToggle = (specialty: string) => {
    dispatch(toggleDamagedSpecialty(specialty));
  };

  // アイテム追加ハンドラー
  const handleItemAdd = (itemName: string) => {
    const item = items.find((i) => i.name === itemName);
    if (item) {
      const newItem: Item = {
        id: `item-${Date.now()}`,
        name: item.name,
        number: 1,
        j: item.j,
        weight: typeof item.weight === 'string' ? parseFloat(item.weight) : item.weight,
        type: item.type,
        area: item.area,
        specialty: item.specialty,
        target: item.target,
        trait: item.trait,
        effect: item.effect,
      };
      dispatch(addItem(newItem));
      setItemSelect('');
    }
  };

  // アイテム更新ハンドラー
  const handleItemUpdate = (updatedRow: Item) => {
    dispatch(updateItem(updatedRow));
    return updatedRow;
  };

  // アイテム削除ハンドラー
  const handleItemDelete = (id: string) => {
    dispatch(deleteItem(id));
  };

  // 装備追加ハンドラー
  const handleEquipmentAdd = () => {
    if (!equipmentArea) return;
    const newEquipment: Equipment = {
      id: `eq-${Date.now()}`,
      equipedArea: equipmentArea,
      name: '',
      j: 0,
      weight: 0,
      type: '',
      area: '',
      specialty: '',
      target: '',
      trait: '',
      effect: '',
    };
    dispatch(addEquipment(newEquipment));
    setEquipmentArea('');
  };

  // 装備更新ハンドラー
  const handleEquipmentUpdate = (updatedRow: Equipment) => {
    dispatch(updateEquipment(updatedRow));
    return updatedRow;
  };

  // 装備削除ハンドラー
  const handleEquipmentDelete = (id: string) => {
    dispatch(deleteEquipment(id));
  };

  // バッグ追加ハンドラー
  const handleBagAdd = () => {
    if (!bagName) return;
    const newBag: Bag = {
      id: `bag-${Date.now()}`,
      name: bagName,
      capacity: 10,
      items: [],
    };
    dispatch(addBag(newBag));
    setBagName('');
  };

  // バッグ更新ハンドラー
  const handleBagUpdate = (updatedBag: Bag) => {
    dispatch(updateBag(updatedBag));
  };

  // バッグ削除ハンドラー
  const handleBagDelete = (bagId: string) => {
    dispatch(deleteBag(bagId));
  };

  // 状態異常トグルハンドラー
  const handleStatusAilmentToggle = (id: string) => {
    dispatch(toggleStatusAilment(id));
  };

  // バックボーン追加ハンドラー
  const handleBackboneAdd = () => {
    const newBackbone: Backbone = {
      id: `bb-${Date.now()}`,
      name: '',
      type: '',
      effect: '',
    };
    dispatch(addBackbone(newBackbone));
  };

  // バックボーン更新ハンドラー
  const handleBackboneUpdate = (updatedRow: Backbone) => {
    dispatch(updateBackbone(updatedRow));
    return updatedRow;
  };

  // バックボーン削除ハンドラー
  const handleBackboneDelete = (id: string) => {
    dispatch(deleteBackbone(id));
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

  const totalWeight = character.items.reduce(
    (sum, item) => sum + item.weight * (item.number || 1),
    0,
  );

  const totalValue = character.items.reduce(
    (sum, item) => sum + item.j * (item.number || 1),
    0,
  );

  return {
    character,
    isValidError,
    previewUrl,
    imageFile,
    classSelect,
    itemSelect,
    equipmentArea,
    bagName,
    totalWeight,
    totalValue,
    classList,
    items,
    setIsValidError,
    setClassSelect,
    setItemSelect,
    setEquipmentArea,
    setBagName,
    setCharacter: (data: CharacterFormData) => dispatch(setCharacter(data)),
    handleImageChange,
    handleClassAdd,
    handleClassDelete,
    handleSpecialtyToggle,
    handleGapToggle,
    handleDamageToggle,
    handleItemAdd,
    handleItemUpdate,
    handleItemDelete,
    handleEquipmentAdd,
    handleEquipmentUpdate,
    handleEquipmentDelete,
    handleBagAdd,
    handleBagUpdate,
    handleBagDelete,
    handleStatusAilmentToggle,
    handleBackboneAdd,
    handleBackboneUpdate,
    handleBackboneDelete,
    handleImageUpload,
  };
};

export type EditFormViewModel = ReturnType<typeof useEditFormHooks>;
