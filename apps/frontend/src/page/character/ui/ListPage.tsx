import React from 'react';
import { SearchableNameList } from '@lostrpg/frontend/shared/ui';
import { useListPageHooks } from '../hooks/useListPageHooks';

const ListPage: React.FC = () => {
  const vm = useListPageHooks();
  return (
    <SearchableNameList
      {...vm}
      title="キャラクター一覧"
      createPath="/character/create"
      detailPathPrefix="/character"
      fallbackIcon="🎒"
    />
  );
};

export default ListPage;
