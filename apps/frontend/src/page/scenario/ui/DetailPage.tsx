import EditIcon from '@mui/icons-material/Edit';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Box,
  Button,
  Chip,
  Collapse,
  Container,
  InputLabel,
  Link as MuiLink,
  Paper,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import { Link, useParams } from 'react-router';
import {
  BossAppendixView,
  CustomTableView,
  EnemyAppendixView,
  ScenarioChartView,
  ScenarioOutlineTree,
  ScenarioPhaseList,
  type Scenario,
  type ScenarioCustomTableKind,
  type ScenarioPhase,
} from '@lostrpg/frontend/entities/scenario';
import {
  FacilityAppendixView,
  ItemAppendixView,
} from '@lostrpg/frontend/features/scenario';
import { useAppSelector } from '@lostrpg/frontend/shared/lib/store';

const CUSTOM_TABLE_SECTIONS: {
  kind: ScenarioCustomTableKind;
  label: string;
  defaultLabel: string;
}[] = [
  {
    kind: 'encounter',
    label: 'ランダムエンカウント表',
    defaultLabel: 'ルールブック標準のランダムエンカウント表を使用します。',
  },
  { kind: 'wander', label: '散策表', defaultLabel: 'ルールブック標準の散策表を使用します。' },
  { kind: 'search', label: '探索表', defaultLabel: 'ルールブック標準の探索表を使用します。' },
  { kind: 'rest', label: '休憩表', defaultLabel: 'ルールブック標準の休憩表を使用します。' },
  { kind: 'other', label: 'その他の表', defaultLabel: '' },
];

// カスタム表（ランダムエンカウント表・散策表・探索表・休憩表・その他）・エネミー付録・
// ヌシ付録・アイテム付録・施設付録：いずれも本文の後に付録として表示する参照用データ
const ScenarioAppendixSection: React.FC<{ scenario: Scenario }> = ({
  scenario,
}) => (
  <>
    {CUSTOM_TABLE_SECTIONS.map(({ kind, label, defaultLabel }) => {
      const tables = scenario.customTables.filter((table) => table.kind === kind);
      if (tables.length === 0) return null;
      return (
        <Box key={kind} sx={{ my: 3 }}>
          <InputLabel sx={{ mb: 1 }}>{label}</InputLabel>
          <CustomTableView tables={tables} defaultLabel={defaultLabel} />
        </Box>
      );
    })}
    {scenario.enemies.length > 0 && (
      <Box sx={{ my: 3 }}>
        <InputLabel sx={{ mb: 1 }}>エネミー</InputLabel>
        <EnemyAppendixView enemies={scenario.enemies} />
      </Box>
    )}
    {scenario.bosses.length > 0 && (
      <Box sx={{ my: 3 }}>
        <InputLabel sx={{ mb: 1 }}>ヌシ</InputLabel>
        <BossAppendixView bosses={scenario.bosses} />
      </Box>
    )}
    {scenario.items.length > 0 && (
      <Box sx={{ my: 3 }}>
        <InputLabel sx={{ mb: 1 }}>アイテム</InputLabel>
        <ItemAppendixView items={scenario.items} />
      </Box>
    )}
    {scenario.facilities.length > 0 && (
      <Box sx={{ my: 3 }}>
        <InputLabel sx={{ mb: 1 }}>施設</InputLabel>
        <FacilityAppendixView facilities={scenario.facilities} />
      </Box>
    )}
  </>
);

// フェイズ/シーンのツリー：スマホでは本文の上に被ってしまうため、
// スマホ幅ではデフォルトで畳んでおき、ボタンで開閉できるようにする。
const ScenarioTreePanel: React.FC<{ phases: ScenarioPhase[] }> = ({
  phases,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isTreeOpen, setIsTreeOpen] = useState(false);

  return (
    <Box sx={{ width: { xs: '100%', sm: 280 }, flexShrink: 0 }}>
      {isMobile && (
        <Button
          fullWidth
          variant="outlined"
          onClick={() => setIsTreeOpen((prev) => !prev)}
          endIcon={isTreeOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          sx={{ mb: isTreeOpen ? 1 : 0 }}
        >
          ツリー
        </Button>
      )}
      <Collapse in={!isMobile || isTreeOpen}>
        <Box
          component={Paper}
          variant="outlined"
          sx={{
            p: 2,
            position: { sm: 'sticky' },
            top: { sm: 16 },
            maxHeight: { sm: 'calc(100vh - 32px)' },
            overflowY: { sm: 'auto' },
          }}
        >
          {!isMobile && <InputLabel sx={{ mb: 1 }}>ツリー</InputLabel>}
          <ScenarioOutlineTree phases={phases} />
        </Box>
      </Collapse>
    </Box>
  );
};

const DetailPage: React.FC = () => {
  const { id } = useParams();
  if (!id) throw new Error('id is empty');

  const scenario = useAppSelector((state) => state.scenario);
  const [detailTab, setDetailTab] = useState(0);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        {/* タイトルと編集ボタン */}
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4" component="h1">
            {scenario.name}
          </Typography>
          <Link to={`/scenario/${id}/edit`}>
            <Button variant="outlined" startIcon={<EditIcon />} size="small">
              編集
            </Button>
          </Link>
          {scenario.isPublish && (
            <Chip label="公開中" color="success" size="small" />
          )}
        </Box>

        {/* 作者名 */}
        {scenario.creatorName && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" color="text.secondary">
              作者: {scenario.creatorName}
            </Typography>
          </Box>
        )}

        {/* 推奨人数・プレイ時間・リミット */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 3 }}>
          {scenario.players && (
            <Chip label={`推奨人数: ${scenario.players}`} variant="outlined" />
          )}
          {scenario.time && (
            <Chip label={`プレイ時間: ${scenario.time}`} variant="outlined" />
          )}
          {scenario.limit && (
            <Chip label={`リミット: ${scenario.limit}`} variant="outlined" />
          )}
        </Box>
        {/* 画像と概要 */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          {scenario.imageUrl && (
            <Box
              component={Paper}
              sx={{
                minWidth: 320,
                maxWidth: 500,
                overflow: 'hidden',
              }}
            >
              <img
                src={scenario.imageUrl}
                alt="シナリオ画像"
                style={{ width: '100%', display: 'block' }}
              />
            </Box>
          )}

          {scenario.summary?.trim() && (
            <Box sx={{ minWidth: 320, flex: 1 }}>
              <InputLabel sx={{ mb: 1 }}>概要</InputLabel>
              <Box
                component={Paper}
                sx={{
                  p: 2,
                  whiteSpace: 'pre-wrap',
                }}
              >
                <Typography variant="body1">{scenario.summary}</Typography>
              </Box>
            </Box>
          )}
        </Box>
        {/* 注意事項 */}
        {scenario.caution?.trim() && (
          <Box sx={{ my: 3 }}>
            <InputLabel sx={{ mb: 1 }}>注意事項</InputLabel>
            <Box
              component={Paper}
              sx={{
                p: 2,
                whiteSpace: 'pre-wrap',
                minWidth: 320,
              }}
            >
              <Typography variant="body1">{scenario.caution}</Typography>
            </Box>
          </Box>
        )}

        {/* 本文（左にツリー・右に本文）／チャート（フェイズが上から下に並ぶフロー図） */}
        {scenario.phases.length > 0 && (
          <Box sx={{ my: 3 }}>
            <Tabs
              value={detailTab}
              onChange={(_, value) => setDetailTab(value)}
              sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
            >
              <Tab label="本文" />
              <Tab label="チャート" />
            </Tabs>

            {detailTab === 0 && (
              <Box
                sx={{
                  display: 'flex',
                  gap: 3,
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                }}
              >
                <ScenarioTreePanel phases={scenario.phases} />
                <Box sx={{ flex: 1, minWidth: 280 }}>
                  <ScenarioPhaseList phases={scenario.phases} />
                </Box>
              </Box>
            )}

            {detailTab === 1 && <ScenarioChartView phases={scenario.phases} />}
          </Box>
        )}
        {/* ランダムエンカウント表・ヌシ付録 */}
        <ScenarioAppendixSection scenario={scenario} />
        {/* 戻るリンク */}
        <Box sx={{ mt: 4 }}>
          <MuiLink component={Link} to="/scenario/" underline="hover">
            戻る
          </MuiLink>
        </Box>
      </Box>
    </Container>
  );
};

export default DetailPage;
