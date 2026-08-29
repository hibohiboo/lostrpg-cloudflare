import SaveIcon from '@mui/icons-material/Save';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  InputLabel,
  Link as MuiLink,
  TextField,
} from '@mui/material';
import React, { useState } from 'react';
import { ImageUploadField } from '@lostrpg/frontend/shared/ui';
import { EditFormViewModel } from '../hooks/useEditFormHooks';
import { EncounterTableEditor } from './EncounterTableEditor';
import { ScenarioContentEditor } from './ScenarioContentEditor';

type Props = EditFormViewModel & {
  handleSave: () => void;
  handleDelete?: () => void;
  prevPath: string;
};

const useSaveClickHandler = (handleSave: () => void) => {
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

  return { isSaving, handleSaveClick };
};

const EditForm: React.FC<Props> = ({
  scenario,
  isValidError,
  previewUrl,
  prevPath,
  setScenario,
  handleImageChange,
  handleSave,
  handleDelete,
}) => {
  const { isSaving, handleSaveClick } = useSaveClickHandler(handleSave);
  const {
    name,
    imageUrl,
    players = '',
    time = '',
    limit = '',
    caution = '',
    summary = '',
    content = '',
    encounterTable,
    creatorName = '',
    password = '',
    isPublish = false,
    hideFromList = false,
  } = scenario;
  const nameError = !name && isValidError;
  const nameHelperText = nameError ? 'シナリオ名は必須です' : '';

  return (
    <Box>
      {/* シナリオ名（必須） */}
      <Box sx={{ my: 2 }}>
        <TextField
          fullWidth
          required
          label="シナリオ名"
          error={nameError}
          helperText={nameHelperText}
          value={name}
          onChange={(e) => setScenario({ ...scenario, name: e.target.value })}
        />
      </Box>

      {/* 作者名 */}
      <Box sx={{ my: 2 }}>
        <TextField
          fullWidth
          label="作者名"
          value={creatorName}
          onChange={(e) =>
            setScenario({ ...scenario, creatorName: e.target.value })
          }
        />
      </Box>

      {/* ランダムエンカウント表（探索フェイズの冒頭で確認できるよう、シナリオ本文より前に配置） */}
      <Box sx={{ my: 3 }}>
        <InputLabel sx={{ mb: 1 }}>ランダムエンカウント表</InputLabel>
        <EncounterTableEditor
          encounterTable={encounterTable}
          onChange={(value) => setScenario({ ...scenario, encounterTable: value })}
        />
      </Box>

      {/* 画像アップロード */}
      <ImageUploadField
        previewUrl={previewUrl}
        currentImageUrl={imageUrl}
        onImageChange={handleImageChange}
      />

      {/* 想定人数・プレイ時間・制限値 */}
      <Box sx={{ display: 'flex', gap: 2, my: 2, flexWrap: 'wrap' }}>
        <TextField
          label="想定人数"
          value={players}
          onChange={(e) =>
            setScenario({ ...scenario, players: e.target.value })
          }
          sx={{ flex: 1, minWidth: 160 }}
        />
        <TextField
          label="プレイ時間"
          value={time}
          onChange={(e) => setScenario({ ...scenario, time: e.target.value })}
          sx={{ flex: 1, minWidth: 160 }}
        />
        <TextField
          label="制限値"
          value={limit}
          onChange={(e) =>
            setScenario({ ...scenario, limit: e.target.value })
          }
          sx={{ flex: 1, minWidth: 160 }}
        />
      </Box>

      {/* 注意事項 */}
      <Box sx={{ my: 2 }}>
        <TextField
          fullWidth
          multiline
          rows={2}
          label="注意事項"
          value={caution}
          onChange={(e) =>
            setScenario({ ...scenario, caution: e.target.value })
          }
        />
      </Box>

      {/* 概要 */}
      <Box sx={{ my: 2 }}>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="概要"
          value={summary}
          onChange={(e) =>
            setScenario({ ...scenario, summary: e.target.value })
          }
        />
      </Box>

      {/* 本文（Markdown編集 / 構造編集の切り替え） */}
      <Box sx={{ my: 2 }}>
        <ScenarioContentEditor
          content={content}
          onContentChange={(next) => setScenario({ ...scenario, content: next })}
        />
      </Box>

      {/* 公開設定 */}
      <Box sx={{ my: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={isPublish}
              onChange={(e) =>
                setScenario({ ...scenario, isPublish: e.target.checked })
              }
            />
          }
          label="公開する"
        />
      </Box>

      {/* パスワード */}
      <Box sx={{ my: 2 }}>
        <TextField
          fullWidth
          type="password"
          label="パスワード（任意）"
          value={password}
          onChange={(e) =>
            setScenario({ ...scenario, password: e.target.value })
          }
          helperText="パスワードを設定すると、シナリオの編集・削除にパスワードが必要になります"
        />

        {/* 一覧に表示しない */}
        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={hideFromList}
                onChange={(e) =>
                  setScenario({ ...scenario, hideFromList: e.target.checked })
                }
              />
            }
            label="一覧に表示しない"
          />
        </Box>
      </Box>

      {/* 保存ボタン */}
      <Box sx={{ my: 2 }}>
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

      {/* 削除ボタン（編集時のみ表示する想定） */}
      {handleDelete && (
        <Box sx={{ my: 2, display: 'none' }}>
          <Button variant="contained" color="error" onClick={handleDelete}>
            削除
          </Button>
        </Box>
      )}

      {/* 戻るリンク */}
      <Box sx={{ mt: 4 }}>
        <MuiLink href={prevPath} underline="hover">
          戻る
        </MuiLink>
      </Box>
    </Box>
  );
};

export default EditForm;
