import {
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
import type { ScenarioPhase } from '../model/scenario';

const DEAD_END_LABEL = '（行き止まり）';

interface ChartRow {
  phaseName: string;
  sceneName: string;
  alias: string | null;
  nextLabels: string[];
}

// シーンID（alias）→ シーン名 の対応表を作る（next側の接続先を名前解決するために使う）
const buildAliasMap = (phases: ScenarioPhase[]): Map<string, string> => {
  const map = new Map<string, string>();
  phases.forEach((phase) => {
    phase.scenes.forEach((scene) => {
      if (scene.alias) map.set(scene.alias, scene.name);
    });
  });
  return map;
};

const resolveNextLabel = (aliasMap: Map<string, string>, target: string): string => {
  if (target === 'none') return DEAD_END_LABEL;
  return aliasMap.get(target) ?? target;
};

// alias（シーンID）または next（次のシーンへの接続）のどちらかが設定されているシーンだけを対象にする
const buildChartRows = (phases: ScenarioPhase[]): ChartRow[] => {
  const aliasMap = buildAliasMap(phases);
  const rows: ChartRow[] = [];

  phases.forEach((phase) => {
    phase.scenes.forEach((scene) => {
      const hasNext = !!scene.next && scene.next.length > 0;
      if (!scene.alias && !hasNext) return;

      rows.push({
        phaseName: phase.name,
        sceneName: scene.name,
        alias: scene.alias ?? null,
        nextLabels: (scene.next ?? []).map((target) => resolveNextLabel(aliasMap, target)),
      });
    });
  });

  return rows;
};

type Props = {
  phases: ScenarioPhase[];
};

// シーンID（alias）と次のシーンへの接続（next）から、探索フェイズのチェックポイント／道の
// つながりを一覧表示する（create-now版の「チャート」タブに相当）
export const ScenarioChartView: React.FC<Props> = ({ phases }) => {
  const rows = buildChartRows(phases);

  if (rows.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        シーンID（alias）や次のシーン（next）が設定されていません
      </Typography>
    );
  }

  return (
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
  );
};
