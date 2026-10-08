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
            className="w-5.5 h-5.5 sm:w-6 sm:h-6 fill-current transition-transform duration-300 group-hover:scale-110"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
        );
      case 'linkedin':
        return (
          <svg
            className="w-5.5 h-5.5 sm:w-6 sm:h-6 fill-current transition-transform duration-300 group-hover:scale-110"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.69 1.69 0 1 0 0-3.38 1.69 1.69 0 0 0 0 3.38m1.4 9.74V9.95H5.06v8.55z" />
          </svg>
        );
      case 'x':
        return (
          <svg
            className="w-5 h-5 sm:w-5.5 sm:h-5.5 fill-current transition-transform duration-300 group-hover:scale-110"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        );
      case 'instagram':
        return (
          <svg
            className="w-5.5 h-5.5 sm:w-6 sm:h-6 fill-none stroke-current stroke-[2] transition-transform duration-300 group-hover:scale-110"
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
            className="w-5.5 h-5.5 sm:w-6 sm:h-6 fill-none stroke-current stroke-[2] transition-transform duration-300 group-hover:scale-110"
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
      case 'youtube':
        return (
          <svg
            className="w-5.5 h-5.5 sm:w-6 sm:h-6 fill-current transition-transform duration-300 group-hover:scale-110"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
            <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#07080b" />
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
      className="group flex flex-col items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f59e0b] rounded-2xl p-1.5 transition-all duration-300"
    >
      {/* Circular Futuristic Button Surface with Dual Gold Glowing Ring */}
      <div className="relative w-13 h-13 sm:w-15 sm:h-15 rounded-full flex items-center justify-center bg-gradient-to-b from-[#141926]/90 to-[#090c12]/95 border border-[#f59e0b]/35 text-[#f3f4f6] group-hover:text-[#f59e0b] group-hover:border-[#f59e0b] group-hover:bg-[#151b28] group-hover:shadow-[0_0_24px_rgba(245,158,11,0.6)] group-hover:-translate-y-1.5 active:scale-95 transition-all duration-300">
        {/* Subtle Ambient Radial Highlight */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#f59e0b]/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        {/* Fine gold inner bezel ring */}
        <div className="absolute inset-1 rounded-full border border-[#f59e0b]/10 group-hover:border-[#f59e0b]/30 transition-colors pointer-events-none" />

        {/* Icon */}
        <div className="relative z-10">{renderIcon()}</div>
      </div>

      {/* Text Label Below Icon */}
      <span className="text-[11px] sm:text-xs font-semibold tracking-widest text-[#9ca3af] group-hover:text-[#f59e0b] transition-colors duration-200 uppercase">
        {social.label}
      </span>
    </a>
  );
};
