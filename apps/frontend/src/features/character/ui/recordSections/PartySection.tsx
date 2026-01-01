import { trophyList } from '@lostrpg/core/game-data/character';
import { Delete } from '@mui/icons-material';
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import {
  addPartyMember,
  removePartyMember,
  updatePartyMember,
} from '@lostrpg/frontend/entities/record';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';

export const PartySection: React.FC = () => {
  const dispatch = useAppDispatch();
  const parties = useAppSelector((state) => state.record.parties);

  return (
    <Box my={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">パーティ</Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => dispatch(addPartyMember())}
        >
          メンバー追加
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>名前</TableCell>
              <TableCell>メモ</TableCell>
              <TableCell>称号</TableCell>
              <TableCell sx={{ width: 50 }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {parties.map((member, index) => (
              <TableRow key={index}>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    value={member.name || ''}
                    onChange={(e) =>
                      dispatch(
                        updatePartyMember({
                          index,
                          data: { name: e.target.value },
                        }),
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    multiline
                    minRows={3}
                    value={member.memo || ''}
                    onChange={(e) =>
                      dispatch(
                        updatePartyMember({
                          index,
                          data: { memo: e.target.value },
                        }),
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    value={member.trophy || ''}
                    onChange={(e) =>
                      dispatch(
                        updatePartyMember({
                          index,
                          data: { trophy: e.target.value },
                        }),
                      )
                    }
                  >
                    <MenuItem value="">設定なし</MenuItem>
                    {trophyList.map((trophy) => (
                      <MenuItem
                        key={trophy.id}
                        value={trophy.name}
                        sx={{ display: 'block' }}
                      >
                        <Typography variant="body1">{trophy.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {trophy.description}
                        </Typography>
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => dispatch(removePartyMember(index))}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {parties.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    メンバーが登録されていません
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
