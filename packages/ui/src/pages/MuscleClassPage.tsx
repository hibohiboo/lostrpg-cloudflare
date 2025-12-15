import { formatHeroSkillForUI } from '@lostrpg/core/index';
import React from 'react';
import {
  GiMuscleUp,
  GiRunningShoe,
  GiShield,
  GiFist,
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

interface MuscleClassPageProps {
  skills?: Skill[];
}

export const MuscleClassPage: React.FC<MuscleClassPageProps> = ({
  skills = [],
}) => {
  const classSkills = skills.map((skill) => ({
    ...formatHeroSkillForUI(skill.name, skill),
    icon: GiMuscleUp,
    color: 'bg-red-50 border-red-200',
  }));

  const classData: ClassPageData = {
    className: 'マッスル',
    description:
      '強靭な肉体を駆使して戦うヒーローたち。単純なパワーに限らず、脚力の強化によるスピードアップや身体機能の上昇による防御なども行える。',
    classIcon: '💪',
    abilityStats: [
      { name: '肉体', value: 3, icon: GiBiceps, color: 'bg-red-100' },
      { name: '反射', value: 2, icon: MdOutlineBolt, color: 'bg-yellow-100' },
      { name: '感覚', value: 2, icon: GiAlliedStar, color: 'bg-blue-100' },
      { name: '知力', value: 1, icon: GiBookshelf, color: 'bg-purple-100' },
      { name: '超常', value: 0, icon: GiMagicSwirl, color: 'bg-gray-100' },
    ],
    hpSp: [
      { name: 'ＨＰ', value: 38, color: 'bg-red-100' },
      { name: 'ＳＰ', value: 17, color: 'bg-blue-100' },
    ],
    characteristics: [
      {
        title: '近接戦闘の専門家',
        icon: GiFist,
        description:
          '腕力とスピードを生かした近接戦闘では他を圧倒する力を見せる',
        color: 'bg-red-50 border-red-200',
      },
      {
        title: '救助活動の最前線',
        icon: GiRunningShoe,
        description:
          '事件や救助の場面では最前線に立ち、その身を使って困難に立ち向かう',
        color: 'bg-blue-50 border-blue-200',
      },
      {
        title: '等身大のヒーロー',
        icon: GiShield,
        description:
          '一般市民からは最も近く感じる等身大のヒーローとして受け止められる',
        color: 'bg-green-50 border-green-200',
      },
    ],
    characteristicsDescription: [
      '強靭な肉体を駆使して戦うヒーローたちだ。単純なパワーに限らず、脚力の強化によるスピードアップや身体機能の上昇による防御なども行える。腕力とスピードを生かした近接戦闘では他を圧倒する力を見せるだろう。',
      'また、事件や救助の場面などでは最前線に立ち、その身を使って困難に立ち向かう姿は、一般市民からは最も近く感じる等身大のヒーローとして受け止められることが多い。',
      'その身体は生まれ持っての恵まれた体かもしれないし、後天的に改造を受けたのかもしれない。あるいは、ひたすらに積んだ鍛錬による可能性もある。いずれにせよ、その肉体はもはや超常の域にあるのだ。',
    ],
    classSkills,
    origins: [
      {
        title: '生まれ持った才能',
        description: 'その身体は生まれ持っての恵まれた体かもしれない',
      },
      {
        title: '後天的な改造',
        description: '後天的に改造を受けたのかもしれない',
      },
      {
        title: '鍛錬の賜物',
        description: 'ひたすらに積んだ鍛錬による可能性もある',
      },
    ],
    originsDescription:
      'マッスルの超常的な肉体がどのようにして得られたかは様々である。キャラクター作成時に、自分のマッスルがどのような経緯で力を得たのかを考えてみよう。',
    originsNote:
      'いずれの起源であっても、その肉体はもはや超常の域にある。普通の人間では到底不可能な身体能力を発揮することができる存在なのだ。',
    abilityNote:
      'マッスルは肉体能力に特化したクラス。最高の肉体能力値（3）を持ち、反射と感覚も平均的な値を保つ。知力は低めで、超常能力は持たない物理特化型のヒーローである。',
    playStyles: [
      {
        title: '戦闘での役割',
        color: 'bg-green-50',
        items: [
          '前衛アタッカーとして敵に接近し、高い攻撃力で敵を撃破',
          '《パワードライブ》による強力なコンボ攻撃',
          '《マッスルチャージ》で各種判定を強化',
          '《バイタルアップ》による高いHP量で壁役も可能',
        ],
      },
      {
        title: '救助・探索での活躍',
        color: 'bg-orange-50',
        items: [
          'がれきの除去や重量物の運搬',
          '危険な場所への突入と人命救助',
          '物理的な障害の突破',
          '一般市民に安心感を与える存在',
        ],
      },
    ],
  };

  return <ClassPageLayout data={classData} />;
};
