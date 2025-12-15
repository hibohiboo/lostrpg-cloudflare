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
      title: 'text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700',
    },
    green: {
      title: 'text-green-600',
      button: 'bg-green-600 hover:bg-green-700',
    },
    purple: {
      title: 'text-purple-600',
      button: 'bg-purple-600 hover:bg-purple-700',
    },
    red: {
      title: 'text-red-600',
      button: 'bg-red-600 hover:bg-red-700',
    },
    orange: {
      title: 'text-orange-600',
      button: 'bg-orange-600 hover:bg-orange-700',
    },
    yellow: {
      title: 'text-yellow-600',
      button: 'bg-yellow-600 hover:bg-yellow-700',
    },
    teal: {
      title: 'text-teal-600',
      button: 'bg-teal-600 hover:bg-teal-700',
    },
  };

  const colors = colorClasses[color];

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow ${className}`}
    >
      <h3
        className={`text-lg sm:text-xl font-semibold mb-3 sm:mb-4 break-words ${colors.title}`}
      >
        {title}
      </h3>
      {description && (
        <p className="text-gray-600 mb-4 text-sm sm:text-base">{description}</p>
      )}
      <Link
        to={href}
        className={`inline-block text-white px-4 py-2 rounded transition-colors text-sm sm:text-base w-full sm:w-auto text-center ${colors.button}`}
      >
        {buttonText}
      </Link>
    </div>
  );
};
