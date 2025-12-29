import { Box, Button, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';
import { addBag, updateBag, deleteBag } from '../../model/characterSlice';
import type { Bag } from '../../model/characterSlice';

export const BagsSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const bags = useAppSelector((state) => state.character.bags);
  const [bagName, setBagName] = useState('');

  const handleBagAdd = () => {
    if (!bagName) return;
    const newBag: Bag = {
      id: `bag-${Date.now()}`,
      name: bagName,
      capacity: 10,
      items: [],
    };
    dispatch(addBag(newBag));
    setBagName('');
  };

  return (
    <Box my={3}>
      <Typography variant="h6" gutterBottom>
        バッグ
      </Typography>
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="バッグ名"
          value={bagName}
          onChange={(e) => setBagName(e.target.value)}
          sx={{ width: 200 }}
        />
        <Button variant="outlined" onClick={handleBagAdd}>
          追加
        </Button>
      </Box>
      {bags.map((bag) => (
        <Box
          key={bag.id}
          my={2}
          p={2}
          border={1}
          borderColor="grey.300"
          borderRadius={1}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="subtitle1">{bag.name}</Typography>
            <Button
              size="small"
              color="error"
              onClick={() => dispatch(deleteBag(bag.id))}
            >
              削除
            </Button>
          </Box>
          <TextField
            type="number"
            label="容量"
            value={bag.capacity}
            onChange={(e) =>
              dispatch(updateBag({ ...bag, capacity: Number(e.target.value) }))
            }
            sx={{ width: 150, mb: 2 }}
          />
        </Box>
      ))}
    </Box>
  );
};
