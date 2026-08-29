import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, IconButton, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { EnemySelectionModal } from '@lostrpg/frontend/entities/enemy';
import type { ScenarioEncounterEnemy } from '@lostrpg/frontend/entities/scenario';

type Props = {
  enemies: ScenarioEncounterEnemy[];
  onChange: (value: ScenarioEncounterEnemy[]) => void;
};

// ルールブック標準のランダムエンカウント表に登場するデフォルトのエネミー。
// 「デフォルトのエネミーを追加」ボタンでまとめて付録に追加できるようにする。
const DEFAULT_ENCOUNTER_ENEMIES: { enemyId: string; enemyName: string }[] = [
  { enemyId: '8e68525d-549b-4a78-b84b-1df7ad49eeb9', enemyName: 'ツノウサギ' },
  { enemyId: '8dd063ea-6065-41f6-b9aa-fbb2fa79f7a1', enemyName: 'オニトンボ' },
  { enemyId: '067ca9e1-8edc-4246-825b-2219f548b780', enemyName: 'ナガムカデ' },
  { enemyId: '458f6150-f04f-4762-bf45-8c982ae58b5f', enemyName: 'ヨロイバチ' },
  { enemyId: '0fab8713-1ba5-4548-95a3-7bb99a6d55e5', enemyName: 'ゾンビ' },
];

// エネミー付録：本文（Markdown）のランダムエンカウント表に登場させたエネミーの参照用一覧。
// ランダムエンカウント表本体はカスタム表（本文の「## カスタム表 {.customTable}」セクション）で
// 編集するため、ここでは付録（エネミー一覧）のみを編集する。
export const EncounterAppendixEditor: React.FC<Props> = ({
  enemies,
  onChange,
}) => {
  const [isEnemyModalOpen, setEnemyModalOpen] = useState(false);

  const handleAddEnemy = (enemyId: string, enemyName: string) => {
    if (!enemyId) return;
    onChange([...enemies, { enemyId, enemyName, url: `/enemy/${enemyId}` }]);
  };

  const handleAddManualEnemy = () => {
    onChange([...enemies, { enemyName: '', url: '' }]);
  };

  const handleAddDefaultEnemies = () => {
    const existingIds = new Set(
      enemies.map((enemy) => enemy.enemyId).filter(Boolean),
    );
    const toAdd = DEFAULT_ENCOUNTER_ENEMIES.filter(
      (enemy) => !existingIds.has(enemy.enemyId),
    ).map((enemy) => ({ ...enemy, url: `/enemy/${enemy.enemyId}` }));
    if (toAdd.length === 0) return;
    onChange([...enemies, ...toAdd]);
  };

  const handleRemoveEnemy = (index: number) => {
    onChange(enemies.filter((_, i) => i !== index));
  };

  const handleEnemyNameChange = (index: number, enemyName: string) => {
    onChange(
      enemies.map((enemy, i) =>
        i === index ? { ...enemy, enemyName } : enemy,
      ),
    );
  };

  const handleEnemyUrlChange = (index: number, url: string) => {
    onChange(
      enemies.map((enemy, i) => (i === index ? { ...enemy, url } : enemy)),
    );
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
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button startIcon={<AddIcon />} onClick={() => setEnemyModalOpen(true)}>
          エネミーを選択して追加
        </Button>
        <Button startIcon={<AddIcon />} onClick={handleAddManualEnemy}>
          手動で追加
        </Button>
        <Button startIcon={<AddIcon />} onClick={handleAddDefaultEnemies}>
          デフォルトのエンカウント表のエネミーを追加
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
