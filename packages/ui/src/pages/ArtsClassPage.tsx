import { formatHeroSkillForUI } from '@lostrpg/core/index';
import React from 'react';
import {
  GiPunchingBag,
  GiBiceps,
  GiAlliedStar,
  GiBookshelf,
  GiMagicSwirl,
} from 'react-icons/gi';
import { MdOutlineBolt } from 'react-icons/md';
import { ClassPageLayout, ClassPageData } from '../components/ClassPageLayout';

interface Skill {
  name: string;
  maxLv: number;
  timing: string;
  skill: string;
  target: string;
  range: string;
  cost: string;
  effect: string;
}

interface ArtsClassPageProps {
  skills?: Skill[];
}

export const ArtsClassPage: React.FC<ArtsClassPageProps> = ({
  skills = [],
}) => {
  const classSkills = skills.map((skill) => ({
    ...formatHeroSkillForUI(skill.name, skill),
    icon: GiPunchingBag,
    color: 'bg-teal-50 border-teal-200',
  }));

  const classData: ClassPageData = {
    className: 'アーツ',
    description:
      '異能の力ではなく技術を磨き、異能に並び立つレベルに昇華させたヒーローたち。彼らは技術を一流の域に到達するまで磨き上げることでヒーローとして戦う力を確立させている。',
    classIcon: '🥊',
    abilityStats: [
      { name: '肉体', value: 1, icon: GiBiceps, color: 'bg-red-100' },
      { name: '反射', value: 3, icon: MdOutlineBolt, color: 'bg-yellow-100' },
      { name: '感覚', value: 2, icon: GiAlliedStar, color: 'bg-blue-100' },
      { name: '知力', value: 2, icon: GiBookshelf, color: 'bg-purple-100' },
      { name: '超常', value: 0, icon: GiMagicSwirl, color: 'bg-gray-100' },
    ],
    hpSp: [
      { name: 'ＨＰ', value: 32, color: 'bg-red-100' },
      { name: 'ＳＰ', value: 23, color: 'bg-blue-100' },
    ],
    classSkills,
    characteristics: [
      {
        title: '技術の極致',
        icon: GiPunchingBag,
        description:
          '異能の力ではなく技術を磨き、異能に並び立つレベルに昇華させた技能の達人',
        color: 'bg-teal-50 border-teal-200',
      },
      {
        title: '努力を怠らない意志',
        icon: GiPunchingBag,
        description:
          '生まれ持っての才能だけに頼らず、現代兵装の訓練や格闘技術の熟練などの努力を継続',
        color: 'bg-blue-50 border-blue-200',
      },
      {
        title: '血の滲む鍛錬',
        icon: GiPunchingBag,
        description:
          'ヒーローに並び立つために血の滲むような鍛錬を続けてきた強い意志の持ち主',
        color: 'bg-green-50 border-green-200',
      },
    ],
    characteristicsDescription: [
      'アーツとは異能の力ではなく技術を磨き、異能に並び立つレベルに昇華させたヒーローたちだ。彼らは異能を持たない、あるいは異能の力が弱いことが多い。そのため、技術を一流の域に到達するまで磨き上げることでヒーローとして戦う力を確立させている。',
      '彼らは生まれ持っての才能だけに頼らず、現代兵装の訓練や格闘技術の熟練などの努力を怠らない。ヒーローに並び立つために血の滲むような鍛錬を続けてきたからこそ、彼らの胸には強い意志が宿っているのだ。',
    ],
    origins: [
      {
        title: '武術の修行者',
        description:
          '古来から伝わる武術を極限まで鍛錬し、超人的な技術を身に着けた格闘家',
      },
      {
        title: '軍事訓練の専門家',
        description:
          '軍事組織や特殊部隊での厳しい訓練により、人間の限界を超えた技術を習得',
      },
      {
        title: '独学の天才',
        description:
          '異能を持たない自分を受け入れ、独自の訓練で技術を極限まで高めた努力家',
      },
    ],
    originsDescription:
      'アーツヒーローの技術がどのようにして磨かれたかは様々である。キャラクター作成時に、自分のアーツヒーローがどのような経緯で技術を極めたのかを考えてみよう。',
    originsNote:
      'いずれの起源であっても、その技術は血の滲むような努力と鍛錬によって身に着けられた特別な存在なのだ。',
    abilityNote:
      'アーツは反射能力（3）に特化し、感覚・知力もバランス良く持つ技術系クラス。超常能力は持たないが、高い技術力で異能者に対抗できる。',
    playStyles: [
      {
        title: '戦闘での役割',
        color: 'bg-green-50',
        items: [
          '《コンバットアーツ》で技術による万能攻撃',
          '《技巧の極み》で攻撃判定を大幅強化',
          '《マルチウェポン》による複数武器同時攻撃',
          '《アンティルブレイク》で強力な技術攻撃',
        ],
      },
      {
        title: '技術的戦術',
        color: 'bg-orange-50',
        items: [
          '《ドッジロール》による優秀な回避技術',
          '《タクティクスコマンド》で味方のダメージを強化',
          '《アウトレンジスナイプ》による長距離精密射撃',
          '《デッドカウンター》でリスクを背負った反撃',
        ],
      },
    ],
  };

  return <ClassPageLayout data={classData} />;
};
