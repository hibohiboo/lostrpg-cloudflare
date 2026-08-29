import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, TextField, Typography } from '@mui/material';
import React from 'react';
import type { ScenarioScene } from '@lostrpg/frontend/entities/scenario';

type Props = {
  scene: ScenarioScene;
  onChange: (changes: Partial<ScenarioScene>) => void;
  onDelete: () => void;
};

const parseNextField = (value: string): string[] | null => {
  const items = value
    .split(',')
    .map((v) => v.trim())
    .filter((v) => v !== '');
  return items.length > 0 ? items : null;
};

export const SceneForm: React.FC<Props> = ({ scene, onChange, onDelete }) => (
  <Box>
    <Typography variant="h6" gutterBottom>
      シーン（チェックポイント／道）を編集
    </Typography>
    <TextField
      fullWidth
      label="シーン名"
      value={scene.name}
      onChange={(e) => onChange({ name: e.target.value })}
      sx={{ my: 2 }}
    />
    <TextField
      fullWidth
      label="種類（type）"
      placeholder="checkpoint / path など"
      helperText="チェックポイントは checkpoint、道は path が一般的です（空欄も可）"
      value={scene.type ?? ''}
      onChange={(e) => onChange({ type: e.target.value || null })}
      sx={{ my: 2 }}
    />
    <TextField
      fullWidth
      label="シーンID（alias）"
      helperText="チャート（次のシーンへのリンク）で参照するためのID。省略可"
      value={scene.alias ?? ''}
      onChange={(e) => onChange({ alias: e.target.value || null })}
      sx={{ my: 2 }}
    />
    <TextField
      fullWidth
      label="次のシーンID（next）"
      helperText="他のシーンのシーンIDをカンマ区切りで指定（分岐がある場合は複数指定）。省略可"
      value={scene.next?.join(', ') ?? ''}
      onChange={(e) => onChange({ next: parseNextField(e.target.value) })}
      sx={{ my: 2 }}
    />
    <TextField
      fullWidth
      multiline
      rows={4}
      label="シーンの説明文"
      value={scene.lines.join('\n')}
      onChange={(e) =>
        onChange({ lines: e.target.value.split('\n') })
      }
      sx={{ my: 2 }}
    />
    <Button
      variant="outlined"
      color="error"
      startIcon={<DeleteIcon />}
      onClick={onDelete}
    >
      このシーンを削除
    </Button>
  </Box>
);
