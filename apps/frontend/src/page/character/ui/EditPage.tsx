import React from 'react';

import { CharacterEditForm } from '@lostrpg/frontend/features/character';
import { EditPageWrapper } from '@lostrpg/frontend/shared/ui';
import { useEditPageHooks } from '../hooks/useEditPageHooks';

const EditPage: React.FC = () => {
  const vm = useEditPageHooks();
  return (
    <EditPageWrapper title="キャラクター編集">
      <CharacterEditForm {...vm} prevPath="/character" />
    </EditPageWrapper>
  );
};

export default EditPage;
