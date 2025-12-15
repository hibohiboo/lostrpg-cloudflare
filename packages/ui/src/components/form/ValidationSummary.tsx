import React from 'react';

interface ValidationSummaryProps {
  label: string;
  current: number;
  limit: number;
  unit?: string;
}

export const ValidationSummary: React.FC<ValidationSummaryProps> = ({
  label,
  current,
  limit,
  unit = '',
}) => {
  const isOverLimit = current > limit;

  return (
    <div className={`text-sm ${isOverLimit ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
      {label}: {current}{unit} / {limit}{unit}
      {isOverLimit && (
        <span className="ml-2">⚠️ 上限を超えています</span>
      )}
    </div>
  );
};