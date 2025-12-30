import { Equipment, ItemBase } from '@lostrpg/schemas/validation/items';
import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import { useState } from 'react';
import { createItem } from '../model/factory';
import { ItemSelectionModal } from './molecules/ItemSelectionModal';

type Props = {
  onItemAdd: (item: Equipment) => void;
  catalog: ItemBase[];
};

export const AddEquipmentForm: React.FC<Props> = ({ onItemAdd, catalog }) => {
  const [modalOpen, setModalOpen] = useState(false);

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
    onItemAdd({ ...newItem, equipedArea: item.area });
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => setModalOpen(true)}
      >
        装備追加
      </Button>
      <ItemSelectionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        items={catalog}
        onSelect={handleAdd}
        title="装備を選択"
      />
    </>
  );
};
