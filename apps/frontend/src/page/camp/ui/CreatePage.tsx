import React from 'react';

import { CampEditForm } from '@lostrpg/frontend/features/camp';
import { useCreatePageHooks } from '../hooks/useCreatePageHooks';

const CreatePage: React.FC = () => {
  const vm = useCreatePageHooks();
  return <CampEditForm {...vm} prevPath="/camp" />;
};

export default CreatePage;
