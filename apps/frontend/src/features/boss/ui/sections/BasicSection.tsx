import {
  Box,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { ImageUploadField } from '@lostrpg/frontend/shared/ui';
import type { BossFormData } from '../../model/bossSlice';

type Props = {
  boss: BossFormData;
  isValidError: boolean;
  previewUrl: string;
  onChange: (data: Partial<BossFormData>) => void;
  onLevelChange: (level: number) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const BasicSection: React.FC<Props> = ({
  boss,
  isValidError,
  previewUrl,
  onChange,
  onLevelChange,
  onImageChange,
}) => (
  <Box sx={{ my: 2 }}>
    <Typography variant="h6" gutterBottom>
      基本情報
    </Typography>

    {/* ヌシ名（必須） */}
    <Box sx={{ my: 2 }}>
      <TextField
        fullWidth
        required
        label="名前"
        error={!boss.name && isValidError}
        helperText={!boss.name && isValidError ? '名前は必須です' : ''}
        value={boss.name}
        onChange={(e) => onChange({ name: e.target.value })}
      />
    </Box>

    {/* 作成者（任意） */}
    <Box sx={{ my: 2 }}>
      <TextField
        fullWidth
        label="作成者"
        helperText="任意項目です"
        value={boss.creator ?? ''}
        onChange={(e) => onChange({ creator: e.target.value })}
      />
    </Box>

    {/* 外見 */}
    <Box sx={{ my: 2 }}>
      <TextField
        fullWidth
        multiline
        rows={4}
        label="概要"
        helperText="外見や設定など"
        value={boss.appearance ?? ''}
        onChange={(e) => onChange({ appearance: e.target.value })}
      />
    </Box>

    {/* レベル */}
    <Box sx={{ my: 2 }}>
      <TextField
        type="number"
        label="レベル"
        helperText=""
        value={boss.level}
        onChange={(e) => onLevelChange(Number(e.target.value))}
        sx={{ width: 200 }}
      />
    </Box>

    {/* 画像 */}
    <ImageUploadField
      previewUrl={previewUrl}
      currentImageUrl={boss.imageUrl}
      onImageChange={onImageChange}
    />

    {/* 一覧に表示しない */}
    <Box sx={{ my: 2 }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={boss.hideFromList ?? false}
            onChange={(e) => onChange({ hideFromList: e.target.checked })}
          />
        }
        label="一覧に表示しない"
      />
    </Box>
  </Box>
);
