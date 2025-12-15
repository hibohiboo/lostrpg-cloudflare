/* eslint-disable complexity */
import React from 'react';
import { FaTrash } from 'react-icons/fa';

import { Button } from './Button';
import { FormField, InputField, SelectField, TextAreaField } from './FormField';
import { ArmorFields } from './item-fields/ArmorFields';
import { ConsumableFields } from './item-fields/ConsumableFields';
import { WeaponFields } from './item-fields/WeaponFields';

export interface ItemFormField {
  name: string;
  type: string;
  skill?: string;
  modifier?: string;
  attackPower?: string;
  guardValue?: string;
  range?: string;
  dodge?: string;
  actionValue?: string;
  protection?: string;
  price: number;
  effect?: string;
  quantity?: number;
}
export type ItemColumn = {
  category: string;
  name: string;
  type: string;
  skill?: string;
  modifier?: string;
  attackPower?: string;
  guardValue?: string;
  range?: string;
  dodge?: string;
  actionValue?: string;
  protection?: string;
  price: number;
  effect?: string;
};
interface ItemFormProps {
  item: ItemFormField;
  index: number;
  onUpdate: (
    index: number,
    field: keyof ItemFormField,
    value: string | number,
  ) => void;
  onRemove: (index: number) => void;
  presetItems?: Array<ItemColumn>;
}
const ITEM_TYPES = [
  { label: '白兵', value: '白兵' },
  { label: '射撃', value: '射撃' },
  { label: '白兵/射撃', value: '白兵/射撃' },
  { label: '防具', value: '防具' },
  { label: '消耗品', value: '消耗品' },
  { label: 'その他', value: 'その他' },
];

export const ItemForm: React.FC<ItemFormProps> = ({
  item,
  index,
  onUpdate,
  onRemove,
  presetItems = [],
}) => {
  const isWeapon =
    item.type === '白兵' || item.type === '射撃' || item.type === '白兵/射撃';
  const isArmor = item.type === '防具';
  const isConsumable = item.type === '消耗品';
  const handlePresetSelect = (value: string) => {
    const preset = presetItems.find((p) => p.name === value);
    if (!preset) return;

    const fields: Partial<ItemFormField> = {
      name: preset.name,
      type: preset.type,
      skill: preset.skill,
      modifier: preset.modifier,
      attackPower: preset.attackPower,
      guardValue: preset.guardValue,
      range: preset.range,
      dodge: preset.dodge,
      actionValue: preset.actionValue,
      protection: preset.protection,
      price: preset.price ?? 0,
      effect: preset.effect,
    };

    (Object.keys(fields) as (keyof ItemFormField)[]).forEach((key) =>
      onUpdate(index, key, fields[key] ?? ''),
    );
  };
  return (
    <div className="p-4 border border-gray-200 rounded-md">
      <div className="mb-4">
        {/* ▼ プリセット選択ドロップダウン */}
        <FormField label="選択">
          <SelectField
            value=""
            options={[
              { label: '', value: '' },
              ...presetItems.map((p) => ({
                label: `[${p.category}] ${p.name}`,
                value: p.name,
              })),
            ]}
            onChange={handlePresetSelect}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="アイテム名">
          <InputField
            value={item.name}
            onChange={(value) => onUpdate(index, 'name', value)}
          />
        </FormField>

        <FormField label="種別">
          <SelectField
            value={item.type}
            onChange={(value) => onUpdate(index, 'type', value)}
            options={ITEM_TYPES}
          />
        </FormField>

        {/* 武器用フィールド */}
        {isWeapon && (
          <WeaponFields
            skill={item.skill}
            modifier={item.modifier}
            attackPower={item.attackPower}
            guardValue={item.guardValue}
            range={item.range}
            onUpdate={(field, value) =>
              onUpdate(index, field as keyof ItemFormField, value)
            }
          />
        )}

        {/* 防具用フィールド */}
        {isArmor && (
          <ArmorFields
            dodge={item.dodge}
            actionValue={item.actionValue}
            protection={item.protection}
            onUpdate={(field, value) =>
              onUpdate(index, field as keyof ItemFormField, value)
            }
          />
        )}

        <FormField label="価格">
          <InputField
            type="number"
            min="0"
            value={item.price}
            onChange={(value) =>
              onUpdate(index, 'price', parseInt(value, 10) || 0)
            }
          />
        </FormField>

        {/* 消耗品用数量フィールド */}
        {isConsumable && (
          <ConsumableFields
            quantity={item.quantity}
            onUpdate={(field, value) =>
              onUpdate(index, field as keyof ItemFormField, value)
            }
          />
        )}

        <FormField label="効果" className="md:col-span-2">
          <TextAreaField
            value={item.effect || ''}
            onChange={(value) => onUpdate(index, 'effect', value)}
            placeholder="アイテムの効果説明"
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
