// Loading skeleton
import React from 'react';

export const LoadingSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-28 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-xl"></div>
        </div>
      ))}
    </div>
  );
};

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="animate-spin rounded-full h-14 w-14 border-4 border-gray-200 border-t-indigo-600"></div>
      <p className="text-gray-500 font-medium mt-4">Loading...</p>
    </div>
  );
};
