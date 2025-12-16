// Header/Navigation component
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title?: string;
  backButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, backButton = false }) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            {backButton && (
              <button
                onClick={() => navigate(-1)}
                className="text-gray-600 hover:text-indigo-600 text-2xl sm:text-3xl transition-colors duration-200"
              >
                ←
              </button>
            )}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-2xl sm:text-3xl">📋</div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                {title || 'Task Manager'}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
