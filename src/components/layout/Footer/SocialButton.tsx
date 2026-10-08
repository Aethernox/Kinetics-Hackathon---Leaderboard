import React from 'react';
import { SocialLinkItem } from './footer.config';

interface SocialButtonProps {
  social: SocialLinkItem;
}

export const SocialButton: React.FC<SocialButtonProps> = ({ social }) => {
  const renderIcon = () => {
    switch (social.icon) {
      case 'github':
        return (
          <svg
            className="w-4.5 h-4.5 sm:w-5 sm:h-5 fill-current transition-transform duration-200 group-hover:scale-110"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
        );
      case 'linkedin':
        return (
          <svg
            className="w-4.5 h-4.5 sm:w-5 sm:h-5 fill-current transition-transform duration-200 group-hover:scale-110"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.69 1.69 0 1 0 0-3.38 1.69 1.69 0 0 0 0 3.38m1.4 9.74V9.95H5.06v8.55z" />
          </svg>
        );
      case 'x':
      case 'youtube':
        return (
          <svg
            className="w-4 h-4 sm:w-[18px] sm:h-[18px] fill-current transition-transform duration-200 group-hover:scale-110"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        );
      case 'instagram':
        return (
          <svg
            className="w-4.5 h-4.5 sm:w-5 sm:h-5 fill-none stroke-current stroke-[2] transition-transform duration-200 group-hover:scale-110"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        );
      case 'website':
        return (
          <svg
            className="w-4.5 h-4.5 sm:w-5 sm:h-5 fill-none stroke-current stroke-[2] transition-transform duration-200 group-hover:scale-110"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <a
      href={social.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={social.ariaLabel}
      className="group flex flex-col items-center gap-1.5 focus:outline-none rounded-xl p-1 transition-all duration-300 select-none min-w-[50px] sm:min-w-[58px]"
    >
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center bg-[#12161f]/80 border border-white/10 text-[#d1d5db] group-hover:text-white group-hover:border-[#f59e0b]/60 group-hover:bg-[#f59e0b]/15 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.35)] active:scale-95 transition-all duration-300">
        <div className="relative z-10 flex items-center justify-center">{renderIcon()}</div>
      </div>

      <span className="text-[10px] font-mono font-bold tracking-wider text-[#94a3b8] group-hover:text-[#fde68a] transition-colors uppercase whitespace-nowrap">
        {social.label}
      </span>
    </a>
  );
};

