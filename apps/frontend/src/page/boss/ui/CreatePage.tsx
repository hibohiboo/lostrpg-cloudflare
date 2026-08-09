import React from 'react';

import { BossEditForm } from '@lostrpg/frontend/features/boss';
import { EditPageWrapper } from '@lostrpg/frontend/shared/ui';
import { useCreatePageHooks } from '../hooks/useCreatePageHooks';

const CreatePage: React.FC = () => {
  const vm = useCreatePageHooks();
  return (
    <EditPageWrapper title="ヌシ登録">
      <BossEditForm {...vm} prevPath="/boss" />
    </EditPageWrapper>
  );
};

export default CreatePage;
