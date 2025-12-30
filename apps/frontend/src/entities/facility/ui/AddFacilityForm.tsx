import { equipmentList } from '@lostrpg/core/game-data/camp';
import { createFacility } from '../model/factory';
import { Facility } from '../model/types';
import { AddItemSelectForm } from './molecules/AddItemSelectForm';

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
    const newFacility = createFacility(item, 'facility');
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
