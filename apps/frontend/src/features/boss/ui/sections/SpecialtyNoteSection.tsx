import { Box, Paper, Typography } from '@mui/material';
import React from 'react';

export const SpecialtyNoteSection: React.FC = () => (
  <Box sx={{ my: 3 }}>
    <Typography variant="h6" gutterBottom>
      特技・ギャップ
    </Typography>
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="body2" color="text.secondary">
        ＜ヌシ＞は全ての特技を習得しています。また、特技リストのギャップを埋めません。
      </Typography>
    </Paper>
  </Box>
);
