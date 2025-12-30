import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import SaveIcon from '@mui/icons-material/Save';
import { Box, Button, Link as MuiLink, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import { useAppSelector } from '@lostrpg/frontend/shared/lib/store';
import { copyCharacterToCcfolia } from '../../utils/exportCcfolia';
import { exportCharacterToTRPGStudio } from '../../utils/exportTRPGStudio';
import { exportCharacterToUdonarium } from '../../utils/exportUdonarium';

type Props = {
  handleSave: () => void;
  handleDelete?: () => void;
  prevPath: string;
};

export const FormActionsSection: React.FC<Props> = ({
  handleSave,
  handleDelete,
  prevPath,
}) => {
  const { id } = useParams();
  const character = useAppSelector((state) => state.character);
  const [copySuccess, setCopySuccess] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [trpgStudioSuccess, setTrpgStudioSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveClick = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      await Promise.resolve(handleSave());
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyToCcfolia = async () => {
    try {
      await copyCharacterToCcfolia(character, id || '');
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('クリップボードへのコピーに失敗しました:', error);
    }
  };

  const handleExportToUdonarium = async () => {
    try {
      await exportCharacterToUdonarium(character, id || '');
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 2000);
    } catch (error) {
      console.error('ユドナリウムへのエクスポートに失敗しました:', error);
    }
  };

  const handleExportToTRPGStudio = () => {
    try {
      exportCharacterToTRPGStudio(character);
      setTrpgStudioSuccess(true);
      setTimeout(() => setTrpgStudioSuccess(false), 2000);
    } catch (error) {
      console.error('TRPGスタジオへのエクスポートに失敗しました:', error);
    }
  };

  return (
    <>
      <Box my={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSaveClick}
          disabled={isSaving}
        >
          {isSaving ? '保存中...' : '保存'}
        </Button>
      </Box>

      {handleDelete && (
        <Box my={2} sx={{ display: 'none' }}>
          <Button variant="contained" color="error" onClick={handleDelete}>
            削除
          </Button>
        </Box>
      )}
      {/* エクスポートボタン */}
      {id && (
        <Box my={3} display="flex" flexWrap="wrap" gap={2} alignItems="center">
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
      )}

      <Box mt={4}>
        <MuiLink href={prevPath} underline="hover">
          戻る
        </MuiLink>
      </Box>
    </>
  );
};
