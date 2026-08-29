import { parseScenarioContent, splitScenarioIntro } from '@lostrpg/core/scenario/parseScenarioContent';
import { stringifyScenarioPhases } from '@lostrpg/core/scenario/stringifyScenarioPhases';
import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Typography } from '@mui/material';
import React, { useState } from 'react';
import { EventForm } from './EventForm';
import { PhaseForm } from './PhaseForm';
import { ScenarioTree } from './ScenarioTree';
import { SceneForm } from './SceneForm';
import {
  addEvent,
  addPhase,
  addScene,
  removeEvent,
  removePhase,
  removeScene,
  updateEvent,
  updatePhase,
  updateScene,
} from './treeOperations';
import { parseNodeId } from './types';
import type { ScenarioPhase } from '@lostrpg/frontend/entities/scenario';

type Props = {
  content: string;
  onContentChange: (content: string) => void;
};

const buildContent = (intro: string, phases: ScenarioPhase[]): string => {
  const body = stringifyScenarioPhases(phases);
  return intro ? `${intro}\n\n${body}` : body;
};

// マークダウン編集タブと相互に行き来できるよう、フェイズ／シーン／イベントの
// ツリー＋フォームで構造化データを編集する。編集内容は都度Markdownへ書き戻し、
// scenario.content（唯一の保存先）と同期させる。
export const StructuredEditor: React.FC<Props> = ({ content, onContentChange }) => {
  const [intro] = useState(() => splitScenarioIntro(content).intro);
  const [phases, setPhases] = useState<ScenarioPhase[]>(
    () => parseScenarioContent(splitScenarioIntro(content).phasesMarkdown).phases,
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const commit = (next: ScenarioPhase[]) => {
    setPhases(next);
    onContentChange(buildContent(intro, next));
  };

  const handleAddPhase = () => commit(addPhase(phases));
  const handleAddScene = (phaseIndex: number) => commit(addScene(phases, phaseIndex));
  const handleAddEvent = (phaseIndex: number, sceneIndex: number) =>
    commit(addEvent(phases, phaseIndex, sceneIndex));

  const selection = parseNodeId(selectedId);

  const renderForm = () => {
    if (!selection) {
      return (
        <Typography variant="body2" color="text.secondary">
          左のツリーからフェイズ／シーン／イベントを選択すると、ここで編集できます。
        </Typography>
      );
    }

    if (selection.kind === 'phase') {
      const phase = phases[selection.phaseIndex];
      if (!phase) return null;
      return (
        <PhaseForm
          phase={phase}
          onChange={(changes) => commit(updatePhase(phases, selection.phaseIndex, changes))}
          onDelete={() => {
            commit(removePhase(phases, selection.phaseIndex));
            setSelectedId(null);
          }}
        />
      );
    }

    if (selection.kind === 'scene') {
      const scene = phases[selection.phaseIndex]?.scenes[selection.sceneIndex];
      if (!scene) return null;
      return (
        <SceneForm
          scene={scene}
          onChange={(changes) =>
            commit(updateScene(phases, selection.phaseIndex, selection.sceneIndex, changes))
          }
          onDelete={() => {
            commit(removeScene(phases, selection.phaseIndex, selection.sceneIndex));
            setSelectedId(null);
          }}
        />
      );
    }

    const event =
      phases[selection.phaseIndex]?.scenes[selection.sceneIndex]?.events[selection.eventIndex];
    if (!event) return null;
    return (
      <EventForm
        event={event}
        onChange={(changes) =>
          commit(
            updateEvent(
              phases,
              selection.phaseIndex,
              selection.sceneIndex,
              selection.eventIndex,
              changes,
            ),
          )
        }
        onDelete={() => {
          commit(
            removeEvent(phases, selection.phaseIndex, selection.sceneIndex, selection.eventIndex),
          );
          setSelectedId(null);
        }}
      />
    );
  };

  return (
    <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <Box sx={{ width: 300, flexShrink: 0 }}>
        <Button size="small" startIcon={<AddIcon />} onClick={handleAddPhase} sx={{ mb: 1 }}>
          フェイズを追加
        </Button>
        {phases.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            まだフェイズがありません。
          </Typography>
        ) : (
          <ScenarioTree
            phases={phases}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onAddScene={handleAddScene}
            onAddEvent={handleAddEvent}
          />
        )}
      </Box>
      <Box sx={{ flex: 1, minWidth: 280 }}>{renderForm()}</Box>
    </Box>
  );
};
