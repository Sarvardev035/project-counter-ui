// Notification component
import React from 'react';
import type { Notification } from '../types';

interface NotificationItemProps {
  notification: Notification;
  onClose: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClose }) => {
  const baseClasses = 'px-5 py-3.5 rounded-xl shadow-xl flex items-center justify-between gap-3 animate-slide-in border';
  const typeClasses = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  };

  const bgIcons = {
    success: 'bg-green-100',
    error: 'bg-red-100',
    info: 'bg-blue-100',
  };

  return (
    <div className={`${baseClasses} ${typeClasses[notification.type]}`}>
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full ${bgIcons[notification.type]} flex items-center justify-center font-bold text-lg`}>
          {icons[notification.type]}
        </div>
        <span className="font-medium text-sm sm:text-base">{notification.message}</span>
      </div>
      <button
        onClick={onClose}
        className="text-xl leading-none hover:opacity-60 flex-shrink-0"
      >
        ×
      </button>
    </div>
  );
};

interface NotificationContainerProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({ notifications, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 space-y-3 z-50 max-w-md px-4">
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={() => onRemove(notification.id)}
        />
      ))}
    </div>
  );
};
