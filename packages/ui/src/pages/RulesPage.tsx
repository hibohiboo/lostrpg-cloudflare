import React from 'react';
import { Link } from 'react-router';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';

export const RulesPage: React.FC = () => {
  const rulesSections = [
    { title: 'キャラクター作成', path: '/rules/character-creation' },
    { title: '判定ルール', path: '/rules/judgment' },
    { title: 'セッションの進行', path: '/rules/session' },
    { title: '喝采ルール', path: '/rules/applause' },
    { title: '戦闘ルール', path: '/rules/combat' },
    // { title: '戦闘ルール：バッドステータス', path: '/rules/combat-bad-status' },
  ];

  return (
    <div>
      <PageHeader
        title="ルール"
        description="Age of Hero TRPGの基本的なルールとシステム"
      />

      <div className="grid md:grid-cols-2 gap-6">
        {rulesSections.map((section, index) => (
          <Link
            key={index}
            to={section.path}
            className="inline-block text-blue-600 hover:text-blue-800 font-medium"
          >
            <Card key={index}>
              <h3 className="text-xl font-semibold mb-4 text-blue-600">
                {section.title}
              </h3>
              詳細を見る →
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};
