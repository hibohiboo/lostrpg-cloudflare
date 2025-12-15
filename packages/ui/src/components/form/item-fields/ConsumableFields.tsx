import React from 'react';
import { FormField, InputField } from '../FormField';

interface ConsumableFieldsProps {
  quantity?: number;
  onUpdate: (field: string, value: number) => void;
}

export const ConsumableFields: React.FC<ConsumableFieldsProps> = ({
  quantity,
  onUpdate,
}) => (
  <FormField label="数量">
    <InputField
      type="number"
      min="1"
      value={quantity || 1}
      onChange={(value) => onUpdate('quantity', parseInt(value, 10) || 1)}
    />
  </FormField>
);