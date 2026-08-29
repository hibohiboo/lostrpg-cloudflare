import {
  parseEncounterTablesMarkdown,
  stringifyEncounterTables,
} from '@lostrpg/core/scenario/encounterTableMarkdown';
import { TextField } from '@mui/material';
import React, { useState } from 'react';
import type { ScenarioEncounterTable } from '@lostrpg/frontend/entities/scenario';

type Props = {
  tables: ScenarioEncounterTable[];
  onChange: (tables: ScenarioEncounterTable[]) => void;
};

// カスタムのランダムエンカウント表をMarkdownで編集する。
// tables配列（構造編集タブの操作先）が唯一の保存先のため、このコンポーネントは
// マウント時（タブを開いたとき）だけ tables からテキストを組み立て、以後はテキストを
// 正として都度 tables へパースして反映する（構造化タブと同様の一方向同期）。
export const EncounterTablesMarkdownEditor: React.FC<Props> = ({ tables, onChange }) => {
  const [text, setText] = useState(() => stringifyEncounterTables(tables));

  const handleChange = (value: string) => {
    setText(value);
    onChange(parseEncounterTablesMarkdown(value));
  };

  return (
    <TextField
      fullWidth
      multiline
      rows={12}
      label="ランダムエンカウント表（Markdown）"
      value={text}
      onChange={(e) => handleChange(e.target.value)}
      helperText="「##### 表名 {.table}」の見出し＋「出目｜内容」の2列表で、複数の表を記述できます"
    />
  );
};
