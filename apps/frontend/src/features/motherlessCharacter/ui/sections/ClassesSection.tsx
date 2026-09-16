import {
  Box,
  Chip,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { useMotherlessClassCatalog } from '@lostrpg/frontend/entities/motherlessSheet';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';
import {
  addClass,
  deleteClass,
  updateMotherlessCharacter,
} from '../../model/characterSlice';

export const ClassesSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const classes = useAppSelector(
    (state) => state.motherlessCharacter.classes,
  );
  const totalExperience = useAppSelector(
    (state) => state.motherlessCharacter.totalExperience,
  );
  const unusedExperience = useAppSelector(
    (state) => state.motherlessCharacter.unusedExperience,
  );
  const catalog = useMotherlessClassCatalog();

  const handleAdd = (e: SelectChangeEvent) => {
    const { value } = e.target;
    if (!value) return;
    const selected = catalog.find((c) => c.name === value);
    if (selected) {
      dispatch(addClass(selected));
    }
  };

  return (
    <Box sx={{ my: 3 }}>
      <Typography variant="h6" gutterBottom>
        クラス
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        作成時は1つ選択。以後は経験点消費で追加できる(消費チェックは手動)
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          type="number"
          label="未使用経験点"
          value={unusedExperience}
          onChange={(e) =>
            dispatch(
              updateMotherlessCharacter({
                unusedExperience: Number(e.target.value),
              }),
            )
          }
          sx={{ width: 150 }}
        />
        <TextField
          type="number"
          label="合計経験点"
          value={totalExperience}
          onChange={(e) =>
            dispatch(
              updateMotherlessCharacter({
                totalExperience: Number(e.target.value),
              }),
            )
          }
          sx={{ width: 150 }}
        />
      </Box>

      <Select
        value=""
        displayEmpty
        onChange={handleAdd}
        sx={{ minWidth: 200, mb: 2 }}
      >
        <MenuItem value="">クラス追加</MenuItem>
        {catalog
          .filter((c) => !classes.some((selected) => selected.name === c.name))
          .map((c) => (
            <MenuItem value={c.name} key={c.name}>
              {c.name}
            </MenuItem>
          ))}
      </Select>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {classes.map((cls) => (
          <Chip
            key={cls.name}
            label={cls.name}
            onDelete={() => dispatch(deleteClass(cls.name))}
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
