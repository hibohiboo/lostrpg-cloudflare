import { createBrowserRouter } from 'react-router';
import {
  BossCreatePage,
  BossDetailPage,
  BossEditPage,
  BossListPage,
} from '@lostrpg/frontend/page/boss';
import {
  createBossCreateLoader,
  createBossLoader,
} from '@lostrpg/frontend/page/boss/loader';
import {
  CampCreatePage,
  CampDetailPage,
  CampEditPage,
  CampListPage,
} from '@lostrpg/frontend/page/camp';
import {
  createCampCreateLoader,
  createCampDetailLoader,
  createCampEditLoader,
} from '@lostrpg/frontend/page/camp/loader';
import {
  LOSTCharacterCreatePage,
  LOSTCharacterDetailPage,
  LOSTCharacterEditPage,
  LOSTCharacterListPage,
} from '@lostrpg/frontend/page/character';
import {
  createCharacterCreateLoader,
  createCharacterLoader,
  createRecordLoader,
} from '@lostrpg/frontend/page/character/loader';
import {
  EnemyCreatePage,
  EnemyDetailPage,
  EnemyEditPage,
  EnemyListPage,
} from '@lostrpg/frontend/page/enemy';
import {
  createEnemyCreateLoader,
  createEnemyLoader,
} from '@lostrpg/frontend/page/enemy/loader';
import {
  RecordCreatePage,
  RecordEditPage,
} from '@lostrpg/frontend/page/record';
import { TopPage } from '@lostrpg/frontend/page/top';
import { Layout } from '@lostrpg/frontend/shared/ui';

export const createRouter = ({ dispatch }: { dispatch: AppDispatch }) =>
  createBrowserRouter([
    {
      path: '/',
      Component: Layout,
      children: [
        {
          path: '',
          element: <TopPage />,
        },
        {
          path: '/enemy',
          children: [
            {
              path: '',
              element: <EnemyListPage />,
            },
            {
              path: 'create',
              element: <EnemyCreatePage />,
              loader: createEnemyCreateLoader(dispatch),
            },
            {
              path: ':id',
              element: <EnemyDetailPage />,
              loader: createEnemyLoader(dispatch),
            },
            {
              path: ':id/edit',
              element: <EnemyEditPage />,
              loader: createEnemyLoader(dispatch),
            },
          ],
        },
        {
          path: '/camp',
          children: [
            {
              path: '',
              element: <CampListPage />,
            },
            {
              path: 'create',
              element: <CampCreatePage />,
              loader: createCampCreateLoader(dispatch),
            },
            {
              path: ':id',
              element: <CampDetailPage />,
              loader: createCampDetailLoader(dispatch),
            },
            {
              path: ':id/edit',
              element: <CampEditPage />,
              loader: createCampEditLoader(dispatch),
            },
          ],
        },
        {
          path: '/boss',
          children: [
            {
              path: '',
              element: <BossListPage />,
            },
            {
              path: 'create',
              element: <BossCreatePage />,
              loader: createBossCreateLoader(dispatch),
            },
            {
              path: ':id',
              element: <BossDetailPage />,
              loader: createBossLoader(dispatch),
            },
            {
              path: ':id/edit',
              element: <BossEditPage />,
              loader: createBossLoader(dispatch),
            },
          ],
        },
        {
          path: '/character',
          children: [
            {
              path: '',
              element: <LOSTCharacterListPage />,
            },
            {
              path: 'create',
              element: <LOSTCharacterCreatePage />,
              loader: createCharacterCreateLoader(dispatch),
            },
            {
              path: ':id',
              element: <LOSTCharacterDetailPage />,
              loader: createCharacterLoader(dispatch),
            },
            {
              path: ':id/edit',
              element: <LOSTCharacterEditPage />,
              loader: createCharacterLoader(dispatch),
            },

            {
              path: ':id/record',
              children: [
                {
                  path: '',
                  element: <RecordCreatePage />,
                  loader: createCharacterLoader(dispatch),
                },
                {
                  path: ':recordId',
                  element: <RecordEditPage />,
                  loader: createRecordLoader(dispatch),
                },
              ],
            },
          ],
        },
      ],
    },
  ]);
