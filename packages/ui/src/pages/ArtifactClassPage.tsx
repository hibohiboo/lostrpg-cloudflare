import { formatHeroSkillForUI } from '@age-of-hero/core/index';
import React from 'react';
import {
  GiAncientSword,
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

interface ArtifactClassPageProps {
  skills?: Skill[];
}

export const ArtifactClassPage: React.FC<ArtifactClassPageProps> = ({
  skills = [],
}) => {
  const classSkills = skills.map((skill) => ({
    ...formatHeroSkillForUI(skill.name, skill),
    icon: GiAncientSword,
    color: 'bg-orange-50 border-orange-200',
  }));

  const classData: ClassPageData = {
    className: 'アーティファクト',
    description:
      '遠い過去や神話の時代の武具を用いたり、それらの世界から現代にやってきたりといったヒーローだ。神代・古代の神秘的な力を持つ道具を使い、神からの寵愛を受ける。',
    classIcon: '⚔️',
    abilityStats: [
      { name: '肉体', value: 2, icon: GiBiceps, color: 'bg-red-100' },
      { name: '反射', value: 1, icon: MdOutlineBolt, color: 'bg-yellow-100' },
      { name: '感覚', value: 2, icon: GiAlliedStar, color: 'bg-blue-100' },
      { name: '知力', value: 1, icon: GiBookshelf, color: 'bg-purple-100' },
      { name: '超常', value: 2, icon: GiMagicSwirl, color: 'bg-gray-100' },
    ],
    hpSp: [
      { name: 'ＨＰ', value: 34, color: 'bg-red-100' },
      { name: 'ＳＰ', value: 21, color: 'bg-blue-100' },
    ],
    classSkills,
    characteristics: [
      {
        title: '神話の武具を操る者',
        icon: GiAncientSword,
        description:
          '遠い過去や神話の時代の武具を用い、神代・古代の神秘的な力を持つ道具で戦う',
        color: 'bg-orange-50 border-orange-200',
      },
      {
        title: '神からの寵愛',
        icon: GiAncientSword,
        description:
          '神からの寵愛を受けた存在として、時に奇跡のような力を発揮する',
        color: 'bg-blue-50 border-blue-200',
      },
      {
        title: '力を保つ遺物',
        icon: GiAncientSword,
        description:
          '遺跡出土品や古代武具を媒介とし、作られた時からの形を保つ物品が力を維持しやすい',
        color: 'bg-green-50 border-green-200',
      },
    ],
    characteristicsDescription: [
      'アーティファクトとは遠い過去や神話の時代の武具を用いたり、それらの世界から現代にやってきたりといったヒーローだ。神代・古代の神秘的な力を持つ道具を使い、神からの寵愛を受ける彼らは時に奇跡のような力を発揮する。',
      '彼らは遺跡から出土した品々や、神話の時代から自身とともに現代にやってきた武具を媒介として能力を使う場合が多い。これは現代世界においては変化していく生命よりも、作られた時からの形を保つ物品の方が力を維持しやすいからだとする説もある。',
    ],
    origins: [
      {
        title: '遺跡からの発見',
        description:
          '古代遺跡から発掘された神秘的な武具や道具を手に入れた考古学者',
      },
      {
        title: '神話時代からの継承',
        description:
          '神話の時代から現代まで受け継がれてきた聖なる武具の正統な継承者',
      },
      {
        title: '異世界からの来訪',
        description: '神話の世界や古代から現代にやって来た戦士や神の使い',
      },
    ],
    originsDescription:
      'アーティファクトヒーローの神秘的な武具がどのようにして得られたかは様々である。キャラクター作成時に、自分のアーティファクトヒーローがどのような経緯で力を得たのかを考えてみよう。',
    originsNote:
      'いずれの起源であっても、その武具は神代・古代の神秘的な力を宿した特別な存在なのだ。',
    abilityNote:
      'アーティファクトは肉体・感覚・超常能力に優れた戦士系クラス。高いHPと神秘的な武具による多彩な戦闘能力を持つ。',
    playStyles: [
      {
        title: '戦闘での役割',
        color: 'bg-green-50',
        items: [
          '《古代兵装》で強力な武器を生成し白兵戦を主導',
          '《グラディエーター》による強力な白兵攻撃',
          '《エンシェントスペル》で武器の力を魔術攻撃に転換',
          '《ジャッジメントボルト》による神の裁きの一撃',
        ],
      },
      {
        title: '神秘的な防護と支援',
        color: 'bg-orange-50',
        items: [
          '《ミスティックアーマー》《守護神の加護》による高い防御力',
          '《神聖なる献身》で味方を守るカバーリング',
          '《黄金の果実》による奇跡の復活能力',
          '《オーラバトラー》でアーティファクト能力を強化',
        ],
      },
    ],
  };

  return <ClassPageLayout data={classData} />;
};
