import AddIcon from '@mui/icons-material/Add';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import React from 'react';
import { eventNodeId, phaseNodeId, sceneNodeId } from './types';
import type { ScenarioPhase } from '@lostrpg/frontend/entities/scenario';

type NodeLabelProps = {
  text: string;
  onAdd?: () => void;
  addLabel?: string;
};

const NodeLabel: React.FC<NodeLabelProps> = ({ text, onAdd, addLabel }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    }}
  >
    <Typography
      variant="body2"
      sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
    >
      {text || '(無題)'}
    </Typography>
    {onAdd && (
      <Tooltip title={addLabel ?? '追加'}>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onAdd();
          }}
        >
          <AddIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>
    )}
  </Box>
);

type Props = {
  phases: ScenarioPhase[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onAddScene: (phaseIndex: number) => void;
  onAddEvent: (phaseIndex: number, sceneIndex: number) => void;
  expandedIds: string[];
  onExpandedIdsChange: (ids: string[]) => void;
};

export const ScenarioTree: React.FC<Props> = ({
  phases,
  selectedId,
  onSelect,
  onAddScene,
  onAddEvent,
  expandedIds,
  onExpandedIdsChange,
}) => (
  <SimpleTreeView
    selectedItems={selectedId}
    onSelectedItemsChange={(_, itemId) => onSelect(itemId)}
    expandedItems={expandedIds}
    onExpandedItemsChange={(_, itemIds) => onExpandedIdsChange(itemIds)}
  >
    {phases.map((phase, phaseIndex) => (
      <TreeItem
        key={phaseNodeId(phaseIndex)}
        itemId={phaseNodeId(phaseIndex)}
        label={
          <NodeLabel
            text={phase.name}
            addLabel="シーンを追加"
            onAdd={() => onAddScene(phaseIndex)}
          />
        }
      >
        {phase.scenes.map((scene, sceneIndex) => (
          <TreeItem
            key={sceneNodeId(phaseIndex, sceneIndex)}
            itemId={sceneNodeId(phaseIndex, sceneIndex)}
            label={
              <NodeLabel
                text={scene.name}
                addLabel="イベントを追加"
                onAdd={() => onAddEvent(phaseIndex, sceneIndex)}
              />
            }
          >
            {scene.events.map((event, eventIndex) => (
              <TreeItem
                key={eventNodeId(phaseIndex, sceneIndex, eventIndex)}
                itemId={eventNodeId(phaseIndex, sceneIndex, eventIndex)}
                label={<NodeLabel text={event.name} />}
              />
            ))}
          </TreeItem>
        ))}
      </TreeItem>
    ))}
  </SimpleTreeView>
);
