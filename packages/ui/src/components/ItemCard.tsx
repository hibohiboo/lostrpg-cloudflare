import React from 'react';
import { IconType } from 'react-icons';
import { ItemDetailField } from './ItemDetailField';

export interface ItemDetails {
  type: string;
  skill?: string;
  modifier?: string;
  attackPower?: string;
  guardValue?: string;
  range?: string;
  dodge?: string; // 防具用
  actionValue?: string; // 防具用
  protection?: string; // 防具用 - 防護点
  price: number;
  effect?: string;
}

export interface ItemCardProps {
  name: string;
  icon: IconType;
  details: ItemDetails;
  color?: string;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  name,
  icon: Icon,
  details,
  color = 'bg-gray-50 border-gray-200',
}) => (
  <div className={`p-6 ${color} rounded-lg border-2`}>
    <div className="flex items-center gap-3 mb-4">
      <Icon size={28} className="text-gray-700" />
      <h3 className="text-xl font-bold text-gray-800">{name}</h3>
    </div>

    <div className="space-y-3">
      <div className="grid md:grid-cols-2 gap-4">
        <ItemDetailField label="種別" value={details.type} />
        <ItemDetailField label="技能" value={details.skill} />
        <ItemDetailField label="修正" value={details.modifier} />
        <ItemDetailField label="攻撃力" value={details.attackPower} />
        <ItemDetailField label="ガード値" value={details.guardValue} />
        <ItemDetailField label="射程" value={details.range} />
        <ItemDetailField label="ドッジ" value={details.dodge} />
        <ItemDetailField label="行動値" value={details.actionValue} />
        <ItemDetailField label="防護点" value={details.protection} />
        <ItemDetailField label="価格" value={details.price} />
      </div>

      {details.effect && (
        <div className="p-4 bg-white rounded border border-gray-200">
          <h5 className="text-sm font-medium text-gray-600 mb-2">効果：</h5>
          <p className="text-sm text-gray-800 leading-relaxed">
            {details.effect}
          </p>
        </div>
      )}
    </div>
  </div>
);
