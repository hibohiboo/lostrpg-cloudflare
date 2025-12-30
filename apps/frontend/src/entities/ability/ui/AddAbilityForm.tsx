import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import React, { useState } from 'react';
import { AbilitySelectionModal } from './molecules/AbilitySelectionModal';
import type { Ability, AbilityGroup } from '../model/types';

type Props = {
  onAbilityAdd: (ability: Ability) => void;
  abilityGroups: readonly AbilityGroup[];
};

export const AddAbilityForm: React.FC<Props> = ({
  onAbilityAdd,
  abilityGroups,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleAdd = (ability: Ability) => {
    onAbilityAdd(ability);
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => setModalOpen(true)}
      >
        アビリティ追加
      </Button>
      <AbilitySelectionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        abilityGroups={abilityGroups}
        onSelect={handleAdd}
        title="アビリティを選択"
      />
    </>
  );
};
