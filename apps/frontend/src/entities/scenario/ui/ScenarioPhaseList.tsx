import {
  Box,
  Chip,
  Link as MuiLink,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React from 'react';
import type {
  ScenarioEvent,
  ScenarioPhase,
  ScenarioScene,
  ScenarioTable,
} from '../model/scenario';

const EventTable: React.FC<{ table: ScenarioTable }> = ({ table }) => (
  <Box sx={{ my: 1 }}>
    {table.title && (
      <Typography variant="subtitle2" gutterBottom>
        {table.title}
      </Typography>
    )}
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            {table.columns.map((column, index) => (
              <TableCell key={`${column}-${index}`}>{column}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {table.rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {row.cells.map((cell, cellIndex) => (
                <TableCell key={cellIndex}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

const EventView: React.FC<{ event: ScenarioEvent }> = ({ event }) => (
  <Box
    sx={{
      my: 1.5,
      pl: 2,
      borderLeft: '3px solid',
      borderColor: 'divider',
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
      <Typography variant="subtitle1">{event.name}</Typography>
      <Chip label={event.type} size="small" variant="outlined" />
    </Box>

    {event.lines.map((line, index) => (
      <Typography key={index} variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
        {line}
      </Typography>
    ))}

    {event.items.length > 0 && (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
        {event.items.map((item, index) => (
          <Chip
            key={index}
            label={`${item.name}（${item.type}）`}
            size="small"
            color="primary"
            variant="outlined"
          />
        ))}
      </Box>
    )}

    {event.tables.map((table, index) => (
      <EventTable key={index} table={table} />
    ))}

    {event.links.length > 0 && (
      <Box sx={{ mt: 1 }}>
        {event.links.map((link, index) => (
          <Box key={index}>
            <MuiLink href={link.url} target="_blank" rel="noopener noreferrer">
              {link.value}
            </MuiLink>
          </Box>
        ))}
      </Box>
    )}
  </Box>
);

const SceneView: React.FC<{ scene: ScenarioScene }> = ({ scene }) => (
  <Box component={Paper} variant="outlined" sx={{ p: 2, my: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
      <Typography variant="h6">{scene.name}</Typography>
      {scene.type && <Chip label={`type: ${scene.type}`} size="small" />}
      {scene.alias && <Chip label={`alias: ${scene.alias}`} size="small" />}
      {scene.next && scene.next.length > 0 && (
        <Chip label={`next: ${scene.next.join(', ')}`} size="small" />
      )}
    </Box>

    {scene.lines.map((line, index) => (
      <Typography key={index} variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 1 }}>
        {line}
      </Typography>
    ))}

    {scene.events.map((event, index) => (
      <EventView key={index} event={event} />
    ))}
  </Box>
);

const PhaseView: React.FC<{ phase: ScenarioPhase }> = ({ phase }) => (
  <Box sx={{ my: 3 }}>
    <Typography variant="h5" sx={{ borderBottom: '2px solid', borderColor: 'primary.main', pb: 0.5 }}>
      {phase.name}
    </Typography>
    {phase.scenes.map((scene, index) => (
      <SceneView key={index} scene={scene} />
    ))}
  </Box>
);

type Props = {
  phases: ScenarioPhase[];
};

export const ScenarioPhaseList: React.FC<Props> = ({ phases }) => {
  if (phases.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        本文からフェイズが検出されませんでした
      </Typography>
    );
  }

  return (
    <Box>
      {phases.map((phase, index) => (
        <PhaseView key={index} phase={phase} />
      ))}
    </Box>
  );
};
