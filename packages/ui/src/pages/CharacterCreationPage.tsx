import React from 'react';
import { Link } from 'react-router';
import { ClassStatsTable } from '../components/ClassStatsTable';
import { PageHeader } from '../components/PageHeader';
import { Section } from '../components/Section';
import { StepList } from '../components/StepList';
import {
  CLASSES,
  SKILLS,
  COMMON_SKILLS,
  ABILITY_CATEGORIES,
} from '../constants/gameData';

export const CharacterCreationPage: React.FC = () => {
  const classColors = [
    'bg-red-100 text-red-800 border-red-300',
    'bg-blue-100 text-blue-800 border-blue-300',
    'bg-purple-100 text-purple-800 border-purple-300',
    'bg-pink-100 text-pink-800 border-pink-300',
    'bg-green-100 text-green-800 border-green-300',
    'bg-yellow-100 text-yellow-800 border-yellow-300',
    'bg-orange-100 text-orange-800 border-orange-300',
    'bg-teal-100 text-teal-800 border-teal-300',
  ];

  const steps = [
    {
      number: 1,
      title: 'クラスを2つ選択',
      description: 'この際同じクラスを2回選択してもよい。',
    },
    {
      number: 2,
      title: '基本能力値を計算',
      description:
        'クラスに設定された能力値を合計する。その後、任意の能力値に１点追加する。',
    },
    {
      number: 3,
      title: '追加の技能ポイント150%を分配',
      description: 'キャラクターの個性を表現する能力値の調整',
    },
    {
      number: 4,
      title: 'ヒーロースキル7レベルを習得',
      description: 'クラスに応じた特殊能力を選択',
    },
    {
      number: 5,
      title: '必殺技1レベルを習得',
      description: 'キャラクター独自の強力な技を作成',
    },
    {
      number: 6,
      title: 'アイテム20点分を購入',
      description: '装備や道具でキャラクターを強化',
    },
    {
      number: 7,
      title: 'HP・SPを算出',
      description: '生命力とスキルポイントの計算',
    },
    {
      number: 8,
      title: '行動値を決定',
      description: '戦闘時の行動順序を決める値を算出',
    },
  ];

  return (
    <article className="max-w-4xl mx-auto">
      <PageHeader
        title="キャラクター作成"
        description="　キミが「Age of Hero」をプレイヤーとして遊ぼうとするならば、キミが「Age of Hero」世界で動かすプレイヤー・キャラクター（PC）を作る必要がある。キミの作ったPCはひとりのヒーローとなり、人を救い、ヴィランと戦うことになる。
「Age of Hero」では、PCはその身体的強さや技術を表す数値と、それぞれが得意とする技であるヒーロースキル、所持するアイテムなどによって表現される。そこに名前や年齢、性別、ヒーローとなった経緯などを加えて、ひとりのキャラクターとなるのだ。"
        centered
      />

      <div className="space-y-12">
        <Section title="キャラクターの要素" icon="🎭">
          <p className="text-gray-600 mb-6">
            キャラクター作成において、キミのヒーローを構成する要素がいくつも存在する。まずはそれらの要素について説明しよう。
          </p>
        </Section>

        <Section title="クラス">
          <p className="text-gray-600 mb-6">
            クラスとはヒーローたちの持つ超常の力を表すものだ。
            クラスはその能力の系統ごとに八種類に分かれている。PCはこれらの内からクラスを二つ選ぶことになる。
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {CLASSES.map((classItem, index) => {
              const IconComponent = classItem.icon;
              return (
                <Link to={`/${classItem.path}`} key={classItem.name}>
                  <div
                    key={classItem.name}
                    className={`p-3 sm:p-4 rounded-lg border-2 ${classColors[index]} text-center font-medium hover:scale-105 transition-transform cursor-pointer`}
                  >
                    <IconComponent className="mx-auto mb-2" size={24} />
                    {classItem.name}
                  </div>
                </Link>
              );
            })}
          </div>
          <p className="text-gray-600 mt-6">
            例えば、クラスが「マッスル」と「バイオ」であれば、「身体改造によって人間以外の動物の能力を移植され、その強力なパワーで戦うヒーロー」というようなキャラクターになるだろう。
            クラスの詳細については、各クラスデータの解説を参照してほしい。
          </p>
        </Section>

        <Section title="能力値と技能">
          <p className="text-gray-600 mb-6">
            能力値はそのヒーローがバイタル・メンタルなどの面でどれほどの強さがあるかを表している。技能はヒーローが具体的にどのようなことができるのかを表すパラメーターとなるのだ。
            各能力値と技能の詳細は以下の通り。
          </p>
          <div className="grid gap-8">
            {ABILITY_CATEGORIES.map((ability) => {
              const skillsInCategory = SKILLS.filter(
                (skill) => skill.category === ability.category,
              );
              return (
                <div
                  key={ability.category}
                  className={`p-4 sm:p-6 rounded-lg border-2 ${ability.bgColor} ${ability.borderColor}`}
                >
                  <h3
                    className={`text-lg sm:text-xl font-semibold mb-3 ${ability.color} flex items-center gap-2`}
                  >
                    <ability.icon size={24} />【{ability.label}】
                  </h3>
                  <p className="text-gray-600 mb-4">{ability.description}</p>
                  <div className="space-y-4">
                    {skillsInCategory.map((skill) => (
                      <div key={skill.name} className="ml-4">
                        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                          <skill.icon size={18} />〈{skill.name}〉
                        </h4>
                        <p className="text-gray-600 text-sm mt-1">
                          {skill.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        <Section title="共通取得技能">
          <p className="text-gray-600 mb-6">
            能力値に左右されない技能を指す。以下の三つが存在する。
          </p>
          <div className="space-y-6">
            {COMMON_SKILLS.map((skill) => (
              <div
                key={skill.name}
                className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg"
              >
                <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                  <skill.icon size={18} />
                  {skill.name}
                </h4>
                <p className="text-gray-600 text-sm">{skill.description}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="作成手順" icon="📋">
          <StepList steps={steps} />
        </Section>
        <Section title="基本能力値を計算" step={2}>
          <div className="p-4 bg-orange-50 border-l-4 border-orange-400 rounded">
            <p className="text-gray-700 mb-4">
              クラスに設定された能力値を合計する。同じクラスを二回選択した場合、そのクラスに設定された能力値を二倍にする。その後、任意の能力値に１点追加する。{' '}
            </p>
            <ClassStatsTable />
          </div>
        </Section>
        <Section title="技能ポイント分配" step={3}>
          <div className="p-4 bg-orange-50 border-l-4 border-orange-400 rounded">
            <p className="text-gray-700">
              能力値×１０％が各技能の初期値となる。その後、技能を１５０％分追加で割り振る。
              ひとつの技能に割り振ることのできるポイントの上限は１００％である。この際、初期値と割り振った技能の合計が１００％を超えるように取得しても構わない。{' '}
            </p>
          </div>
        </Section>

        <Section title="ヒーロースキル" step={5}>
          <div className="p-4 bg-pink-50 border-l-4 border-pink-400 rounded">
            <div className="text-gray-700">
              ヒーロースキルを合計７Ｌｖ分習得する。
              <Link
                to="/character/hero-skill-guide"
                className="text-blue-600 hover:text-blue-800 underline font-medium"
              >
                ヒーロースキルの見方
              </Link>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {CLASSES.map((classItem, index) => {
                  const IconComponent = classItem.icon;
                  return (
                    <Link to={`/${classItem.path}`} key={classItem.name}>
                      <div
                        key={classItem.name}
                        className={`p-3 sm:p-4 rounded-lg border-2 ${classColors[index]} text-center font-medium hover:scale-105 transition-transform cursor-pointer`}
                      >
                        <IconComponent className="mx-auto mb-2" size={24} />
                        {classItem.name}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </Section>

        <Section title="必殺技" step={6}>
          <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded">
            <p className="text-gray-700">必殺技１Ｌｖを習得する。</p>
            <Link
              to="/character/ultimate-skill"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              必殺技一覧
            </Link>
          </div>
        </Section>

        <Section title="アイテム" step={7}>
          <div className="p-4 bg-teal-50 border-l-4 border-teal-400 rounded">
            <p className="text-gray-700">価格２０点分のアイテムを購入する。</p>
          </div>
          <Link
            to="/character/item"
            className="text-blue-600 hover:text-blue-800 underline font-medium"
          >
            アイテム一覧
          </Link>
        </Section>

        <Section title="最終計算" step={8}>
          <div className="space-y-3">
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
              <span className="font-semibold text-indigo-800">HP・SP算出:</span>
              <span className="text-gray-700 ml-2">
                選択した二つのクラスのＨＰ・ＳＰの数値をそれぞれ合計し、ヒーロースキルなどで修正がある場合はそれを加える。
              </span>
            </div>
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
              <span className="font-semibold text-indigo-800">行動値決定:</span>
              <span className="text-gray-700 ml-2">
                行動値の算出を行う。行動値は【反射】×２＋【知力】となる。ヒーロースキルなどで修正がある場合はそれを加える。
              </span>
            </div>
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
          {/* <Link
            to="/character"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            キャラクター作成ツールへ →
          </Link> */}
          <Link
            to="/rules/judgment"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            判定ルールへ →
          </Link>
        </div>
      </nav>
    </article>
  );
};
