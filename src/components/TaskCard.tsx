// Task card component
import React from 'react';
import type { Task } from '../types';
import { formatDate, isOverdue } from '../utils/dateFormat';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onStatusChange: (taskId: string, status: Task['status']) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick, onStatusChange }) => {
  const priorityColors = {
    low: 'bg-blue-50 text-blue-700 border-blue-200',
    medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    high: 'bg-red-50 text-red-700 border-red-200',
  };

  const priorityIcons = {
    low: '⬇️',
    medium: '→',
    high: '⬆️',
  };

  const statusColors = {
    todo: 'bg-slate-50 border-slate-200',
    'in-progress': 'bg-blue-50 border-blue-200',
    done: 'bg-green-50 border-green-200',
  };

  const statusTextColors = {
    todo: 'text-slate-700',
    'in-progress': 'text-blue-700',
    done: 'text-green-700',
  };

  const overdue = isOverdue(task.due_date, task.status);

  return (
    <div className={`rounded-xl p-4 sm:p-5 border-2 transition-all duration-300 hover:shadow-md ${statusColors[task.status]}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 text-base sm:text-lg leading-snug">
            {task.title}
          </h4>
        </div>
        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap border ${priorityColors[task.priority]}`}>
          {priorityIcons[task.priority]} {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      <div className="flex items-center gap-2 mb-3 text-sm font-medium">
        <span>📅</span>
        <span className={overdue && task.status !== 'done' ? 'text-red-600 font-bold' : 'text-gray-600'}>
          {formatDate(task.due_date)}
        </span>
        {overdue && task.status !== 'done' && (
          <span className="text-red-600 text-xs font-bold">⚠️ Overdue</span>
        )}
      </div>

      {task.assignedUsers.length > 0 && (
        <div className="flex gap-1.5 mb-4">
          {task.assignedUsers.map(user => (
            <div
              key={user.id}
              title={user.name}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-indigo-100 flex items-center justify-center text-lg font-semibold hover:scale-110 transition-transform"
            >
              {user.avatar}
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as Task['status'])}
          onClick={(e) => e.stopPropagation()}
          className={`flex-1 min-w-[120px] px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg border-2 cursor-pointer transition-colors ${statusTextColors[task.status]} border-gray-300 hover:border-gray-400`}
        >
          <option value="todo">📋 Todo</option>
          <option value="in-progress">⏳ In Progress</option>
          <option value="done">✓ Done</option>
        </select>
        <button
          onClick={onClick}
          className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
        >
          ✏️ Edit
        </button>
      </div>
    </div>
  );
};
