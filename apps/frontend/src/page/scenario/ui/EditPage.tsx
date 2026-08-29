import React from 'react';

import { ScenarioEditForm } from '@lostrpg/frontend/features/scenario';
import { EditPageWrapper } from '@lostrpg/frontend/shared/ui';
import { useEditPageHooks } from '../hooks/useEditPageHooks';

const EditPage: React.FC = () => {
  const vm = useEditPageHooks();
  return (
    <EditPageWrapper title="シナリオ編集">
      <ScenarioEditForm {...vm} prevPath="/scenario" />
    </EditPageWrapper>
  );
};

export default EditPage;
