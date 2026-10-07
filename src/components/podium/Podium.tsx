import React from 'react';
import { Team } from '../../types/leaderboard';
import { PodiumCard } from './PodiumCard';

interface PodiumProps {
  teams: Team[];
}

export const Podium: React.FC<PodiumProps> = ({ teams }) => {
  const first = teams.find(t => t.rank === 1) || teams[0];
  const second = teams.find(t => t.rank === 2) || teams[1];
  const third = teams.find(t => t.rank === 3) || teams[2];

  if (!first || !second || !third) {
    return null;
  }

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 mt-3 mb-6 md:mt-5 md:mb-8 flex flex-col items-center">
      {/* Cards Row: 2nd (Left) | 1st (Center, Elevated) | 3rd (Right) */}
      <div className="w-full flex flex-col md:flex-row items-center md:items-end justify-center gap-4 md:gap-3 lg:gap-6 relative z-10">
        <PodiumCard team={second} rankPosition={2} />
        <PodiumCard team={first} rankPosition={1} />
        <PodiumCard team={third} rankPosition={3} />
      </div>

      {/* 3D Stepped Metallic Platform Base underneath */}
      <div className="hidden md:flex items-end justify-center w-full max-w-[1100px] h-8 -mt-2 relative z-0">
        {/* Left Step (2nd place) */}
        <div className="w-[320px] lg:w-[350px] h-5 bg-gradient-to-b from-[#1e222d] to-[#0c0e14] border-t border-l border-r border-[#374151]/50 shadow-[0_6px_16px_rgba(0,0,0,0.8)] relative">
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#94a3b8]/40 to-transparent" />
        </div>

        {/* Center Step (1st place, elevated and warm glow) */}
        <div className="w-[380px] lg:w-[410px] h-8 bg-gradient-to-b from-[#2d1b09] to-[#0f0c08] border-t border-l border-r border-[#f59e0b]/60 shadow-[0_0_20px_rgba(245,158,11,0.25)] relative">
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#f59e0b] to-transparent" />
          <div className="absolute -bottom-2 inset-x-4 h-4 bg-[#f59e0b]/20 blur-md pointer-events-none" />
        </div>

        {/* Right Step (3rd place) */}
        <div className="w-[320px] lg:w-[350px] h-5 bg-gradient-to-b from-[#22150e] to-[#0c0806] border-t border-l border-r border-[#ea580c]/50 shadow-[0_6px_16px_rgba(0,0,0,0.8)] relative">
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#ea580c]/40 to-transparent" />
        </div>
      </div>
    </div>
  );
};
