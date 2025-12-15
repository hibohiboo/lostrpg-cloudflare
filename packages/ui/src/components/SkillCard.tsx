import React from 'react';
import { IconType } from 'react-icons';

export interface SkillDetails {
  maxLv: number;
  timing: string;
  skill: string;
  target: string;
  range: string;
  cost: string;
  effect: string;
}

export interface SkillCardProps {
  name: string;
  icon: IconType;
  details: SkillDetails;
  color?: string;
}

export const SkillCard: React.FC<SkillCardProps> = ({
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
        <div className="p-3 bg-white rounded border border-gray-200">
          <span className="text-sm font-medium text-gray-600">最大Ｌｖ：</span>
          <span className="text-sm text-gray-800">{details.maxLv}</span>
        </div>
        <div className="p-3 bg-white rounded border border-gray-200">
          <span className="text-sm font-medium text-gray-600">
            タイミング：
          </span>
          <span className="text-sm text-gray-800">{details.timing}</span>
        </div>
        <div className="p-3 bg-white rounded border border-gray-200">
          <span className="text-sm font-medium text-gray-600">技能：</span>
          <span className="text-sm text-gray-800">{details.skill}</span>
        </div>
        <div className="p-3 bg-white rounded border border-gray-200">
          <span className="text-sm font-medium text-gray-600">対象：</span>
          <span className="text-sm text-gray-800">{details.target}</span>
        </div>
        <div className="p-3 bg-white rounded border border-gray-200">
          <span className="text-sm font-medium text-gray-600">射程：</span>
          <span className="text-sm text-gray-800">{details.range}</span>
        </div>
        <div className="p-3 bg-white rounded border border-gray-200">
          <span className="text-sm font-medium text-gray-600">コスト：</span>
          <span className="text-sm text-gray-800">{details.cost}</span>
        </div>
      </div>

      <div className="p-4 bg-white rounded border border-gray-200">
        <h5 className="text-sm font-medium text-gray-600 mb-2">効果：</h5>
        <p className="text-sm text-gray-800 leading-relaxed">
          {details.effect}
        </p>
      </div>
    </div>
  </div>
);
