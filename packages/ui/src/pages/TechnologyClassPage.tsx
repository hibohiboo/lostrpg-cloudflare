import { formatHeroSkillForUI } from '@lostrpg/core/index';
import React from 'react';
import {
  GiRobotGrab,
  GiMechaHead,
  GiRayGun,
  GiBiceps,
  GiAlliedStar,
  GiBookshelf,
  GiMagicSwirl,
  GiRobotAntennas,
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

interface TechnologyClassPageProps {
  skills?: Skill[];
}

export const TechnologyClassPage: React.FC<TechnologyClassPageProps> = ({
  skills = [],
}) => {
  const classSkills = skills.map((skill) => ({
    ...formatHeroSkillForUI(skill.name, skill),
    icon: GiRobotAntennas,
    color: 'bg-cyan-50 border-cyan-200',
  }));

  const classData: ClassPageData = {
    className: 'テクノロジー',
    description:
      '最先端技術の申し子たるヒーローたち。新技術の粋を集めたパワードスーツや、自ら開発したアイデア兵器などを使用して戦闘や救助を行う。',
    classIcon: '⚙️',
    abilityStats: [
      { name: '肉体', value: 1, icon: GiBiceps, color: 'bg-red-100' },
      { name: '反射', value: 2, icon: MdOutlineBolt, color: 'bg-yellow-100' },
      { name: '感覚', value: 3, icon: GiAlliedStar, color: 'bg-blue-100' },
      { name: '知力', value: 2, icon: GiBookshelf, color: 'bg-purple-100' },
      { name: '超常', value: 0, icon: GiMagicSwirl, color: 'bg-gray-100' },
    ],
    hpSp: [
      { name: 'ＨＰ', value: 30, color: 'bg-red-100' },
      { name: 'ＳＰ', value: 25, color: 'bg-blue-100' },
    ],

    classSkills,
    characteristics: [
      {
        title: '最先端技術の申し子',
        icon: GiMechaHead,
        description:
          '新技術の粋を集めたパワードスーツや、自ら開発したアイデア兵器などを使用して戦闘や救助を行う',
        color: 'bg-cyan-50 border-cyan-200',
      },
      {
        title: '特殊機構の使い手',
        icon: GiRayGun,
        description:
          '普通では扱えないような特殊な機構を持つアイテムを最も効果的に扱えるヒーロー',
        color: 'bg-blue-50 border-blue-200',
      },
      {
        title: '多様なアイテム',
        icon: GiRobotGrab,
        description:
          '企業や組織から与えられたもの、自らの手で開発したもの、未来の不可思議な技術で作られたものなど様々',
        color: 'bg-green-50 border-green-200',
      },
    ],
    characteristicsDescription: [
      '最先端技術の申し子たるヒーローたちだ。新技術の粋を集めたパワードスーツや、自ら開発したアイデア兵器などを使用して戦闘や救助を行う。アイテムに頼りがちのように思われることもあるが、彼らは普通では扱えないような特殊な機構を持つアイテムを最も効果的に扱えるヒーローなのだ。',
      '身に付けるアイテムは企業や組織から与えられたものや、自らの手で開発したもの、果ては未来の不可思議な技術で作られたものであったりと様々だ。しかし、それらは一様に強力で、持ち主であるヒーローのみが扱えるのである。',
    ],
    origins: [
      {
        title: '企業・組織支給',
        description: '企業や組織から与えられたパワードスーツや特殊装備',
      },
      {
        title: '自己開発',
        description: '自らの手で開発したアイデア兵器や発明品',
      },
      {
        title: '未来の技術',
        description: '未来の不可思議な技術で作られた謎の装置',
      },
    ],
    originsDescription:
      'テクノロジーヒーローの装備がどのようにして得られたかは様々である。キャラクター作成時に、自分のテクノロジーヒーローがどのような経緯で装備を得たのかを考えてみよう。',
    originsNote:
      'いずれの起源であっても、それらの装備は一様に強力で、持ち主であるヒーローのみが扱える特別な存在なのだ。',
    abilityNote:
      'テクノロジーは感覚能力（3）に特化し、知力・反射も平均的な値を持つ技術特化型クラス。肉体は低く、超常能力は持たないが、アイテムによって多様な能力を発揮できる。',
    playStyles: [
      {
        title: '戦闘での役割',
        color: 'bg-green-50',
        items: [
          '《ツールファイト》による射撃・操縦攻撃の強化',
          '《バラージショット》による範囲攻撃',
          '《エネルギーレイ》で防護点を無視した攻撃',
          '《バリア発生装置》による味方の防護',
        ],
      },
      {
        title: 'アイテム活用',
        color: 'bg-orange-50',
        items: [
          '《スペシャルツール》でテクノロジー専用アイテム取得',
          '《アイテムボックス》で装備の性能強化',
          '《研究費用》で豊富な常備化点を活用',
          '《デポジッション》による状況に応じた装備変更',
        ],
      },
    ],
  };

  return <ClassPageLayout data={classData} />;
};
