import React from 'react';

import { EnemyEditForm } from '@lostrpg/frontend/features/enemy';
import { EditPageWrapper } from '@lostrpg/frontend/shared/ui';
import { useEditPageHooks } from '../hooks/useEditPageHooks';

const EditPage: React.FC = () => {
  const vm = useEditPageHooks();
  return (
    <EditPageWrapper title="エネミー編集">
      <EnemyEditForm {...vm} prevPath="/enemy" />
    </EditPageWrapper>
  );
};

export default EditPage;
