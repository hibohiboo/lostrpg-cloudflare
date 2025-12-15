import { formatHeroSkillForUI } from '@lostrpg/core/index';
import React from 'react';
import {
  GiCrystalBall,
  GiMagicSwirl,
  GiSpellBook,
  GiMagicPalm,
  GiBiceps,
  GiAlliedStar,
  GiBookshelf,
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

interface MagicalClassPageProps {
  skills?: Skill[];
}

export const MagicalClassPage: React.FC<MagicalClassPageProps> = ({
  skills = [],
}) => {
  const classSkills = skills.map((skill) => ({
    ...formatHeroSkillForUI(skill.name, skill),
    icon: GiCrystalBall,
    color: 'bg-purple-50 border-purple-200',
  }));

  const classData: ClassPageData = {
    className: 'マジカル',
    description:
      '魔術や魔法と呼ばれる不可思議な力を用いるヒーローたち。別の姿に変身する、空を飛ぶ、結界をはる、炎を操るなど、幅広い能力を持つ。',
    classIcon: '🔮',
    abilityStats: [
      { name: '肉体', value: 1, icon: GiBiceps, color: 'bg-red-100' },
      { name: '反射', value: 1, icon: MdOutlineBolt, color: 'bg-yellow-100' },
      { name: '感覚', value: 1, icon: GiAlliedStar, color: 'bg-blue-100' },
      { name: '知力', value: 2, icon: GiBookshelf, color: 'bg-purple-100' },
      { name: '超常', value: 3, icon: GiMagicSwirl, color: 'bg-gray-100' },
    ],
    hpSp: [
      { name: 'ＨＰ', value: 23, color: 'bg-red-100' },
      { name: 'ＳＰ', value: 32, color: 'bg-blue-100' },
    ],
    classSkills,
    characteristics: [
      {
        title: '不可思議な力の使い手',
        icon: GiCrystalBall,
        description:
          '変身、飛行、結界、炎の操作など、幅広い魔術的能力を持つ多彩なヒーロー',
        color: 'bg-purple-50 border-purple-200',
      },
      {
        title: '未解明の力',
        icon: GiSpellBook,
        description:
          '魔術は解明されていない力の分野であり、多くの人々がその存在を信じていない神秘的な力',
        color: 'bg-blue-50 border-blue-200',
      },
      {
        title: '超能力とは異なる原理',
        icon: GiMagicPalm,
        description:
          '科学で解析できる超能力とは根本的に異なり、その原理も力の源も不明な部分が多い',
        color: 'bg-green-50 border-green-200',
      },
    ],
    characteristicsDescription: [
      '魔術や魔法と呼ばれる不可思議な力を用いるヒーローたちだ。別の姿に変身する、空を飛ぶ、結界をはる、炎を操るなど、幅広い能力を持つ。未だに魔術は解明されていない力の分野であり、多くの人々がその存在を信じていない力でもある。',
      '超能力と同一にみられることが多いが、それとは根本的に力のあり方が異なる。科学で解析できる範囲に収まっている超能力とことなり、魔術はその原理も力の源も不明な部分が多い。魔術を使うヒーローは師匠から学んだり、異世界の存在から力を与えられたりしているとか。',
    ],
    origins: [
      {
        title: '師匠からの伝承',
        description: '古の魔術師から秘術を受け継いだ正統な魔術師',
      },
      {
        title: '異世界の契約',
        description: '異世界の存在から力を与えられた契約者',
      },
      {
        title: '魔導書の発見',
        description: '偶然発見した古の魔導書から力を得た独学者',
      },
    ],
    originsDescription:
      'マジカルヒーローの力がどのようにして得られたかは様々である。キャラクター作成時に、自分のマジカルヒーローがどのような経緯で魔術を習得したのかを考えてみよう。',
    originsNote:
      'いずれの起源であっても、その力は神秘的で不可思議なものであり、使い手のみが理解できる特別な存在なのだ。',
    abilityNote:
      'マジカルは超常能力（3）に特化し、知力も平均以上を持つ魔術特化型クラス。物理能力は低いが、多彩な魔術で様々な状況に対応できる。',
    playStyles: [
      {
        title: '戦闘での役割',
        color: 'bg-green-50',
        items: [
          '《マジカルアタック》による魔術攻撃',
          '《支援魔術》で味方の攻撃を強化',
          '《ヒーリングライト》による回復支援',
          '《マルチスペル》で複数の対象を同時処理',
        ],
      },
      {
        title: '魔術による多彩な支援',
        color: 'bg-orange-50',
        items: [
          '《ウィッチブルーム》による移動支援',
          '《ハピネス》で味方の判定を強化',
          '《スマイルマジック》による交渉力向上',
          '《封印結界術式》で敵スキルを無効化',
        ],
      },
    ],
  };

  return <ClassPageLayout data={classData} />;
};
