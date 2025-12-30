import { ItemBase } from '@lostrpg/schemas/validation/items';
import { AddItemSelectForm } from '@lostrpg/frontend/shared/ui/components/molecules/AddItemSelectForm';
import { createItem } from '../model/factory';
import { Item } from '../model/types';

type Props = {
  itemSelect: string;
  onItemAdd: (item: Item) => void;
  catalog: ItemBase[];
};

export const AddItemForm: React.FC<Props> = ({
  itemSelect,
  onItemAdd,
  catalog,
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
      label="アイテム追加"
      value={itemSelect}
      items={catalog}
      getItemName={(item) => item.name}
      onAdd={handleAdd}
    />
  );
};
