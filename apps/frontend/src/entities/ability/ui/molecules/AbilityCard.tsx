import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Typography,
} from '@mui/material';
import React from 'react';
import type { Ability } from '../../model/types';

type AbilityCardProps = {
  ability: Ability;
  onSelect: (ability: Ability) => void;
};

export const AbilityCard: React.FC<AbilityCardProps> = ({
  ability,
  onSelect,
}) => (
  <Card sx={{ height: '100%' }}>
    <CardActionArea onClick={() => onSelect(ability)} sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {ability.name}
        </Typography>

        <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
          <Chip label={`グループ: ${ability.group}`} size="small" />
          <Chip
            label={`タイプ: ${ability.type}`}
            size="small"
            color="primary"
          />
          <Chip
            label={`反動: ${ability.recoil}`}
            size="small"
            color="secondary"
          />
        </Box>

        {ability.specialty && ability.specialty !== '-' && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>指定特技:</strong> {ability.specialty}
          </Typography>
        )}

        {ability.target && ability.target !== '-' && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>対象:</strong> {ability.target}
          </Typography>
        )}

        {ability.effect && (
          <Typography variant="body2" color="text.secondary">
            <strong>効果:</strong> {ability.effect}
          </Typography>
        )}
      </CardContent>
    </CardActionArea>
  </Card>
);
