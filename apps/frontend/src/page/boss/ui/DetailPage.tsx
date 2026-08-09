import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Button,
  Chip,
  Container,
  InputLabel,
  Link as MuiLink,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { Link, useParams } from 'react-router';
import { AbilityTable } from '@lostrpg/frontend/entities/ability';
import {
  SpecialtiesSection,
  StatusAilmentsSection,
  copyBossToCcfolia,
  exportBossToTRPGStudio,
  exportBossToUdonarium,
} from '@lostrpg/frontend/features/boss';
import { useAppSelector } from '@lostrpg/frontend/shared/lib/store';

const DetailPage: React.FC = () => {
  const { id } = useParams();
  const boss = useAppSelector((state) => state.boss);
  const [copySuccess, setCopySuccess] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [trpgStudioSuccess, setTrpgStudioSuccess] = useState(false);
  // 体力・気力はプレイ中にメモとして書き換えられるよう、この画面限りの状態として保持する（保存はしない）
  const [staminaMemo, setStaminaMemo] = useState(boss.stamina);
  const [willPowerMemo, setWillPowerMemo] = useState(boss.willPower);

  const handleCopyToCcfolia = async () => {
    try {
      await copyBossToCcfolia(boss, id || '');
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('クリップボードへのコピーに失敗しました:', error);
    }
  };

  const handleExportToUdonarium = async () => {
    try {
      await exportBossToUdonarium(boss, id || '');
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 2000);
    } catch (error) {
      console.error('ユドナリウムへのエクスポートに失敗しました:', error);
    }
  };

  const handleExportToTRPGStudio = () => {
    try {
      exportBossToTRPGStudio(boss);
      setTrpgStudioSuccess(true);
      setTimeout(() => setTrpgStudioSuccess(false), 2000);
    } catch (error) {
      console.error('TRPGスタジオへのエクスポートに失敗しました:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        {/* タイトルと編集ボタン */}
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4" component="h1">
            {boss.name}
          </Typography>
          <Chip label={`Lv.${boss.level}`} color="primary" />
          <Link to={`/boss/${id}/edit`}>
            <Button variant="outlined" startIcon={<EditIcon />} size="small">
              編集
            </Button>
          </Link>
        </Box>

        {/* 画像と概要 */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          {boss.imageUrl && (
            <Box
              component={Paper}
              sx={{ minWidth: 320, maxWidth: 500, overflow: 'hidden' }}
            >
              <img
                src={boss.imageUrl}
                alt="ヌシ画像"
                style={{ width: '100%', display: 'block' }}
              />
            </Box>
          )}

          {boss.appearance && (
            <Box sx={{ minWidth: 320, flex: 1 }}>
              <InputLabel sx={{ mb: 1 }}>概要</InputLabel>
              <Box
                component={Paper}
                sx={{ p: 2, whiteSpace: 'pre-wrap' }}
              >
                <Typography variant="body1">{boss.appearance}</Typography>
              </Box>
            </Box>
          )}
        </Box>

        {/* アビリティ */}
        {boss.abilities && boss.abilities.length > 0 && (
          <Box sx={{ my: 3 }}>
            <Typography variant="h6" gutterBottom>
              アビリティ
            </Typography>
            <Box sx={{ width: '100%' }}>
              <AbilityTable
                abilities={boss.abilities}
                handleAbilityDelete={() => {}}
                handleAbilityUpdate={(row) => row}
                hideActions={true}
              />
            </Box>
          </Box>
        )}

        {/* 能力値 */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            my: 3,
            maxWidth: 600,
            flexWrap: 'wrap',
          }}
        >
          <TextField
            label="体力"
            helperText="プレイ中のメモ用（保存されません）"
            value={staminaMemo}
            type="number"
            onChange={(e) => setStaminaMemo(Number(e.target.value))}
            sx={{ flex: 1, minWidth: 120 }}
          />
          <TextField
            label="気力"
            helperText="プレイ中のメモ用（保存されません）"
            value={willPowerMemo}
            type="number"
            onChange={(e) => setWillPowerMemo(Number(e.target.value))}
            sx={{ flex: 1, minWidth: 120 }}
          />
        </Box>

        {/* 特技・ギャップ */}
        <SpecialtiesSection />

        {/* 変調 */}
        <StatusAilmentsSection />

        {/* エクスポートボタン */}
        <Box
          sx={{
            my: 3,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            alignItems: 'center',
          }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<ContentCopyIcon />}
            onClick={handleCopyToCcfolia}
          >
            ココフォリア用クリップボードコピー
          </Button>
          {copySuccess && (
            <Typography variant="body2" color="success.main">
              コピーしました！
            </Typography>
          )}
          <Button
            variant="contained"
            color="secondary"
            startIcon={<DownloadIcon />}
            onClick={handleExportToUdonarium}
          >
            ユドナリウムコマ出力
          </Button>
          {exportSuccess && (
            <Typography variant="body2" color="success.main">
              ダウンロードしました！
            </Typography>
          )}
          <Button
            variant="contained"
            color="secondary"
            startIcon={<DownloadIcon />}
            onClick={handleExportToTRPGStudio}
          >
            TRPGスタジオ用テキスト出力
          </Button>
          {trpgStudioSuccess && (
            <Typography variant="body2" color="success.main">
              ダウンロードしました！
            </Typography>
          )}
        </Box>

        {/* 戻るリンク */}
        <Box sx={{ mt: 4 }}>
          <MuiLink component={Link} to="/boss/" underline="hover">
            戻る
          </MuiLink>
        </Box>
      </Box>
    </Container>
  );
};

export default DetailPage;
