import React from 'react';
import { Team } from '../../types/leaderboard';
import { MetricVisual } from './MetricVisual';
import { ScoreCounter } from './ScoreCounter';
import { toProperCase } from '../../utils/text';

interface LeaderboardRowProps {
  team: Team;
  isEven?: boolean;
}

export const LeaderboardRow: React.FC<LeaderboardRowProps> = ({ team, isEven = false }) => {
  const renderInstitutionLogo = () => {
    if (team.logo) {
      return (
        <img
          src={team.logo}
          alt={team.institution}
          className="w-8 h-8 rounded-full object-cover border border-white/20"
        />
      );
    }

    const code = (team.institutionCode || team.institution).toUpperCase();

    if (code.includes('MIT')) {
      return (
        <div className="w-8 h-8 rounded bg-[#800000]/30 border border-[#ef4444]/60 flex items-center justify-center text-[10px] font-black text-[#ef4444] font-['Times_New_Roman',Times,serif]">
          MIT
        </div>
      );
    }
    if (code.includes('STANFORD')) {
      return (
        <div className="w-8 h-8 rounded-full bg-[#8c1515]/30 border border-[#f87171]/60 flex items-center justify-center text-xs font-black text-[#f87171] font-['Times_New_Roman',Times,serif]">
          S
        </div>
      );
    }
    if (code.includes('IIT') || code.includes('DELHI')) {
      return (
        <div className="w-8 h-8 rounded-full bg-[#1e3a8a]/40 border border-[#60a5fa]/60 flex items-center justify-center text-[9px] font-black text-[#93c5fd] font-['Times_New_Roman',Times,serif]">
          IIT
        </div>
      );
    }
    if (code.includes('CMU')) {
      return (
        <div className="w-8 h-8 rounded bg-[#990000]/40 border border-[#fca5a5]/60 flex items-center justify-center text-[9px] font-black text-[#fca5a5] font-['Times_New_Roman',Times,serif]">
          CMU
        </div>
      );
    }
    if (code.includes('OXFORD')) {
      return (
        <div className="w-8 h-8 rounded-full bg-[#002147]/60 border border-[#93c5fd]/50 flex items-center justify-center text-[9px] font-bold text-[#bfdbfe] font-['Times_New_Roman',Times,serif]">
          OXF
        </div>
      );
    }
    if (code.includes('TUM')) {
      return (
        <div className="w-8 h-8 rounded bg-[#0065BD]/40 border border-[#60a5fa]/60 flex items-center justify-center text-[9px] font-black text-[#60a5fa] font-['Times_New_Roman',Times,serif]">
          TUM
        </div>
      );
    }
    if (code.includes('CALTECH')) {
      return (
        <div className="w-8 h-8 rounded-full bg-[#FF6C0C]/20 border border-[#fb923c]/70 flex items-center justify-center text-[10px] font-bold text-[#fb923c] font-['Times_New_Roman',Times,serif]">
          CIT
        </div>
      );
    }

    return (
      <div className="w-8 h-8 rounded-full bg-[#1f2937] border border-[#f59e0b]/40 flex items-center justify-center text-[10px] font-bold text-[#f59e0b] font-['Times_New_Roman',Times,serif]">
        {code.slice(0, 3)}
      </div>
    );
  };

  const getStatusStyle = () => {
    switch (team.status) {
      case 'CALCULATING...':
        return 'text-[#f59e0b] animate-pulse';
      case 'COOLDOWN':
        return 'text-[#9ca3af] opacity-60';
      case 'OFFLINE':
      case 'DISQUALIFIED':
        return 'text-[#ef4444]';
      case 'ACTIVE':
      default:
        return 'text-[#f59e0b] font-semibold';
    }
  };

  const formattedTeamName = toProperCase(team.teamName);
  const formattedInstitution = toProperCase(team.institution);
  const formattedStatus = toProperCase(team.status);

  return (
    <div
      className={`group relative grid grid-cols-12 items-center px-4 sm:px-6 py-3.5 border-b border-[#1c212c]/80 transition-all duration-300 font-['Times_New_Roman',Times,serif] ${
        isEven ? 'bg-[#0a0c10]/70' : 'bg-[#0d1017]/70'
      } hover:bg-[#151922] hover:border-[#f59e0b]/30`}
    >
      {/* 1. RANK */}
      <div className="col-span-2 sm:col-span-1 flex items-center">
        <span className="text-lg sm:text-xl font-black text-white group-hover:text-[#f59e0b] transition-colors">
          #{team.rank}
        </span>
      </div>

      {/* 2. TEAM & INSTITUTION in Proper Case */}
      <div className="col-span-6 sm:col-span-4 flex items-center gap-3 pr-2">
        <div className="flex-shrink-0">{renderInstitutionLogo()}</div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm sm:text-base font-bold text-white tracking-wide truncate group-hover:text-[#f59e0b] transition-colors">
            {formattedTeamName}
          </span>
          <span className="text-xs font-medium text-[#9ca3af] tracking-wide truncate">
            {formattedInstitution}
          </span>
        </div>
      </div>

      {/* 3. ROUND SCORE */}
      <div className="col-span-4 sm:col-span-2 text-right sm:text-left">
        <ScoreCounter
          score={team.score}
          className="text-base sm:text-lg text-white justify-end sm:justify-start"
        />
      </div>

      {/* 4. METRICS / GAIN in Proper Case, no SVG glyphs */}
      <div className="hidden sm:flex sm:col-span-3 items-center pr-3">
        <MetricVisual type={team.metricType} label={team.metricLabel} />
      </div>

      {/* 5. RANK CHANGE */}
      <div className="hidden sm:flex sm:col-span-1 items-center justify-center text-sm font-bold">
        {team.rankChange > 0 ? (
          <span className="text-[#f59e0b] flex items-center gap-0.5">
            +{team.rankChange}
          </span>
        ) : team.rankChange < 0 ? (
          <span className="text-[#ef4444] flex items-center gap-0.5">
            {team.rankChange}
          </span>
        ) : (
          <span className="text-[#9ca3af] opacity-60">0</span>
        )}
      </div>

      {/* 6. STATUS in Proper Case */}
      <div className="hidden sm:flex sm:col-span-1 items-center justify-end">
        <span
          className={`text-xs font-bold tracking-wider ${getStatusStyle()}`}
        >
          {formattedStatus}
        </span>
      </div>
    </div>
  );
};
