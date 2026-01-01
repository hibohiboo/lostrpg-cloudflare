import { initiativeSpecialties } from '@lostrpg/core/game-data/speciality';
import {
  Box,
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
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';
import { updateCharacterForm } from '../../model/characterFormSlice';

export const InitiativeSpecialtiesSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedSpecialty = useAppSelector(
    (state) => state.characterForm.selectedSpecialty,
  );

  return (
    <Box my={1}>
      <Typography variant="h6" gutterBottom>
        先制判定
      </Typography>
      <TableContainer component={Paper} sx={{ width: 'auto' }}>
        <Table
          size="small"
          sx={{ border: 1, borderColor: 'divider', width: 'auto' }}
        >
          <TableHead>
            <TableRow>
              {initiativeSpecialties.map((_, index) => (
                <TableCell
                  key={index}
                  align="center"
                  sx={{
                    bgcolor: 'grey.900',
                    color: 'white',
                    fontWeight: 600,
                    minWidth: 80,
                    border: 1,
                    borderColor: 'divider',
                  }}
                >
                  {index + 1}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {initiativeSpecialties.map((specialty) => (
                <TableCell
                  key={specialty}
                  align="center"
                  onClick={() => {
                    if (selectedSpecialty === specialty) {
                      dispatch(updateCharacterForm({ selectedSpecialty: '' }));
                    } else {
                      dispatch(
                        updateCharacterForm({ selectedSpecialty: specialty }),
                      );
                    }
                  }}
                  sx={{
                    cursor: 'pointer',
                    bgcolor:
                      selectedSpecialty === specialty
                        ? 'primary.light'
                        : 'inherit',
                    '&:hover': { bgcolor: 'action.hover' },
                    border: 1,
                    borderColor: 'divider',
                    py: 1,
                  }}
                >
                  {specialty}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
