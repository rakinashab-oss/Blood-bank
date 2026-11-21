import React from 'react';
import { BloodGroup } from '../types';

interface BloodGroupBadgeProps {
  group: BloodGroup;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BloodGroupBadge: React.FC<BloodGroupBadgeProps> = ({
  group,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 font-bold',
    md: 'text-sm px-2.5 py-1 font-bold',
    lg: 'text-base px-3.5 py-1.5 font-extrabold',
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-md bg-blood-50 text-blood-700 border border-blood-200 tracking-wide font-mono ${sizeClasses[size]} ${className}`}
    >
      {group}
    </span>
  );
};
