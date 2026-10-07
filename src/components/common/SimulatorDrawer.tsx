import React from 'react';
import { X, Play, Shuffle, Zap, WifiOff, Wifi, RotateCcw, Trophy, Database } from 'lucide-react';
import { Team, ConnectionState } from '../../types/leaderboard';
import { HACKATHON_SHEET_DATASET_TEAMS } from '../../services/mockData';

interface SimulatorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  teams: Team[];
  onUpdateTeams: (newTeams: Team[]) => void;
  onResetTeams: () => void;
  connectionState: ConnectionState;
  onSetConnectionState: (state: ConnectionState) => void;
  isEvaluationConcluded?: boolean;
  onToggleEvaluationConcluded?: (concluded: boolean) => void;
}

export const SimulatorDrawer: React.FC<SimulatorDrawerProps> = ({
  isOpen,
  onClose,
  teams,
  onUpdateTeams,
  onResetTeams,
  connectionState,
  onSetConnectionState,
  isEvaluationConcluded = false,
  onToggleEvaluationConcluded,
}) => {
  if (!isOpen) return null;

  const triggerRandomScoreBoost = () => {
    const randomIdx = Math.floor(Math.random() * teams.length);
    const boost = Math.floor(150 + Math.random() * 350);

    const updated = teams.map((team, idx) => {
      if (idx === randomIdx) {
        return {
          ...team,
          previousScore: team.score,
          score: team.score + boost,
          lastUpdated: new Date().toISOString(),
        };
      }
      return team;
    });

    updated.sort((a, b) => b.score - a.score);
    const reRanked = updated.map((team, idx) => {
      const newRank = idx + 1;
      return {
        ...team,
        rank: newRank,
        rankChange: team.rank - newRank,
      };
    });

    onUpdateTeams(reRanked);
  };

  const triggerDramaticOvertake = () => {
    if (teams.length < 4) return;
    const team4 = teams.find(t => t.rank === 4);
    const team2 = teams.find(t => t.rank === 2);
    if (!team4 || !team2) return;

    const updated = teams.map(team => {
      if (team.id === team4.id) {
        return {
          ...team,
          previousScore: team.score,
          score: team2.score + 200,
          previousRank: team.rank,
        };
      }
      return team;
    });

    updated.sort((a, b) => b.score - a.score);
    const reRanked = updated.map((team, idx) => {
      const newRank = idx + 1;
      const prev = teams.find(t => t.id === team.id);
      return {
        ...team,
        rank: newRank,
        previousRank: prev ? prev.rank : newRank,
        rankChange: (prev ? prev.rank : newRank) - newRank,
      };
    });

    onUpdateTeams(reRanked);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-80 sm:w-96 bg-[#0c0f16] border-l border-[#f59e0b]/40 shadow-[-10px_0_30px_rgba(0,0,0,0.8)] flex flex-col justify-between animate-slideLeft select-none font-['Times_New_Roman',Times,serif]">
      {/* Drawer Header */}
      <div className="px-5 py-4 border-b border-[#1f293d] flex items-center justify-between bg-[#111622]">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#f59e0b]" />
          <h3 className="text-base font-bold text-white uppercase">
            Live Event Simulator
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-[#9ca3af] hover:text-white hover:bg-white/10 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Drawer Body */}
      <div className="p-5 space-y-4 overflow-y-auto flex-1">
        <p className="text-xs text-[#9ca3af] leading-relaxed">
          Use these command controls to test real-time rank transitions, score count-ups, sound triggers, and final 3D podium reveals.
        </p>

        {/* Feature: Evaluation End & 3D Final Reveal */}
        <div className="p-3.5 bg-gradient-to-b from-[#1a1510] to-[#111622] rounded-lg border border-[#f59e0b]/60 space-y-2.5 shadow-[0_0_16px_rgba(245,158,11,0.15)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#f59e0b] uppercase tracking-wider flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-[#f59e0b]" /> Competition Evaluation
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase ${isEvaluationConcluded ? 'bg-[#f59e0b] text-black shadow-[0_0_10px_#f59e0b]' : 'bg-[#22c55e]/20 text-[#4ade80] border border-[#22c55e]/40'}`}>
              {isEvaluationConcluded ? '3D CEREMONY' : 'LIVE 2D'}
            </span>
          </div>
          <p className="text-[11px] text-[#9ca3af] leading-relaxed">
            {isEvaluationConcluded
              ? 'Evaluation ended. Final rankings are active on the 3D stadium stage.'
              : 'Evaluation in progress. Click to lock final rankings and launch 3D podium stage.'}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onToggleEvaluationConcluded?.(true)}
              className={`py-2 px-2.5 rounded border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                isEvaluationConcluded
                  ? 'bg-[#f59e0b] text-black border-[#f59e0b] shadow-[0_0_12px_#f59e0b]'
                  : 'bg-[#f59e0b]/15 text-[#f59e0b] border-[#f59e0b]/50 hover:bg-[#f59e0b]/30'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" /> End & Reveal 3D
            </button>
            <button
              onClick={() => onToggleEvaluationConcluded?.(false)}
              className={`py-2 px-2.5 rounded border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                !isEvaluationConcluded
                  ? 'bg-[#22c55e]/25 text-[#4ade80] border-[#22c55e]'
                  : 'bg-[#1f2937] text-[#9ca3af] border-[#374151] hover:text-white'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" /> Live 2D Mode
            </button>
          </div>
        </div>

        {/* Action 1: Random Score Boost */}
        <div className="p-3 bg-[#111622] rounded-lg border border-[#1f293d] space-y-2">
          <span className="text-xs font-bold text-white block uppercase tracking-wider">
            1. Real-Time Score Surge
          </span>
          <button
            onClick={triggerRandomScoreBoost}
            className="w-full py-2 px-3 rounded bg-[#f59e0b]/15 hover:bg-[#f59e0b]/25 border border-[#f59e0b]/50 text-xs text-[#f59e0b] font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Play className="w-3.5 h-3.5" /> Boost Random Team (+150-500 pts)
          </button>
        </div>

        {/* Action 2: Dramatic Overtake */}
        <div className="p-3 bg-[#111622] rounded-lg border border-[#1f293d] space-y-2">
          <span className="text-xs font-bold text-white block uppercase tracking-wider">
            2. High-Stakes Rank Swap
          </span>
          <button
            onClick={triggerDramaticOvertake}
            className="w-full py-2 px-3 rounded bg-[#3b82f6]/15 hover:bg-[#3b82f6]/25 border border-[#3b82f6]/50 text-xs text-[#60a5fa] font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Shuffle className="w-3.5 h-3.5" /> Simulate Rank 4 Surpassing Rank 2
          </button>
        </div>

        {/* Action 3: Connection State Toggle */}
        <div className="p-3 bg-[#111622] rounded-lg border border-[#1f293d] space-y-2">
          <span className="text-xs font-bold text-white block uppercase tracking-wider">
            3. Network Telemetry Test
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSetConnectionState(connectionState === 'LIVE' ? 'OFFLINE' : 'LIVE')}
              className={`py-2 px-2 rounded border text-xs flex items-center justify-center gap-1.5 transition-colors ${
                connectionState === 'LIVE'
                  ? 'border-[#22c55e]/50 bg-[#22c55e]/15 text-[#22c55e]'
                  : 'border-[#ef4444]/50 bg-[#ef4444]/15 text-[#ef4444]'
              }`}
            >
              {connectionState === 'LIVE' ? (
                <>
                  <Wifi className="w-3.5 h-3.5" /> Live Online
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5" /> Offline Mode
                </>
              )}
            </button>
            <button
              onClick={() => onSetConnectionState('DELAYED')}
              className="py-2 px-2 rounded border border-[#f59e0b]/50 bg-[#f59e0b]/15 text-[#f59e0b] text-xs flex items-center justify-center gap-1.5"
            >
              Simulate Delay
            </button>
          </div>
        </div>

        {/* Action 4: Load Dataset & Reset */}
        <div className="pt-2 space-y-2">
          <button
            onClick={() => onUpdateTeams(HACKATHON_SHEET_DATASET_TEAMS)}
            className="w-full py-2.5 px-3 rounded bg-[#f59e0b]/20 hover:bg-[#f59e0b]/30 border border-[#f59e0b]/60 text-xs text-[#f59e0b] font-bold flex items-center justify-center gap-2 transition-colors shadow-[0_0_12px_rgba(245,158,11,0.2)]"
          >
            <Database className="w-3.5 h-3.5 text-[#f59e0b]" /> Load Hackathon Dataset (15 Teams: 975 - 380 pts)
          </button>
          <button
            onClick={onResetTeams}
            className="w-full py-2 px-3 rounded bg-[#1f2937] hover:bg-[#374151] border border-[#4b5563] text-xs text-[#d1d5db] flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset to Reference UI Data
          </button>
        </div>
      </div>

      {/* Drawer Footer */}
      <div className="p-4 border-t border-[#1f293d] bg-[#090b10] text-center">
        <span className="text-[11px] text-[#6b7280]">
          KINETICS 2026 CONTROL TERMINAL
        </span>
      </div>
    </div>
  );
};
