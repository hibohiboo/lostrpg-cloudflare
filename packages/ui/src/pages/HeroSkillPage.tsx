import React from 'react';
import { FaRegUserCircle, FaUser, FaUsers } from 'react-icons/fa';
import {
  GiMagicLamp,
  GiLevelEndFlag,
  GiAlarmClock,
  GiChecklist,
  GiTargetArrows,
  GiCrosshair,
  GiFireBottle,
  GiMagicSwirl,
  GiExpand,
  GiRunningShoe,
  GiPowerButton,
  GiMuscleUp,
  GiFilmStrip,
} from 'react-icons/gi';
import { Link } from 'react-router';
import { PageHeader } from '../components/PageHeader';
import { Section } from '../components/Section';
import { SkillCard } from '../components/SkillCard';

export const HeroSkillPage: React.FC = () => {
  const skillProperties = [
    {
      title: '①名称',
      icon: GiMagicLamp,
      description: 'そのヒーロースキルの名称。《○○》の形で表記する。',
      color: 'bg-blue-50 border-blue-200',
    },
    {
      title: '②最大Ｌｖ',
      icon: GiLevelEndFlag,
      description: 'ヒーロースキルの最大取得Ｌｖ。',
      color: 'bg-green-50 border-green-200',
    },
    {
      title: '③タイミング',
      icon: GiAlarmClock,
      description:
        'ヒーロースキルを使用できるタイミング。タイミングが同一のヒーロースキルは使用する技能が同じであれば組み合わせて使用することができる。',
      color: 'bg-purple-50 border-purple-200',
    },
    {
      title: '④技能',
      icon: GiChecklist,
      description:
        'そのヒーロースキルを使用する際に何の技能で判定を行うのかを表す。',
      color: 'bg-orange-50 border-orange-200',
    },
    {
      title: '⑤対象',
      icon: GiTargetArrows,
      description: 'ヒーロースキルの効果を受ける対象を表す。',
      color: 'bg-red-50 border-red-200',
    },
    {
      title: '⑥射程',
      icon: GiCrosshair,
      description:
        'ヒーロースキルの効果が届く距離を表す。「近距離」「遠距離」と書かれている場合はその距離以内までとなる。',
      color: 'bg-teal-50 border-teal-200',
    },
    {
      title: '⑦コスト',
      icon: GiFireBottle,
      description:
        'ヒーロースキルを使用するために必要なＳＰやファンチット（解説内ではＦＣと略す）が書かれている。コストを消費できない場合、そのヒーロースキルは使用することができない。',
      color: 'bg-yellow-50 border-yellow-200',
    },
    {
      title: '⑧効果',
      icon: GiMagicSwirl,
      description: 'ヒーロースキルを使用した際に発揮される効果。',
      color: 'bg-indigo-50 border-indigo-200',
    },
  ];

  const timingTypes = [
    {
      type: 'アクション',
      icon: GiRunningShoe,
      items: [
        {
          name: 'マイナーアクション',
          description: 'マイナーアクションとして効果を発揮する',
        },
        {
          name: 'メジャーアクション',
          description: 'メジャーアクションとして効果を発揮する',
        },
        {
          name: 'リアクション',
          description: 'リアクションとして効果を発揮する',
        },
      ],
    },
    {
      type: '特殊タイミング',
      icon: GiPowerButton,
      items: [
        {
          name: 'オートアクション',
          description:
            '使用の宣言を行うことで使用可能である。特に記載がない限り判定は発生しない',
        },
        {
          name: 'プロセス',
          description:
            'スタートプロセス、エンドプロセスなど表記される場合、それぞれのプロセスでヒーロースキルを使用する',
        },
        { name: '常時', description: '常に効果を発揮しているヒーロースキル' },
      ],
    },
  ];

  const skillTypes = [
    {
      name: '〈技能名〉',
      description:
        '表記されている技能を判定に用いる。複数の技能が書いてある場合、それらの技能のいずれかを使用しての判定が行えるという意味となる',
    },
    {
      name: 'なし',
      description:
        '判定を行わない。「技能：なし」のヒーロースキルは「技能：なし」のヒーロースキルとのみ組み合わせることができる',
    },
    {
      name: '○○攻撃',
      description: '表記されている攻撃方法に組み合わせて使用することができる',
    },
    {
      name: 'ドッジ',
      description: 'ドッジの判定に組み合わせて使用することができる',
    },
    {
      name: 'ガード',
      description: 'ガードの判定に組み合わせて使用することができる',
    },
  ];

  const targetTypes = [
    {
      name: '自身',
      description: 'ヒーロースキルを使用したキャラクターにのみ効果を発揮する',
      icon: FaRegUserCircle,
    },
    {
      name: '単体',
      description:
        'キャラクターひとりをひとりが効果を受ける。使用者自身も対象にできる',
      icon: FaUser,
    },
    {
      name: 'Ｘ体',
      description:
        'Ｘには数字が入る。Ｘ以下の数のキャラクターを任意に選択して効果を発揮する。使用者自身も対象にできる',
      icon: FaUsers,
    },
    {
      name: '範囲',
      description: 'エンゲージひとつの中のキャラクター全員に効果を発揮する',
      icon: GiExpand,
    },
    {
      name: '範囲（選択）',
      description:
        'エンゲージひとつの中の任意に選んだキャラクター全員に効果を発揮する',
      icon: GiExpand,
    },
    {
      name: '場面',
      description: 'シーンに登場しているキャラクター全員に効果を発揮する',
      icon: GiFilmStrip,
    },
    {
      name: '場面（選択）',
      description:
        'シーンに登場しているキャラクターの内、任意に選んだキャラクター全員に効果を発揮する',
      icon: GiFilmStrip,
    },
  ];

  const rangeTypes = [
    { name: '至近', description: '使用者と同一のエンゲージにのみ効果が届く' },
    { name: '武器', description: '武器に設定された射程と同じ距離まで届く' },
    {
      name: '視界',
      description:
        '使用者から見える距離まで届く。基本的にはシーンに登場しているものすべてが射程内となる',
    },
  ];

  const exampleSkills = [
    {
      name: '《パワードライブ》',
      icon: GiMuscleUp,
      details: {
        maxLv: 5,
        timing: 'メジャーアクション',
        skill: '白兵攻撃',
        target: '単体',
        range: '武器',
        cost: '4',
        effect:
          '対象に白兵攻撃を行う。コンボ２。このヒーロースキルを組み合わせた攻撃のダメージに＋[Ｌｖ×４]する。このヒーロースキルのＬｖが４以上になったならばコンボ数を＋１してもよい。',
      },
      color: 'bg-red-50 border-red-200',
    },
  ];

  return (
    <article className="max-w-4xl mx-auto">
      <PageHeader
        title="ヒーロースキル"
        description="ヒーローたちが持つ特別な能力について解説する。"
        centered
      />

      <div className="space-y-12">
        <Section title="ヒーロースキルの見方" icon="🔍">
          <p className="text-gray-600 mb-6">
            ヒーロースキルはいくつかの項目から成る。それらの項目については以下の通りだ。
          </p>

          <div className="space-y-4">
            {skillProperties.map((property, index) => (
              <div
                key={index}
                className={`p-4 ${property.color} rounded-lg border-2`}
              >
                <div className="flex items-start gap-3">
                  <property.icon
                    size={24}
                    className="text-gray-700 mt-1 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      {property.title}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {property.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="タイミングの詳細" icon="⏰">
          <div className="space-y-6">
            {timingTypes.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-4">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <category.icon size={20} />
                  {category.type}
                </h3>
                <div className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="p-3 bg-gray-50 rounded border border-gray-200"
                    >
                      <h4 className="font-medium text-gray-800 mb-1">
                        {item.name}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="技能の種類" icon="⚙️">
          <div className="space-y-3">
            {skillTypes.map((skill, index) => (
              <div
                key={index}
                className="p-3 bg-blue-50 rounded border border-blue-200"
              >
                <h4 className="font-medium text-blue-800 mb-1">{skill.name}</h4>
                <p className="text-blue-700 text-sm">{skill.description}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="対象の種類" icon="🎯">
          <div className="grid md:grid-cols-2 gap-4">
            {targetTypes.map((target, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-start gap-3">
                  <target.icon
                    size={20}
                    className="text-gray-700 mt-1 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 mb-1">
                      {target.name}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {target.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="射程の種類" icon="🏹">
          <div className="space-y-3">
            {rangeTypes.map((range, index) => (
              <div
                key={index}
                className="p-3 bg-teal-50 rounded border border-teal-200"
              >
                <h4 className="font-medium text-teal-800 mb-1">{range.name}</h4>
                <p className="text-teal-700 text-sm">{range.description}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="スキル例" icon="📋">
          <p className="text-gray-600 mb-6">
            以下は実際のヒーロースキルの例である。
          </p>

          <div className="space-y-6">
            {exampleSkills.map((skill, index) => (
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
      </div>

      <nav className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <Link
            to="/rules"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            ← ルール一覧に戻る
          </Link>
          <Link
            to="/character-creation"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            キャラクター作成へ →
          </Link>
        </div>
      </nav>
    </article>
  );
};
