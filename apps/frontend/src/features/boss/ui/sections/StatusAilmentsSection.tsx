import { statusAilments } from '@lostrpg/core/game-data/character';
import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material';
import React, { useState } from 'react';

// レコードシートと同様、変調のチェックはこの画面内だけのセッション状態として扱う（保存はしない）
export const StatusAilmentsSection: React.FC = () => {
  const [selectedStatusAilments, setSelectedStatusAilments] = useState<
    string[]
  >([]);

  const handleToggle = (name: string) => {
    setSelectedStatusAilments((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );
  };

  return (
    <Box sx={{ my: 3 }}>
      <Typography variant="h6" gutterBottom>
        変調
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        {statusAilments.map((ailment) => (
          <FormControlLabel
            key={ailment.name}
            control={
              <Checkbox
                checked={selectedStatusAilments.includes(ailment.name)}
                onChange={() => handleToggle(ailment.name)}
              />
            }
            label={`${ailment.name} - ${ailment.effect}`}
          />
        ))}
      </Box>
    </Box>
  );
};
