import React from 'react';
import { Team } from '../../types/leaderboard';
import { LeaderboardRow } from './LeaderboardRow';

interface LeaderboardTableProps {
  teams: Team[];
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ teams }) => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 pb-16 select-none relative z-10 font-sans">
      {/* Table Container: Flat Surface with Hairline Borders */}
      <div className="w-full rounded-2xl border border-white/[0.08] bg-[#0a0a0a]/60 backdrop-blur-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.7)]">
        {/* Table Column Headers */}
        <div className="grid grid-cols-12 items-center px-4 sm:px-8 py-4 border-b border-white/[0.10] bg-white/[0.02] text-[11px] sm:text-xs font-medium tracking-[0.2em] uppercase text-[#a7a6a6]">
          <div className="col-span-2 sm:col-span-1 text-left">
            Rank
          </div>

          <div className="col-span-6 sm:col-span-4 text-left">
            Team / Participant
          </div>

          <div className="col-span-4 sm:col-span-2 text-right sm:text-left">
            Score
          </div>

          <div className="hidden sm:block sm:col-span-3 text-left">
            Telemetry / Metrics
          </div>

          <div className="hidden sm:block sm:col-span-1 text-center">
            Delta
          </div>

          <div className="hidden sm:block sm:col-span-1 text-right">
            Status
          </div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-white/[0.06]">
          {teams.length > 0 ? (
            teams.map((team, idx) => (
              <LeaderboardRow
                key={team.id || `team-${team.rank}-${team.teamName}`}
                team={team}
                isEven={idx % 2 === 1}
              />
            ))
          ) : (
            <div className="py-16 text-center text-sm text-[#71717a]">
              No active data feeds detected
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

