import { ItemBase } from '@lostrpg/schemas/validation/items';
import {
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Typography,
  Box,
} from '@mui/material';
import React from 'react';

type ItemCardProps = {
  item: ItemBase;
  onSelect: (item: ItemBase) => void;
};

export const ItemCard: React.FC<ItemCardProps> = ({ item, onSelect }) => (
  <Card sx={{ height: '100%' }}>
    <CardActionArea onClick={() => onSelect(item)} sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {item.name}
        </Typography>

        <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
          <Chip label={`種別: ${item.type}`} size="small" />
          <Chip label={`J: ${item.j}`} size="small" color="primary" />
          <Chip label={`重量: ${item.weight}`} size="small" />
        </Box>

        {item.area && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>部位:</strong> {item.area}
          </Typography>
        )}

        {item.specialty && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>特技:</strong> {item.specialty}
          </Typography>
        )}

        {item.target && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>対象:</strong> {item.target}
          </Typography>
        )}

        {item.trait && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>特性:</strong> {item.trait}
          </Typography>
        )}

        {item.effect && (
          <Typography variant="body2" color="text.secondary">
            <strong>効果:</strong> {item.effect}
          </Typography>
        )}
      </CardContent>
    </CardActionArea>
  </Card>
);
