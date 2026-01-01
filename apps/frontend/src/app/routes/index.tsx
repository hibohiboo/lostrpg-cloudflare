import { createBrowserRouter } from 'react-router';
import {
  CampCreatePage,
  CampDetailPage,
  CampEditPage,
  CampListPage,
} from '@lostrpg/frontend/page/camp';
import {
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
  createCharacterLoader,
  createRecordLoader,
} from '@lostrpg/frontend/page/character/loader';
import { RecordCreatePage } from '@lostrpg/frontend/page/record';
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
          path: '/camp',
          children: [
            {
              path: '',
              element: <CampListPage />,
            },
            {
              path: 'create',
              element: <CampCreatePage />,
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
          path: '/character',
          children: [
            {
              path: '',
              element: <LOSTCharacterListPage />,
            },
            {
              path: 'create',
              element: <LOSTCharacterCreatePage />,
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
              element: <RecordCreatePage />,
              loader: createCharacterLoader(dispatch),
            },
            {
              path: ':characterId/record/:id',
              element: <RecordCreatePage />,
              loader: createRecordLoader(dispatch),
            },
          ],
        },
      ],
    },
  ]);
