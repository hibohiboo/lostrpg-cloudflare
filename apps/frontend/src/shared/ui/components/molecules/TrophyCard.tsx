import { Card, CardActionArea, CardContent, Typography } from '@mui/material';
import React from 'react';

export type Trophy = {
  name: string;
  id: string;
  description: string;
};

type Props = {
  trophy: Trophy;
  onClick: () => void;
};

export const TrophyCard: React.FC<Props> = ({ trophy, onClick }) => (
  <Card>
    <CardActionArea onClick={onClick}>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {trophy.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {trophy.description}
        </Typography>
      </CardContent>
    </CardActionArea>
  </Card>
);
