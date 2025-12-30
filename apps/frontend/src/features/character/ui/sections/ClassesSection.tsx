import {
  Box,
  Chip,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';
import { addClass, deleteClass } from '../../model/characterSlice';
import { classCatalogSelector } from '../../model/selectors';
import type { CharacterClass } from '@lostrpg/schemas';

export const ClassesSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const classes = useAppSelector((state) => state.character.classes);
  const catalog = useAppSelector(classCatalogSelector);
  const [classSelect, setClassSelect] = useState('');

  const handleClassAdd = (value: string) => {
    if (value) {
      const newClass: CharacterClass = {
        id: `class-${Date.now()}`,
        name: value,
      };
      dispatch(addClass(newClass));
      setClassSelect('');
    }
  };

  return (
    <Box my={3}>
      <Typography variant="h6" gutterBottom>
        クラス
      </Typography>
      <Select
        value={classSelect}
        label="クラス追加"
        onChange={(e: SelectChangeEvent) => {
          const { value } = e.target;
          setClassSelect(value);
          if (value) {
            handleClassAdd(value);
          }
        }}
        sx={{ minWidth: 200, mb: 2 }}
      >
        <MenuItem value="">未選択</MenuItem>
        {catalog.map((cls) => (
          <MenuItem value={cls.name} key={cls.name}>
            {cls.name}
          </MenuItem>
        ))}
      </Select>

      <Box display="flex" flexWrap="wrap" gap={1}>
        {classes.map((cls) => (
          <Chip
            key={cls.id}
            label={cls.name}
            onDelete={() => dispatch(deleteClass(cls.id))}
            color="primary"
          />
        ))}
        {classes.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            クラスが選択されていません
          </Typography>
        )}
      </Box>
    </Box>
  );
};
