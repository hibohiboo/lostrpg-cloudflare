import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { scenarioNotationTable, scenarioSamples } from '@lostrpg/core/game-data/scenario';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {
  Box,
  Button,
  Container,
  Link as MuiLink,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { SCENARIO_NOTATION_ICONS } from './scenarioNotationIcons';

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!navigator.clipboard) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="contained" startIcon={<ContentCopyIcon />} onClick={handleCopy}>
      {copied ? 'コピーしました' : 'コピー'}
    </Button>
  );
};

const SamplePage: React.FC = () => (
  <Container maxWidth="lg">
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        シナリオ本文の記法例
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        シナリオの「本文（Markdown）」欄は、以下の記法でフェイズ／シーン／イベントの構造に自動変換されます。
      </Typography>

      {/* 記法一覧 */}
      <Typography variant="h6" gutterBottom>
        {scenarioNotationTable.title}
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 4 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {scenarioNotationTable.columns.map((column) => (
                <TableCell key={column}>{column}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {scenarioNotationTable.rows.map((row) => (
              <TableRow key={`${row.purpose}-${row.notation}`}>
                <TableCell sx={{ whiteSpace: 'pre-wrap' }}>{row.purpose}</TableCell>
                <TableCell sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                  {row.notation}
                </TableCell>
                <TableCell sx={{ whiteSpace: 'pre-wrap' }}>
                  {row.icon && (
                    <FontAwesomeIcon
                      icon={SCENARIO_NOTATION_ICONS[row.icon]}
                      style={{ marginRight: 8 }}
                    />
                  )}
                  {row.label}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 記法例（コピーして本文欄に貼り付けられます） */}
      <Typography variant="h6" gutterBottom>
        記法例
      </Typography>
      {scenarioSamples.map((sample) => (
        <Box key={sample.title} sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            {sample.title}
          </Typography>
          <Box sx={{ mb: 1 }}>
            <CopyButton text={sample.content} />
          </Box>
          <Box
            component={Paper}
            variant="outlined"
            sx={{
              p: 2,
              maxHeight: 480,
              overflow: 'auto',
            }}
          >
            <Box component="pre" sx={{ m: 0, whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
              {sample.content}
            </Box>
          </Box>
        </Box>
      ))}

      {/* 戻るリンク */}
      <Box sx={{ mt: 4 }}>
        <MuiLink href="/scenario/" underline="hover">
          戻る
        </MuiLink>
      </Box>
    </Box>
  </Container>
);

export default SamplePage;
