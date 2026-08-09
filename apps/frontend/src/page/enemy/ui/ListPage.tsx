import React from 'react';
import { SearchableNameList } from '@lostrpg/frontend/shared/ui';
import { useListPageHooks } from '../hooks/useListPageHooks';

const ListPage: React.FC = () => {
  const vm = useListPageHooks();
  return (
    <SearchableNameList
      {...vm}
      title="エネミー一覧"
      createPath="/enemy/create"
      detailPathPrefix="/enemy"
      fallbackIcon="👾"
    />
  );
};

export default ListPage;
