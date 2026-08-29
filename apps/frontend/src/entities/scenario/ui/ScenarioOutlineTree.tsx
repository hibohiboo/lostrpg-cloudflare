import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Typography } from '@mui/material';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import React from 'react';
import { getScenarioTypeIcon, getScenarioTypeLabel } from '../model/scenarioIcons';
import {
  scenarioEventElementId,
  scenarioPhaseElementId,
  scenarioSceneElementId,
} from '../model/scenarioNodeIds';
import type { ScenarioPhase } from '../model/scenario';

// クリックすると本文（ScenarioPhaseList）の該当箇所までスムーズスクロールする。
// react-router の Link ではなく素の <a> にすることで、SPA内遷移として扱われず
// ブラウザ標準のハッシュスクロールが効く。
const JumpLink: React.FC<{ elementId: string; icon?: ReturnType<typeof getScenarioTypeIcon>; text: string }> = ({
  elementId,
  icon,
  text,
}) => (
  <Box
    component="a"
    href={`#${elementId}`}
    onClick={(e: React.MouseEvent) => {
      e.preventDefault();
      document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }}
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      width: '100%',
      color: 'text.primary',
      textDecoration: 'none',
      '&:hover': { textDecoration: 'underline' },
    }}
  >
    {icon && <FontAwesomeIcon icon={icon} fixedWidth />}
    <Typography
      variant="body2"
      sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
    >
      {text || '(無題)'}
    </Typography>
  </Box>
);

const phaseTreeId = (phaseIndex: number): string => `outline-phase-${phaseIndex}`;
const sceneTreeId = (phaseIndex: number, sceneIndex: number): string =>
  `outline-scene-${phaseIndex}-${sceneIndex}`;
const eventTreeId = (phaseIndex: number, sceneIndex: number, eventIndex: number): string =>
  `outline-event-${phaseIndex}-${sceneIndex}-${eventIndex}`;

type Props = {
  phases: ScenarioPhase[];
};

// フェイズ／シーン／イベントの階層をアイコン付きツリーで一覧表示し、クリックで本文へジャンプ
// できるようにする（create-now版の「アイコンとツリー」表示に相当）。
export const ScenarioOutlineTree: React.FC<Props> = ({ phases }) => {
  if (phases.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        本文からフェイズが検出されませんでした
      </Typography>
    );
  }

  const allItemIds = phases.flatMap((phase, phaseIndex) => [
    phaseTreeId(phaseIndex),
    ...phase.scenes.flatMap((scene, sceneIndex) => [
      sceneTreeId(phaseIndex, sceneIndex),
      ...scene.events.map((_event, eventIndex) => eventTreeId(phaseIndex, sceneIndex, eventIndex)),
    ]),
  ]);

  return (
    <SimpleTreeView defaultExpandedItems={allItemIds}>
      {phases.map((phase, phaseIndex) => (
        <TreeItem
          key={phaseTreeId(phaseIndex)}
          itemId={phaseTreeId(phaseIndex)}
          label={<JumpLink elementId={scenarioPhaseElementId(phaseIndex)} text={phase.name} />}
        >
          {phase.scenes.map((scene, sceneIndex) => (
            <TreeItem
              key={sceneTreeId(phaseIndex, sceneIndex)}
              itemId={sceneTreeId(phaseIndex, sceneIndex)}
              label={
                <JumpLink
                  elementId={scenarioSceneElementId(phaseIndex, sceneIndex)}
                  icon={getScenarioTypeIcon(scene.type)}
                  text={
                    getScenarioTypeLabel(scene.type)
                      ? `${scene.name}（${getScenarioTypeLabel(scene.type)}）`
                      : scene.name
                  }
                />
              }
            >
              {scene.events.map((event, eventIndex) => (
                <TreeItem
                  key={eventTreeId(phaseIndex, sceneIndex, eventIndex)}
                  itemId={eventTreeId(phaseIndex, sceneIndex, eventIndex)}
                  label={
                    <JumpLink
                      elementId={scenarioEventElementId(phaseIndex, sceneIndex, eventIndex)}
                      icon={getScenarioTypeIcon(event.type)}
                      text={
                        getScenarioTypeLabel(event.type)
                          ? `${event.name}（${getScenarioTypeLabel(event.type)}）`
                          : event.name
                      }
                    />
                  }
                />
              ))}
            </TreeItem>
          ))}
        </TreeItem>
      ))}
    </SimpleTreeView>
  );
};
