import React from 'react';

export interface SectionProps {
  title: string;
  children: React.ReactNode;
  step?: number;
  icon?: string;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({
  title,
  children,
  step,
  icon,
  className = '',
}) => {
  const getStepColor = (stepNumber: number) => {
    const colors = [
      'bg-blue-100 text-blue-800 ring-1 ring-blue-200',
      'bg-purple-100 text-purple-800 ring-1 ring-purple-200',
      'bg-green-100 text-green-800 ring-1 ring-green-200',
      'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200',
      'bg-orange-100 text-orange-800 ring-1 ring-orange-200',
      'bg-pink-100 text-pink-800 ring-1 ring-pink-200',
      'bg-red-100 text-red-800 ring-1 ring-red-200',
      'bg-teal-100 text-teal-800 ring-1 ring-teal-200',
      'bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200',
    ];
    return colors[(stepNumber - 1) % colors.length];
  };

  return (
    <section
      className={`bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8 ${className}`}
    >
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6 flex items-center font-serif tracking-wide border-b border-gray-100 pb-2">
        {step && (
          <span
            className={`${getStepColor(step)} rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3`}
          >
            {step}
          </span>
        )}
        {icon && !step && (
          <span className="bg-slate-100 text-slate-600 ring-1 ring-slate-200 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
            {icon}
          </span>
        )}
        {title}
      </h2>
      <div className="text-gray-700">{children}</div>
    </section>
  );
};
