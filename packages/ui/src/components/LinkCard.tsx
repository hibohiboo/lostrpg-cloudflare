import React from 'react';
import { Link } from 'react-router';

export interface LinkCardProps {
  title: string;
  description?: string;
  href: string;
  buttonText: string;
  color?: 'blue' | 'green' | 'purple' | 'red' | 'orange' | 'yellow' | 'teal';
  className?: string;
}

export const LinkCard: React.FC<LinkCardProps> = ({
  title,
  description,
  href,
  buttonText,
  color = 'blue',
  className = '',
}) => {
  const colorClasses = {
    blue: {
      title: 'text-blue-700',
      button: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
    green: {
      title: 'text-emerald-700',
      button: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    },
    purple: {
      title: 'text-purple-700',
      button: 'bg-purple-600 hover:bg-purple-700 text-white',
    },
    red: {
      title: 'text-red-700',
      button: 'bg-red-600 hover:bg-red-700 text-white',
    },
    orange: {
      title: 'text-orange-700',
      button: 'bg-orange-600 hover:bg-orange-700 text-white',
    },
    yellow: {
      title: 'text-amber-700',
      button: 'bg-amber-600 hover:bg-amber-700 text-white',
    },
    teal: {
      title: 'text-teal-700',
      button: 'bg-teal-600 hover:bg-teal-700 text-white',
    },
  };

  const colors = colorClasses[color];

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md hover:border-gray-300 transition-all duration-300 ${className}`}
    >
      <h3
        className={`text-lg sm:text-xl font-semibold mb-3 sm:mb-4 break-words ${colors.title}`}
      >
        {title}
      </h3>
      {description && (
        <p className="text-gray-600 mb-4 text-sm sm:text-base leading-relaxed">
          {description}
        </p>
      )}
      <Link
        to={href}
        className={`inline-block px-4 py-2 rounded transition-colors text-sm sm:text-base w-full sm:w-auto text-center font-medium ${colors.button}`}
      >
        {buttonText}
      </Link>
    </div>
  );
};
