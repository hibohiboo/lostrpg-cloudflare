import React from 'react';
import { IconType } from 'react-icons';
import { Link } from 'react-router';
import { PageHeader } from './PageHeader';
import { Section } from './Section';
import { SkillCard } from './SkillCard';

export interface AbilityStat {
  name: string;
  value: number;
  icon: IconType;
  color: string;
}

export interface HpSpStat {
  name: string;
  value: number;
  color: string;
}

export interface ClassCharacteristic {
  title: string;
  icon: IconType;
  description: string;
  color: string;
}

export interface ClassSkill {
  name: string;
  icon: IconType;
  details: {
    maxLv: number;
    timing: string;
    skill: string;
    target: string;
    range: string;
    cost: string;
    effect: string;
  };
  color: string;
}

export interface ClassOrigin {
  title: string;
  description: string;
}

export interface PlayStyleSection {
  title: string;
  color: string;
  items: string[];
}

export interface ClassPageData {
  className: string;
  description: string;
  classIcon: string;
  abilityStats: AbilityStat[];
  hpSp: HpSpStat[];
  characteristics: ClassCharacteristic[];
  characteristicsDescription: string[];
  classSkills: ClassSkill[];
  origins: ClassOrigin[];
  originsDescription: string;
  originsNote: string;
  abilityNote: string;
  playStyles: PlayStyleSection[];
}

interface ClassPageLayoutProps {
  data: ClassPageData;
}

export const AbilityStatsSection: React.FC<{
  abilityStats: AbilityStat[];
  hpSp: HpSpStat[];
  abilityNote: string;
}> = ({ abilityStats, hpSp, abilityNote }) => (
  <Section title="能力値" icon="📊">
    <div className="space-y-6">
      <div className="grid grid-cols-5 gap-4">
        {abilityStats.map((stat, index) => (
          <div
            key={index}
            className={`p-4 ${stat.color} rounded-lg border border-gray-200 text-center`}
          >
            <div className="flex justify-center mb-2">
              <stat.icon size={24} className="text-gray-700" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-1">{stat.name}</h4>
            <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        {hpSp.map((stat, index) => (
          <div
            key={index}
            className={`p-4 ${stat.color} rounded-lg border border-gray-200 text-center`}
          >
            <h4 className="font-semibold text-gray-800 mb-2">{stat.name}</h4>
            <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
        <p className="text-yellow-800 text-sm">
          <strong>能力値の特徴：</strong>
          <br />
          {abilityNote}
        </p>
      </div>
    </div>
  </Section>
);

export const CharacteristicsSection: React.FC<{
  characteristics: ClassCharacteristic[];
  descriptions: string[];
}> = ({ characteristics, descriptions }) => (
  <Section title="クラスの特徴" icon="💪">
    <div className="space-y-4 mb-6">
      {descriptions.map((desc, index) => (
        <p key={index} className="text-gray-600">
          {desc}
        </p>
      ))}
    </div>

    <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-4">
      {characteristics.map((char, index) => (
        <div key={index} className={`p-4 ${char.color} rounded-lg border-2`}>
          <div className="flex items-start gap-3">
            <char.icon size={24} className="text-gray-700 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800 mb-2">{char.title}</h4>
              <p className="text-gray-600 text-sm">{char.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </Section>
);

export const ClassSkillsSection: React.FC<{
  classSkills: ClassSkill[];
  className: string;
}> = ({ classSkills, className }) => (
  <Section title="クラス固有スキル" icon="⚡">
    <p className="text-gray-600 mb-6">
      {className}クラスが習得できる専用のヒーロースキル。
    </p>

    <div className="space-y-6">
      {classSkills.map((skill, index) => (
        <SkillCard
          key={index}
          name={skill.name}
          icon={skill.icon}
          details={skill.details}
          color={skill.color}
        />
      ))}
    </div>
  </Section>
);

export const OriginsSection: React.FC<{
  origins: ClassOrigin[];
  className: string;
  description: string;
  note: string;
}> = ({ origins, className, description, note }) => (
  <Section title={`${className}の起源`} icon="🔬">
    <p className="text-gray-600 mb-6">{description}</p>

    <div className="space-y-4">
      {origins.map((origin, index) => (
        <div
          key={index}
          className="p-4 bg-gray-50 rounded-lg border border-gray-200"
        >
          <h4 className="font-semibold text-gray-800 mb-2">{origin.title}</h4>
          <p className="text-gray-600 text-sm">{origin.description}</p>
        </div>
      ))}
    </div>

    <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
      <p className="text-blue-800 text-sm">
        <strong>重要：</strong>
        <br />
        {note}
      </p>
    </div>
  </Section>
);

export const PlayStyleSection: React.FC<{
  playStyles: PlayStyleSection[];
}> = ({ playStyles }) => (
  <Section title="プレイスタイル" icon="🎯">
    <div className="space-y-4">
      {playStyles.map((style, index) => (
        <div key={index} className={`p-4 ${style.color} border-l-4 rounded`}>
          <h4
            className={`font-semibold mb-3 ${style.color.replace('bg-', 'text-').replace('-50', '-800')}`}
          >
            {style.title}
          </h4>
          <ul
            className={`text-sm space-y-2 ${style.color.replace('bg-', 'text-').replace('-50', '-700')}`}
          >
            {style.items.map((item, itemIndex) => (
              <li key={itemIndex}>• {item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </Section>
);

export const ClassPageLayout: React.FC<ClassPageLayoutProps> = ({ data }) => (
  <article className="max-w-4xl mx-auto">
    <PageHeader
      title={data.className}
      description={data.description}
      centered
    />

    <div className="space-y-12">
      <CharacteristicsSection
        characteristics={data.characteristics}
        descriptions={data.characteristicsDescription}
      />

      <AbilityStatsSection
        abilityStats={data.abilityStats}
        hpSp={data.hpSp}
        abilityNote={data.abilityNote}
      />

      <ClassSkillsSection
        classSkills={data.classSkills}
        className={data.className}
      />

      <OriginsSection
        origins={data.origins}
        className={data.className}
        description={data.originsDescription}
        note={data.originsNote}
      />

      <PlayStyleSection playStyles={data.playStyles} />
    </div>

    <nav className="mt-12 pt-8 border-t border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <Link
          to="/rules/character-creation"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          ← キャラクター作成に戻る
        </Link>
        <Link
          to="/rules/hero-skill-guide"
          className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          ヒーロースキルへ →
        </Link>
      </div>
    </nav>
  </article>
);
