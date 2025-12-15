import React from 'react';
import { FormField, InputField } from '../FormField';

interface ArmorFieldsProps {
  dodge?: string;
  actionValue?: string;
  protection?: string;
  onUpdate: (field: string, value: string) => void;
}

export const ArmorFields: React.FC<ArmorFieldsProps> = ({
  dodge,
  actionValue,
  protection,
  onUpdate,
}) => (
  <>
    <FormField label="ドッジ">
      <InputField
        value={dodge || ''}
        onChange={(value) => onUpdate('dodge', value)}
        placeholder="＋０％"
      />
    </FormField>

    <FormField label="行動値">
      <InputField
        value={actionValue || ''}
        onChange={(value) => onUpdate('actionValue', value)}
        placeholder="＋０"
      />
    </FormField>

    <FormField label="防護点">
      <InputField
        value={protection || ''}
        onChange={(value) => onUpdate('protection', value)}
        placeholder="５"
      />
    </FormField>
  </>
);