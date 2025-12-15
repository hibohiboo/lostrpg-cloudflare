import React from 'react';
import { LinkCard } from '../components/LinkCard';
import { PageHeader } from '../components/PageHeader';

export const HomePage: React.FC = () => {
  const sections = [
    {
      title: 'ルール',
      description: 'ゲームの基本的なルールとシステムについて学べます。',
      href: '/rules',
      buttonText: 'ルールを見る',
      color: 'blue' as const,
    },
    // {
    //   title: 'ワールド',
    //   description: 'Age of Heroの世界観と設定について詳しく知ることができます。',
    //   href: '/world',
    //   buttonText: 'ワールドを見る',
    //   color: 'green' as const
    // },
    // {
    //   title: 'キャラクター作成',
    //   description: 'あなた独自のヒーローキャラクターを作成するためのガイドです。',
    //   href: '/character',
    //   buttonText: 'キャラクター作成',
    //   color: 'purple' as const
    // }
  ];

  return (
    <div className="text-center">
      <PageHeader title="Age of Hero TRPG へようこそ" centered />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-8 sm:mt-12">
        {sections.map((section) => (
          <LinkCard key={section.title} {...section} />
        ))}
      </div>
    </div>
  );
};
