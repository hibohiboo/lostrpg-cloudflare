import { Box } from '@mui/material';
import React from 'react';
import {
  CharacterBasicSection,
  SpecialtiesSection,
  ExpCheckSection,
} from './recordSections';
import {
  AbilitySection,
  ItemsSection,
  EquipmentSection,
  BagsSection,
  FormActionsSection,
} from './sections';
import type { EditFormViewModel } from '../hooks/useEditFormHooks';

type Props = EditFormViewModel & {
  handleSave: () => void;
  handleDelete?: () => void;
  prevPath: string;
};

const EditForm: React.FC<Props> = ({
  handleSave,
  handleDelete,
  prevPath,
  isValidError,
  previewUrl,
  handleImageChange,
}) => (
  <Box>
    <CharacterBasicSection
      isValidError={isValidError}
      onImageChange={handleImageChange}
      previewUrl={previewUrl}
    />
    <SpecialtiesSection />
    <ExpCheckSection />
    <AbilitySection />
    <ItemsSection />
    <EquipmentSection />
    <BagsSection />
    <FormActionsSection
      handleSave={handleSave}
      handleDelete={handleDelete}
      prevPath={prevPath}
    />
  </Box>
);

export default EditForm;
