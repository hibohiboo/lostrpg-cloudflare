import React from 'react';

import { MotherlessCharacterEditForm } from '@lostrpg/frontend/features/motherlessCharacter';
import { EditPageWrapper } from '@lostrpg/frontend/shared/ui';
import { useCreatePageHooks } from '../hooks/useCreatePageHooks';

const CreatePage: React.FC = () => {
  const vm = useCreatePageHooks();
  return (
    <EditPageWrapper title="Motherless キャラクター作成">
      <MotherlessCharacterEditForm {...vm} prevPath="/motherless/characters" />
    </EditPageWrapper>
  );
};

export default CreatePage;
