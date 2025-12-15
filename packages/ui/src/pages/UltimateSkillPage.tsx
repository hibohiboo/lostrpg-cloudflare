import React from 'react';
import {
  GiSwordsPower,
  GiHeartPlus,
  GiUpgrade,
  GiStarStruck,
} from 'react-icons/gi';
import { Link } from 'react-router';
import { PageHeader } from '../components/PageHeader';
import { Section } from '../components/Section';
import { SkillCard } from '../components/SkillCard';
import { ExternalSkill } from '../components/form/SkillForm';
import { ultimateSkills } from '../constants/gameData';

interface UltimateSkillPageProps {
  ultimateSkills?: Omit<ExternalSkill, 'class'>[];
}

export const UltimateSkillPage: React.FC<UltimateSkillPageProps> = ({
  ultimateSkills: propsUltimateSkills = [],
}) => {
  const skillCategories = [
    {
      title: '攻撃系必殺技',
      icon: GiSwordsPower,
      skills: ['《ダメージブースト》', '《カルネージアタック》'],
      description: 'ダメージを大幅に向上させる必殺技群',
      color: 'bg-red-50 border-red-200',
    },
    {
      title: '支援系必殺技',
      icon: GiUpgrade,
      skills: ['《スキルアッパー》', '《ファンアピール》'],
      description: '味方の能力を向上させたり、リソースを獲得する必殺技群',
      color: 'bg-blue-50 border-blue-200',
    },
    {
      title: '防御・回復系必殺技',
      icon: GiHeartPlus,
      skills: ['《リザレクション》', '《フルディフェンス》'],
      description: '味方を守り、回復させる必殺技群',
      color: 'bg-green-50 border-green-200',
    },
    {
      title: '運命操作系必殺技',
      icon: GiStarStruck,
      skills: ['《ディスティニールーラー》', '《フェイトダークサイド》'],
      description: '判定結果を直接変更する強力な必殺技群',
      color: 'bg-purple-50 border-purple-200',
    },
  ];
  const skills = propsUltimateSkills.map((s) => {
    const skill = ultimateSkills.find((us) => us.name === s.name);
    if (!skill) return { ...s, icon: GiSwordsPower, color: 'gray' };
    return { ...s, icon: skill.icon, color: skill.color };
  });

  return (
    <article className="max-w-4xl mx-auto">
      <PageHeader
        title="必殺技"
        description="ヒーローがいずれも所持している強力な特殊技能について説明する。"
        centered
      />

      <div className="space-y-12">
        <Section title="必殺技について" icon="⭐">
          <div className="space-y-4">
            <p className="text-gray-600">
              ヒーローはいずれも必殺技、得意技と呼ばれるスキルを所持している。必殺技の効果は以下の通りだが、名前と演出についてはＰＬが考え決定すること。
            </p>

            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
              <h4 className="font-semibold text-yellow-800 mb-2">
                必殺技の特徴
              </h4>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>• 全ての必殺技は最大Lv1で、タイミングはオートアクション</li>
                <li>• 技能判定は不要（技能：なし）でコストも発生しない</li>
                <li>• 全ての必殺技はシナリオに１回まで使用可能</li>
                <li>• 名前と演出はプレイヤーが自由に決められる</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
              <h4 className="font-semibold text-blue-800 mb-2">演出の重要性</h4>
              <p className="text-blue-700 text-sm">
                必殺技は単なるゲーム的な効果ではなく、そのキャラクターらしさを表現する重要な要素である。キャラクターの個性や信念、戦闘スタイルを反映した演出を心がけよう。
              </p>
            </div>
          </div>
        </Section>

        <Section title="必殺技の分類" icon="📊">
          <p className="text-gray-600 mb-6">
            必殺技は大きく以下の4つのカテゴリに分類される。
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {skillCategories.map((category, index) => (
              <div
                key={index}
                className={`p-4 ${category.color} rounded-lg border-2`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <category.icon
                    size={24}
                    className="text-gray-700 mt-1 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      {category.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-3">
                      {category.description}
                    </p>
                    <div className="space-y-1">
                      {category.skills.map((skill, skillIndex) => (
                        <div
                          key={skillIndex}
                          className="p-2 bg-white rounded text-sm text-gray-700"
                        >
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="必殺技一覧" icon="📋">
          <p className="text-gray-600 mb-6">
            以下は利用可能な必殺技の完全なリストである。
          </p>

          <div className="space-y-6">
            {skills.map((skill, index) => (
              <SkillCard
                key={index}
                name={skill.name}
                icon={skill.icon}
                details={skill}
                color={skill.color}
              />
            ))}
          </div>
        </Section>

        <Section title="必殺技の使用タイミング" icon="⏰">
          <div className="space-y-6">
            <div className="p-4 bg-orange-50 border-2 border-orange-200 rounded-lg">
              <h4 className="font-semibold text-orange-800 mb-3">
                ラウンド数による効果変動
              </h4>
              <p className="text-orange-700 text-sm mb-3">
                一部の必殺技は現在のラウンド数に応じて効果が変動する。戦闘が長引くほど強力になる。
              </p>
              <div className="space-y-2">
                <div className="p-2 bg-orange-100 rounded text-orange-800 text-sm">
                  <strong>《ダメージブースト》：</strong>{' '}
                  +[ラウンド数×10]ダメージ
                </div>
                <div className="p-2 bg-orange-100 rounded text-orange-800 text-sm">
                  <strong>《スキルアッパー》：</strong> +[ラウンド数×30]%判定値
                </div>
                <div className="p-2 bg-orange-100 rounded text-orange-800 text-sm">
                  <strong>《フルディフェンス》：</strong>{' '}
                  -[ラウンド数×5]ダメージ軽減
                </div>
              </div>
            </div>

            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-3">
                使用制限について
              </h4>
              <p className="text-red-700 text-sm">
                全ての必殺技は「シナリオに１回まで」の使用制限がある。セッション中に一度使用すると、そのシナリオが終了するまで再使用できない。使用するタイミングを慎重に見極めることが重要である。
              </p>
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
          <Link
            to="/rules/hero-skill"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ヒーロースキルへ →
          </Link>
        </div>
      </nav>
    </article>
  );
};
