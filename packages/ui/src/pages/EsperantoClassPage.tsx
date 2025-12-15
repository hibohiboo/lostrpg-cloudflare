import { formatHeroSkillForUI } from '@lostrpg/core/index';
import React from 'react';
import {
  GiStarFormation,
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

interface EsperantoClassPageProps {
  skills?: Skill[];
}

export const EsperantoClassPage: React.FC<EsperantoClassPageProps> = ({
  skills = [],
}) => {
  const classSkills = skills.map((skill) => ({
    ...formatHeroSkillForUI(skill.name, skill),
    icon: GiStarFormation,
    color: 'bg-yellow-50 border-yellow-200',
  }));

  const classData: ClassPageData = {
    className: 'エスペラント',
    description:
      '宇宙や未来の世界からやって来たヒーローたち。現代の地球に存在しない特殊な技術や進化した身体能力を駆使して戦う。',
    classIcon: '⭐',
    abilityStats: [
      { name: '肉体', value: 1, icon: GiBiceps, color: 'bg-red-100' },
      { name: '反射', value: 2, icon: MdOutlineBolt, color: 'bg-yellow-100' },
      { name: '感覚', value: 1, icon: GiAlliedStar, color: 'bg-blue-100' },
      { name: '知力', value: 2, icon: GiBookshelf, color: 'bg-purple-100' },
      { name: '超常', value: 2, icon: GiMagicSwirl, color: 'bg-gray-100' },
    ],
    hpSp: [
      { name: 'ＨＰ', value: 27, color: 'bg-red-100' },
      { name: 'ＳＰ', value: 28, color: 'bg-blue-100' },
    ],
    classSkills,
    characteristics: [
      {
        title: '宇宙・未来からの来訪者',
        icon: GiStarFormation,
        description:
          '宇宙や未来の世界からやって来たヒーローで、現代地球にない特殊な技術や進化した身体能力を持つ',
        color: 'bg-yellow-50 border-yellow-200',
      },
      {
        title: '出自を隠すヒーロー',
        icon: GiStarFormation,
        description:
          '基本的には混乱を避けるため自身の出身地や能力の由来を隠しているヒーローが多い',
        color: 'bg-blue-50 border-blue-200',
      },
      {
        title: '多様なスタート地点',
        icon: GiStarFormation,
        description:
          '異星人、未来人、異星生命体との共存者、異次元出身者、宇宙人の血を受け継ぐ者など様々な背景を持つ',
        color: 'bg-green-50 border-green-200',
      },
    ],
    characteristicsDescription: [
      'エスペラントとは宇宙や未来の世界からやって来たヒーローたちだ。彼らは現代の地球に存在しない特殊な技術や進化した身体能力を駆使して戦う。基本的には混乱を避けるため自身の出身地や能力の由来を隠しているヒーローが多いのも特徴だ。',
      'エスペラントの能力をもつヒーローのスタート地点は様々で、宇宙から飛来した異星人、未来人、異星生命体と共存するものもいる。その他にも異次元からやってきたと自称する者や過去に地球にやってきた宇宙人の血を受け継いだと自称する者などもいる。',
    ],
    origins: [
      {
        title: '異星人・宇宙から飛来',
        description:
          '宇宙から地球にやって来た異星人、または宇宙船で漂着した存在',
      },
      {
        title: '未来人・時間移動者',
        description: '未来の時代から何らかの理由でやって来た時間移動者',
      },
      {
        title: '異次元・宇宙人の血統',
        description: '異次元出身者や過去の宇宙人の血を受け継いだ地球人',
      },
    ],
    originsDescription:
      'エスペラントヒーローの出身がどこであるかは様々である。キャラクター作成時に、自分のエスペラントヒーローがどのような経緯で地球にやって来たのかを考えてみよう。',
    originsNote:
      'いずれの起源であっても、その力は現代地球を超越した技術や能力であり、使い手にとって特別な存在なのだ。',
    abilityNote:
      'エスペラントは反射・知力・超常能力に優れたテクニカル系クラス。物理能力は控えめだが、未来技術と超常能力で多彩な戦術が可能。',
    playStyles: [
      {
        title: '戦闘での役割',
        color: 'bg-green-50',
        items: [
          '《スペースファクター》《フューチャールール》による技術・射撃攻撃',
          '《空の音》で味方の攻撃を大幅強化',
          '《特殊相対性フィールド》で敵の行動値を削減',
          '《ギャラクシーガーディアン》で広範囲への同時行動',
        ],
      },
      {
        title: '未来技術による支援',
        color: 'bg-orange-50',
        items: [
          '《ブロッカービット》で味方の防護点を向上',
          '《パナシーア》で状態異常を完全回復',
          '《エナジードレイン》でエネルギーを操作',
          '《未来技術》で他者のスキルを一時的に習得',
        ],
      },
    ],
  };

  return <ClassPageLayout data={classData} />;
};
