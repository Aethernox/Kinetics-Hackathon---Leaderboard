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
      aria-label="KINETICS 2026 Official Social and Connect Section"
      className={`w-full relative z-20 overflow-hidden bg-[#07080b] border-t border-[#1c212c]/90 select-none font-['Times_New_Roman',Times,serif] ${className}`}
    >
      {/* Background Ambient Lighting & Cyber HUD Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Left Warm Orbital Glow */}
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#f59e0b]/[0.05] blur-3xl" />
        
        {/* Right Robotic Arm Warm Glow */}
        <div className="absolute -right-16 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#f59e0b]/[0.08] blur-3xl" />

        {/* Subtle Tech Hex/Grid Lines Overlay */}
        <div className="absolute inset-0 bg-scanlines opacity-10" />

        {/* Far-left glowing curved orbital arc accent matching the reference image */}
        <div className="hidden lg:block absolute -left-36 top-[-40%] w-80 h-[180%] rounded-full border border-[#f59e0b]/25 shadow-[0_0_35px_rgba(245,158,11,0.2)] pointer-events-none" />

        {/* Top-left dot constellation */}
        <div className="hidden md:block absolute left-8 top-6 opacity-30 pointer-events-none">
          <div className="grid grid-cols-4 gap-2">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-[#f59e0b]" />
            ))}
          </div>
        </div>
      </div>

      {/* Main Symmetrical 3-Column Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 relative min-h-[160px]">
          
          {/* Column 1: Official KINETIC Branding (Left) */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-2.5 flex-shrink-0 z-10">
            <div className="relative group cursor-pointer">
              <img
                src={config.brand.logoSrc}
                alt={config.brand.logoAlt}
                className="h-16 sm:h-18 md:h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_20px_rgba(245,158,11,0.25)]"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.endsWith('./logo.png')) {
                    target.src = './logo.png';
                  }
                }}
                loading="lazy"
              />
            </div>

            {/* Tagline */}
            <p className="text-xs sm:text-sm font-bold tracking-[0.32em] uppercase text-[#e2e8f0] drop-shadow-sm">
              {config.brand.tagline}
            </p>
          </div>

          {/* Center: Futuristic HUD Vertical Divider (Desktop) / Horizontal (Mobile) */}
          <div className="hidden lg:flex items-center">
            <HudDivider orientation="vertical" />
          </div>
          <div className="w-full lg:hidden">
            <HudDivider orientation="horizontal" />
          </div>

          {/* Column 2: CONNECT WITH US + 5 Symmetrical Social Buttons (Center) */}
          <div className="flex-1 flex flex-col items-center lg:items-start space-y-3.5 z-10">
            {/* Header with Gold Accent Line */}
            <div className="flex items-center gap-3">
              <h2 className="text-xs sm:text-sm font-black tracking-[0.25em] uppercase text-[#f3f4f6] drop-shadow-md">
                {config.heading}
              </h2>
              <div className="h-[2px] w-10 sm:w-14 bg-gradient-to-r from-[#f59e0b] via-[#fbbf24] to-transparent rounded-full shadow-[0_0_10px_#f59e0b]" />
            </div>

            {/* Symmetrical Social Buttons List */}
            <div
              className="flex items-center justify-center flex-wrap gap-3.5 sm:gap-5 xl:gap-6"
              role="list"
              aria-label="Official Social Profiles"
            >
              {config.socialLinks.map((social) => (
                <div key={social.id} role="listitem">
                  <SocialButton social={social} />
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: High-Resolution 3D Cinematic Robotic Arm Render (Right) */}
          <div className="hidden lg:flex items-center justify-end flex-shrink-0 w-64 xl:w-80 h-48 max-h-[220px] xl:max-h-[250px] overflow-hidden z-0 pointer-events-none">
            <RoboticArmGraphic className="w-full h-full" />
          </div>
        </div>

        {/* Angular Futuristic Bottom HUD Edge & Stepped Circuit Line */}
        <div className="relative mt-6 pt-4">
          {/* Futuristic Gold Stepped Border Line */}
          <div className="relative w-full h-[2px] bg-gradient-to-r from-transparent via-[#f59e0b]/60 to-transparent shadow-[0_0_10px_rgba(245,158,11,0.3)]">
            {/* Left Stepped Notch */}
            <div className="absolute left-0 -top-1.5 w-28 h-2 border-t-2 border-r-2 border-[#f59e0b]/50 shadow-[0_0_8px_rgba(245,158,11,0.3)]" />
            {/* Right Stepped Notch */}
            <div className="absolute right-0 -top-1.5 w-36 h-2 border-t-2 border-l-2 border-[#f59e0b]/50 shadow-[0_0_8px_rgba(245,158,11,0.3)]" />
          </div>

          {/* Bottom Technical Micro-Copy with Clean Symmetrical Alignment */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-3 text-[10px] sm:text-xs text-[#9ca3af] tracking-wider uppercase font-medium">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] shadow-[0_0_6px_#f59e0b] animate-pulse" />
              <span>{config.eventLabel}</span>
            </div>
            <span>{config.copyright}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
