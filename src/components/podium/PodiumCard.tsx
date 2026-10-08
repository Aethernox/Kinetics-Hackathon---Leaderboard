import React, { useEffect, useState } from 'react';
import { Team } from '../../types/leaderboard';
import { ArrowDown } from 'lucide-react';
import { toProperCase } from '../../utils/text';

interface PodiumCardProps {
  team: Team;
  rankPosition: 1 | 2 | 3;
}

export const PodiumCard: React.FC<PodiumCardProps> = ({ team, rankPosition }) => {
  const [displayScore, setDisplayScore] = useState(team.score);

  useEffect(() => {
    const startScore = displayScore;
    const endScore = team.score;
    if (startScore === endScore) return;

    const duration = 1200;
    const startTime = performance.now();

    const animateNumber = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(startScore + (endScore - startScore) * easeProgress);
      setDisplayScore(currentVal);

      if (progress < 1) {
        requestAnimationFrame(animateNumber);
      }
    };

    requestAnimationFrame(animateNumber);
  }, [team.score]);

  const isFirst = rankPosition === 1;
  const isSecond = rankPosition === 2;

  const theme = isFirst
    ? {
        border: 'border-[#f59e0b]/80 shadow-[0_0_25px_rgba(245,158,11,0.25)]',
        bg: 'bg-gradient-to-b from-[#2a1d0d]/90 via-[#181410]/95 to-[#0e0c0a]/95',
        badgeColor: 'text-[#fbbf24]',
        rankText: '1st',
        accentGlow: 'from-[#f59e0b]/30 via-transparent to-transparent',
      }
    : isSecond
    ? {
        border: 'border-[#94a3b8]/70 shadow-[0_0_20px_rgba(148,163,184,0.15)]',
        bg: 'bg-gradient-to-b from-[#1e293b]/90 via-[#0f172a]/95 to-[#090d16]/95',
        badgeColor: 'text-[#e2e8f0]',
        rankText: '2nd',
        accentGlow: 'from-[#94a3b8]/25 via-transparent to-transparent',
      }
    : {
        border: 'border-[#ea580c]/70 shadow-[0_0_20px_rgba(234,88,12,0.18)]',
        bg: 'bg-gradient-to-b from-[#2d150b]/90 via-[#1a0e07]/95 to-[#0c0603]/95',
        badgeColor: 'text-[#fdba74]',
        rankText: '3rd',
        accentGlow: 'from-[#ea580c]/25 via-transparent to-transparent',
      };

  return (
    <div
      className={`relative flex flex-col justify-between transition-all duration-700 ease-out select-none font-['Times_New_Roman',Times,serif]
        ${isFirst ? 'w-full md:w-[360px] lg:w-[410px] h-[210px] md:h-[225px] z-20 order-1 md:order-2' : ''}
        ${isSecond ? 'w-full md:w-[310px] lg:w-[350px] h-[185px] md:h-[195px] z-10 order-2 md:order-1 self-end' : ''}
        ${!isFirst && !isSecond ? 'w-full md:w-[310px] lg:w-[350px] h-[185px] md:h-[195px] z-10 order-3 md:order-3 self-end' : ''}
      `}
    >
      {/* Outer Chamfered Container with metallic beveling */}
      <div
        className={`w-full h-full relative rounded-lg border ${theme.border} ${theme.bg} p-4 md:p-5 flex flex-col justify-between overflow-hidden backdrop-blur-md`}
        style={{
          clipPath: isFirst
            ? 'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))'
            : isSecond
            ? 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)'
            : 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)',
        }}
      >
        {/* Top ambient highlight glow */}
        <div className={`absolute -top-12 -left-12 -right-12 h-24 bg-gradient-to-b ${theme.accentGlow} pointer-events-none`} />

        {/* Top Section: Team Logo + Names & Rank Badge + Rank Change */}
        <div className="relative flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="relative flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/20 bg-black/60 flex items-center justify-center shadow-inner overflow-hidden"
            >
              {team.logo ? (
                <img src={team.logo} alt={team.teamName} className="w-full h-full object-cover" />
              ) : isFirst ? (
                <svg viewBox="0 0 100 100" className="w-8 h-8 md:w-9 md:h-9">
                  <defs>
                    <linearGradient id="aetherGold" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fef08a" />
                      <stop offset="50%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#b45309" />
                    </linearGradient>
                  </defs>
                  <polygon points="50,15 88,80 12,80" fill="none" stroke="url(#aetherGold)" strokeWidth="8" strokeLinejoin="round" />
                  <polygon points="50,38 72,75 28,75" fill="url(#aetherGold)" />
                </svg>
              ) : isSecond ? (
                <svg viewBox="0 0 100 100" className="w-8 h-8 md:w-9 md:h-9">
                  <defs>
                    <linearGradient id="cyberSilver" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="50%" stopColor="#94a3b8" />
                      <stop offset="100%" stopColor="#475569" />
                    </linearGradient>
                  </defs>
                  <circle cx="50" cy="50" r="35" fill="none" stroke="url(#cyberSilver)" strokeWidth="5" strokeDasharray="14 6" />
                  <circle cx="50" cy="50" r="16" fill="none" stroke="url(#cyberSilver)" strokeWidth="4" />
                  <circle cx="50" cy="20" r="6" fill="url(#cyberSilver)" />
                  <circle cx="76" cy="65" r="6" fill="url(#cyberSilver)" />
                  <circle cx="24" cy="65" r="6" fill="url(#cyberSilver)" />
                </svg>
              ) : (
                <svg viewBox="0 0 100 100" className="w-8 h-8 md:w-9 md:h-9">
                  <defs>
                    <linearGradient id="neuralBronze" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fed7aa" />
                      <stop offset="50%" stopColor="#ea580c" />
                      <stop offset="100%" stopColor="#7c2d12" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 50,20 C 30,20 20,35 20,50 C 20,68 35,80 50,80 C 65,80 80,68 80,50 C 80,35 70,20 50,20 Z"
                    fill="none"
                    stroke="url(#neuralBronze)"
                    strokeWidth="4"
                  />
                  <line x1="30" y1="40" x2="70" y2="60" stroke="url(#neuralBronze)" strokeWidth="2" strokeDasharray="3 2" />
                  <line x1="30" y1="60" x2="70" y2="40" stroke="url(#neuralBronze)" strokeWidth="2" strokeDasharray="3 2" />
                  <circle cx="35" cy="45" r="4" fill="url(#neuralBronze)" />
                  <circle cx="65" cy="45" r="4" fill="url(#neuralBronze)" />
                  <circle cx="50" cy="60" r="5" fill="url(#neuralBronze)" />
                </svg>
              )}
            </div>

            <div className="flex flex-col">
              <h3
                className={`font-bold tracking-wide text-white leading-tight ${
                  isFirst ? 'text-lg md:text-xl' : 'text-base md:text-lg'
                }`}
              >
                {toProperCase(team.teamName)}
              </h3>
              <span className="text-xs font-semibold tracking-wider text-[#9ca3af]">
                {toProperCase(team.institutionCode || team.institution)}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span
              className={`font-black tracking-wider leading-none ${
                isFirst ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'
              } ${theme.badgeColor}`}
            >
              {theme.rankText}
            </span>

            <div className="flex items-center gap-0.5 mt-1 text-sm font-bold">
              {team.rankChange > 0 ? (
                <span className="text-[#f59e0b] flex items-center">
                  +{team.rankChange}
                </span>
              ) : team.rankChange < 0 ? (
                <span className="text-[#ef4444] flex items-center">
                  <ArrowDown className="w-3.5 h-3.5 inline" /> {team.rankChange}
                </span>
              ) : (
                <span className="text-[#9ca3af] flex items-center">
                  +0
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Center/Bottom Score Typography */}
        <div className="relative mt-2">
          <div className="flex items-baseline gap-1.5">
            <span
              className={`font-black tracking-tight text-white ${
                isFirst ? 'text-3xl md:text-4xl lg:text-5xl' : 'text-2xl md:text-3xl lg:text-4xl'
              }`}
            >
              {displayScore.toLocaleString()}
            </span>
            <span className="text-sm font-bold tracking-wider text-[#9ca3af] uppercase">
              pts
            </span>
          </div>
        </div>

        {/* Card Footer */}
        <div className="relative mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-xs text-[#9ca3af]">
          <span className="truncate pr-2">
            {team.metricLabel || `${team.round || 'RND 4'} / LiDAR accuracy: 98.4%`}
          </span>

          <div className="flex items-center gap-1 flex-shrink-0">
            <div className="grid grid-cols-3 gap-0.5 opacity-70">
              <span className={`w-1.5 h-1.5 rounded-full ${isFirst ? 'bg-[#f59e0b]' : isSecond ? 'bg-[#cbd5e1]' : 'bg-[#ea580c]'}`} />
              <span className={`w-1.5 h-1.5 rounded-full ${isFirst ? 'bg-[#f59e0b]' : isSecond ? 'bg-[#cbd5e1]' : 'bg-[#ea580c]'}`} />
              <span className={`w-1.5 h-1.5 rounded-full ${isFirst ? 'bg-[#f59e0b]' : isSecond ? 'bg-[#cbd5e1]' : 'bg-[#ea580c]'}`} />
              <span className={`w-1.5 h-1.5 rounded-full ${isFirst ? 'bg-[#f59e0b]' : isSecond ? 'bg-[#cbd5e1]' : 'bg-[#ea580c]'}`} />
              <span className={`w-1.5 h-1.5 rounded-full ${isFirst ? 'bg-[#f59e0b]' : isSecond ? 'bg-[#cbd5e1]' : 'bg-[#ea580c]'}`} />
              <span className={`w-1.5 h-1.5 rounded-full ${isFirst ? 'bg-[#f59e0b]' : isSecond ? 'bg-[#cbd5e1]' : 'bg-[#ea580c]'}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
