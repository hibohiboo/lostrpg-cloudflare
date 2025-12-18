import React from 'react';

import { CampEditForm } from '@lostrpg/frontend/features/camp';
import { EditPageWrapper } from '@lostrpg/frontend/shared/ui';
import { useEditPageHooks } from '../hooks/useEditPageHooks';

const EditPage: React.FC = () => {
  const vm = useEditPageHooks();
  return (
    <EditPageWrapper title="キャンプ編集">
      <CampEditForm {...vm} prevPath="/camp" />
    </EditPageWrapper>
  );
};

export default EditPage;
