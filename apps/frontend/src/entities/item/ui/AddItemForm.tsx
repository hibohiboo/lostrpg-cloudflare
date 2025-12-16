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
  weight: number | string;
};

export const AddItemForm: React.FC<Props> = ({ itemSelect, onItemAdd }) => {
  const handleAdd = (item: GameDataItem) => {
    const weight = typeof item.weight === 'string' ? Number(item.weight) : item.weight;
    const newItem = createItem({ name: item.name, weight });
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
