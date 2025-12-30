import { AbilityBase } from '@lostrpg/schemas';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from '@mui/material';
import React, { useState } from 'react';
import { AbilityCard } from './AbilityCard';
import type { AbilityGroup } from '../../model/types';

type NewType = AbilityBase;

type AbilitySelectionModalProps = {
  open: boolean;
  onClose: () => void;
  abilityGroups: readonly AbilityGroup[];
  onSelect: (ability: NewType) => void;
  title?: string;
};

export const AbilitySelectionModal: React.FC<AbilitySelectionModalProps> = ({
  open,
  onClose,
  abilityGroups,
  onSelect,
  title = 'アビリティ選択',
}) => {
  const [searchText, setSearchText] = useState('');

  // 全アビリティをフラットに展開
  const allAbilities = abilityGroups.flatMap((group) => group.list);

  const filteredAbilities = allAbilities.filter((ability) => {
    const search = searchText.toLowerCase();
    return (
      ability.name.toLowerCase().includes(search) ||
      ability.group.toLowerCase().includes(search) ||
      ability.type.toLowerCase().includes(search) ||
      ability.effect.toLowerCase().includes(search) ||
      ability.specialty.toLowerCase().includes(search)
    );
  });

  const handleSelect = (ability: AbilityBase) => {
    onSelect(ability);
    onClose();
    setSearchText('');
  };

  const handleClose = () => {
    onClose();
    setSearchText('');
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {title}
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="アビリティを検索"
          variant="outlined"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{ mb: 2 }}
          autoFocus
        />
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 2,
          }}
        >
          {filteredAbilities.map((ability, index) => (
            <AbilityCard
              key={`${ability.name}-${index}`}
              ability={ability}
              onSelect={handleSelect}
            />
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};
