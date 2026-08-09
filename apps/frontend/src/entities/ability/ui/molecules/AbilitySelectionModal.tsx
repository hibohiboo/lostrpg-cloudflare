import { AbilityBase } from '@lostrpg/schemas';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField,
} from '@mui/material';
import React, { useMemo, useState } from 'react';
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

const ALL_VALUE = '';

export const AbilitySelectionModal: React.FC<AbilitySelectionModalProps> = ({
  open,
  onClose,
  abilityGroups,
  onSelect,
  title = 'アビリティ選択',
}) => {
  const [searchText, setSearchText] = useState('');
  const [groupFilter, setGroupFilter] = useState(ALL_VALUE);
  const [typeFilter, setTypeFilter] = useState(ALL_VALUE);

  // 全アビリティをフラットに展開
  const allAbilities = useMemo(
    () => abilityGroups.flatMap((group) => group.list),
    [abilityGroups],
  );

  // 選択肢に出現するグループ・タイプのみを絞り込み候補にする
  // グループは呼び出し元のabilityGroupsの並び順（初出順）をそのまま使う
  const groupOptions = useMemo(
    () => [...new Set(allAbilities.map((a) => a.group))],
    [allAbilities],
  );
  const typeOptions = useMemo(
    () => [...new Set(allAbilities.map((a) => a.type))].sort(),
    [allAbilities],
  );

  const filteredAbilities = allAbilities.filter((ability) => {
    const search = searchText.toLowerCase();
    const matchesSearch =
      ability.name.toLowerCase().includes(search) ||
      ability.group.toLowerCase().includes(search) ||
      ability.type.toLowerCase().includes(search) ||
      ability.effect.toLowerCase().includes(search) ||
      ability.specialty.toLowerCase().includes(search);
    const matchesGroup = !groupFilter || ability.group === groupFilter;
    const matchesType = !typeFilter || ability.type === typeFilter;

    return matchesSearch && matchesGroup && matchesType;
  });

  const resetFilters = () => {
    setSearchText('');
    setGroupFilter(ALL_VALUE);
    setTypeFilter(ALL_VALUE);
  };

  const handleSelect = (ability: AbilityBase) => {
    onSelect(ability);
    onClose();
    resetFilters();
  };

  const handleClose = () => {
    onClose();
    resetFilters();
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
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <TextField
            label="アビリティを検索"
            variant="outlined"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            autoFocus
            sx={{ flex: 2, minWidth: 200 }}
          />
          <TextField
            select
            label="グループ"
            variant="outlined"
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            sx={{ flex: 1, minWidth: 160 }}
          >
            <MenuItem value={ALL_VALUE}>すべて</MenuItem>
            {groupOptions.map((group) => (
              <MenuItem key={group} value={group}>
                {group}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="タイプ"
            variant="outlined"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            sx={{ flex: 1, minWidth: 160 }}
          >
            <MenuItem value={ALL_VALUE}>すべて</MenuItem>
            {typeOptions.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
        </Box>
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
