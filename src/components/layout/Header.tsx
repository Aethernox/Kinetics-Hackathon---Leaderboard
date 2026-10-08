import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Maximize, Minimize, Settings, Sliders, RefreshCw, Unlock } from 'lucide-react';
import { ConnectionState } from '../../types/leaderboard';

interface HeaderProps {
  connectionState: ConnectionState;
  lastSyncTimestamp?: number | null;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
  onOpenConfig: () => void;
  onOpenSimulator: () => void;
  onManualRefresh?: () => void;
  dataSource?: string;
  isAuthenticated?: boolean;
  onToggleAuthLock?: () => void;
  onScrollToTop?: () => void;
  onScrollToPodium?: () => void;
  onScrollToTable?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  connectionState,
  lastSyncTimestamp,
  isSoundEnabled,
  onToggleSound,
  onOpenConfig,
  onOpenSimulator,
  onManualRefresh,
  dataSource: _dataSource,
  isAuthenticated = false,
  onToggleAuthLock,
  onScrollToTop,
  onScrollToPodium,
  onScrollToTable,
}) => {
  const [currentDate, setCurrentDate] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      };
      setCurrentDate(now.toLocaleDateString('en-US', options).toUpperCase());
    };
    updateDate();
    const timer = setInterval(updateDate, 60000);
    return () => clearInterval(timer);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => { });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => { });
      setIsFullscreen(false);
    }
  };

  const getStatusDisplay = () => {
    switch (connectionState) {
      case 'LIVE':
        return {
          text: 'FEED ACTIVE',
          badgeText: 'LIVE',
          badgeBg: 'bg-white text-black',
          dotColor: 'bg-black',
          subColor: 'text-neutral-400',
        };
      case 'SYNCING':
        return {
          text: 'SYNCING...',
          badgeText: 'SYNC',
          badgeBg: 'bg-neutral-200 text-black',
          dotColor: 'bg-black',
          subColor: 'text-neutral-400',
        };
      case 'DELAYED':
        return {
          text: 'FEED DELAYED',
          badgeText: 'DELAYED',
          badgeBg: 'bg-neutral-800 text-neutral-300',
          dotColor: 'bg-neutral-400',
          subColor: 'text-neutral-500',
        };
      case 'OFFLINE':
      default:
        return {
          text: 'FEED OFFLINE',
          badgeText: 'OFFLINE',
          badgeBg: 'bg-neutral-900 text-neutral-500',
          dotColor: 'bg-neutral-600',
          subColor: 'text-neutral-600',
        };
    }
  };

  const status = getStatusDisplay();

  return (
    <header className="sticky top-0 w-full z-40 border-b border-white/[0.08] bg-[#050505]/80 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between font-sans select-none transition-colors">
      {/* Left: Brand / Kinetics Identity */}
      <div className="flex items-center gap-4">
        <button
          onClick={onScrollToTop}
          className="flex items-center gap-3 cursor-pointer group text-left"
        >
          <img
            src="logo.png"
            alt="Kinetics Logo"
            className="h-7 sm:h-8 w-auto object-contain flex-shrink-0 opacity-90 group-hover:opacity-100 transition-opacity"
            onError={(e) => {
              (e.target as HTMLImageElement).src = './logo.png';
            }}
          />

          <div className="flex items-center gap-2.5">
            <span className="text-sm sm:text-base font-semibold tracking-[0.16em] text-[#fafafa] uppercase">
              KINETICS
            </span>
            <span className="hidden sm:inline h-3 w-[1px] bg-white/20" />
            <span className="hidden sm:inline text-[11px] font-medium tracking-[0.2em] text-[#a7a6a6] uppercase">
              LIVE LEADERBOARD
            </span>
          </div>
        </button>
      </div>

      {/* Center: Minimal Text-Based Navigation */}
      <nav
        aria-label="Header Navigation"
        className="hidden md:flex items-center gap-7 text-xs font-medium tracking-[0.18em] uppercase text-[#a7a6a6]"
      >
        <button
          onClick={onScrollToTop}
          className="hover:text-white transition-colors cursor-pointer py-1"
        >
          OVERVIEW
        </button>

        <button
          onClick={onScrollToPodium}
          className="hover:text-white transition-colors cursor-pointer py-1"
        >
          TOP RANKINGS
        </button>

        <button
          onClick={onScrollToTable}
          className="text-white transition-colors cursor-pointer py-1 border-b border-white"
        >
          FULL BOARD
        </button>
      </nav>

      {/* Right: Real-Time Status, Audio, Admin Clearances & White Pill Action */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Dynamic Date & Telemetry Text */}
        <div className="hidden lg:flex flex-col items-end text-right">
          <span className="text-xs font-medium tracking-wider text-[#fafafa]">
            {currentDate || 'OCTOBER 2026'}
          </span>
          <span className={`text-[10px] tracking-wide ${status.subColor} font-mono`}>
            {status.text}
          </span>
        </div>

        {/* Live Status Pill */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/20 ${status.badgeBg} text-xs font-semibold tracking-wider uppercase shadow-sm`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${status.dotColor} animate-subtlePulse`} />
          <span className="text-[10px] sm:text-[11px] font-bold">
            {status.badgeText}
          </span>
        </div>

        {/* Action Controls Group */}
        <div className="flex items-center gap-1 bg-white/[0.04] border border-white/10 rounded-full p-1">
          {onManualRefresh && (
            <button
              onClick={onManualRefresh}
              title={
                lastSyncTimestamp
                  ? `Sync Feed (Last Sync: ${new Date(lastSyncTimestamp).toLocaleTimeString()})`
                  : 'Manual Sync'
              }
              className="p-1.5 text-[#a7a6a6] hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${connectionState === 'SYNCING' ? 'animate-spin text-white' : ''
                  }`}
              />
            </button>
          )}

          <button
            onClick={onToggleSound}
            title={isSoundEnabled ? 'Mute Audio FX' : 'Enable Audio FX'}
            className="p-1.5 text-[#a7a6a6] hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            {isSoundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-white" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-[#71717a]" />
            )}
          </button>

          <button
            onClick={onOpenSimulator}
            title={
              isAuthenticated
                ? 'Open Live Simulator Controls (Unlocked)'
                : 'Open Live Simulator (Password Required)'
            }
            className={`p-1.5 rounded-full transition-colors relative cursor-pointer ${isAuthenticated
                ? 'text-white hover:bg-white/15'
                : 'text-[#a7a6a6] hover:text-white hover:bg-white/10'
              }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            {!isAuthenticated && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-white/60" />
            )}
          </button>

          <button
            onClick={onOpenConfig}
            title={
              isAuthenticated
                ? 'Leaderboard Settings (Unlocked)'
                : 'Leaderboard Settings (Password Required)'
            }
            className={`p-1.5 rounded-full transition-colors relative cursor-pointer ${isAuthenticated
                ? 'text-white hover:bg-white/15'
                : 'text-[#a7a6a6] hover:text-white hover:bg-white/10'
              }`}
          >
            <Settings className="w-3.5 h-3.5" />
            {!isAuthenticated && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-white/60" />
            )}
          </button>

          {isAuthenticated && onToggleAuthLock && (
            <button
              onClick={onToggleAuthLock}
              title="Admin Session Active (Click to Lock Session)"
              className="p-1.5 text-white hover:bg-white/20 rounded-full transition-colors cursor-pointer"
            >
              <Unlock className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen Mode'}
            className="p-1.5 text-[#a7a6a6] hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            {isFullscreen ? (
              <Minimize className="w-3.5 h-3.5" />
            ) : (
              <Maximize className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
