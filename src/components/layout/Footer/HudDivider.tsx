import React from 'react';

interface HudDividerProps {
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}

export const HudDivider: React.FC<HudDividerProps> = ({
  orientation = 'vertical',
  className = '',
}) => {
  if (orientation === 'horizontal') {
    return (
      <div className={`relative w-full flex items-center justify-center my-4 ${className}`}>
        {/* Left gradient line */}
        <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#f59e0b]/40 to-[#f59e0b]/80" />
        
        {/* Center glowing diamond/node */}
        <div className="relative mx-3">
          <div className="w-2.5 h-2.5 rotate-45 bg-[#f59e0b] shadow-[0_0_10px_#f59e0b] animate-pulse" />
          <div className="absolute inset-0 rotate-45 border border-[#fbbf24] scale-150 opacity-60" />
        </div>

        {/* Right gradient line */}
        <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#f59e0b]/40 to-[#f59e0b]/80" />
      </div>
    );
  }

  return (
    <div className={`relative hidden md:flex flex-col items-center justify-center h-28 mx-6 lg:mx-10 ${className}`}>
      {/* Top vertical gradient line */}
      <div className="w-[1.5px] flex-1 bg-gradient-to-b from-transparent via-[#f59e0b]/40 to-[#f59e0b]/80" />
      
      {/* Center glowing diamond/node */}
      <div className="relative my-2">
        <div className="w-2.5 h-2.5 rotate-45 bg-[#f59e0b] shadow-[0_0_12px_#f59e0b] animate-pulse" />
        <div className="absolute inset-0 rotate-45 border border-[#fbbf24] scale-150 opacity-60" />
      </div>

      {/* Bottom vertical gradient line */}
      <div className="w-[1.5px] flex-1 bg-gradient-to-t from-transparent via-[#f59e0b]/40 to-[#f59e0b]/80" />
    </div>
  );
};
