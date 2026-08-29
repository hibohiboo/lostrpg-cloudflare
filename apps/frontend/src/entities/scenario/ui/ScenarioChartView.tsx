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

const NODE_WIDTH = 200;
const NODE_HEIGHT = 56;
const COLUMN_GAP = 48;
const ROW_GAP = 40;
const ROW_HEIGHT = NODE_HEIGHT + ROW_GAP;
const PHASE_LABEL_HEIGHT = 32;
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

interface PhaseBand {
  name: string;
  y: number;
  height: number;
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

// next（'none'以外でaliasが解決できたもの）を明示的エッジとして集める
const buildExplicitEdges = (phases: ScenarioPhase[], aliasIndex: Map<string, string>): ChartEdge[] => {
  const edges: ChartEdge[] = [];
  phases.forEach((phase, phaseIndex) => {
    phase.scenes.forEach((scene, sceneIndex) => {
      (scene.next ?? [])
        .filter((target) => target !== 'none')
        .forEach((target) => {
          const toKey = aliasIndex.get(target);
          if (toKey) edges.push({ fromKey: sceneKey(phaseIndex, sceneIndex), toKey, isDefault: false });
        });
    });
  });
  return edges;
};

// next が明示されていないシーンは、同じフェイズ内の次のシーンへ既定の進行順エッジを引く。
// ただし、その次のシーンが既に別の場所からの明示的な接続先になっている（合流点である）場合は、
// ドキュメント順のノイズになる implicit edge を引かない。
const buildImplicitEdges = (phases: ScenarioPhase[], explicitEdges: ChartEdge[]): ChartEdge[] => {
  const explicitlyTargeted = new Set(explicitEdges.map((edge) => edge.toKey));
  const edges: ChartEdge[] = [];
  phases.forEach((phase, phaseIndex) => {
    phase.scenes.forEach((scene, sceneIndex) => {
      const next = scene.next ?? [];
      if (next.length > 0 || sceneIndex >= phase.scenes.length - 1) return;
      const toKey = sceneKey(phaseIndex, sceneIndex + 1);
      if (explicitlyTargeted.has(toKey)) return;
      edges.push({ fromKey: sceneKey(phaseIndex, sceneIndex), toKey, isDefault: true });
    });
  });
  return edges;
};

// フェイズ内のシーンを、分岐は分岐として横に並ぶ列（レーン）へ、進行度合いに応じた行へ
// 配置する（簡易的な階層グラフレイアウト）。1つ目の接続先は同じレーンを継続し、
// 2つ目以降の接続先は新しいレーンに分岐する。合流するシーンは両方の分岐より下の行になる。
const layoutPhase = (
  phaseIndex: number,
  sceneCount: number,
  localEdges: ChartEdge[],
): { column: Map<string, number>; layer: Map<string, number>; columnsUsed: number } => {
  const localKeys = Array.from({ length: sceneCount }, (_, i) => sceneKey(phaseIndex, i));

  const childrenOf = new Map<string, string[]>();
  localEdges.forEach((edge) => {
    const list = childrenOf.get(edge.fromKey) ?? [];
    list.push(edge.toKey);
    childrenOf.set(edge.fromKey, list);
  });
  const hasIncoming = new Set(localEdges.map((edge) => edge.toKey));
  const roots = localKeys.filter((key) => !hasIncoming.has(key));

  const column = new Map<string, number>();
  let nextColumn = 0;
  const assignColumn = (key: string, col: number) => {
    if (column.has(key)) return;
    column.set(key, col);
    nextColumn = Math.max(nextColumn, col + 1);
    (childrenOf.get(key) ?? []).forEach((childKey, i) => {
      assignColumn(childKey, i === 0 ? col : nextColumn);
    });
  };
  roots.forEach((key) => assignColumn(key, nextColumn));
  localKeys.forEach((key) => {
    if (!column.has(key)) assignColumn(key, nextColumn); // 孤立ノードの保険
  });

  // 最長経路でのレイヤリング（トポロジカル順の緩和を localKeys の数だけ繰り返して収束させる）
  const layer = new Map<string, number>(localKeys.map((key) => [key, 0]));
  for (let iteration = 0; iteration < localKeys.length; iteration += 1) {
    localEdges.forEach((edge) => {
      const from = layer.get(edge.fromKey) ?? 0;
      const to = layer.get(edge.toKey) ?? 0;
      if (to < from + 1) layer.set(edge.toKey, from + 1);
    });
  }

  return { column, layer, columnsUsed: Math.max(1, nextColumn) };
};

const buildChart = (
  phases: ScenarioPhase[],
): { nodes: ChartNode[]; edges: ChartEdge[]; bands: PhaseBand[]; totalHeight: number; maxColumns: number } => {
  const aliasIndex = buildAliasIndex(phases);
  const explicitEdges = buildExplicitEdges(phases, aliasIndex);
  const implicitEdges = buildImplicitEdges(phases, explicitEdges);
  const allEdges = [...explicitEdges, ...implicitEdges];

  const nodes: ChartNode[] = [];
  const bands: PhaseBand[] = [];
  let cursorY = PADDING;
  let maxColumns = 1;

  phases.forEach((phase, phaseIndex) => {
    const localKeys = new Set(phase.scenes.map((_, sceneIndex) => sceneKey(phaseIndex, sceneIndex)));
    const localEdges = allEdges.filter((edge) => localKeys.has(edge.fromKey) && localKeys.has(edge.toKey));
    const { column, layer, columnsUsed } = layoutPhase(phaseIndex, phase.scenes.length, localEdges);
    maxColumns = Math.max(maxColumns, columnsUsed);

    const bandStartY = cursorY;
    const contentStartY = cursorY + PHASE_LABEL_HEIGHT;
    const maxLayer = Math.max(0, ...Array.from(layer.values()));

    phase.scenes.forEach((scene, sceneIndex) => {
      const key = sceneKey(phaseIndex, sceneIndex);
      const next = scene.next ?? [];
      nodes.push({
        key,
        phaseIndex,
        sceneIndex,
        name: scene.name,
        type: scene.type,
        alias: scene.alias,
        isDeadEnd: next.includes('none'),
        x: PADDING + (column.get(key) ?? 0) * (NODE_WIDTH + COLUMN_GAP),
        y: contentStartY + (layer.get(key) ?? 0) * ROW_HEIGHT,
      });
    });

    cursorY = contentStartY + (maxLayer + 1) * ROW_HEIGHT;
    bands.push({ name: phase.name, y: bandStartY, height: cursorY - bandStartY });
  });

  return { nodes, edges: allEdges, bands, totalHeight: cursorY + PADDING, maxColumns };
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
            .join(' / ') || ' '}
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

// フェイズは上から下に、フェイズ内のチェックポイント／道は「分岐は横のレーンに分かれ、
// 合流はまた1つのノードに戻る」階層グラフとして描画するフローチャート
// （create-now版の「チャート」タブに相当）。
export const ScenarioChartView: React.FC<Props> = ({ phases }) => {
  const theme = useTheme();
  const { nodes, edges, bands, totalHeight, maxColumns } = buildChart(phases);

  if (nodes.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        本文からフェイズが検出されませんでした
      </Typography>
    );
  }

  const nodeByKey = new Map(nodes.map((node) => [node.key, node]));
  const width = PADDING * 2 + maxColumns * NODE_WIDTH + (maxColumns - 1) * COLUMN_GAP;
  const height = totalHeight;

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

          {/* フェイズごとの帯（上から下に並ぶ）と見出し */}
          {bands.map((band, index) => (
            <g key={`band-${index}`}>
              {index % 2 === 0 && (
                <rect x={0} y={band.y} width={width} height={band.height} fill={theme.palette.action.hover} />
              )}
              <foreignObject x={PADDING} y={band.y} width={width - PADDING * 2} height={PHASE_LABEL_HEIGHT}>
                <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                  {band.name}
                </Typography>
              </foreignObject>
            </g>
          ))}

          {/* 分岐は横のレーンへ、合流はまた1本のノードへ戻るS字カーブでつなぐ */}
          {edges.map((edge, index) => {
            const from = nodeByKey.get(edge.fromKey);
            const to = nodeByKey.get(edge.toKey);
            if (!from || !to) return null;

            const startX = from.x + NODE_WIDTH / 2;
            const startY = from.y + NODE_HEIGHT;
            const endX = to.x + NODE_WIDTH / 2;
            const endY = to.y;
            const midY = (startY + endY) / 2;

            return (
              <path
                key={index}
                d={`M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`}
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
        点線の矢印はフェイズ内の既定の進行順、実線の矢印は next 属性による明示的な接続です。分岐は横のレーンに分かれ、合流すると1つのノードに戻ります。
      </Typography>

      <ChartTextTable phases={phases} />
    </Box>
  );
};
