import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
import { getScenarioTypeIcon, getScenarioTypeLabel } from '../model/scenarioIcons';
import {
  scenarioEventElementId,
  scenarioPhaseElementId,
  scenarioSceneElementId,
} from '../model/scenarioNodeIds';
import type {
  ScenarioEvent,
  ScenarioPhase,
  ScenarioScene,
  ScenarioTable,
} from '../model/scenario';

// 種類（type）アイコン付きのChip。記法例にないtypeの場合はアイコンなしで表示し、
// ラベルも日本語名が引ければそちらを使う（引けなければtypeの生値を表示する）。
const TypeBadge: React.FC<{ type?: string | null; prefix?: string }> = ({ type, prefix }) => {
  if (!type) return null;
  const icon = getScenarioTypeIcon(type);
  const label = getScenarioTypeLabel(type) ?? type;
  return (
    <Chip
      icon={icon ? <FontAwesomeIcon icon={icon} style={{ fontSize: '0.85em' }} /> : undefined}
      label={prefix ? `${prefix}（${label}）` : label}
      size="small"
      variant="outlined"
    />
  );
};

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

type EventViewProps = { event: ScenarioEvent; elementId?: string };

const EventView: React.FC<EventViewProps> = ({ event, elementId }) => (
  <Box
    id={elementId}
    sx={{
      my: 1.5,
      pl: 2,
      borderLeft: '3px solid',
      borderColor: 'divider',
      scrollMarginTop: 16,
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
      <Typography variant="subtitle1">{event.name}</Typography>
      <TypeBadge type={event.type} />
    </Box>

    {event.lines.map((line, index) => (
      <Typography key={index} variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
        {line}
      </Typography>
    ))}

    {event.items.length > 0 && (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
        {event.items.map((item, index) => (
          <TypeBadge key={index} type={item.type} prefix={item.name} />
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

type SceneViewProps = { scene: ScenarioScene; phaseIndex: number; sceneIndex: number };

const SceneView: React.FC<SceneViewProps> = ({ scene, phaseIndex, sceneIndex }) => (
  <Box
    id={scenarioSceneElementId(phaseIndex, sceneIndex)}
    component={Paper}
    variant="outlined"
    sx={{ p: 2, my: 2, scrollMarginTop: 16 }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
      <Typography variant="h6">{scene.name}</Typography>
      <TypeBadge type={scene.type} />
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
      <EventView
        key={index}
        event={event}
        elementId={scenarioEventElementId(phaseIndex, sceneIndex, index)}
      />
    ))}
  </Box>
);

const PhaseView: React.FC<{ phase: ScenarioPhase; phaseIndex: number }> = ({
  phase,
  phaseIndex,
}) => (
  <Box id={scenarioPhaseElementId(phaseIndex)} sx={{ my: 3, scrollMarginTop: 16 }}>
    <Typography variant="h5" sx={{ borderBottom: '2px solid', borderColor: 'primary.main', pb: 0.5 }}>
      {phase.name}
    </Typography>
    {phase.scenes.map((scene, index) => (
      <SceneView key={index} scene={scene} phaseIndex={phaseIndex} sceneIndex={index} />
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
        <PhaseView key={index} phase={phase} phaseIndex={index} />
      ))}
    </Box>
  );
};
