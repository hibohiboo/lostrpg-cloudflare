import React from 'react';
import { SearchableNameList } from '@lostrpg/frontend/shared/ui';
import { useListPageHooks } from '../hooks/useListPageHooks';

const ListPage: React.FC = () => {
  const vm = useListPageHooks();
  return (
    <SearchableNameList
      {...vm}
      title="シナリオ一覧"
      createPath="/scenario/create"
      detailPathPrefix="/scenario"
      fallbackIcon="📖"
    />
  );
};

export default ListPage;
