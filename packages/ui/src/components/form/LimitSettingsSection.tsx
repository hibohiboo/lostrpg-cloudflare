import React from 'react';
import { FormField, InputField } from './FormField';

interface LimitSettingsSectionProps {
  skillPointsLimit: number;
  heroSkillLevelLimit: number;
  itemPriceLimit: number;
  onUpdate: (field: string, value: number) => void;
}

export const LimitSettingsSection: React.FC<LimitSettingsSectionProps> = ({
  skillPointsLimit,
  heroSkillLevelLimit,
  itemPriceLimit,
  onUpdate,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <FormField label="技能ポイント上限" htmlFor="skillPointsLimit">
      <InputField
        type="number"
        min="0"
        max="1000"
        value={skillPointsLimit}
        onChange={(value) =>
          onUpdate('skillPointsLimit', parseInt(value, 10) || 150)
        }
      />
    </FormField>

    <FormField label="ヒーロースキルレベル上限" htmlFor="heroSkillLevelLimit">
      <InputField
        type="number"
        min="0"
        max="50"
        value={heroSkillLevelLimit}
        onChange={(value) =>
          onUpdate('heroSkillLevelLimit', parseInt(value, 10) || 7)
        }
      />
    </FormField>

    <FormField label="アイテム価格上限" htmlFor="itemPriceLimit">
      <InputField
        type="number"
        min="0"
        max="1000"
        value={itemPriceLimit}
        onChange={(value) =>
          onUpdate('itemPriceLimit', parseInt(value, 10) || 20)
        }
      />
    </FormField>
  </div>
);
