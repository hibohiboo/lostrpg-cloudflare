import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, IconButton, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { BossSelectionModal } from '@lostrpg/frontend/entities/boss';
import type { ScenarioBossAppendix } from '@lostrpg/frontend/entities/scenario';

type Props = {
  bosses: ScenarioBossAppendix[];
  onChange: (bosses: ScenarioBossAppendix[]) => void;
};

// ヌシ付録：本文（Markdown）の決戦フェイズ等に登場させたヌシの参照用一覧。
export const BossAppendixEditor: React.FC<Props> = ({ bosses, onChange }) => {
  const [isBossModalOpen, setBossModalOpen] = useState(false);

  const handleAddBoss = (bossId: string, bossName: string) => {
    if (!bossId) return;
    onChange([...bosses, { bossId, bossName, url: `/boss/${bossId}` }]);
  };

  const handleAddManualBoss = () => {
    onChange([...bosses, { bossName: '', url: '' }]);
  };

  const handleRemoveBoss = (index: number) => {
    onChange(bosses.filter((_, i) => i !== index));
  };

  const handleBossNameChange = (index: number, bossName: string) => {
    onChange(
      bosses.map((boss, i) => (i === index ? { ...boss, bossName } : boss)),
    );
  };

  const handleBossUrlChange = (index: number, url: string) => {
    onChange(bosses.map((boss, i) => (i === index ? { ...boss, url } : boss)));
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        ヌシ
      </Typography>
      {bosses.map((boss, index) => (
        <Box
          key={index}
          sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1 }}
        >
          <TextField
            size="small"
            placeholder="名前"
            sx={{ minWidth: 160 }}
            value={boss.bossName ?? ''}
            onChange={(e) => handleBossNameChange(index, e.target.value)}
          />
          <TextField
            size="small"
            fullWidth
            placeholder="URL（例: /boss/xxxx や外部サイトへのリンク）"
            value={boss.url ?? ''}
            onChange={(e) => handleBossUrlChange(index, e.target.value)}
          />
          <IconButton
            aria-label="ヌシを削除"
            size="small"
            onClick={() => handleRemoveBoss(index)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button startIcon={<AddIcon />} onClick={() => setBossModalOpen(true)}>
          ヌシを選択して追加
        </Button>
        <Button startIcon={<AddIcon />} onClick={handleAddManualBoss}>
          手動で追加
        </Button>
      </Box>

      <BossSelectionModal
        open={isBossModalOpen}
        onClose={() => setBossModalOpen(false)}
        selectedBossId=""
        onSelect={handleAddBoss}
      />
    </Box>
  );
};
