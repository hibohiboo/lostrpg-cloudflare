import { campPersonalityList } from '@lostrpg/core/game-data/camp';
import { createFacility } from '../model/factory';
import { Facility } from '../model/types';
import { AddItemSelectForm } from './molecules/AddItemSelectForm';

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
    const newPersonality = createFacility(item, 'personality');
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
