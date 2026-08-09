import { Box } from '@mui/material';
import React from 'react';
import {
  AbilitiesSection,
  BasicSection,
  DropItemsSection,
  FormActionsSection,
  PasswordSection,
  StatsSection,
} from './sections';
import type { EditFormViewModel } from '../hooks/useEditFormHooks';
import type { EnemyFormData } from '../model/enemySlice';

type Props = EditFormViewModel & {
  handleSave: () => void;
  handleDelete?: () => void;
  prevPath: string;
};

const EditForm: React.FC<Props> = ({
  enemy,
  isValidError,
  previewUrl,
  setEnemy,
  handleImageChange,
  handleDropItemChange,
  handleAbilityAdd,
  handleAbilityUpdate,
  handleAbilityDelete,
  handleSave,
  handleDelete,
  prevPath,
}) => {
  const handleChange = (data: Partial<EnemyFormData>) =>
    setEnemy({ ...enemy, ...data });

  return (
    <Box>
      <BasicSection
        enemy={enemy}
        isValidError={isValidError}
        previewUrl={previewUrl}
        onChange={handleChange}
        onImageChange={handleImageChange}
      />
      <StatsSection enemy={enemy} onChange={handleChange} />
      <AbilitiesSection
        abilities={enemy.abilities}
        onAbilityAdd={handleAbilityAdd}
        onAbilityUpdate={handleAbilityUpdate}
        onAbilityDelete={handleAbilityDelete}
      />
      <DropItemsSection
        dropItems={enemy.dropItems}
        onDropItemChange={handleDropItemChange}
      />
      <PasswordSection enemy={enemy} onChange={handleChange} />
      <FormActionsSection
        handleSave={handleSave}
        handleDelete={handleDelete}
        prevPath={prevPath}
      />
    </Box>
  );
};

export default EditForm;
