import React from 'react';

import { BossEditForm } from '@lostrpg/frontend/features/boss';
import { EditPageWrapper } from '@lostrpg/frontend/shared/ui';
import { useEditPageHooks } from '../hooks/useEditPageHooks';

const EditPage: React.FC = () => {
  const vm = useEditPageHooks();
  return (
    <EditPageWrapper title="ヌシ編集">
      <BossEditForm {...vm} prevPath="/boss" />
    </EditPageWrapper>
  );
};

export default EditPage;
