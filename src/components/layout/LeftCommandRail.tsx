import React from 'react';
import { getSocialFooterConfig } from './Footer/footer.config';
import { Table, Sliders, Settings, Award } from 'lucide-react';

interface LeftCommandRailProps {
  onScrollToTop?: () => void;
  onScrollToPodium?: () => void;
  onScrollToTable?: () => void;
  onOpenSimulator?: () => void;
  onOpenConfig?: () => void;
}

export const LeftCommandRail: React.FC<LeftCommandRailProps> = ({
  onScrollToTop,
  onScrollToPodium,
  onScrollToTable,
  onOpenSimulator,
  onOpenConfig,
}) => {
  const config = getSocialFooterConfig();

  return (
    <aside
      aria-label="Command Rail Navigation"
      className="fixed left-0 top-0 bottom-0 z-30 hidden lg:flex flex-col items-center justify-between py-6 px-3 w-16 bg-[#050505]/70 backdrop-blur-xl border-r border-white/[0.08] select-none font-sans pointer-events-auto"
    >
      {/* Top: Brand Logo */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={onScrollToTop}
          title="KINETICS — Return to Top"
          className="p-1 rounded-lg border border-white/15 hover:border-white/40 bg-white/[0.03] transition-all cursor-pointer"
        >
          <img
            src="logo.png"
            alt="KINETIC Logo"
            className="w-5 h-5 object-contain opacity-80 hover:opacity-100 transition-opacity"
            onError={(e) => {
              (e.target as HTMLImageElement).src = './logo.png';
            }}
          />
        </button>

        <div className="w-1 h-1 rounded-full bg-white/40 animate-subtlePulse" />
      </div>

      {/* Middle: Vertical Social Icons & Navigation Shortcuts */}
      <div className="flex flex-col items-center gap-4">
        {config.socialLinks.map((social) => (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            title={social.ariaLabel}
            className="w-7 h-7 rounded-md flex items-center justify-center text-[#71717a] hover:text-white hover:bg-white/[0.06] transition-all text-xs"
          >
            {social.icon === 'github' && (
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            )}
            {social.icon === 'linkedin' && (
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.69 1.69 0 1 0 0-3.38 1.69 1.69 0 0 0 0 3.38m1.4 9.74V9.95H5.06v8.55z" />
              </svg>
            )}
            {social.icon === 'x' && (
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            )}
            {social.icon === 'instagram' && (
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            )}
            {social.icon === 'website' && (
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            )}
          </a>
        ))}

        <div className="w-4 h-[1px] bg-white/10 my-1" />

        {onScrollToPodium && (
          <button
            onClick={onScrollToPodium}
            title="Top Rankings"
            className="w-7 h-7 rounded-md flex items-center justify-center text-[#71717a] hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
          >
            <Award className="w-4 h-4" />
          </button>
        )}

        {onScrollToTable && (
          <button
            onClick={onScrollToTable}
            title="Full Leaderboard"
            className="w-7 h-7 rounded-md flex items-center justify-center text-[#71717a] hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
          >
            <Table className="w-4 h-4" />
          </button>
        )}

        {onOpenSimulator && (
          <button
            onClick={onOpenSimulator}
            title="Simulator"
            className="w-7 h-7 rounded-md flex items-center justify-center text-[#71717a] hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
          >
            <Sliders className="w-4 h-4" />
          </button>
        )}

        {onOpenConfig && (
          <button
            onClick={onOpenConfig}
            title="Settings"
            className="w-7 h-7 rounded-md flex items-center justify-center text-[#71717a] hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Bottom: Vertical Label */}
      <div className="flex flex-col items-center">
        <div className="h-8 w-[1px] bg-gradient-to-b from-white/20 to-transparent mb-3" />
        <span
          className="text-[9px] tracking-[0.25em] text-[#52525b] uppercase font-medium"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          KINETICS 2026
        </span>
      </div>
    </aside>
  );
};

