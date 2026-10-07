import React from 'react';

interface TelemetryHUDProps {
  round?: string;
  isEvaluationConcluded?: boolean;
}

export const TelemetryHUD: React.FC<TelemetryHUDProps> = ({ round = 'RND 4', isEvaluationConcluded = false }) => {
  return (
    <div className="relative w-full z-10 pt-3 pb-3 select-none font-['Times_New_Roman',Times,serif] flex flex-col items-center justify-center text-center">
      {/* Coordinates / Status Telemetry Bar */}
      <div className="flex items-center justify-center gap-4 sm:gap-8 w-full max-w-2xl text-[11px] sm:text-xs text-[#9ca3af]/85 tracking-[0.25em] uppercase mb-1.5">
        <span className="hidden sm:inline-block text-[#6b7280]">COORDINATES: 28.6139° N, 77.2090° E</span>
        <span className={`${isEvaluationConcluded ? 'text-[#f59e0b]' : 'text-[#f59e0b]'} font-semibold flex items-center gap-1.5`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isEvaluationConcluded ? 'bg-[#f59e0b] shadow-[0_0_8px_#f59e0b]' : 'bg-[#f59e0b] animate-pulse'}`} />
          {isEvaluationConcluded ? '🏆 COMPETITION EVALUATION CONCLUDED 🏆' : 'AUTONOMOUS SYSTEMS TELEMETRY'}
          <span className={`w-1.5 h-1.5 rounded-full ${isEvaluationConcluded ? 'bg-[#f59e0b] shadow-[0_0_8px_#f59e0b]' : 'bg-[#f59e0b] animate-pulse'}`} />
        </span>
        <span className="hidden sm:inline-block text-[#6b7280]">{isEvaluationConcluded ? 'STATUS: FINALIZED' : 'STATUS: ACTIVE'}</span>
      </div>

      {/* Prominent Centralized Hero Title */}
      <h1 
        className="text-4xl sm:text-5xl md:text-6xl lg:text-[60px] font-black tracking-[0.08em] uppercase text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]"
        style={{ textShadow: '0 0 40px rgba(255,255,255,0.2)' }}
      >
        KINETICS HACKATHON
      </h1>

      {/* Subtitle with metallic copper glowing line dividers */}
      <div className="flex items-center justify-center gap-4 mt-2">
        <div className="h-[1.5px] w-12 sm:w-20 md:w-28 bg-gradient-to-r from-transparent via-[#f59e0b] to-[#f59e0b]/80 shadow-[0_0_8px_#f59e0b]" />
        <h2 className="text-base sm:text-lg md:text-xl font-bold tracking-[0.3em] uppercase text-[#f59e0b] drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]">
          {isEvaluationConcluded ? 'FINAL 3D PODIUM CEREMONY' : 'LIVE LEADERBOARD'}
        </h2>
        <div className="h-[1.5px] w-12 sm:w-20 md:w-28 bg-gradient-to-l from-transparent via-[#f59e0b] to-[#f59e0b]/80 shadow-[0_0_8px_#f59e0b]" />
      </div>
    </div>
  );
};


