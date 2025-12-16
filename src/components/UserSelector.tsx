// User selector component
import React, { useState } from 'react';
import type { User } from '../types';

interface UserSelectorProps {
  users: User[];
  selectedUsers: User[];
  onChange: (users: User[]) => void;
}

export const UserSelector: React.FC<UserSelectorProps> = ({ users, selectedUsers, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleUser = (user: User) => {
    const isSelected = selectedUsers.some(u => u.id === user.id);
    if (isSelected) {
      onChange(selectedUsers.filter(u => u.id !== user.id));
    } else {
      onChange([...selectedUsers, user]);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="input-field text-left flex items-center justify-between bg-white"
      >
        {selectedUsers.length === 0 ? (
          <span className="text-gray-500">Select users to assign...</span>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {selectedUsers.map(user => (
              <span key={user.id} className="bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-lg text-xs font-semibold">
                {user.name}
              </span>
            ))}
          </div>
        )}
        <span className="text-gray-400">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-300 rounded-xl shadow-xl z-10">
          <div className="max-h-60 overflow-y-auto">
            {users.map((user, idx) => (
              <label
                key={user.id}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 cursor-pointer transition-colors ${idx !== users.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={selectedUsers.some(u => u.id === user.id)}
                  onChange={() => toggleUser(user)}
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 cursor-pointer"
                />
                <div className="flex-1 text-sm font-medium text-gray-700">
                  {user.name}
                </div>
                <span className="text-base">{user.avatar}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
