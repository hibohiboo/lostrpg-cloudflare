import React from 'react';

import { EnemyEditForm } from '@lostrpg/frontend/features/enemy';
import { EditPageWrapper } from '@lostrpg/frontend/shared/ui';
import { useCreatePageHooks } from '../hooks/useCreatePageHooks';

const CreatePage: React.FC = () => {
  const vm = useCreatePageHooks();
  return (
    <EditPageWrapper title="エネミー登録">
      <EnemyEditForm {...vm} prevPath="/enemy" />
    </EditPageWrapper>
  );
};

export default CreatePage;
