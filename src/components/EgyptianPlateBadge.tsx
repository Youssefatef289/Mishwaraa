import React from 'react';

interface EgyptianPlateBadgeProps {
  letters?: string;
  numbers?: string;
  variant?: 'white' | 'dark' | 'amber' | 'compact';
  statusText?: string;
  statusColor?: 'tertiary' | 'primary' | 'secondary' | 'neutral';
  className?: string;
}

export const EgyptianPlateBadge: React.FC<EgyptianPlateBadgeProps> = ({
  letters = 'س ج د',
  numbers = '9418',
  variant = 'white',
  statusText,
  statusColor = 'tertiary',
  className = '',
}) => {
  return (
    <div
      className={`relative inline-flex items-center gap-2 px-3 py-1 rounded border border-[#d9c3b1] shadow-xs select-none ${
        variant === 'dark'
          ? 'bg-[#14171C] text-white'
          : variant === 'amber'
          ? 'bg-[#ffdcbf]/40 text-[#2d1600]'
          : 'bg-[#ffffff] text-[#121c28]'
      } ${className}`}
    >
      {/* 4 Simulated Corner Screws */}
      <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#867465]/60 pointer-events-none" />
      <span className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-[#867465]/60 pointer-events-none" />
      <span className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-[#867465]/60 pointer-events-none" />
      <span className="absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full bg-[#867465]/60 pointer-events-none" />

      {/* Egypt Label Strip */}
      <span className="bg-[#a4f0ef]/60 text-[#0f6969] px-1 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase font-mono-numeric">
        مصر EGY
      </span>

      {/* Letters and Numbers */}
      <div className="flex items-center gap-2 font-mono-numeric font-bold text-sm tracking-widest border-r border-[#d9c3b1]/70 pr-2">
        <span className="font-sans font-bold text-sm">{letters}</span>
        <span className="text-[#884e00] font-mono-numeric font-bold text-base">{numbers}</span>
      </div>

      {/* Optional Status Pill */}
      {statusText && (
        <span
          className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
            statusColor === 'tertiary'
              ? 'bg-[#9ff5c1]/40 text-[#056a41]'
              : statusColor === 'primary'
              ? 'bg-[#ffdcbf] text-[#884e00]'
              : statusColor === 'secondary'
              ? 'bg-[#a4f0ef]/60 text-[#0f6969]'
              : 'bg-[#e5efff] text-[#534437]'
          }`}
        >
          {statusText}
        </span>
      )}
    </div>
  );
};
