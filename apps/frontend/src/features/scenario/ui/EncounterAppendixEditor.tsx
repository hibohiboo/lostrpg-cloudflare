import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, IconButton, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { EnemySelectionModal } from '@lostrpg/frontend/entities/enemy';
import type { ScenarioEncounterSettings } from '@lostrpg/frontend/entities/scenario';

type Props = {
  encounterTable: ScenarioEncounterSettings;
  onChange: (value: ScenarioEncounterSettings) => void;
};

// エネミー付録：本文（Markdown）のランダムエンカウント表に登場させたエネミーの参照用一覧。
// ランダムエンカウント表本体は本文の「## ランダムエンカウント表 {.encounterTable}」セクションで
// 編集するため、ここでは付録（エネミー一覧）のみを編集する。
export const EncounterAppendixEditor: React.FC<Props> = ({ encounterTable, onChange }) => {
  const [isEnemyModalOpen, setEnemyModalOpen] = useState(false);
  const { enemies } = encounterTable;

  const handleAddEnemy = (enemyId: string, enemyName: string) => {
    if (!enemyId) return;
    onChange({
      ...encounterTable,
      enemies: [...enemies, { enemyId, enemyName, note: '' }],
    });
  };

  const handleRemoveEnemy = (index: number) => {
    onChange({
      ...encounterTable,
      enemies: enemies.filter((_, i) => i !== index),
    });
  };

  const handleEnemyNoteChange = (index: number, note: string) => {
    onChange({
      ...encounterTable,
      enemies: enemies.map((enemy, i) => (i === index ? { ...enemy, note } : enemy)),
    });
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        エネミー付録（本文のランダムエンカウント表に登場させたエネミーの参照用）
      </Typography>
      {enemies.map((enemy, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1 }}>
          <Typography sx={{ minWidth: 140 }}>{enemy.enemyName || 'エネミー'}</Typography>
          <TextField
            size="small"
            fullWidth
            placeholder="補足（例: 1d6体、表Aの1で登場 など）"
            value={enemy.note ?? ''}
            onChange={(e) => handleEnemyNoteChange(index, e.target.value)}
          />
          <IconButton
            aria-label="エネミーを削除"
            size="small"
            onClick={() => handleRemoveEnemy(index)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}
      <Button startIcon={<AddIcon />} onClick={() => setEnemyModalOpen(true)}>
        エネミーを追加
      </Button>

      <EnemySelectionModal
        open={isEnemyModalOpen}
        onClose={() => setEnemyModalOpen(false)}
        selectedEnemyId=""
        onSelect={handleAddEnemy}
      />
    </Box>
  );
};
