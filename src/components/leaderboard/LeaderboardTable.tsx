import React from 'react';
import { Team } from '../../types/leaderboard';
import { LeaderboardRow } from './LeaderboardRow';

interface LeaderboardTableProps {
  teams: Team[];
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ teams }) => {
  const tableTeams = teams.filter(t => t.rank > 3);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pb-12 select-none relative z-10 font-['Times_New_Roman',Times,serif]">
      {/* Table Container */}
      <div className="w-full rounded-xl border border-[#2d2218]/90 bg-[#090b10]/85 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.7)] overflow-hidden">
        {/* Table Header Row */}
        <div className="grid grid-cols-12 items-center px-4 sm:px-6 py-3.5 border-b border-[#2d2218] bg-gradient-to-r from-[#171310] via-[#120f0d] to-[#171310] text-xs sm:text-sm font-bold tracking-[0.15em] text-[#9ca3af] uppercase">
          <div className="col-span-2 sm:col-span-1 text-left text-[#d1d5db]">
            RANK
          </div>

          <div className="col-span-6 sm:col-span-4 text-left text-[#d1d5db]">
            TEAM / INSTITUTION
          </div>

          <div className="col-span-4 sm:col-span-2 text-right sm:text-left text-[#d1d5db]">
            ROUND SCORE
          </div>

          <div className="hidden sm:block sm:col-span-3 text-left text-[#d1d5db]">
            METRICS / GAIN
          </div>

          <div className="hidden sm:block sm:col-span-1 text-center text-[#d1d5db]">
            RANK CHANGE
          </div>

          <div className="hidden sm:block sm:col-span-1 text-right text-[#d1d5db]">
            STATUS
          </div>
        </div>

        {/* Table Body: List of Team Rows */}
        <div className="divide-y divide-[#181c26]/60">
          {tableTeams.length > 0 ? (
            tableTeams.map((team, idx) => (
              <LeaderboardRow
                key={team.id || `team-${team.rank}-${team.teamName}`}
                team={team}
                isEven={idx % 2 === 1}
              />
            ))
          ) : (
            <div className="py-12 text-center text-base text-[#9ca3af]">
              NO ADDITIONAL TEAMS IN DATA FEED
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
