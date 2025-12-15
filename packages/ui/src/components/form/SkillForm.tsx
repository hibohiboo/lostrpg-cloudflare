import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { Button } from './Button';
import { FormField, InputField, SelectField, TextAreaField } from './FormField';

interface SkillFormField {
  name: string;
  level: number;
  timing: string;
  skill: string;
  target: string;
  range: string;
  cost: string;
  effect: string;
}

export interface ExternalSkill {
  name: string;
  maxLv: number;
  timing: string;
  skill: string;
  target: string;
  range: string;
  cost: string;
  effect: string;
  class: string;
}

interface SkillFormProps {
  skill: SkillFormField;
  index: number;
  onUpdate: (index: number, field: keyof SkillFormField, value: string) => void;
  onRemove: (index: number) => void;
  nameLabel?: string;
  selectedClasses: string[];
  externalSkills?: ExternalSkill[];
}

export const SkillForm: React.FC<SkillFormProps> = ({
  skill,
  index,
  onUpdate,
  onRemove,
  nameLabel = 'スキル名',
  selectedClasses = [],
  externalSkills = [],
}) => {
  const updateAllFieldsFromExternal = (preset: ExternalSkill) => {
    onUpdate(index, 'name', preset.name);
    onUpdate(index, 'timing', preset.timing);
    onUpdate(index, 'skill', preset.skill);
    onUpdate(index, 'target', preset.target);
    onUpdate(index, 'range', preset.range);
    onUpdate(index, 'cost', preset.cost);
    onUpdate(index, 'effect', preset.effect);
  };

  const createPresetHandler =
    (classSkills: ExternalSkill[]) => (value: string) => {
      const preset = classSkills.find((s) => s.name === value);
      if (preset) updateAllFieldsFromExternal(preset);
    };

  const getSkillsByClass = (className: string) =>
    externalSkills.filter((s) => s.class === className);

  return (
    <div className="p-4 border border-gray-200 rounded-md">
      <div className="mb-4 space-y-4">
        {[...new Set(selectedClasses)].map((className) => {
          const classSkills = getSkillsByClass(className);
          if (classSkills.length === 0) return null;

          return (
            <FormField key={className} label={`${className}スキル選択`}>
              <SelectField
                value=""
                options={[
                  { label: '', value: '' },
                  ...classSkills.map((s) => ({
                    label: s.name,
                    value: s.name,
                  })),
                ]}
                onChange={createPresetHandler(classSkills)}
              />
            </FormField>
          );
        })}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label={nameLabel}>
          <InputField
            value={skill.name}
            onChange={(value) => onUpdate(index, 'name', value)}
          />
        </FormField>

        <FormField label="レベル">
          <InputField
            type="number"
            min="1"
            value={skill.level}
            onChange={(value) => onUpdate(index, 'level', value)}
          />
        </FormField>

        <FormField label="タイミング">
          <InputField
            value={skill.timing}
            onChange={(value) => onUpdate(index, 'timing', value)}
          />
        </FormField>

        <FormField label="対応技能">
          <InputField
            value={skill.skill}
            onChange={(value) => onUpdate(index, 'skill', value)}
          />
        </FormField>

        <FormField label="対象">
          <InputField
            value={skill.target}
            onChange={(value) => onUpdate(index, 'target', value)}
          />
        </FormField>

        <FormField label="射程">
          <InputField
            value={skill.range}
            onChange={(value) => onUpdate(index, 'range', value)}
          />
        </FormField>

        <FormField label="コスト">
          <InputField
            value={skill.cost}
            onChange={(value) => onUpdate(index, 'cost', value)}
          />
        </FormField>

        <FormField label="効果" className="md:col-span-2">
          <TextAreaField
            value={skill.effect}
            onChange={(value) => onUpdate(index, 'effect', value)}
          />
        </FormField>
      </div>

      <div className="mt-2">
        <Button onClick={() => onRemove(index)} variant="danger" size="sm">
          <FaTrash size={12} />
          削除
        </Button>
      </div>
    </div>
  );
};
