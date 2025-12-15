import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'hover';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  variant = 'hover' 
}) => {
  const baseClasses = 'bg-white rounded-lg shadow-md p-4 sm:p-6';
  const variantClasses = variant === 'hover' 
    ? 'hover:shadow-lg transition-shadow' 
    : '';
  
  return (
    <div className={`${baseClasses} ${variantClasses} ${className}`}>
      {children}
    </div>
  );
};