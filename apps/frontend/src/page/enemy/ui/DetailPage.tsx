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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { Link, useParams } from 'react-router';
import { AbilityTable } from '@lostrpg/frontend/entities/ability';
import { ItemTable } from '@lostrpg/frontend/entities/item';
import {
  SpecialtiesSection,
  copyEnemyToCcfolia,
  exportEnemyToTRPGStudio,
  exportEnemyToUdonarium,
} from '@lostrpg/frontend/features/enemy';
import { useAppSelector } from '@lostrpg/frontend/shared/lib/store';

const DetailPage: React.FC = () => {
  const { id } = useParams();
  const enemy = useAppSelector((state) => state.enemy);
  const [copySuccess, setCopySuccess] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [trpgStudioSuccess, setTrpgStudioSuccess] = useState(false);
  // 体力・気力はプレイ中にメモとして書き換えられるよう、この画面限りの状態として保持する（保存はしない）
  const [staminaMemo, setStaminaMemo] = useState(enemy.stamina);
  const [willPowerMemo, setWillPowerMemo] = useState(enemy.willPower);

  const handleCopyToCcfolia = async () => {
    try {
      await copyEnemyToCcfolia(enemy, id || '');
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('クリップボードへのコピーに失敗しました:', error);
    }
  };

  const handleExportToUdonarium = async () => {
    try {
      await exportEnemyToUdonarium(enemy, id || '');
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 2000);
    } catch (error) {
      console.error('ユドナリウムへのエクスポートに失敗しました:', error);
    }
  };

  const handleExportToTRPGStudio = () => {
    try {
      exportEnemyToTRPGStudio(enemy);
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
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="h4" component="h1">
            {enemy.name}
          </Typography>
          <Chip label={`Lv.${enemy.level}`} color="primary" />
          {enemy.type && <Chip label={enemy.type} color="secondary" variant="outlined" />}
          <Link to={`/enemy/${id}/edit`}>
            <Button variant="outlined" startIcon={<EditIcon />} size="small">
              編集
            </Button>
          </Link>
        </Box>

        {enemy.creator && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" color="text.secondary">
              作成者: {enemy.creator}
            </Typography>
          </Box>
        )}

        {/* 画像と外見 */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          {enemy.imageUrl && (
            <Box
              component={Paper}
              sx={{ minWidth: 320, maxWidth: 500, overflow: 'hidden' }}
            >
              <img
                src={enemy.imageUrl}
                alt="エネミー画像"
                style={{ width: '100%', display: 'block' }}
              />
            </Box>
          )}

          {enemy.appearance && (
            <Box sx={{ minWidth: 320, flex: 1 }}>
              <InputLabel sx={{ mb: 1 }}>外見</InputLabel>
              <Box component={Paper} sx={{ p: 2, whiteSpace: 'pre-wrap' }}>
                <Typography variant="body1">{enemy.appearance}</Typography>
              </Box>
            </Box>
          )}
        </Box>

        {/* アビリティ */}
        {enemy.abilities && enemy.abilities.length > 0 && (
          <Box sx={{ my: 3 }}>
            <Typography variant="h6" gutterBottom>
              アビリティ
            </Typography>
            <Box sx={{ width: '100%' }}>
              <AbilityTable
                abilities={enemy.abilities}
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
            maxWidth: 400,
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
        <SpecialtiesSection specialties={enemy.specialties} gaps={enemy.gaps} />

        {/* ドロップアイテム表 */}
        {enemy.dropItems.some((item) => item) && (
          <Box sx={{ my: 3 }}>
            <Typography variant="h6" gutterBottom>
              ドロップアイテム表
            </Typography>
            <TableContainer component={Paper} sx={{ maxWidth: 400 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>出目</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>アイテム</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {enemy.dropItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item || '（未設定）'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* アイテム詳細 */}
        {enemy.itemDetails && enemy.itemDetails.length > 0 && (
          <Box sx={{ my: 3 }}>
            <Typography variant="h6" gutterBottom>
              アイテム詳細
            </Typography>
            <Box sx={{ width: '100%' }}>
              <ItemTable
                items={enemy.itemDetails}
                handleItemDelete={() => {}}
                handleItemUpdate={(row) => row}
                hideActions={true}
                hideNumberColumn
              />
            </Box>
          </Box>
        )}

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
          <MuiLink component={Link} to="/enemy/" underline="hover">
            戻る
          </MuiLink>
        </Box>
      </Box>
    </Container>
  );
};

export default DetailPage;
