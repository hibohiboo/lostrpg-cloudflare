import { items } from '@lostrpg/core/game-data/lostrpg';
import { AddItemSelectForm } from '@lostrpg/frontend/shared/ui/components/molecules/AddItemSelectForm';
import { createItem } from '../model/factory';
import { Item } from '../model/types';

type Props = {
  itemSelect: string;
  onItemAdd: (item: Item) => void;
};

type GameDataItem = {
  name: string;
  j: number;
  weight: number | string;
  type: string;
  area: string;
  specialty: string;
  target: string;
  trait: string;
  effect: string;
};

export const AddItemForm: React.FC<Props> = ({ itemSelect, onItemAdd }) => {
  const handleAdd = (item: GameDataItem) => {
    const weight =
      typeof item.weight === 'string' ? Number(item.weight) : item.weight;
    const newItem = createItem({
      name: item.name,
      j: item.j,
      weight,
      type: item.type,
      area: item.area,
      specialty: item.specialty,
      target: item.target,
      trait: item.trait,
      effect: item.effect,
    });
    onItemAdd(newItem);
  };

  return (
    <AddItemSelectForm
      label="アイテム追加"
      value={itemSelect}
      items={items}
      getItemName={(item) => item.name}
      onAdd={handleAdd}
    />
  );
};
