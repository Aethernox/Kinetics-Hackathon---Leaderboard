import React from 'react';

interface TelemetryHUDProps {
  round?: string;
}

export const TelemetryHUD: React.FC<TelemetryHUDProps> = ({ round = 'ROUND 04' }) => {
  return (
    <div className="relative w-full z-10 pt-3 pb-3 select-none font-sans flex flex-col items-center justify-center text-center">
      {/* Coordinates / Status Telemetry Bar */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 w-full max-w-2xl text-[11px] sm:text-xs text-[#a7a6a6] tracking-[0.2em] uppercase mb-1.5 font-mono">
        <span className="hidden sm:inline-block text-[#71717a]">28.6139° N, 77.2090° E</span>
        <span className="text-white font-medium px-2 py-0.5 rounded bg-white/10 border border-white/20 text-[10px]">
          {round}
        </span>
        <span className="text-white font-medium flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-subtlePulse" />
          AUTONOMOUS SLAM TELEMETRY
        </span>
      </div>

      {/* Prominent Hero Title */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-normal tracking-[-0.03em] text-[#fafafa]">
        Kinetics <span className="font-semibold text-white">Hackathon</span>
      </h1>
    </div>
  );
};



