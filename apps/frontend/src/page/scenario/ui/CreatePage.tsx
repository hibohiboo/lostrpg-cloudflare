import React from 'react';

import { ScenarioEditForm } from '@lostrpg/frontend/features/scenario';
import { EditPageWrapper } from '@lostrpg/frontend/shared/ui';
import { useCreatePageHooks } from '../hooks/useCreatePageHooks';

const CreatePage: React.FC = () => {
  const vm = useCreatePageHooks();
  return (
    <EditPageWrapper title="シナリオ作成">
      <ScenarioEditForm {...vm} prevPath="/scenario" />
    </EditPageWrapper>
  );
};

export default CreatePage;
