import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import React from 'react';
import { getScenarioTypeIcon, getScenarioTypeLabel } from '../model/scenarioIcons';
import type { ScenarioPhase } from '../model/scenario';

const DEAD_END_LABEL = '（行き止まり）';

const NODE_WIDTH = 176;
const NODE_HEIGHT = 60;
const COL_WIDTH = 220;
const ROW_HEIGHT = 128;
const PADDING = 24;

interface ChartNode {
  key: string;
  phaseIndex: number;
  sceneIndex: number;
  name: string;
  type: string | null | undefined;
  alias: string | null | undefined;
  isDeadEnd: boolean;
  x: number;
  y: number;
}

interface ChartEdge {
  fromKey: string;
  toKey: string;
  isDefault: boolean;
}

const sceneKey = (phaseIndex: number, sceneIndex: number): string => `${phaseIndex}-${sceneIndex}`;

// シーンID（alias）→ ノードキー の対応表（next側の接続先を解決するために使う）
const buildAliasIndex = (phases: ScenarioPhase[]): Map<string, string> => {
  const map = new Map<string, string>();
  phases.forEach((phase, phaseIndex) => {
    phase.scenes.forEach((scene, sceneIndex) => {
      if (scene.alias) map.set(scene.alias, sceneKey(phaseIndex, sceneIndex));
    });
  });
  return map;
};

// フェイズ内のシーンを横一列（スイムレーン）に並べたノードと、
// 「同じフェイズ内での隣接（既定の進行順）」「next属性による明示的な接続」の2種類のエッジを組み立てる
const buildChart = (phases: ScenarioPhase[]): { nodes: ChartNode[]; edges: ChartEdge[] } => {
  const aliasIndex = buildAliasIndex(phases);
  const nodes: ChartNode[] = [];
  const edges: ChartEdge[] = [];

  phases.forEach((phase, phaseIndex) => {
    phase.scenes.forEach((scene, sceneIndex) => {
      const next = scene.next ?? [];
      nodes.push({
        key: sceneKey(phaseIndex, sceneIndex),
        phaseIndex,
        sceneIndex,
        name: scene.name,
        type: scene.type,
        alias: scene.alias,
        isDeadEnd: next.includes('none'),
        x: PADDING + sceneIndex * COL_WIDTH,
        y: PADDING + phaseIndex * ROW_HEIGHT,
      });

      // next（'none'以外）はaliasで解決できた接続先だけを明示的なエッジとして描画する
      next
        .filter((target) => target !== 'none')
        .forEach((target) => {
          const toKey = aliasIndex.get(target);
          if (toKey) edges.push({ fromKey: sceneKey(phaseIndex, sceneIndex), toKey, isDefault: false });
        });

      // next が明示されていないシーンは、同じフェイズ内の次のシーンへ既定の進行順エッジを引く
      if (next.length === 0 && sceneIndex < phase.scenes.length - 1) {
        edges.push({
          fromKey: sceneKey(phaseIndex, sceneIndex),
          toKey: sceneKey(phaseIndex, sceneIndex + 1),
          isDefault: true,
        });
      }
    });
  });

  return { nodes, edges };
};

const ChartNodeBox: React.FC<{ node: ChartNode }> = ({ node }) => {
  const icon = getScenarioTypeIcon(node.type);
  const label = getScenarioTypeLabel(node.type);

  return (
    <foreignObject x={node.x} y={node.y} width={NODE_WIDTH} height={NODE_HEIGHT}>
      <Box
        component={Paper}
        variant="outlined"
        sx={{
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
          p: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 0.25,
          borderColor: node.isDeadEnd ? 'error.main' : 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0 }}>
          {icon && <FontAwesomeIcon icon={icon} fixedWidth />}
          <Typography
            variant="body2"
            sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {node.name}
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ pl: icon ? 2.5 : 0 }}>
          {[label, node.alias ? `ID:${node.alias}` : null, node.isDeadEnd ? DEAD_END_LABEL : null]
            .filter(Boolean)
            .join(' / ') || ' '}
        </Typography>
      </Box>
    </foreignObject>
  );
};

type Props = {
  phases: ScenarioPhase[];
};

// スクリーンリーダー等、SVGの図が読み取れない場合のためのテキスト版（alias/nextの一覧）
const ChartTextTable: React.FC<Props> = ({ phases }) => {
  const aliasIndex = buildAliasIndex(phases);
  const nameByKey = new Map(
    phases.flatMap((phase, phaseIndex) =>
      phase.scenes.map((scene, sceneIndex) => [sceneKey(phaseIndex, sceneIndex), scene.name] as const),
    ),
  );
  const resolveNextLabel = (target: string): string => {
    if (target === 'none') return DEAD_END_LABEL;
    const key = aliasIndex.get(target);
    return key ? (nameByKey.get(key) ?? target) : target;
  };

  const rows = phases.flatMap((phase) =>
    phase.scenes
      .filter((scene) => scene.alias || (scene.next && scene.next.length > 0))
      .map((scene) => ({
        phaseName: phase.name,
        sceneName: scene.name,
        alias: scene.alias ?? null,
        nextLabels: (scene.next ?? []).map(resolveNextLabel),
      })),
  );

  if (rows.length === 0) return null;

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        テキスト表示
      </Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>フェイズ</TableCell>
              <TableCell>シーン</TableCell>
              <TableCell>ID（alias）</TableCell>
              <TableCell>次へ（next）</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.phaseName}</TableCell>
                <TableCell>{row.sceneName}</TableCell>
                <TableCell>{row.alias ?? '－'}</TableCell>
                <TableCell>{row.nextLabels.length > 0 ? row.nextLabels.join(' / ') : '－'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

// フェイズごとのシーンを横一列に並べ、既定の進行順（灰色の矢印）と
// next属性による明示的な接続（青色の矢印、分岐や別フェイズへのジャンプを含む）を
// SVGで描画するフローチャート（create-now版の「チャート」タブに相当）。
export const ScenarioChartView: React.FC<Props> = ({ phases }) => {
  const theme = useTheme();
  const { nodes, edges } = buildChart(phases);

  if (nodes.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        本文からフェイズが検出されませんでした
      </Typography>
    );
  }

  const nodeByKey = new Map(nodes.map((node) => [node.key, node]));
  const maxCols = Math.max(...phases.map((phase) => phase.scenes.length));
  const width = PADDING * 2 + maxCols * COL_WIDTH;
  const height = PADDING * 2 + phases.length * ROW_HEIGHT;

  const defaultColor = theme.palette.text.disabled;
  const explicitColor = theme.palette.primary.main;

  return (
    <Box>
      <Box sx={{ overflowX: 'auto', border: 1, borderColor: 'divider', borderRadius: 1 }}>
        <svg width={width} height={height} style={{ display: 'block', minWidth: width }}>
          <defs>
            <marker
              id="chart-arrow-default"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 z" fill={defaultColor} />
            </marker>
            <marker
              id="chart-arrow-explicit"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 z" fill={explicitColor} />
            </marker>
          </defs>

          {edges.map((edge, index) => {
            const from = nodeByKey.get(edge.fromKey);
            const to = nodeByKey.get(edge.toKey);
            if (!from || !to) return null;

            const startX = from.x + NODE_WIDTH;
            const startY = from.y + NODE_HEIGHT / 2;
            const endX = to.x;
            const endY = to.y + NODE_HEIGHT / 2;
            const curve = Math.max(40, Math.abs(endX - startX) / 2);

            return (
              <path
                key={index}
                d={`M ${startX} ${startY} C ${startX + curve} ${startY}, ${endX - curve} ${endY}, ${endX} ${endY}`}
                fill="none"
                stroke={edge.isDefault ? defaultColor : explicitColor}
                strokeWidth={edge.isDefault ? 1.5 : 2}
                strokeDasharray={edge.isDefault ? '4 3' : undefined}
                markerEnd={`url(#${edge.isDefault ? 'chart-arrow-default' : 'chart-arrow-explicit'})`}
              />
            );
          })}

          {nodes.map((node) => (
            <ChartNodeBox key={node.key} node={node} />
          ))}
        </svg>
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
        点線の矢印はフェイズ内の既定の進行順、実線の矢印は next 属性による明示的な接続（分岐・別フェイズへのジャンプを含む）です。
      </Typography>

      <ChartTextTable phases={phases} />
    </Box>
  );
};
