import React from 'react';
import { MetricType } from '../../types/leaderboard';

interface MetricVisualProps {
  type?: MetricType;
  label?: string;
}

export const MetricVisual: React.FC<MetricVisualProps> = ({ type = 'custom', label }) => {
  const renderIcon = () => {
    switch (type) {
      case 'lidar':
        return (
          <svg viewBox="0 0 40 24" className="w-7 h-5 flex-shrink-0">
            <defs>
              <linearGradient id="lidarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
            </defs>
            <path d="M 4,4 L 36,4 L 20,12 L 36,20 L 4,20 L 20,12 Z" fill="none" stroke="url(#lidarGrad)" strokeWidth="1.5" />
            <line x1="8" y1="7" x2="32" y2="7" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="2 1" />
            <line x1="12" y1="10" x2="28" y2="10" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="2 1" />
            <line x1="12" y1="14" x2="28" y2="14" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="2 1" />
            <line x1="8" y1="17" x2="32" y2="17" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="2 1" />
          </svg>
        );

      case 'pointcloud':
        return (
          <svg viewBox="0 0 36 24" className="w-7 h-5 flex-shrink-0">
            <circle cx="6" cy="18" r="1.5" fill="#f59e0b" />
            <circle cx="12" cy="16" r="1.5" fill="#f59e0b" />
            <circle cx="18" cy="12" r="1.5" fill="#f59e0b" />
            <circle cx="24" cy="8" r="1.5" fill="#f59e0b" />
            <circle cx="30" cy="5" r="1.5" fill="#fbbf24" />
            <circle cx="10" cy="20" r="1" fill="#ea580c" opacity="0.7" />
            <circle cx="16" cy="16" r="1" fill="#ea580c" opacity="0.7" />
            <circle cx="22" cy="12" r="1" fill="#ea580c" opacity="0.7" />
            <circle cx="28" cy="10" r="1" fill="#ea580c" opacity="0.7" />
            <circle cx="14" cy="8" r="1" fill="#f59e0b" opacity="0.5" />
            <circle cx="20" cy="5" r="1" fill="#f59e0b" opacity="0.5" />
          </svg>
        );

      case 'neural':
        return (
          <svg viewBox="0 0 36 24" className="w-7 h-5 flex-shrink-0">
            <line x1="6" y1="6" x2="18" y2="12" stroke="#f59e0b" strokeWidth="1" opacity="0.7" />
            <line x1="6" y1="18" x2="18" y2="12" stroke="#f59e0b" strokeWidth="1" opacity="0.7" />
            <line x1="18" y1="12" x2="30" y2="6" stroke="#f59e0b" strokeWidth="1" opacity="0.7" />
            <line x1="18" y1="12" x2="30" y2="18" stroke="#f59e0b" strokeWidth="1" opacity="0.7" />
            <line x1="6" y1="6" x2="30" y2="6" stroke="#ea580c" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.5" />
            <circle cx="6" cy="6" r="2.5" fill="#f59e0b" />
            <circle cx="6" cy="18" r="2.5" fill="#f59e0b" />
            <circle cx="18" cy="12" r="3" fill="#fbbf24" />
            <circle cx="30" cy="6" r="2.5" fill="#f59e0b" />
            <circle cx="30" cy="18" r="2.5" fill="#f59e0b" />
          </svg>
        );

      case 'trajectory':
        return (
          <svg viewBox="0 0 36 24" className="w-7 h-5 flex-shrink-0">
            <path
              d="M 4,18 C 12,20 16,4 32,8"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="1.5"
            />
            <circle cx="4" cy="18" r="2" fill="#fbbf24" />
            <circle cx="16" cy="11" r="1.5" fill="#ea580c" />
            <circle cx="32" cy="8" r="2.5" fill="#fbbf24" />
            <line x1="32" y1="8" x2="28" y2="5" stroke="#fbbf24" strokeWidth="1.2" />
            <line x1="32" y1="8" x2="28" y2="11" stroke="#fbbf24" strokeWidth="1.2" />
          </svg>
        );

      case 'grid':
        return (
          <svg viewBox="0 0 36 24" className="w-7 h-5 flex-shrink-0">
            <rect x="6" y="2" width="24" height="20" fill="none" stroke="#f59e0b" strokeWidth="1" opacity="0.8" />
            <line x1="14" y1="2" x2="14" y2="22" stroke="#f59e0b" strokeWidth="0.8" opacity="0.6" />
            <line x1="22" y1="2" x2="22" y2="22" stroke="#f59e0b" strokeWidth="0.8" opacity="0.6" />
            <line x1="6" y1="8.5" x2="30" y2="8.5" stroke="#f59e0b" strokeWidth="0.8" opacity="0.6" />
            <line x1="6" y1="15.5" x2="30" y2="15.5" stroke="#f59e0b" strokeWidth="0.8" opacity="0.6" />
          </svg>
        );

      case 'optimization':
        return (
          <svg viewBox="0 0 36 24" className="w-7 h-5 flex-shrink-0">
            <path
              d="M 6,19 A 12,12 0 0,1 30,19"
              fill="none"
              stroke="#4b5563"
              strokeWidth="2"
            />
            <path
              d="M 6,19 A 12,12 0 0,1 24,9"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2.5"
            />
            <line x1="18" y1="19" x2="24" y2="11" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
            <circle cx="18" cy="19" r="2" fill="#fbbf24" />
          </svg>
        );

      case 'slam':
      default:
        return (
          <svg viewBox="0 0 36 24" className="w-7 h-5 flex-shrink-0">
            <polygon points="18,4 30,19 6,19" fill="none" stroke="#f59e0b" strokeWidth="1.2" />
            <circle cx="18" cy="4" r="2" fill="#fbbf24" />
            <circle cx="30" cy="19" r="2" fill="#fbbf24" />
            <circle cx="6" cy="19" r="2" fill="#fbbf24" />
            <circle cx="18" cy="14" r="1.5" fill="#ea580c" />
          </svg>
        );
    }
  };

  return (
    <div className="flex items-center gap-2.5 overflow-hidden font-['Times_New_Roman',Times,serif]">
      {renderIcon()}
      <span className="text-xs sm:text-sm text-[#d1d5db] tracking-wide truncate">
        {label || 'Telemetry Data Feed'}
      </span>
    </div>
  );
};
