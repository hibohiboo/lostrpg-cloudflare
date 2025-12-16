import { campPersonalityList } from '@lostrpg/core/game-data/lostrpg';
import { AddItemSelectForm } from '@lostrpg/frontend/shared/ui/components/molecules/AddItemSelectForm';
import { Facility } from '../model/types';

type Props = {
  personalitySelect: string;
  onPersonalityAdd: (item: Facility) => void;
};

type PersonalityItem = {
  name: string;
  type: string;
  specialty: string;
  effect: string;
};

export const AddPersonalityForm: React.FC<Props> = ({
  personalitySelect,
  onPersonalityAdd,
}) => {
  const handleAdd = (item: PersonalityItem) => {
    const newPersonality: Facility = {
      id: `personality-${Date.now()}`,
      name: item.name,
      type: item.type,
      specialty: item.specialty,
      level: 1,
      effect: item.effect,
    };
    onPersonalityAdd(newPersonality);
  };

  return (
    <AddItemSelectForm
      label="人材追加"
      value={personalitySelect}
      items={campPersonalityList}
      getItemName={(item) => item.name}
      onAdd={handleAdd}
    />
  );
};
