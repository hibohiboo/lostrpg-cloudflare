import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import React from 'react';

interface AddItemSelectFormProps<T> {
  label: string;
  value: string;
  items: readonly T[];
  getItemName: (item: T) => string;
  onAdd: (item: T) => void;
}

export function AddItemSelectForm<T>({
  label,
  value,
  items,
  getItemName,
  onAdd,
}: AddItemSelectFormProps<T>): React.ReactElement {
  const handleChange = (event: SelectChangeEvent) => {
    const selectedName = event.target.value;
    const item = items.find((i) => getItemName(i) === selectedName);
    if (item) {
      onAdd(item);
    }
  };

  return (
    <FormControl sx={{ minWidth: 200 }}>
      <InputLabel>{label}</InputLabel>
      <Select value={value} label={label} onChange={handleChange}>
        <MenuItem value="">未選択</MenuItem>
        {items.map((item) => {
          const name = getItemName(item);
          return (
            <MenuItem value={name} key={name}>
              {name}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
