import React from 'react';

import { MotherlessCharacterEditForm } from '@lostrpg/frontend/features/motherlessCharacter';
import { EditPageWrapper } from '@lostrpg/frontend/shared/ui';
import { useEditPageHooks } from '../hooks/useEditPageHooks';

const EditPage: React.FC = () => {
  const vm = useEditPageHooks();
  return (
    <EditPageWrapper title="Motherless キャラクター編集">
      <MotherlessCharacterEditForm {...vm} prevPath="/motherless/characters" />
    </EditPageWrapper>
  );
};

export default EditPage;
