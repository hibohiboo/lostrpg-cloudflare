import { formatHeroSkillForUI } from '@lostrpg/core';
import React from 'react';
import {
  GiDna2,
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

interface BioClassPageProps {
  skills?: Skill[];
}

export const BioClassPage: React.FC<BioClassPageProps> = ({ skills = [] }) => {
  const classSkills = skills.map((skill) => ({
    ...formatHeroSkillForUI(skill.name, skill),
    icon: GiDna2,
    color: 'bg-green-50 border-green-200',
  }));

  const classData: ClassPageData = {
    className: 'バイオ',
    description:
      '人類以外の生命体、獣や虫、植物といったものたちの能力をその身に宿したヒーローたち。人間の身体機能の外側をいく動作や知覚を行うことができる。',
    classIcon: '🧬',
    abilityStats: [
      { name: '肉体', value: 2, icon: GiBiceps, color: 'bg-red-100' },
      { name: '反射', value: 2, icon: MdOutlineBolt, color: 'bg-yellow-100' },
      { name: '感覚', value: 2, icon: GiAlliedStar, color: 'bg-blue-100' },
      { name: '知力', value: 2, icon: GiBookshelf, color: 'bg-purple-100' },
      { name: '超常', value: 0, icon: GiMagicSwirl, color: 'bg-gray-100' },
    ],
    hpSp: [
      { name: 'ＨＰ', value: 36, color: 'bg-red-100' },
      { name: 'ＳＰ', value: 19, color: 'bg-blue-100' },
    ],
    classSkills,
    characteristics: [
      {
        title: '生命体の能力を宿す',
        icon: GiDna2,
        description:
          '獣や虫、植物といった人類以外の生命体の能力をその身に宿し、人間を超えた動作や知覚を実現する',
        color: 'bg-green-50 border-green-200',
      },
      {
        title: 'ヒトならざる姿への変身',
        icon: GiDna2,
        description:
          '能力発現時に「ヒトならざる」姿になることが多く、コスチュームで隠す派とアピールする派に分かれる',
        color: 'bg-blue-50 border-blue-200',
      },
      {
        title: '様々な能力の出自',
        icon: GiDna2,
        description:
          '実験や改造で生まれた能力、親から引き継いだ能力など出自は様々で、触れたがらないヒーローも多い',
        color: 'bg-orange-50 border-orange-200',
      },
    ],
    characteristicsDescription: [
      '人類以外の生命体、獣や虫、植物といったものたちの能力をその身に宿したヒーローたちだ。人間の身体機能の外側をいく動作や知覚を行うことができ、拡張された視野や予想できない攻撃方法などをもつ。',
      'その能力を発現させる際、「ヒトならざる」姿になるものも多く、一般人の目線を気にしてコスチュームを工夫する層と、むしろその「ヒトならざる」姿をアピールする層とがいる。',
      'その生命体の力は実験や改造で生まれたものであったり、親から引き継いだものであったりする。能力の出自に触れたがらないヒーローも少なからず存在する。',
    ],
    origins: [
      {
        title: '実験・改造',
        description: '科学実験や身体改造によって他の生命体の能力を獲得した',
      },
      {
        title: '遺伝・継承',
        description: '親や先祖から生命体の力を受け継いだ血統の持ち主',
      },
      {
        title: '突然変異',
        description: '何らかの要因で突然変異を起こし、生命体の能力が発現した',
      },
    ],
    originsDescription:
      'バイオヒーローの生命体能力がどのようにして得られたかは様々である。キャラクター作成時に、自分のバイオヒーローがどのような経緯で能力を得たのかを考えてみよう。',
    originsNote:
      'いずれの起源であっても、その能力は人間の限界を超えた生命体の力であり、使い手にとって特別な存在なのだ。',
    abilityNote:
      'バイオは全能力値がバランス良く2に配分されたオールラウンダークラス。超常能力は持たないが、高いHPと生命体特有の能力で多様な戦術が可能。',
    playStyles: [
      {
        title: '戦闘での役割',
        color: 'bg-green-50',
        items: [
          '《疾風の健脚》による高い行動値で先制攻撃',
          '《限定獣化》で素手戦闘を強化',
          '《ラッシングライフ》《エンタングルアーム》による白兵攻撃',
          '《強制神経加速》でリスクを背負った強力な攻撃',
        ],
      },
      {
        title: '生命体能力の活用',
        color: 'bg-orange-50',
        items: [
          '《ネイチャーセンス》による優れた知覚能力',
          '《バイオパワー》で攻撃判定を強化',
          '《スリップショック》で状態異常を付与',
          '《ビーストウィズイン》で獣の力を完全開放',
        ],
      },
    ],
  };

  return <ClassPageLayout data={classData} />;
};
