import React from 'react';

import { RecordEditForm } from '@lostrpg/frontend/features/character';
import { EditPageWrapper } from '@lostrpg/frontend/shared/ui';
import { useEditPageHooks } from '../hooks/useEditPageHooks';

const EditPage: React.FC = () => {
  const vm = useEditPageHooks();

  if (vm.isLoading) {
    return (
      <EditPageWrapper title="レコードシート編集">
        <div>読み込み中...</div>
      </EditPageWrapper>
    );
  }

  return (
    <EditPageWrapper title="レコードシート編集">
      <RecordEditForm {...vm} />
    </EditPageWrapper>
  );
};

export default EditPage;
