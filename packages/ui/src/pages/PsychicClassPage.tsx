import { formatHeroSkillForUI } from '@lostrpg/core/index';
import React from 'react';
import {
  GiBrain,
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

interface PsychicClassPageProps {
  skills?: Skill[];
}

export const PsychicClassPage: React.FC<PsychicClassPageProps> = ({
  skills = [],
}) => {
  const classSkills = skills.map((skill) => ({
    ...formatHeroSkillForUI(skill.name, skill),
    icon: GiBrain,
    color: 'bg-pink-50 border-pink-200',
  }));

  const classData: ClassPageData = {
    className: 'サイキック',
    description:
      '超能力という特殊な能力を使うヒーローたち。個人ごとにテレパスや治癒能力の強化、気象や磁力の操作など能力の規模や方向性が異なる様々な能力を用いて戦闘や救助を行う。',
    classIcon: '🧠',
    abilityStats: [
      { name: '肉体', value: 1, icon: GiBiceps, color: 'bg-red-100' },
      { name: '反射', value: 1, icon: MdOutlineBolt, color: 'bg-yellow-100' },
      { name: '感覚', value: 2, icon: GiAlliedStar, color: 'bg-blue-100' },
      { name: '知力', value: 2, icon: GiBookshelf, color: 'bg-purple-100' },
      { name: '超常', value: 2, icon: GiMagicSwirl, color: 'bg-gray-100' },
    ],
    hpSp: [
      { name: 'ＨＰ', value: 25, color: 'bg-red-100' },
      { name: 'ＳＰ', value: 30, color: 'bg-blue-100' },
    ],
    classSkills,
    characteristics: [
      {
        title: '特殊な超能力の使い手',
        icon: GiBrain,
        description:
          'テレパス、治癒能力、気象や磁力操作など、個人ごとに異なる様々な超能力を駆使する',
        color: 'bg-pink-50 border-pink-200',
      },
      {
        title: '一つの能力への特化',
        icon: GiBrain,
        description:
          '魔術とは異なり、個人が持てる能力はほぼひとつのみだが、その能力の使い方を究めている',
        color: 'bg-blue-50 border-blue-200',
      },
      {
        title: '科学的に解明された力',
        icon: GiBrain,
        description:
          '「使われていなかった脳機能」の発現であると解明され、人間の進化の一形態とされる',
        color: 'bg-green-50 border-green-200',
      },
    ],
    characteristicsDescription: [
      '超能力という特殊な能力を使うヒーローたちだ。個人ごとにテレパスや治癒能力の強化、気象や磁力の操作など能力の規模や方向性が異なる様々な能力を用いて戦闘や救助を行う。',
      '魔術とは異なり、個人が持てる能力はほとんどの場合ひとつのみだ。しかし、それ故に自分の能力の使い方を究めたヒーローが多く、彼らは自分の長所短所を十分に理解し戦術を構築している。',
      '現在では超能力は「それまで使われていなかった人間の脳機能」が突然変異的に発現したものであると解明され、人間の進化のひとつの形なのではと囁かれている。',
    ],
    origins: [
      {
        title: '生来の能力者',
        description: '生まれつき超能力を持っていた天然の能力者',
      },
      {
        title: '突然の覚醒',
        description: '事故やショックをきっかけに能力が突然発現した',
      },
      {
        title: '後天的獲得',
        description: '実験や訓練によって後天的に超能力を身に着けた',
      },
    ],
    originsDescription:
      'サイキックヒーローの超能力がどのようにして発現したかは様々である。キャラクター作成時に、自分のサイキックがどのような経緯で能力を得たのかを考えてみよう。',
    originsNote:
      'いずれの起源であっても、その能力は脳機能の特殊な発現であり、使い手独自の特別な能力なのだ。',
    abilityNote:
      'サイキックは感覚・知力・超常能力がバランス良く配分された精神系クラス。物理能力は低いが、多様な超能力で戦況をコントロールできる。クラス取得時に《パワーオリジン》を自動取得する。',
    playStyles: [
      {
        title: '戦闘での役割',
        color: 'bg-green-50',
        items: [
          '《オリジン：エレメント》による超能力攻撃',
          '《オリジン：精神感応能力》で敵の判定を妨害',
          '《サイコインパクト》による強化攻撃',
          '《能力暴走》でリスクを背負った強力な攻撃',
        ],
      },
      {
        title: '戦術的支援',
        color: 'bg-orange-50',
        items: [
          '《オリジン：空間転移》による位置制御',
          '《オリジン：プレコグニション》で先読み行動',
          '《オリジン：物体動作支配》による場の制圧',
          '《多重能力者》で複数の超能力を習得',
        ],
      },
    ],
  };

  return <ClassPageLayout data={classData} />;
};
