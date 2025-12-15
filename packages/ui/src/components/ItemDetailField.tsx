import React from 'react';

interface ItemDetailFieldProps {
  label: string;
  value?: string | number;
}

export const ItemDetailField: React.FC<ItemDetailFieldProps> = ({
  label,
  value,
}) => {
  if (!value && value !== 0) {
    return null;
  }

  return (
    <div className="p-3 bg-white rounded border border-gray-200">
      <span className="text-sm font-medium text-gray-600">{label}：</span>
      <span className="text-sm text-gray-800">{value}</span>
    </div>
  );
};
