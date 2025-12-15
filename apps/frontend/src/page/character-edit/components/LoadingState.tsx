import React from 'react';

export const LoadingState: React.FC = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="text-center py-12">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
      <p className="mt-2 text-gray-600">読み込み中...</p>
    </div>
  </div>
);
