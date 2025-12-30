import { ItemBase } from '@lostrpg/schemas/validation/items';
import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import React, { useState } from 'react';
import { ItemSelectionModal } from '@lostrpg/frontend/shared/ui/components/molecules/ItemSelectionModal';
import { createItem } from '../model/factory';
import { Item } from '../model/types';

type Props = {
  onItemAdd: (item: Item) => void;
  catalog: ItemBase[];
};

export const AddItemForm: React.FC<Props> = ({ onItemAdd, catalog }) => {
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
    onItemAdd(newItem);
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => setModalOpen(true)}
      >
        アイテム追加
      </Button>
      <ItemSelectionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        items={catalog}
        onSelect={handleAdd}
        title="アイテムを選択"
      />
    </>
  );
};
