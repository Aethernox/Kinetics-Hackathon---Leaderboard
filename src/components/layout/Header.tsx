import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Maximize, Minimize, Settings, Sliders, RefreshCw, Trophy } from 'lucide-react';
import { ConnectionState } from '../../types/leaderboard';

interface HeaderProps {
  connectionState: ConnectionState;
  lastSyncTimestamp: number | null;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
  onOpenConfig: () => void;
  onOpenSimulator: () => void;
  onManualRefresh?: () => void;
  dataSource: string;
  isEvaluationConcluded?: boolean;
  onToggleEvaluationConcluded?: (concluded: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  connectionState,
  lastSyncTimestamp,
  isSoundEnabled,
  onToggleSound,
  onOpenConfig,
  onOpenSimulator,
  onManualRefresh,
  dataSource,
  isEvaluationConcluded = false,
  onToggleEvaluationConcluded,
}) => {
  const [currentDate, setCurrentDate] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        month: 'long',
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
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const getStatusDisplay = () => {
    switch (connectionState) {
      case 'LIVE':
        return {
          text: 'DATA FEED ACTIVE',
          badgeText: 'LIVE',
          badgeBg: 'bg-[#ef4444]',
          dotColor: 'bg-white',
          glow: 'shadow-[0_0_12px_#ef4444]',
          subColor: 'text-[#f59e0b]',
          icon: '⚡',
        };
      case 'SYNCING':
        return {
          text: 'SYNCING FEED...',
          badgeText: 'SYNC',
          badgeBg: 'bg-[#f59e0b]',
          dotColor: 'bg-white',
          glow: 'shadow-[0_0_12px_#f59e0b]',
          subColor: 'text-[#f59e0b]',
          icon: '🔄',
        };
      case 'DELAYED':
        return {
          text: 'FEED DELAYED',
          badgeText: 'LAG',
          badgeBg: 'bg-[#d97706]',
          dotColor: 'bg-[#fef3c7]',
          glow: 'shadow-[0_0_8px_#d97706]',
          subColor: 'text-[#fbbf24]',
          icon: '⚠️',
        };
      case 'OFFLINE':
      default:
        return {
          text: 'DATA FEED INTERRUPTED',
          badgeText: 'OFFLINE',
          badgeBg: 'bg-[#4b5563]',
          dotColor: 'bg-[#9ca3af]',
          glow: 'none',
          subColor: 'text-[#9ca3af]',
          icon: '✕',
        };
    }
  };

  const status = getStatusDisplay();

  return (
    <header className="relative w-full z-20 border-b border-[#262c3a]/60 bg-[#07080b]/85 backdrop-blur-md px-4 sm:px-8 py-3 flex items-center justify-between font-['Times_New_Roman',Times,serif]">
      {/* Left: Kinetics Logo (Kinetic Logo.png) & Hackathon 2026 Branding */}
      <div className="flex items-center gap-3">
        {/* Kinetic Logo Image added as it is */}
        <img
          src="Kinetics Logo.png"
          alt="Kinetics Logo"
          className="h-10 sm:h-12 w-auto object-contain flex-shrink-0"
          onError={(e) => {
            // Fallback to relative path if needed
            (e.target as HTMLImageElement).src = './Kinetics Logo.png';
          }}
        />

        {/* Brand Text */}
        <div className="flex items-center gap-2.5">
          <span className="text-xl sm:text-2xl md:text-3xl font-black tracking-[0.12em] text-white drop-shadow-md">
            KINETIC
          </span>
          <span className="h-5 w-[1.5px] bg-[#4b5563]" />
          <span className="text-sm sm:text-base font-semibold tracking-[0.15em] text-[#9ca3af] uppercase">
            HACKATHON 2026
          </span>
        </div>
      </div>

      {/* Center: LEADERBOARD Tab with active glow indicator */}
      <div className="hidden md:flex flex-col items-center">
        <div className="relative px-6 py-1">
          <span className="text-sm sm:text-base font-bold tracking-[0.2em] text-white uppercase">
            LEADERBOARD
          </span>
          <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-transparent via-[#f59e0b] to-transparent shadow-[0_0_8px_#f59e0b]" />
        </div>
      </div>

      {/* Right: Dynamic Date + Status Indicator + Controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Dynamic Date & Telemetry Text */}
        <div className="hidden sm:flex flex-col items-end text-right">
          <span className="text-xs sm:text-sm font-bold tracking-wider text-[#e5e7eb]">
            {currentDate || 'OCTOBER 7, 2026'}
          </span>
          <span className={`text-[10px] tracking-wide ${isEvaluationConcluded ? 'text-[#f59e0b] font-bold' : status.subColor} flex items-center gap-1`}>
            <span>{isEvaluationConcluded ? '🏆' : status.icon}</span> {isEvaluationConcluded ? 'FINAL RESULTS LOCKED' : status.text}
          </span>
        </div>

        {/* Live Pill Badge / Concluded Badge */}
        <button
          onClick={() => onToggleEvaluationConcluded?.(!isEvaluationConcluded)}
          title={isEvaluationConcluded ? 'Switch to Live 2D View' : 'Conclude & Launch 3D Podium'}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full cursor-pointer transition-all duration-300 ${
            isEvaluationConcluded
              ? 'bg-[#f59e0b] shadow-[0_0_15px_rgba(245,158,11,0.6)] text-black'
              : `${status.badgeBg} ${status.glow} text-white`
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${isEvaluationConcluded ? 'bg-black' : status.dotColor} animate-pulse`} />
          <span className="text-[11px] font-black tracking-widest uppercase">
            {isEvaluationConcluded ? '🏆 3D FINAL' : status.badgeText}
          </span>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-1 bg-[#111827]/80 border border-[#374151]/50 rounded-lg p-0.5">
          {onManualRefresh && (
            <button
              onClick={onManualRefresh}
              title="Manual Sync Google Sheet"
              className="p-1.5 text-[#9ca3af] hover:text-[#f59e0b] hover:bg-[#1f2937] rounded transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${connectionState === 'SYNCING' ? 'animate-spin text-[#f59e0b]' : ''}`} />
            </button>
          )}

          <button
            onClick={onToggleSound}
            title={isSoundEnabled ? 'Mute Audio FX' : 'Enable Sci-Fi Audio FX'}
            className="p-1.5 text-[#9ca3af] hover:text-[#f59e0b] hover:bg-[#1f2937] rounded transition-colors"
          >
            {isSoundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#f59e0b]" /> : <VolumeX className="w-3.5 h-3.5 text-[#6b7280]" />}
          </button>

          <button
            onClick={onOpenSimulator}
            title="Open Live Simulator / Quick Controls"
            className="p-1.5 text-[#9ca3af] hover:text-[#f59e0b] hover:bg-[#1f2937] rounded transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onOpenConfig}
            title="Google Sheets & Dashboard Settings"
            className="p-1.5 text-[#9ca3af] hover:text-[#f59e0b] hover:bg-[#1f2937] rounded transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Command Center Mode (1080p/4K)'}
            className="p-1.5 text-[#9ca3af] hover:text-[#f59e0b] hover:bg-[#1f2937] rounded transition-colors"
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
