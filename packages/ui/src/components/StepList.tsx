import React from 'react';

export interface StepItem {
  number: number;
  title: string;
  description?: string;
}

export interface StepListProps {
  steps: StepItem[];
}

export const StepList: React.FC<StepListProps> = ({ steps }) => (
    <div className="grid gap-4 sm:gap-6">
      {steps.map((step) => (
        <div 
          key={step.number} 
          className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
            {step.number}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">{step.title}</h3>
            {step.description && (
              <p className="text-gray-600 text-sm">{step.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );