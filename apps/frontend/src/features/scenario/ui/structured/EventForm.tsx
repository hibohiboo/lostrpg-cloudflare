import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, TextField, Typography } from '@mui/material';
import React from 'react';
import { EventItemsEditor } from './EventItemsEditor';
import { EventLinksEditor } from './EventLinksEditor';
import { EventTablesEditor } from './EventTablesEditor';
import type { ScenarioEvent } from '@lostrpg/frontend/entities/scenario';

type Props = {
  event: ScenarioEvent;
  onChange: (changes: Partial<ScenarioEvent>) => void;
  onDelete: () => void;
};

export const EventForm: React.FC<Props> = ({ event, onChange, onDelete }) => (
  <Box>
    <Typography variant="h6" gutterBottom>
      イベントを編集
    </Typography>
    <TextField
      fullWidth
      label="イベント名"
      value={event.name}
      onChange={(e) => onChange({ name: e.target.value })}
      sx={{ my: 2 }}
    />
    <TextField
      fullWidth
      label="種類（type）"
      placeholder="battle / lock / search / limitUp / boss など"
      helperText="描写（通常の説明イベント）は空欄のままでOKです"
      value={event.type === 'view' ? '' : event.type}
      onChange={(e) => onChange({ type: e.target.value || 'view' })}
      sx={{ my: 2 }}
    />
    <TextField
      fullWidth
      multiline
      rows={4}
      label="本文"
      value={event.lines.join('\n')}
      onChange={(e) => onChange({ lines: e.target.value.split('\n') })}
      sx={{ my: 2 }}
    />

    <Box sx={{ my: 3 }}>
      <EventItemsEditor items={event.items} onChange={(items) => onChange({ items })} />
    </Box>
    <Box sx={{ my: 3 }}>
      <EventTablesEditor tables={event.tables} onChange={(tables) => onChange({ tables })} />
    </Box>
    <Box sx={{ my: 3 }}>
      <EventLinksEditor links={event.links} onChange={(links) => onChange({ links })} />
    </Box>

    <Button
      variant="outlined"
      color="error"
      startIcon={<DeleteIcon />}
      onClick={onDelete}
    >
      このイベントを削除
    </Button>
  </Box>
);
