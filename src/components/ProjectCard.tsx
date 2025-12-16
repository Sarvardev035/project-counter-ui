// Project card component
import React from 'react';
import type { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  taskCount: number;
  onClick: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, taskCount, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="card p-6 sm:p-8 text-left block w-full hover:-translate-y-1 transform transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
          {project.name}
        </h3>
        <span className="text-2xl group-hover:scale-110 transition-transform">📁</span>
      </div>
      
      {project.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {project.description}
        </p>
      )}
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-xl">✓</span>
          <span className="text-sm font-semibold text-gray-600">
            {taskCount} task{taskCount !== 1 ? 's' : ''}
          </span>
        </div>
        <span className="text-indigo-600 font-semibold group-hover:translate-x-1 transition-transform">
          →
        </span>
      </div>
    </button>
  );
};
