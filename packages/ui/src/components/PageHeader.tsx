import React from 'react';

export interface PageHeaderProps {
  title: string;
  description?: string;
  centered?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  description, 
  centered = false 
}) => {
  const containerClasses = centered ? 'text-center mb-8' : 'mb-8';
  
  return (
    <header className={containerClasses}>
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 break-words">
        {title}
      </h1>
      {centered && (
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-6"></div>
      )}
      {description && (
        <p className={`text-lg text-gray-600 leading-relaxed ${
          centered ? 'max-w-2xl mx-auto' : ''
        }`}>
          {description}
        </p>
      )}
    </header>
  );
};