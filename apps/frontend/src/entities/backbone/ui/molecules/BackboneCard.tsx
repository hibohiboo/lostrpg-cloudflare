import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Typography,
} from '@mui/material';
import React from 'react';
import type { Backbone } from '../../model/types';

type BackboneCardProps = {
  backbone: Backbone;
  onSelect: (backbone: Backbone) => void;
};

export const BackboneCard: React.FC<BackboneCardProps> = ({
  backbone,
  onSelect,
}) => (
  <Card sx={{ height: '100%' }}>
    <CardActionArea onClick={() => onSelect(backbone)} sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {backbone.name}
        </Typography>

        <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
          <Chip label={`必要経験点: ${backbone.cp}`} size="small" />
          <Chip
            label={`タイプ: ${backbone.type}`}
            size="small"
            color="primary"
          />
        </Box>

        {backbone.effect && (
          <Typography variant="body2" color="text.secondary">
            <strong>効果:</strong> {backbone.effect}
          </Typography>
        )}
      </CardContent>
    </CardActionArea>
  </Card>
);
