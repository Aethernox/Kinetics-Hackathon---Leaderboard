import React from 'react';
import { getSocialFooterConfig } from './footer.config';
import { SocialButton } from './SocialButton';
import { HudDivider } from './HudDivider';
import { RoboticArmGraphic } from './RoboticArmGraphic';

export interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const config = getSocialFooterConfig();

  return (
    <footer
      role="contentinfo"
      aria-label="KINETICS Live Leaderboard Official Footer"
      className={`w-full relative z-20 overflow-hidden bg-[#050505] border-t border-white/[0.08] select-none font-sans ${className}`}
    >
      {/* Subtle Background Radial Atmosphere Glow */}
      <div className="absolute right-0 bottom-0 w-[500px] h-48 bg-gradient-to-l from-[#f59e0b]/[0.07] via-transparent to-transparent blur-3xl pointer-events-none" />

      {/* Main Content Container: 3-Column Responsive Grid */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-4 relative">

          {/* Column 1: Brand & Organization Identity (Left - 3 cols) */}
          <div className="lg:col-span-3 flex flex-col items-center lg:items-start text-center lg:text-left space-y-2.5 flex-shrink-0 z-10">
            <div className="flex items-center gap-3">
              <div className="relative p-1 rounded-xl bg-white/[0.03] border border-white/10 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                <img
                  src={config.brand.logoSrc}
                  alt={config.brand.logoAlt}
                  className="h-9 sm:h-10 w-auto object-contain opacity-95 hover:opacity-100 transition-opacity drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.endsWith('./logo.png') && !target.src.endsWith('/logo.png')) {
                      target.src = '/logo.png';
                    }
                  }}
                  loading="lazy"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-extrabold tracking-[0.2em] text-[#fafafa] uppercase">
                  {config.brand.clubName}
                </span>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#f59e0b] uppercase">
                  ROBOTICS SOCIETY
                </span>
              </div>
            </div>

            <p className="text-xs text-[#a7a6a6] font-normal tracking-normal max-w-xs leading-relaxed">
              {config.brand.tagline} • Autonomous navigation, robotics research & competitive AI systems.
            </p>

            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.02] text-[10px] font-mono text-[#94a3b8]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
              <span>NIT DELHI // LABS ACTIVE</span>
            </div>
          </div>

          {/* Column 2: Connect Social Matrix (Center - 5 cols, Single Line Horizontal Row) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-3.5 z-10 lg:border-x lg:border-white/[0.08] lg:px-4">
            <div className="flex items-center gap-2">
              <span className="w-1 h-3 bg-[#f59e0b] rounded-full" />
              <h2 className="text-xs font-bold tracking-[0.25em] uppercase text-[#fafafa]">
                {config.heading}
              </h2>
            </div>

            <div
              className="flex items-center justify-center flex-nowrap gap-2 sm:gap-3 lg:gap-3 w-full max-w-full overflow-x-auto no-scrollbar py-1"
              role="list"
              aria-label="Official Social Profiles"
            >
              {config.socialLinks.map((social) => (
                <div key={social.id} role="listitem" className="flex-shrink-0">
                  <SocialButton social={social} />
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: 3D Autonomous Robotic Arm Visual Showcase (Right - 4 cols) */}
          <div className="lg:col-span-4 w-full h-[140px] sm:h-[160px] lg:h-[180px] flex items-center justify-center lg:justify-end z-10 relative">
            <RoboticArmGraphic className="w-full h-full" />
          </div>

        </div>

        {/* Bottom Metadata & Copyright Line */}
        <div className="relative mt-8 pt-5 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#71717a] font-normal">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-subtlePulse" />
            <span className="font-mono text-[#a1a1aa] tracking-wider uppercase">{config.eventLabel}</span>
          </div>
          <span className="font-sans text-[#71717a]">{config.copyright}</span>
        </div>
      </div>
    </footer>
  );
};

