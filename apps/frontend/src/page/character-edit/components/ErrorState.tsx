import React from 'react';

interface ErrorStateProps {
  error: string;
  onNavigateToList: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  onNavigateToList,
}) => (
  <div className="container mx-auto px-4 py-8">
    <div className="text-center py-12">
      <div className="text-red-600 mb-4">
        <svg
          className="w-16 h-16 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <p className="text-red-600 mb-4">{error}</p>
      <button
        onClick={onNavigateToList}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        キャラクター一覧に戻る
      </button>
    </div>
  </div>
);
