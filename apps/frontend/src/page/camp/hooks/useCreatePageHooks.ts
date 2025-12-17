import { useState } from 'react';
import { Facility } from '@lostrpg/frontend/entities/facility';
import { Item } from '@lostrpg/frontend/entities/item';

interface CampFormData {
  playerName: string;
  name: string;
  imageUrl: string;
  facilities: Facility[];
  items: Item[];
  unusedCampPoint: number;
  totalCampPoint: number;
  summary: string;
  freeWriting: string;
}

export const useCreatePageHooks = () => {
  const [camp, setCamp] = useState<CampFormData>({
    playerName: '',
    name: '',
    imageUrl: '',
    facilities: [],
    items: [],
    unusedCampPoint: 0,
    totalCampPoint: 0,
    summary: '',
    freeWriting: '',
  });

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
    setCamp({ ...camp, facilities: [...camp.facilities, item] });
    setEquipmentSelect('');
  };

  // 人材追加ハンドラー
  const handlePersonalityAdd = (item: Facility) => {
    setCamp({ ...camp, facilities: [...camp.facilities, item] });
    setPersonalitySelect('');
  };

  // アイテム追加ハンドラー
  const handleItemAdd = (item: Item) => {
    setCamp({ ...camp, items: [...camp.items, item] });
    setItemSelect('');
  };

  // 施設削除ハンドラー
  const handleFacilityDelete = (id: string) => {
    setCamp({
      ...camp,
      facilities: camp.facilities.filter((f) => f.id !== id),
    });
  };

  // アイテム削除ハンドラー
  const handleItemDelete = (id: string) => {
    setCamp({
      ...camp,
      items: camp.items.filter((i) => i.id !== id),
    });
  };

  // 施設更新ハンドラー
  const handleFacilityUpdate = (newRow: Facility) => {
    setCamp({
      ...camp,
      facilities: camp.facilities.map((f) => (f.id === newRow.id ? newRow : f)),
    });
    return newRow;
  };

  // アイテム更新ハンドラー
  const handleItemUpdate = (newRow: Item) => {
    setCamp({
      ...camp,
      items: camp.items.map((i) => (i.id === newRow.id ? newRow : i)),
    });
    return newRow;
  };

  // 保存ハンドラー
  const handleSave = () => {
    if (!camp.name) {
      setIsValidError(true);
      window.scrollTo(0, 0);
      return;
    }
    // 実際にはAPI呼び出しを行う
    console.log('Saving camp:', camp);
    alert('キャンプを保存しました（ダミー動作）');
  };

  // 削除ハンドラー
  const handleDelete = () => {
    if (window.confirm('本当に削除しますか？')) {
      // 実際にはAPI呼び出しを行う
      console.log('Deleting camp');
      alert('キャンプを削除しました（ダミー動作）');
    }
  };
  return {
    camp,
    isValidError,
    previewUrl,
    equipmentSelect,
    personalitySelect,
    itemSelect,
    setCamp,
    handleImageChange,
    handleEquipmentAdd,
    handlePersonalityAdd,
    handleItemAdd,
    handleFacilityDelete,
    handleItemDelete,
    handleFacilityUpdate,
    handleItemUpdate,
    handleSave,
    handleDelete,
  };
};
