import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, IconButton, TextField, Typography } from '@mui/material';
import React from 'react';
import type { ScenarioLink } from '@lostrpg/frontend/entities/scenario';

type Props = {
  links: ScenarioLink[];
  onChange: (links: ScenarioLink[]) => void;
};

export const EventLinksEditor: React.FC<Props> = ({ links, onChange }) => {
  const handleAdd = () => onChange([...links, { value: '', url: '' }]);
  const handleRemove = (index: number) => onChange(links.filter((_, i) => i !== index));
  const handleUpdate = (index: number, changes: Partial<ScenarioLink>) =>
    onChange(links.map((link, i) => (i === index ? { ...link, ...changes } : link)));

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        リンク
      </Typography>
      {links.map((link, index) => (
        <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center', my: 1 }}>
          <TextField
            size="small"
            label="表示名"
            value={link.value}
            onChange={(e) => handleUpdate(index, { value: e.target.value })}
          />
          <TextField
            size="small"
            fullWidth
            label="URL"
            value={link.url}
            onChange={(e) => handleUpdate(index, { url: e.target.value })}
          />
          <IconButton size="small" onClick={() => handleRemove(index)} aria-label="リンクを削除">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}
      <Button size="small" startIcon={<AddIcon />} onClick={handleAdd}>
        リンクを追加
      </Button>
    </Box>
  );
};
