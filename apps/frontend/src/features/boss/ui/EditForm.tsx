import { Box } from '@mui/material';
import React from 'react';
import {
  AbilitiesSection,
  BasicSection,
  FormActionsSection,
  PasswordSection,
  SpecialtyNoteSection,
  StatsSection,
} from './sections';
import type { EditFormViewModel } from '../hooks/useEditFormHooks';
import type { BossFormData } from '../model/bossSlice';

type Props = EditFormViewModel & {
  handleSave: () => void;
  handleDelete?: () => void;
  prevPath: string;
};

const EditForm: React.FC<Props> = ({
  boss,
  isValidError,
  previewUrl,
  setBoss,
  handleLevelChange,
  handleImageChange,
  handleAbilityAdd,
  handleAbilityUpdate,
  handleAbilityDelete,
  handleSave,
  handleDelete,
  prevPath,
}) => {
  const handleChange = (data: Partial<BossFormData>) =>
    setBoss({ ...boss, ...data });

  return (
    <Box>
      <BasicSection
        boss={boss}
        isValidError={isValidError}
        previewUrl={previewUrl}
        onChange={handleChange}
        onLevelChange={handleLevelChange}
        onImageChange={handleImageChange}
      />
      <SpecialtyNoteSection />
      <StatsSection boss={boss} onChange={handleChange} />
      <AbilitiesSection
        level={boss.level}
        abilities={boss.abilities}
        onAbilityAdd={handleAbilityAdd}
        onAbilityUpdate={handleAbilityUpdate}
        onAbilityDelete={handleAbilityDelete}
      />
      <PasswordSection boss={boss} onChange={handleChange} />
      <FormActionsSection
        handleSave={handleSave}
        handleDelete={handleDelete}
        prevPath={prevPath}
      />
    </Box>
  );
};

export default EditForm;
