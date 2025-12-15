import React from 'react';
import { FormField, InputField } from '../FormField';

interface WeaponFieldsProps {
  skill?: string;
  modifier?: string;
  attackPower?: string;
  guardValue?: string;
  range?: string;
  onUpdate: (field: string, value: string) => void;
}

export const WeaponFields: React.FC<WeaponFieldsProps> = ({
  skill,
  modifier,
  attackPower,
  guardValue,
  range,
  onUpdate,
}) => (
  <>
    <FormField label="技能">
      <InputField
        value={skill || ''}
        onChange={(value) => onUpdate('skill', value)}
        placeholder="〈パワー〉"
      />
    </FormField>

    <FormField label="修正">
      <InputField
        value={modifier || ''}
        onChange={(value) => onUpdate('modifier', value)}
        placeholder="＋０％"
      />
    </FormField>

    <FormField label="攻撃力">
      <InputField
        value={attackPower || ''}
        onChange={(value) => onUpdate('attackPower', value)}
        placeholder="＋４"
      />
    </FormField>

    <FormField label="ガード値">
      <InputField
        value={guardValue || ''}
        onChange={(value) => onUpdate('guardValue', value)}
        placeholder="３"
      />
    </FormField>

    <FormField label="射程">
      <InputField
        value={range || ''}
        onChange={(value) => onUpdate('range', value)}
        placeholder="至近"
      />
    </FormField>
  </>
);