import React from 'react';

interface HighwayDividerProps {
  className?: string;
  variant?: 'amber' | 'subtle';
}

export const HighwayDivider: React.FC<HighwayDividerProps> = ({
  className = '',
  variant = 'amber',
}) => {
  return (
    <div
      aria-hidden="true"
      className={`w-full flex items-center justify-center my-4 overflow-hidden select-none ${className}`}
    >
      <div
        className={`w-full border-t-2 border-dashed ${
          variant === 'amber' ? 'border-[#884e00]/30' : 'border-[#d9c3b1]/50'
        }`}
      />
    </div>
  );
};
