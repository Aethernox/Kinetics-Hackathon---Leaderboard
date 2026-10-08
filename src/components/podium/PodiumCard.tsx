import React, { useEffect, useState } from 'react';
import { Team } from '../../types/leaderboard';
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

    const duration = 800;
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

  // 2D Cyber-Esports Theme (Gold Champion, Ice Silver, Copper Bronze)
  const theme = isFirst
    ? {
        border: 'border-[#f59e0b] shadow-[0_0_35px_rgba(245,158,11,0.25)]',
        bg: 'bg-gradient-to-b from-[#18140e]/95 via-[#0e0c08]/95 to-[#070604]/98',
        secText: 'SEC // 01',
        badge: '👑 1ST PLACE • CHAMPION',
        badgeClass:
          'bg-gradient-to-r from-[#fbbf24] via-[#f59e0b] to-[#d97706] text-black font-black shadow-[0_0_15px_rgba(245,158,11,0.5)]',
        accentGlow: 'bg-gradient-to-r from-transparent via-[#f59e0b] to-transparent',
        dotColor: 'bg-[#f59e0b] shadow-[0_0_8px_#f59e0b]',
        instColor: 'text-[#fde68a]',
        scoreColor: 'text-white',
        barShadow: 'shadow-[0_0_16px_#f59e0b]',
        heightClass: 'md:h-[220px]',
        rankBoxBorder: 'border-[#f59e0b]/40 text-[#fde68a]',
      }
    : isSecond
    ? {
        border: 'border-[#38bdf8]/70 shadow-[0_0_25px_rgba(56,189,248,0.2)]',
        bg: 'bg-gradient-to-b from-[#0e1622]/95 via-[#090d16]/95 to-[#05080e]/98',
        secText: 'SEC // 02',
        badge: '🥈 2ND PLACE',
        badgeClass:
          'bg-gradient-to-r from-[#e2e8f0] via-[#94a3b8] to-[#64748b] text-black font-extrabold shadow-[0_0_12px_rgba(148,163,184,0.4)]',
        accentGlow: 'bg-gradient-to-r from-transparent via-[#38bdf8] to-transparent',
        dotColor: 'bg-[#38bdf8] shadow-[0_0_8px_#38bdf8]',
        instColor: 'text-[#93c5fd]',
        scoreColor: 'text-white',
        barShadow: 'shadow-[0_0_14px_#38bdf8]',
        heightClass: 'md:h-[200px]',
        rankBoxBorder: 'border-[#38bdf8]/40 text-[#93c5fd]',
      }
    : {
        border: 'border-[#f97316]/70 shadow-[0_0_25px_rgba(249,115,22,0.25)]',
        bg: 'bg-gradient-to-b from-[#1a110b]/95 via-[#110a06]/95 to-[#090503]/98',
        secText: 'SEC // 03',
        badge: '🥉 3RD PLACE',
        badgeClass:
          'bg-gradient-to-r from-[#fb923c] via-[#ea580c] to-[#c2410c] text-white font-extrabold shadow-[0_0_12px_rgba(234,88,12,0.4)]',
        accentGlow: 'bg-gradient-to-r from-transparent via-[#f97316] to-transparent',
        dotColor: 'bg-[#f97316] shadow-[0_0_8px_#f97316]',
        instColor: 'text-[#fed7aa]',
        scoreColor: 'text-white',
        barShadow: 'shadow-[0_0_14px_#f97316]',
        heightClass: 'md:h-[200px]',
        rankBoxBorder: 'border-[#f97316]/40 text-[#fed7aa]',
      };

  return (
    <div
      className={`relative flex flex-col items-center justify-between transition-all duration-300 select-none font-sans
        ${isFirst ? 'w-full md:w-[360px] lg:w-[390px] z-20 order-1 md:order-2 -translate-y-1' : ''}
        ${isSecond ? 'w-full md:w-[310px] lg:w-[340px] z-10 order-2 md:order-1 self-end' : ''}
        ${!isFirst && !isSecond ? 'w-full md:w-[310px] lg:w-[340px] z-10 order-3 md:order-3 self-end' : ''}
      `}
    >
      {/* Outer Card with Cyber Cut Borders & Atmospheric Glow */}
      <div
        className={`w-full ${theme.heightClass} relative rounded-xl border ${theme.border} ${theme.bg} p-5 flex flex-col justify-between overflow-hidden backdrop-blur-2xl transition-all duration-200 hover:scale-[1.01]`}
      >
        {/* Top Header: Section Tag + Centered Championship Badge + System Status */}
        <div className="flex items-center justify-between relative w-full mb-1">
          <span className="text-[10px] font-mono tracking-widest text-[#71717a] font-bold">
            {theme.secText}
          </span>

          {/* Championship Rank Badge */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0">
            <span
              className={`text-[10px] sm:text-[11px] tracking-[0.16em] uppercase px-3 py-0.5 rounded-full whitespace-nowrap ${theme.badgeClass}`}
            >
              {theme.badge}
            </span>
          </div>

          <span className="text-[10px] font-mono tracking-widest text-[#71717a] font-bold">
            SYS.RDY
          </span>
        </div>

        {/* Center: Team Name & Institution */}
        <div className="flex flex-col items-center text-center my-auto pt-2">
          <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight truncate max-w-full drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            {toProperCase(team.teamName)}
          </h3>
          <span className={`text-xs font-semibold tracking-normal truncate mt-0.5 ${theme.instColor}`}>
            {toProperCase(team.institutionCode || team.institution)}
          </span>

          {/* Large Heroic Score */}
          <div className="flex items-baseline gap-1.5 mt-2 tabular-nums">
            <span className="text-3xl sm:text-4xl font-black text-white tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              {displayScore.toLocaleString()}
            </span>
            <span className="text-xs font-extrabold text-[#a1a1aa] uppercase tracking-wider">
              pts
            </span>
          </div>
        </div>

        {/* Bottom Metrics Row: Task Info + Delta Tag */}
        <div className="flex items-center justify-between pt-2.5 border-t border-white/10 mt-1 text-[11px]">
          {/* Telemetry Metric / Tasks */}
          <div className="flex items-center gap-1.5 min-w-0 pr-2">
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${theme.dotColor}`} />
            <span className="text-[#d1d5db] font-medium tracking-tight truncate">
              {team.metricLabel || 'Autonomous Telemetry Feed'}
            </span>
          </div>

          {/* Cyber Rank Tag Box */}
          <div className={`px-2 py-0.5 rounded border text-[10px] font-mono font-bold flex-shrink-0 ${theme.rankBoxBorder} bg-black/40`}>
            {team.rankChange > 0 ? (
              <span className="text-emerald-400">RANK ▲ +{team.rankChange}</span>
            ) : team.rankChange < 0 ? (
              <span className="text-rose-400">RANK ▼ {team.rankChange}</span>
            ) : (
              <span>RANK — 0</span>
            )}
          </div>
        </div>
      </div>

      {/* Cyber Underline Horizon Glow Bar Beneath the Podium Card */}
      <div className={`w-3/4 h-1 rounded-full ${theme.accentGlow} mt-2.5 opacity-90 ${theme.barShadow}`} />
    </div>
  );
};
