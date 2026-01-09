import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { ChevronDown, X, User as UserIcon } from 'lucide-react';

interface UserSelectorProps {
  users: User[];
  selectedUserIds: string[];
  onSelect: (userId: string) => void;
  onRemove?: (userId: string) => void;
  mode: 'single' | 'multiple';
  placeholder?: string;
  disabled?: boolean;
  label?: string;
}

export const UserSelector: React.FC<UserSelectorProps> = ({
  users,
  selectedUserIds,
  onSelect,
  onRemove,
  mode,
  placeholder = 'Select user...',
  disabled = false,
  label
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter users based on search and already selected
  const availableUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const notSelected = mode === 'multiple' ? !selectedUserIds.includes(user.id) : true;
    return matchesSearch && notSelected;
  });

  const selectedUsers = users.filter(user => selectedUserIds.includes(user.id));

  const handleSelect = (userId: string) => {
    onSelect(userId);
    setSearchTerm('');
    if (mode === 'single') {
      setIsOpen(false);
    }
  };

  const handleRemove = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(userId);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-bold text-text-main mb-2">
          {label}
        </label>
      )}

      {/* Selected users display (for single mode) */}
      {mode === 'single' && selectedUsers.length > 0 ? (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <img
              src={selectedUsers[0].avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUsers[0].name)}&background=random`}
              alt={selectedUsers[0].name}
              className="size-8 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-bold text-text-main">{selectedUsers[0].name}</p>
              <p className="text-xs text-text-muted">{selectedUsers[0].role}</p>
            </div>
          </div>
          {!disabled && onRemove && (
            <button
              onClick={(e) => handleRemove(selectedUsers[0].id, e)}
              className="text-gray-400 hover:text-red-600 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      ) : null}

      {/* Dropdown trigger */}
      {(mode === 'multiple' || selectedUsers.length === 0) && (
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
            disabled
              ? 'bg-gray-100 border-gray-200 cursor-not-allowed'
              : 'bg-white border-gray-200 hover:border-primary cursor-pointer'
          }`}
        >
          <span className={`text-sm ${selectedUsers.length === 0 ? 'text-gray-400' : 'text-text-main font-medium'}`}>
            {mode === 'single' && selectedUsers.length === 0 ? placeholder :
             mode === 'multiple' && selectedUsers.length > 0 ? `${selectedUsers.length} selected` :
             placeholder}
          </span>
          <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      )}

      {/* Dropdown menu */}
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-gray-100">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              autoFocus
            />
          </div>

          {/* User list */}
          <div className="max-h-48 overflow-y-auto">
            {availableUsers.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-400">
                {searchTerm ? 'No users found' : 'No available users'}
              </div>
            ) : (
              availableUsers.map(user => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleSelect(user.id)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                    alt={user.name}
                    className="size-8 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-text-main truncate">{user.name}</p>
                    <p className="text-xs text-text-muted truncate">{user.email}</p>
                  </div>
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                    {user.role}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
