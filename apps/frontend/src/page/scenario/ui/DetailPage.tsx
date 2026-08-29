import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Button,
  Chip,
  Container,
  InputLabel,
  Link as MuiLink,
  Paper,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { Link, useParams } from 'react-router';
import {
  BossAppendixView,
  EncounterTableView,
  RollTableView,
  ScenarioChartView,
  ScenarioOutlineTree,
  ScenarioPhaseList,
  type Scenario,
} from '@lostrpg/frontend/entities/scenario';
import { ItemAppendixView } from '@lostrpg/frontend/features/scenario';
import { useAppSelector } from '@lostrpg/frontend/shared/lib/store';

// ランダムエンカウント表・散策表・探索表・休憩表・ヌシ付録・アイテム付録：
// いずれも本文の後に付録として表示する参照用データ
const ScenarioAppendixSection: React.FC<{ scenario: Scenario }> = ({
  scenario,
}) => (
  <>
    {scenario.encounterTable.mode !== 'default' && (
      <Box sx={{ my: 3 }}>
        <InputLabel sx={{ mb: 1 }}>ランダムエンカウント表</InputLabel>
        <EncounterTableView encounterTable={scenario.encounterTable} />
      </Box>
    )}
    {scenario.wanderTable.mode !== 'default' && (
      <Box sx={{ my: 3 }}>
        <InputLabel sx={{ mb: 1 }}>散策表</InputLabel>
        <RollTableView
          settings={scenario.wanderTable}
          defaultLabel="ルールブック標準の散策表を使用します。"
        />
      </Box>
    )}
    {scenario.searchTable.mode !== 'default' && (
      <Box sx={{ my: 3 }}>
        <InputLabel sx={{ mb: 1 }}>探索表</InputLabel>
        <RollTableView
          settings={scenario.searchTable}
          defaultLabel="ルールブック標準の探索表を使用します。"
        />
      </Box>
    )}
    {scenario.restTable.mode !== 'default' && (
      <Box sx={{ my: 3 }}>
        <InputLabel sx={{ mb: 1 }}>休憩表</InputLabel>
        <RollTableView
          settings={scenario.restTable}
          defaultLabel="ルールブック標準の休憩表を使用します。"
        />
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
  </>
);

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
                <Box
                  component={Paper}
                  variant="outlined"
                  sx={{
                    width: 280,
                    flexShrink: 0,
                    p: 2,
                    position: 'sticky',
                    top: 16,
                    maxHeight: 'calc(100vh - 32px)',
                    overflowY: 'auto',
                  }}
                >
                  <InputLabel sx={{ mb: 1 }}>ツリー</InputLabel>
                  <ScenarioOutlineTree phases={scenario.phases} />
                </Box>
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
          <MuiLink href="/scenario/" underline="hover">
            戻る
          </MuiLink>
        </Box>
      </Box>
    </Container>
  );
};

export default DetailPage;
