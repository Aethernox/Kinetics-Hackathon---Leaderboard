import React from 'react';
import { getCinematicConfig } from '../../config/cinematic.config';

interface HeroCinematicSectionProps {
  scrollProgress: number; // 0 (top) to 1 (scrolled past hero)
  onScrollToTable: () => void;
  onOpenSimulator?: () => void;
  onOpenConfig?: () => void;
}

export const HeroCinematicSection: React.FC<HeroCinematicSectionProps> = ({
  scrollProgress,
  onScrollToTable,
  onOpenSimulator,
  onOpenConfig,
}) => {
  const config = getCinematicConfig();

  // Restrained scroll transformation: subtle translateY and opacity fade
  const scale = 1 + scrollProgress * 0.15;
  const opacity = Math.max(0, 1 - scrollProgress * 1.6);
  const translateY = scrollProgress * 70;

  return (
    <section
      aria-label="Kinetics Hackathon Live Leaderboard Hero"
      className="relative min-h-[82vh] sm:min-h-[88vh] w-full flex flex-col items-center justify-center text-center px-4 sm:px-6 overflow-hidden select-none"
      style={{
        pointerEvents: opacity < 0.1 ? 'none' : 'auto',
      }}
    >
      {/* Editorial Content Container */}
      <div
        className="relative z-10 flex flex-col items-center justify-center max-w-4xl mx-auto will-change-transform pt-8"
        style={{
          transform: `translateY(${translateY}px) scale(${scale})`,
          opacity: opacity,
          transition: 'transform 0.08s ease-out, opacity 0.08s ease-out',
        }}
      >
        {/* Minimal Category Eyebrow */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-subtlePulse" />
          <span className="text-[11px] sm:text-xs font-medium tracking-[0.25em] text-[#a7a6a6] uppercase">
            {config.organization} // AUTONOMOUS SUMMIT
          </span>
        </div>

        {/* Grand Cinematic Manrope Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-normal tracking-[-0.03em] text-[#fafafa] leading-[1.04] max-w-3xl">
          Live <span className="font-semibold text-white">Leaderboard</span>
        </h1>

        {/* Editorial Subtitle */}
        <p className="text-sm sm:text-base md:text-lg font-normal text-[#a7a6a6] max-w-xl mx-auto mt-4 sm:mt-5 leading-relaxed tracking-normal">
          Real-time autonomous robotics performance, SLAM metrics, and live competition rankings.
        </p>

        {/* Action Buttons: Primary White Pill */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-8 sm:mt-10 w-full max-w-md justify-center">
          {/* Primary Action Button: White Pill */}
          <button
            id="btn-hero-explore-leaderboard"
            onClick={onScrollToTable}
            className="w-full sm:w-auto px-8 py-3 rounded-full bg-white text-[#050505] font-semibold text-xs sm:text-sm tracking-[0.1em] uppercase hover:bg-[#e5e5e5] active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
          >
            Explore Standings
          </button>
        </div>

        {/* Auxiliary Controls */}
        <div className="flex items-center gap-4 mt-6 text-xs text-[#71717a] tracking-wider uppercase font-mono">
          {onOpenSimulator && (
            <button
              onClick={onOpenSimulator}
              className="hover:text-white transition-colors cursor-pointer"
            >
              [ Simulator ]
            </button>
          )}
          <span>•</span>
          {onOpenConfig && (
            <button
              onClick={onOpenConfig}
              className="hover:text-white transition-colors cursor-pointer"
            >
              [ Settings ]
            </button>
          )}
        </div>
      </div>

      {/* Minimal Scroll Descend Indicator */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer group transition-opacity duration-300"
        style={{ opacity: Math.max(0, 1 - scrollProgress * 2.5) }}
        onClick={onScrollToTable}
      >
        <span className="text-[10px] font-medium tracking-[0.25em] text-[#71717a] group-hover:text-white transition-colors uppercase">
          SCROLL TO RANKINGS
        </span>
        <div className="w-[1px] h-5 bg-gradient-to-b from-white/40 to-transparent group-hover:h-7 transition-all" />
      </div>
    </section>
  );
};

