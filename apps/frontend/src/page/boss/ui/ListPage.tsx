import React from 'react';
import { SearchableNameList } from '@lostrpg/frontend/shared/ui';
import { useListPageHooks } from '../hooks/useListPageHooks';

const ListPage: React.FC = () => {
  const vm = useListPageHooks();
  return (
    <SearchableNameList
      {...vm}
      title="ヌシ一覧"
      createPath="/boss/create"
      detailPathPrefix="/boss"
      fallbackIcon="👹"
    />
  );
};

export default ListPage;
