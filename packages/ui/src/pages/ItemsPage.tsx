import React from 'react';
import {
  GiSwordsPower,
  GiShield,
  GiHeartBottle,
  GiBackpack,
} from 'react-icons/gi';

import { ItemCard } from '../components/ItemCard';
import { ItemColumn } from '../components/form/ItemForm';
import {
  weapons,
  armor,
  consumables,
  otherItems,
  technologyItems,
} from '../constants/gameData';

interface ItemsPageProps {
  items?: ItemColumn[];
}

const getDefaultIcon = (type: string) => {
  switch (type) {
    case '白兵':
    case '射撃':
    case '白兵/射撃':
      return GiSwordsPower;
    case '防具':
      return GiShield;
    case '消耗品':
      return GiHeartBottle;
    case 'その他':
      return GiBackpack;
    default:
      return GiBackpack;
  }
};

const getItemColor = (category: string) => {
  switch (category) {
    case '武器':
      return 'bg-red-50 border-red-200';
    case '防具':
      return 'bg-blue-50 border-blue-200';
    case '消耗品':
      return 'bg-green-50 border-green-200';
    case 'その他':
      return 'bg-purple-50 border-purple-200';
    case 'テクノロジー':
      return 'bg-orange-50 border-orange-200';
    default:
      return 'bg-gray-50 border-gray-200';
  }
};

export const ItemsPage: React.FC<ItemsPageProps> = ({ items = [] }) => {
  const allItems = [
    ...weapons.map((w) => ({ category: '武器', ...w })),
    ...armor.map((a) => ({ category: '防具', ...a })),
    ...consumables.map((c) => ({ category: '消耗品', ...c })),
    ...otherItems.map((o) => ({ category: 'その他', ...o })),
    ...technologyItems.map((t) => ({ category: 'テクノロジー', ...t })),
  ];

  const processedItems = items.map((item) => {
    const defaultItem = allItems.find((di) => di.name === item.name);
    const icon = defaultItem?.icon || getDefaultIcon(item.type);
    return {
      ...item,
      icon,
      details: item,
    };
  });
  const itemsByCategory = processedItems.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, typeof processedItems>,
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            アイテム一覧
          </h1>
          <p className="text-lg text-gray-600">
            Age of Hero TRPGで使用できるアイテムの詳細情報
          </p>
        </div>

        {Object.entries(itemsByCategory).map(([category, categoryItems]) => {
          const borderColor =
            {
              武器: 'border-red-500',
              防具: 'border-blue-500',
              消耗品: 'border-green-500',
              その他: 'border-purple-500',
              テクノロジー: 'border-orange-500',
            }[category] || 'border-gray-500';

          return (
            <section key={category} className="mb-12">
              <h2
                className={`text-3xl font-bold text-gray-800 mb-6 border-b-4 ${borderColor} pb-2`}
              >
                {category}
              </h2>
              {category === '消耗品' && (
                <p className="mb-4 text-gray-600">
                  「種別：消耗品」のアイテムは装備欄に関係なく複数個購入することができる。これらのアイテムは、ひとつにつき１シナリオで１回使用できる。
                </p>
              )}
              <div className="grid lg:grid-cols-2 gap-6">
                {categoryItems.map((item, index) => (
                  <ItemCard
                    key={index}
                    name={item.name}
                    icon={item.icon}
                    details={item.details}
                    color={getItemColor(category)}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
