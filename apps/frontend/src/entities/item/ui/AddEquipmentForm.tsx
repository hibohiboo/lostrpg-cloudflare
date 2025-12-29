import { items } from '@lostrpg/core/game-data/item';
import { ItemBase } from '@lostrpg/schemas/validation/items';
import { AddItemSelectForm } from '@lostrpg/frontend/shared/ui/components/molecules/AddItemSelectForm';
import { createItem } from '../model/factory';
import { Item } from '../model/types';

type Props = {
  itemSelect: string;
  onItemAdd: (item: Item) => void;
};

export const AddEquipmentForm: React.FC<Props> = ({
  itemSelect,
  onItemAdd,
}) => {
  const handleAdd = (item: ItemBase) => {
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
      label="装備追加"
      value={itemSelect}
      items={items.filter((i) => i.area !== '-')}
      getItemName={(item) => item.name}
      onAdd={handleAdd}
    />
  );
};
