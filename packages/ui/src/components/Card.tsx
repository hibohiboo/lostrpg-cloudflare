import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'hover';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'hover',
}) => {
  const baseClasses =
    'bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6 text-gray-900';
  const variantClasses =
    variant === 'hover'
      ? 'hover:shadow-md hover:border-gray-300 transition-all duration-300'
      : '';

  return (
    <div className={`${baseClasses} ${variantClasses} ${className}`}>
      {children}
    </div>
  );
};
