import React from 'react';
import { SearchableNameList } from '@lostrpg/frontend/shared/ui';
import { useListPageHooks } from '../hooks/useListPageHooks';

const ListPage: React.FC = () => {
  const vm = useListPageHooks();
  return (
    <SearchableNameList
      {...vm}
      title="キャンプ一覧"
      listName="キャンプリスト"
      createPath="/camp/create"
      detailPathPrefix="/camp"
    />
  );
};

export default ListPage;
