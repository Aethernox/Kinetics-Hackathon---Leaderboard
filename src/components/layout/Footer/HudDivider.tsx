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
        <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </div>
    );
  }

  return (
    <div className={`relative hidden lg:flex flex-col items-center justify-center h-24 mx-6 lg:mx-8 ${className}`}>
      <div className="w-[1px] flex-1 bg-gradient-to-b from-transparent via-white/15 to-transparent" />
    </div>
  );
};

