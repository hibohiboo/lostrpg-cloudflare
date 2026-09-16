import React from 'react';
import { SearchableNameList } from '@lostrpg/frontend/shared/ui';
import { useListPageHooks } from '../hooks/useListPageHooks';

const ListPage: React.FC = () => {
  const vm = useListPageHooks();
  return (
    <SearchableNameList
      {...vm}
      title="Motherless キャラクター一覧"
      createPath="/motherless/characters/create"
      detailPathPrefix="/motherless/characters"
      fallbackIcon="🧬"
    />
  );
};

export default ListPage;
