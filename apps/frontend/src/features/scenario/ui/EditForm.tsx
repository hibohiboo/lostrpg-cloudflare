import { parseScenarioContent } from '@lostrpg/core/scenario/parseScenarioContent';
import SaveIcon from '@mui/icons-material/Save';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Link as MuiLink,
  TextField,
} from '@mui/material';
import React, { useState } from 'react';
import { ImageUploadField } from '@lostrpg/frontend/shared/ui';
import { EditFormViewModel } from '../hooks/useEditFormHooks';
import { BossAppendixEditor } from './BossAppendixEditor';
import { EncounterAppendixEditor } from './EncounterAppendixEditor';
import { ItemAppendixEditor } from './ItemAppendixEditor';
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
    summary = '',
    content = '',
    enemies = [],
    bosses = [],
    items = [],
    creatorName = '',
    password = '',
    isPublish = false,
    hideFromList = false,
  } = scenario;
  const nameError = !name && isValidError;
  const nameHelperText = nameError ? 'シナリオ名は必須です' : '';

  // 推奨人数・プレイ時間・リミット・注意事項・カスタム表は本文（Markdown）側の
  // 特殊見出しで管理するため、本文が変わるたびにここから再抽出してscenarioへ反映する
  const handleContentChange = (next: string) => {
    const { players, time, limit, caution, customTables } = parseScenarioContent(next);
    setScenario({
      ...scenario,
      content: next,
      players,
      time,
      limit,
      caution,
      customTables,
    });
  };

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

      {/* 画像アップロード */}
      <ImageUploadField
        previewUrl={previewUrl}
        currentImageUrl={imageUrl}
        onImageChange={handleImageChange}
      />

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

      {/* 本文（Markdown編集 / 構造編集の切り替え）
          推奨人数・プレイ時間・リミット・注意事項・ランダムエンカウント表もここで編集します */}
      <Box sx={{ my: 2 }}>
        <ScenarioContentEditor
          content={content}
          onContentChange={handleContentChange}
        />
      </Box>
      <h3>付録</h3>
      {/* ヌシ付録：付録のため本文の後に配置 */}
      <Box sx={{ my: 3 }}>
        <BossAppendixEditor
          bosses={bosses}
          onChange={(value) => setScenario({ ...scenario, bosses: value })}
        />
      </Box>
      {/* エネミー付録：付録のため本文の後に配置 */}
      <Box sx={{ my: 3 }}>
        <EncounterAppendixEditor
          enemies={enemies}
          onChange={(value) => setScenario({ ...scenario, enemies: value })}
        />
      </Box>

      {/* アイテム付録：付録のため本文の後に配置 */}
      <Box sx={{ my: 3 }}>
        <ItemAppendixEditor
          items={items}
          onChange={(value) => setScenario({ ...scenario, items: value })}
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
