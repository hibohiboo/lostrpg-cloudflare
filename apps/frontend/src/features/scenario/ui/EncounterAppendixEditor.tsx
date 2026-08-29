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
export const EncounterAppendixEditor: React.FC<Props> = ({
  encounterTable,
  onChange,
}) => {
  const [isEnemyModalOpen, setEnemyModalOpen] = useState(false);
  const { enemies } = encounterTable;

  const handleAddEnemy = (enemyId: string, enemyName: string) => {
    if (!enemyId) return;
    onChange({
      ...encounterTable,
      enemies: [...enemies, { enemyId, enemyName, url: `/enemy/${enemyId}` }],
    });
  };

  const handleAddManualEnemy = () => {
    onChange({
      ...encounterTable,
      enemies: [...enemies, { enemyName: '', url: '' }],
    });
  };

  const handleRemoveEnemy = (index: number) => {
    onChange({
      ...encounterTable,
      enemies: enemies.filter((_, i) => i !== index),
    });
  };

  const handleEnemyNameChange = (index: number, enemyName: string) => {
    onChange({
      ...encounterTable,
      enemies: enemies.map((enemy, i) =>
        i === index ? { ...enemy, enemyName } : enemy,
      ),
    });
  };

  const handleEnemyUrlChange = (index: number, url: string) => {
    onChange({
      ...encounterTable,
      enemies: enemies.map((enemy, i) =>
        i === index ? { ...enemy, url } : enemy,
      ),
    });
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        エネミー
      </Typography>
      {enemies.map((enemy, index) => (
        <Box
          key={index}
          sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1 }}
        >
          <TextField
            size="small"
            placeholder="名前"
            sx={{ minWidth: 160 }}
            value={enemy.enemyName ?? ''}
            onChange={(e) => handleEnemyNameChange(index, e.target.value)}
          />
          <TextField
            size="small"
            fullWidth
            placeholder="URL（例: /enemy/xxxx や外部サイトへのリンク）"
            value={enemy.url ?? ''}
            onChange={(e) => handleEnemyUrlChange(index, e.target.value)}
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
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button startIcon={<AddIcon />} onClick={() => setEnemyModalOpen(true)}>
          エネミーを選択して追加
        </Button>
        <Button startIcon={<AddIcon />} onClick={handleAddManualEnemy}>
          手動で追加
        </Button>
      </Box>

      <EnemySelectionModal
        open={isEnemyModalOpen}
        onClose={() => setEnemyModalOpen(false)}
        selectedEnemyId=""
        onSelect={handleAddEnemy}
      />
    </Box>
  );
};
