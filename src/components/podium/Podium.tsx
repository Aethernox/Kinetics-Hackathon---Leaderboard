import React from 'react';
import { Team } from '../../types/leaderboard';
import { PodiumCard } from './PodiumCard';

interface PodiumProps {
  teams: Team[];
  onScrollToTable?: () => void;
}

export const Podium: React.FC<PodiumProps> = ({ teams, onScrollToTable }) => {
  const first = teams.find(t => t.rank === 1) || teams[0];
  const second = teams.find(t => t.rank === 2) || teams[1];
  const third = teams.find(t => t.rank === 3) || teams[2];

  if (!first || !second || !third) {
    return null;
  }

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-8 mt-4 mb-8 flex flex-col items-center select-none font-sans">
      {/* 1. Summit Elevation Cyber Banner */}
      <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/20 bg-[#0c1017]/85 backdrop-blur-xl mb-8 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
        <span className="text-[#f59e0b] text-xs">✦</span>
        <span className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.25em] text-[#e2e8f0] uppercase">
          SUMMIT ELEVATION: 4,392M // KINETICS ARENA
        </span>
        <span className="text-[#f59e0b] text-xs">✦</span>
      </div>

      {/* 2. Top 3 Spotlight Podium Cards */}
      <div className="w-full flex flex-col md:flex-row items-center md:items-end justify-center gap-6 lg:gap-8 relative z-10">
        <PodiumCard team={second} rankPosition={2} />
        <PodiumCard team={first} rankPosition={1} />
        <PodiumCard team={third} rankPosition={3} />
      </div>

      {/* 3. Descend CTA Prompt */}
      {onScrollToTable && (
        <div
          onClick={onScrollToTable}
          className="mt-10 flex flex-col items-center cursor-pointer group transition-all"
        >
          <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono font-extrabold tracking-[0.25em] text-[#f87171] group-hover:text-[#ef4444] transition-colors uppercase drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">
            <span className="text-[#ef4444] animate-bounce">▼</span>
            <span>DESCEND TO FULL LEADERBOARD (#4 — #{teams.length})</span>
            <span className="text-[#ef4444] animate-bounce">▼</span>
          </div>
          <div className="w-48 h-[2px] bg-gradient-to-r from-transparent via-[#ef4444] to-transparent mt-2 group-hover:w-64 transition-all duration-300 shadow-[0_0_12px_#ef4444]" />
        </div>
      )}
    </div>
  );
};
