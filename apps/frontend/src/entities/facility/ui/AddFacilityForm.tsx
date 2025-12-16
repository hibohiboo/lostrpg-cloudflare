import { equipmentList } from '@lostrpg/core/game-data/lostrpg';
import { AddItemSelectForm } from '@lostrpg/frontend/shared/ui/AddItemSelectForm';
import { Facility } from '../model/types';

type Props = {
  equipmentSelect: string;
  onEquipmentAdd: (item: Facility) => void;
};

type EquipmentItem = {
  name: string;
  type: string;
  specialty: string;
  effect: string;
};

export const AddFacilityForm: React.FC<Props> = ({
  equipmentSelect,
  onEquipmentAdd,
}) => {
  const handleAdd = (item: EquipmentItem) => {
    const newFacility: Facility = {
      id: `facility-${Date.now()}`,
      name: item.name,
      type: item.type,
      specialty: item.specialty,
      level: 1,
      effect: item.effect,
    };
    onEquipmentAdd(newFacility);
  };

  return (
    <AddItemSelectForm
      label="設備追加"
      value={equipmentSelect}
      items={equipmentList}
      getItemName={(item) => item.name}
      onAdd={handleAdd}
    />
  );
};
