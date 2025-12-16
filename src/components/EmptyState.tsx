// Empty state component
import React from 'react';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => {
  return (
    <div className="text-center py-16 sm:py-20 px-4">
      <div className="text-7xl sm:text-8xl mb-6 opacity-80">{icon}</div>
      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
        {title}
      </h3>
      <p className="text-gray-600 text-base sm:text-lg mb-8 max-w-md mx-auto">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="btn-primary inline-block"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
