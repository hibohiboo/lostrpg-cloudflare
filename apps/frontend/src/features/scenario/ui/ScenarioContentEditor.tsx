import {
  Box,
  InputLabel,
  Link as MuiLink,
  Tab,
  Tabs,
  TextField,
} from '@mui/material';
import React, { useState } from 'react';
import { StructuredEditor } from './structured/StructuredEditor';

type Props = {
  content: string;
  onContentChange: (content: string) => void;
};

// シナリオ本文を「Markdown編集」「構造編集（ツリー＋フォーム）」のタブで切り替えて編集する。
// どちらのタブで編集しても scenario.content（Markdown）に書き戻され、常に同期する。
export const ScenarioContentEditor: React.FC<Props> = ({
  content,
  onContentChange,
}) => {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <InputLabel sx={{ mb: 1 }}>本文</InputLabel>
      <Box sx={{ mb: 1 }}>
        <MuiLink
          href="/scenario/sample"
          target="_blank"
          rel="noopener noreferrer"
        >
          記法例を見る（別タブで開きます）
        </MuiLink>
      </Box>

      <Tabs
        value={tab}
        onChange={(_, value) => setTab(value)}
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
      >
        <Tab label="編集" />
        <Tab label="テキスト編集" />
      </Tabs>

      {tab === 0 && (
        <StructuredEditor content={content} onContentChange={onContentChange} />
      )}
      {tab === 1 && (
        <TextField
          fullWidth
          multiline
          rows={16}
          label="本文（Markdown）"
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          helperText="保存時にフェイズ／シーン／イベントの構造へ自動変換されます（記法は上のリンクから確認できます）"
        />
      )}
    </Box>
  );
};
