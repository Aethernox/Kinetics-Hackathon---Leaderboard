import React from 'react';
import { Team } from '../../types/leaderboard';
import { MetricVisual } from './MetricVisual';
import { ScoreCounter } from './ScoreCounter';
import { toProperCase } from '../../utils/text';

interface LeaderboardRowProps {
  team: Team;
  isEven?: boolean;
}

export const LeaderboardRow: React.FC<LeaderboardRowProps> = ({ team }) => {
  const isFirst = team.rank === 1;
  const isSecond = team.rank === 2;
  const isThird = team.rank === 3;

  // 2D Cyber-Rank typography hierarchy
  const getRankStyle = () => {
    if (isFirst) return 'text-[#f59e0b] font-black drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]';
    if (isSecond) return 'text-[#38bdf8] font-black drop-shadow-[0_0_10px_rgba(56,189,248,0.4)]';
    if (isThird) return 'text-[#f97316] font-black drop-shadow-[0_0_10px_rgba(249,115,22,0.4)]';
    return 'text-[#cbd5e1] font-bold';
  };

  const formattedRank = team.rank < 10 ? `0${team.rank}` : `${team.rank}`;
  const formattedTeamName = toProperCase(team.teamName);
  const formattedInstitution = toProperCase(team.institution);

  return (
    <div
      className={`group relative grid grid-cols-12 items-center px-4 sm:px-8 py-4 sm:py-5 border-b border-white/[0.08] transition-all duration-200 font-sans hover:bg-white/[0.04] ${
        isFirst ? 'bg-[#f59e0b]/[0.03]' : isSecond ? 'bg-[#38bdf8]/[0.02]' : isThird ? 'bg-[#f97316]/[0.02]' : ''
      }`}
    >
      {/* 1. RANK */}
      <div className="col-span-2 sm:col-span-1 flex items-baseline">
        <span className={`text-xl sm:text-2xl tracking-tight font-mono ${getRankStyle()}`}>
          {formattedRank}
        </span>
      </div>

      {/* 2. TEAM & INSTITUTION */}
      <div className="col-span-6 sm:col-span-4 flex flex-col justify-center pr-2">
        <div className="flex items-center gap-2">
          <span className="text-sm sm:text-base font-bold text-[#ffffff] tracking-normal group-hover:text-white transition-colors truncate">
            {formattedTeamName}
          </span>
          {isFirst && (
            <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-[#f59e0b] text-black tracking-wider uppercase shadow-[0_0_8px_#f59e0b]">
              1ST
            </span>
          )}
          {isSecond && (
            <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-[#38bdf8] text-black tracking-wider uppercase shadow-[0_0_8px_#38bdf8]">
              2ND
            </span>
          )}
          {isThird && (
            <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-[#f97316] text-white tracking-wider uppercase shadow-[0_0_8px_#f97316]">
              3RD
            </span>
          )}
        </div>
        <span className="text-xs text-[#94a3b8] font-medium tracking-normal truncate mt-0.5">
          {formattedInstitution}
        </span>
      </div>

      {/* 3. SCORE */}
      <div className="col-span-4 sm:col-span-2 text-right sm:text-left flex items-center">
        <ScoreCounter
          score={team.score}
          className="text-base sm:text-lg font-extrabold text-white justify-end sm:justify-start tracking-tight"
        />
      </div>

      {/* 4. METRICS / TELEMETRY */}
      <div className="hidden sm:flex sm:col-span-3 items-center pr-3">
        <MetricVisual type={team.metricType} label={team.metricLabel} />
      </div>

      {/* 5. RANK DELTA */}
      <div className="hidden sm:flex sm:col-span-1 items-center justify-center text-xs font-mono font-bold">
        {team.rankChange > 0 ? (
          <span className="text-emerald-400 flex items-center gap-0.5">
            ▲ +{team.rankChange}
          </span>
        ) : team.rankChange < 0 ? (
          <span className="text-rose-400 flex items-center gap-0.5">
            ▼ {team.rankChange}
          </span>
        ) : (
          <span className="text-[#94a3b8]">— 0</span>
        )}
      </div>

      {/* 6. STATUS */}
      <div className="hidden sm:flex sm:col-span-1 items-center justify-end">
        <div className="flex items-center gap-1.5 text-xs text-white font-bold tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
          <span>LIVE</span>
        </div>
      </div>
    </div>
  );
};
