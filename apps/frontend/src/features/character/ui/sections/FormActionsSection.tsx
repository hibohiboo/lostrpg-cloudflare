import SaveIcon from '@mui/icons-material/Save';
import { Box, Button, Link as MuiLink } from '@mui/material';
import React from 'react';

type Props = {
  handleSave: () => void;
  handleDelete?: () => void;
  prevPath: string;
};

export const FormActionsSection: React.FC<Props> = ({
  handleSave,
  handleDelete,
  prevPath,
}) => (
  <>
    <Box my={2}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<SaveIcon />}
        onClick={handleSave}
      >
        保存
      </Button>
    </Box>

    {handleDelete && (
      <Box my={2} sx={{ display: 'none' }}>
        <Button variant="contained" color="error" onClick={handleDelete}>
          削除
        </Button>
      </Box>
    )}

    <Box mt={4}>
      <MuiLink href={prevPath} underline="hover">
        戻る
      </MuiLink>
    </Box>
  </>
);
