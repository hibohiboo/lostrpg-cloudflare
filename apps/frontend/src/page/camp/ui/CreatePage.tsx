import React from 'react';

import { CampEditForm } from '@lostrpg/frontend/features/camp';
import { EditPageWrapper } from '@lostrpg/frontend/shared/ui';
import { useCreatePageHooks } from '../hooks/useCreatePageHooks';

const CreatePage: React.FC = () => {
  const vm = useCreatePageHooks();
  return (
    <EditPageWrapper title="キャンプ作成">
      <CampEditForm {...vm} prevPath="/camp" />
    </EditPageWrapper>
  );
};

export default CreatePage;
