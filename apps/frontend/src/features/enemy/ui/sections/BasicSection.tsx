import {
  Box,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { ImageUploadField } from '@lostrpg/frontend/shared/ui';
import type { EnemyFormData } from '../../model/enemySlice';

const ENEMY_TYPES = ['ケモノ', 'ムシ', 'ミュータント'] as const;

type Props = {
  enemy: EnemyFormData;
  isValidError: boolean;
  previewUrl: string;
  onChange: (data: Partial<EnemyFormData>) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const BasicSection: React.FC<Props> = ({
  enemy,
  isValidError,
  previewUrl,
  onChange,
  onImageChange,
}) => (
  <Box sx={{ my: 2 }}>
    <Typography variant="h6" gutterBottom>
      基本情報
    </Typography>

    {/* エネミー名（必須） */}
    <Box sx={{ my: 2 }}>
      <TextField
        fullWidth
        required
        label="名前"
        error={!enemy.name && isValidError}
        helperText={!enemy.name && isValidError ? '名前は必須です' : ''}
        value={enemy.name}
        onChange={(e) => onChange({ name: e.target.value })}
      />
    </Box>

    {/* 外見 */}
    <Box sx={{ my: 2 }}>
      <TextField
        fullWidth
        multiline
        rows={4}
        label="外見"
        helperText="外見や設定など"
        value={enemy.appearance ?? ''}
        onChange={(e) => onChange({ appearance: e.target.value })}
      />
    </Box>

    {/* タイプ */}
    <Box sx={{ my: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <TextField
        select
        label="タイプ"
        value={enemy.type ?? ''}
        onChange={(e) =>
          onChange({
            type: (e.target.value ||
              undefined) as EnemyFormData['type'],
          })
        }
        sx={{ width: 200 }}
      >
        <MenuItem value="">未選択</MenuItem>
        {ENEMY_TYPES.map((type) => (
          <MenuItem key={type} value={type}>
            {type}
          </MenuItem>
        ))}
      </TextField>

      {/* レベル */}
      <TextField
        type="number"
        label="レベル"
        value={enemy.level}
        onChange={(e) => onChange({ level: Number(e.target.value) })}
        sx={{ width: 200 }}
      />
    </Box>

    {/* 画像 */}
    <ImageUploadField
      previewUrl={previewUrl}
      currentImageUrl={enemy.imageUrl}
      onImageChange={onImageChange}
    />
  </Box>
);
