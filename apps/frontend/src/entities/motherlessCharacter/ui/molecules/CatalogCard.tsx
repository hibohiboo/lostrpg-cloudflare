import { Card, CardActionArea, CardContent, Typography } from '@mui/material';
import React from 'react';

type Props<T> = {
  entry: T;
  name: string;
  onSelect: (entry: T) => void;
  children?: React.ReactNode;
};

export const CatalogCard = <T,>({
  entry,
  name,
  onSelect,
  children,
}: Props<T>) => (
  <Card variant="outlined">
    <CardActionArea onClick={() => onSelect(entry)}>
      <CardContent>
        <Typography variant="subtitle1" gutterBottom>
          {name}
        </Typography>
        {children}
      </CardContent>
    </CardActionArea>
  </Card>
);
