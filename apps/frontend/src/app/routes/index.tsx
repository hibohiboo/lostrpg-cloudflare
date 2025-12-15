/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ArtifactClassPage,
  ArtsClassPage,
  BioClassPage,
  EsperantoClassPage,
  HeroBirthPage,
  HeroSkillPage,
  ItemsPage,
  MagicalClassPage,
  MuscleClassPage,
  PsychicClassPage,
  TechnologyClassPage,
  UltimateSkillPage,
} from '@lostrpg/ui/index';
import { createBrowserRouter } from 'react-router';
import { CampCreatePage, CampListPage } from '@lostrpg/frontend/page/camp';
import { Page as CharacterCreatePage } from '@lostrpg/frontend/page/character-create';
import { Page as CharacterDetailPage } from '@lostrpg/frontend/page/character-detail';
import { Page as CharacterEditPage } from '@lostrpg/frontend/page/character-edit';
import { Page as CharacterListPage } from '@lostrpg/frontend/page/character-list';
import {
  AcclaimRulePage,
  BattleRulePage,
  JudgmentRulePage,
  RulesPage,
  SessionProgressPage,
} from '@lostrpg/frontend/page/rules';
import { Page as CharacterCreationPage } from '@lostrpg/frontend/page/rules/character-creation';
import { TopPage } from '@lostrpg/frontend/page/top';
import { Layout } from '@lostrpg/frontend/shared/layout';
import {
  useSpreadSheetItemData,
  useSpreadSheetSkillData,
  useSpreadSheetUltimateData,
} from '@lostrpg/frontend/shared/spreadsheet';

const ClassPageWrapper = ({
  className,
  Component,
}: {
  className: string;
  Component: React.ComponentType<{ skills?: any[] }>;
}) => {
  const skillData = useSpreadSheetSkillData();
  const filteredSkills = skillData.filter((skill) => skill.class === className);
  return <Component skills={filteredSkills} />;
};
const UltimateWrapper = ({
  Component,
}: {
  Component: React.ComponentType<{ ultimateSkills?: any[] }>;
}) => {
  const skillData = useSpreadSheetUltimateData();
  return <Component ultimateSkills={skillData} />;
};
const ItemWrapper = ({
  Component,
}: {
  Component: React.ComponentType<{ items?: any[] }>;
}) => {
  const itemData = useSpreadSheetItemData();
  return <Component items={itemData} />;
};
export const createRouter = () =>
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
          ],
        },
      ],
    },
    {
      path: '/sample',
      Component: Layout,
      children: [
        {
          path: '',
          element: <TopPage />,
        },
        {
          path: 'rules',
          element: <RulesPage />,
        },
        {
          path: 'rules/character-creation',
          element: <CharacterCreationPage />,
        },
        {
          path: 'character/create',
          element: <CharacterCreatePage />,
        },
        {
          path: 'character-list',
          element: <CharacterListPage />,
        },
        {
          path: 'character/:id',
          element: <CharacterDetailPage />,
        },
        {
          path: 'character/:id/edit',
          element: <CharacterEditPage />,
        },
        {
          path: 'rules/judgment',
          element: <JudgmentRulePage />,
        },
        {
          path: 'rules/session',
          element: <SessionProgressPage />,
        },
        {
          path: 'rules/applause',
          element: <AcclaimRulePage />,
        },
        {
          path: 'rules/combat',
          element: <BattleRulePage />,
        },
        {
          path: 'world/hero-birth',
          element: <HeroBirthPage />,
        },
        {
          path: 'character/hero-skill-guide',
          element: <HeroSkillPage />,
        },
        {
          path: 'character/muscle',
          element: (
            <ClassPageWrapper
              className="マッスル"
              Component={MuscleClassPage}
            />
          ),
        },
        {
          path: 'character/technology',
          element: (
            <ClassPageWrapper
              className="テクノロジー"
              Component={TechnologyClassPage}
            />
          ),
        },
        {
          path: 'character/bio',
          element: (
            <ClassPageWrapper className="バイオ" Component={BioClassPage} />
          ),
        },
        {
          path: 'character/esperanto',
          element: (
            <ClassPageWrapper
              className="エスペラント"
              Component={EsperantoClassPage}
            />
          ),
        },
        {
          path: 'character/magical',
          element: (
            <ClassPageWrapper
              className="マジカル"
              Component={MagicalClassPage}
            />
          ),
        },
        {
          path: 'character/psychic',
          element: (
            <ClassPageWrapper
              className="サイキック"
              Component={PsychicClassPage}
            />
          ),
        },
        {
          path: 'character/artifact',
          element: (
            <ClassPageWrapper
              className="アーティファクト"
              Component={ArtifactClassPage}
            />
          ),
        },
        {
          path: 'character/arts',
          element: (
            <ClassPageWrapper className="アーツ" Component={ArtsClassPage} />
          ),
        },
        {
          path: 'character/ultimate-skill',
          element: <UltimateWrapper Component={UltimateSkillPage} />,
        },
        {
          path: 'character/item',
          element: <ItemWrapper Component={ItemsPage} />,
        },
      ],
    },
  ]);
