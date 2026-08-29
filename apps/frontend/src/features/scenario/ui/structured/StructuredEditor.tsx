import { parseScenarioContent } from '@lostrpg/core/scenario/parseScenarioContent';
import { stringifyScenario } from '@lostrpg/core/scenario/stringifyScenario';
import AddIcon from '@mui/icons-material/Add';
import { Box, Button, TextField, Typography } from '@mui/material';
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

interface EditorState {
  players: string;
  time: string;
  limit: string;
  caution: string;
  phases: ScenarioPhase[];
}

// マークダウン編集タブと相互に行き来できるよう、想定人数／プレイ時間／リミット／注意事項と
// フェイズ／シーン／イベントのツリー＋フォームで構造化データを編集する。
// 編集内容は都度Markdownへ書き戻し、scenario.content（唯一の保存先）と同期させる。
export const StructuredEditor: React.FC<Props> = ({
  content,
  onContentChange,
}) => {
  const [state, setState] = useState<EditorState>(() =>
    parseScenarioContent(content),
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const commit = (changes: Partial<EditorState>) => {
    const next = { ...state, ...changes };
    setState(next);
    onContentChange(stringifyScenario(next));
  };

  const { phases } = state;
  const commitPhases = (next: ScenarioPhase[]) => commit({ phases: next });

  const handleAddPhase = () => commitPhases(addPhase(phases));
  const handleAddScene = (phaseIndex: number) =>
    commitPhases(addScene(phases, phaseIndex));
  const handleAddEvent = (phaseIndex: number, sceneIndex: number) =>
    commitPhases(addEvent(phases, phaseIndex, sceneIndex));

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
          onChange={(changes) =>
            commitPhases(updatePhase(phases, selection.phaseIndex, changes))
          }
          onDelete={() => {
            commitPhases(removePhase(phases, selection.phaseIndex));
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
            commitPhases(
              updateScene(
                phases,
                selection.phaseIndex,
                selection.sceneIndex,
                changes,
              ),
            )
          }
          onDelete={() => {
            commitPhases(
              removeScene(phases, selection.phaseIndex, selection.sceneIndex),
            );
            setSelectedId(null);
          }}
        />
      );
    }

    const event =
      phases[selection.phaseIndex]?.scenes[selection.sceneIndex]?.events[
        selection.eventIndex
      ];
    if (!event) return null;
    return (
      <EventForm
        event={event}
        onChange={(changes) =>
          commitPhases(
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
          commitPhases(
            removeEvent(
              phases,
              selection.phaseIndex,
              selection.sceneIndex,
              selection.eventIndex,
            ),
          );
          setSelectedId(null);
        }}
      />
    );
  };

  return (
    <Box>
      {/* シナリオ設定（想定人数・プレイ時間・リミット・注意事項） */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          label="想定人数"
          value={state.players}
          onChange={(e) => commit({ players: e.target.value })}
          sx={{ flex: 1, minWidth: 160 }}
        />
        <TextField
          label="プレイ時間"
          value={state.time}
          onChange={(e) => commit({ time: e.target.value })}
          sx={{ flex: 1, minWidth: 160 }}
        />
        <TextField
          label="リミット"
          value={state.limit}
          onChange={(e) => commit({ limit: e.target.value })}
          sx={{ flex: 1, minWidth: 160 }}
        />
        <TextField
          label="注意事項"
          value={state.caution}
          onChange={(e) => commit({ caution: e.target.value })}
          sx={{ flex: 2, minWidth: 200 }}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: 3,
          alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{ width: 300, flexShrink: 0 }}>
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={handleAddPhase}
            sx={{ mb: 1 }}
          >
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
    </Box>
  );
};
