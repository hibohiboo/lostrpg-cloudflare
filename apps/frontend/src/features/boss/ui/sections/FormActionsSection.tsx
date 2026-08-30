import SaveIcon from '@mui/icons-material/Save';
import { Box, Button, Link as MuiLink } from '@mui/material';
import React, { useState } from 'react';
import { Link } from 'react-router';

type Props = {
  handleSave: () => void;
  handleDelete?: () => void;
  prevPath: string;
};

export const FormActionsSection: React.FC<Props> = ({
  handleSave,
  handleDelete,
  prevPath,
}) => {
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

  return (
    <>
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

      {handleDelete && (
        <Box sx={{ my: 2, display: 'none' }}>
          <Button variant="contained" color="error" onClick={handleDelete}>
            削除
          </Button>
        </Box>
      )}

      <Box sx={{ mt: 4 }}>
        <MuiLink component={Link} to={prevPath} underline="hover">
          戻る
        </MuiLink>
      </Box>
    </>
  );
};
