import React from 'react';

interface UserProfileIconProps {
  fullName: string | null;
}

export function UserProfileIcon({ fullName }: UserProfileIconProps) {
  const getInitials = (name: string | null): string => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div 
      className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center"
      aria-label={`Profile icon for ${fullName || 'user'}`}
    >
      <span className="text-purple-700 font-semibold text-sm">
        {getInitials(fullName)}
      </span>
    </div>
  );
}