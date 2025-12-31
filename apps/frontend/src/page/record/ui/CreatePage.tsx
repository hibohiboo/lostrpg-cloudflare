import React from 'react';

import { RecordEditForm } from '@lostrpg/frontend/features/character';
import { EditPageWrapper } from '@lostrpg/frontend/shared/ui';
import { useCreatePageHooks } from '../hooks/useCreatePageHooks';

const CreatePage: React.FC = () => {
  const vm = useCreatePageHooks();
  return (
    <EditPageWrapper title="レコードシート作成">
      <RecordEditForm {...vm} prevPath="/character" />
    </EditPageWrapper>
  );
};

export default CreatePage;
