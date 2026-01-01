import { expCheckPoints } from '@lostrpg/core/game-data/character';
import {
  Box,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React from 'react';
import { toggleExpCheckPoint } from '@lostrpg/frontend/entities/record';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';

export const ExpCheckSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedPoints =
    useAppSelector((state) => state.record.expCheckPoints) || [];

  return (
    <Box my={3}>
      <Typography variant="h6" gutterBottom>
        経験点チェック表
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">{/* Checkbox column */}</TableCell>
              <TableCell>項目</TableCell>
              <TableCell align="right">経験点</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expCheckPoints.map((point) => (
              <TableRow
                key={point.name}
                hover
                onClick={() => dispatch(toggleExpCheckPoint(point.name))}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedPoints.includes(point.name)}
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(toggleExpCheckPoint(point.name));
                    }}
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  {point.name}
                </TableCell>
                <TableCell align="right">{point.point}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
