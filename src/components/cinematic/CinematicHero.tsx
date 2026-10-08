import React from 'react';
import { getCinematicConfig } from '../../config/cinematic.config';

interface CinematicHeroProps {
  round?: string;
  onScrollToTable?: () => void;
  onOpenSimulator?: () => void;
  onOpenConfig?: () => void;
}

export const CinematicHero: React.FC<CinematicHeroProps> = ({
  round = 'RND 4',
  onScrollToTable,
  onOpenSimulator,
  onOpenConfig,
}) => {
  const config = getCinematicConfig();

  return (
    <div className="relative w-full z-10 pt-4 pb-4 select-none font-sans flex flex-col items-center justify-center text-center">
      {/* Top Cyber Telemetry Metadata Bar */}
      <div className="flex items-center justify-center gap-3 sm:gap-6 w-full max-w-3xl text-[10px] sm:text-xs text-[#9ca3af] tracking-[0.25em] uppercase mb-2">
        <span className="hidden sm:inline-block text-[#6b7280]">
          COORDINATES: 28.6139° N, 77.2090° E
        </span>

        <span className="text-[#f87171] font-bold px-2 py-0.5 rounded-sm bg-[#dc2626]/10 border border-[#dc2626]/40 text-[10px] font-mono shadow-[0_0_8px_rgba(220,38,38,0.3)]">
          {round}
        </span>

        <span className="text-[#f87171] font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-pulse" />
          AUTONOMOUS SYSTEMS TELEMETRY ACTIVE
          <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-pulse" />
        </span>

        <span className="hidden sm:inline-block text-[#6b7280]">
          STATUS: LIVE STREAM
        </span>
      </div>

      {/* Main Cinematic Title (Configured from .env) */}
      <h1
        className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-black tracking-[0.12em] uppercase text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]"
        style={{
          textShadow: '0 0 50px rgba(220,38,38,0.4), 0 0 20px rgba(255,255,255,0.2)',
          letterSpacing: '0.12em'
        }}
      >
        {config.title}
      </h1>

      {/* Cinematic Laser Glow Subtitle with Divider Lines */}
      <div className="flex items-center justify-center gap-3 sm:gap-6 mt-2 max-w-2xl w-full">
        <div className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-[#dc2626] to-[#ef4444] shadow-[0_0_10px_#ef4444]" />
        
        <h2 className="text-xs sm:text-sm md:text-base font-bold tracking-[0.35em] uppercase text-[#f87171] drop-shadow-[0_0_12px_rgba(239,68,68,0.7)] whitespace-nowrap">
          {config.subtitle}
        </h2>
        
        <div className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-[#dc2626] to-[#ef4444] shadow-[0_0_10px_#ef4444]" />
      </div>

      {/* Location / Event Badge */}
      <div className="mt-2 text-[10px] sm:text-xs text-[#9ca3af] tracking-[0.2em] uppercase font-mono flex items-center gap-2">
        <span className="text-[#6b7280]">•</span>
        <span>{config.location}</span>
        <span className="text-[#6b7280]">•</span>
      </div>

      {/* Cinematic Quick Action Navigation Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-4">
        {onScrollToTable && (
          <button
            onClick={onScrollToTable}
            className="px-3.5 py-1.5 bg-[#11141d]/80 hover:bg-[#1a202c] border border-[#374151] hover:border-[#dc2626]/70 text-[#d1d5db] hover:text-white text-[11px] font-bold tracking-[0.15em] uppercase rounded-sm transition-all shadow-[0_2px_10px_rgba(0,0,0,0.5)] flex items-center gap-1.5"
          >
            <span>📊 Leaderboard Feed</span>
          </button>
        )}

        {onOpenSimulator && (
          <button
            onClick={onOpenSimulator}
            className="px-3.5 py-1.5 bg-[#11141d]/80 hover:bg-[#1a202c] border border-[#374151] hover:border-[#dc2626]/70 text-[#9ca3af] hover:text-white text-[11px] font-bold tracking-[0.15em] uppercase rounded-sm transition-all shadow-[0_2px_10px_rgba(0,0,0,0.5)] flex items-center gap-1.5"
          >
            <span>⚡ Simulator</span>
          </button>
        )}

        {onOpenConfig && (
          <button
            onClick={onOpenConfig}
            className="px-3.5 py-1.5 bg-[#11141d]/80 hover:bg-[#1a202c] border border-[#374151] hover:border-[#dc2626]/70 text-[#9ca3af] hover:text-white text-[11px] font-bold tracking-[0.15em] uppercase rounded-sm transition-all shadow-[0_2px_10px_rgba(0,0,0,0.5)] flex items-center gap-1.5"
          >
            <span>⚙ Data Source</span>
          </button>
        )}
      </div>
    </div>
  );
};
