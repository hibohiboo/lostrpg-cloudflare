import React from 'react';

import { CharacterEditForm } from '@lostrpg/frontend/features/character';
import { EditPageWrapper } from '@lostrpg/frontend/shared/ui';
import { useCreatePageHooks } from '../hooks/useCreatePageHooks';

const CreatePage: React.FC = () => {
  const vm = useCreatePageHooks();
  return (
    <EditPageWrapper title="キャラクター作成">
      <CharacterEditForm {...vm} prevPath="/character" />
    </EditPageWrapper>
  );
};

export default CreatePage;
