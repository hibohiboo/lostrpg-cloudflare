import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import React, { useState } from 'react';
import { BackboneSelectionModal } from './molecules/BackboneSelectionModal';
import type { Backbone } from '../model/types';

type Props = {
  onBackboneAdd: (backbone: Backbone) => void;
  backbones: readonly Backbone[];
};

export const AddBackboneForm: React.FC<Props> = ({
  onBackboneAdd,
  backbones,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleAdd = (backbone: Backbone) => {
    onBackboneAdd(backbone);
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => setModalOpen(true)}
      >
        背景追加
      </Button>
      <BackboneSelectionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        backbones={backbones}
        onSelect={handleAdd}
        title="背景を選択"
      />
    </>
  );
};
