import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Team, ConnectionState, GoogleSheetConfig } from './types/leaderboard';
import { INITIAL_TEAMS } from './services/mockData';
import { fetchGoogleSheetData } from './services/googleSheets';
import { soundFx } from './services/audioEffects';
import { isSessionAuthenticated, setSessionAuthenticated } from './services/auth';
import { Header } from './components/layout/Header';
import { TelemetryHUD } from './components/layout/TelemetryHUD';
import { Footer } from './components/layout/Footer';
import { SplineBackground } from './components/spline/SplineBackground';
import { Hero3D } from './components/hero3d';
import { Podium } from './components/podium/Podium';
import { LeaderboardTable } from './components/leaderboard/LeaderboardTable';
import { ConfigModal } from './components/common/ConfigModal';
import { SimulatorDrawer } from './components/common/SimulatorDrawer';
import { AdminAuthModal, ProtectedFeature } from './components/common/AdminAuthModal';

export const App: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [connectionState, setConnectionState] = useState<ConnectionState>('LIVE');
  const [lastSyncTimestamp, setLastSyncTimestamp] = useState<number | null>(Date.now());
  const [dataSource, setDataSource] = useState<'google-sheets' | 'mock' | 'simulator'>('mock');
  const [isSplineEnabled, setIsSplineEnabled] = useState(true);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isEvaluationConcluded, setIsEvaluationConcluded] = useState(false);

  // Admin Security Clearance & Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => isSessionAuthenticated());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [targetFeature, setTargetFeature] = useState<ProtectedFeature>('general');

  const [sheetConfig, setSheetConfig] = useState<GoogleSheetConfig>({
    sheetId: '',
    sheetName: 'Sheet1',
    pollIntervalMs: 3500,
  });

  const teamsRef = useRef(teams);
  teamsRef.current = teams;

  useEffect(() => {
    soundFx.isMuted = !isSoundEnabled;
  }, [isSoundEnabled]);

  const performSync = useCallback(async () => {
    if (dataSource !== 'google-sheets' || !sheetConfig.sheetId) return;

    setConnectionState(prev => (prev === 'LIVE' ? 'SYNCING' : prev));
    try {
      const freshTeams = await fetchGoogleSheetData(sheetConfig, teamsRef.current);
      if (freshTeams && freshTeams.length > 0) {
        let hasRankUp = false;
        let hasRankDown = false;

        freshTeams.forEach(ft => {
          if (ft.rankChange > 0) hasRankUp = true;
          if (ft.rankChange < 0) hasRankDown = true;
        });

        if (hasRankUp && isSoundEnabled) {
          soundFx.playRankUp();
        } else if (hasRankDown && isSoundEnabled) {
          soundFx.playRankDown();
        }

        setTeams(freshTeams);
        setConnectionState('LIVE');
        setLastSyncTimestamp(Date.now());
      }
    } catch (err) {
      console.warn('Google Sheet live sync interrupted:', err);
      setConnectionState('DELAYED');
    }
  }, [dataSource, sheetConfig, isSoundEnabled]);

  useEffect(() => {
    if (dataSource !== 'google-sheets') return;

    performSync();
    const interval = setInterval(performSync, sheetConfig.pollIntervalMs || 3500);
    return () => clearInterval(interval);
  }, [dataSource, sheetConfig, performSync]);

  const handleUpdateTeamsFromSimulator = (newTeams: Team[]) => {
    const hasRankChange = newTeams.some(t => t.rankChange !== 0);
    if (hasRankChange && isSoundEnabled) {
      soundFx.playRankUp();
    }
    setTeams(newTeams);
    setLastSyncTimestamp(Date.now());
  };

  const handleResetToDefault = () => {
    setTeams(INITIAL_TEAMS);
    setConnectionState('LIVE');
    setLastSyncTimestamp(Date.now());
  };

  // Protected Feature Access Handlers
  const handleOpenConfig = () => {
    if (isAuthenticated) {
      setIsConfigOpen(true);
    } else {
      setTargetFeature('config');
      setIsAuthModalOpen(true);
    }
  };

  const handleOpenSimulator = () => {
    if (isAuthenticated) {
      setIsSimulatorOpen(true);
    } else {
      setTargetFeature('simulator');
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setSessionAuthenticated(true);
    setIsAuthModalOpen(false);

    if (targetFeature === 'config') {
      setIsConfigOpen(true);
    } else if (targetFeature === 'simulator') {
      setIsSimulatorOpen(true);
    }
  };

  const handleLockSession = () => {
    setIsAuthenticated(false);
    setSessionAuthenticated(false);
    setIsConfigOpen(false);
    setIsSimulatorOpen(false);
    try {
      soundFx.playRankDown();
    } catch {
      // Audio fallback
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#07080b] text-white flex flex-col justify-between relative overflow-x-hidden font-['Times_New_Roman',Times,serif] select-none antialiased">
      {/* 3D Spline / Procedural Light Shafts Background */}
      <SplineBackground isSplineEnabled={isSplineEnabled} />

      {/* Main UI Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Header */}
        <Header
          connectionState={connectionState}
          lastSyncTimestamp={lastSyncTimestamp}
          isSoundEnabled={isSoundEnabled}
          onToggleSound={() => setIsSoundEnabled(!isSoundEnabled)}
          onOpenConfig={handleOpenConfig}
          onOpenSimulator={handleOpenSimulator}
          onManualRefresh={performSync}
          dataSource={dataSource}
          isEvaluationConcluded={isEvaluationConcluded}
          onToggleEvaluationConcluded={setIsEvaluationConcluded}
          isAuthenticated={isAuthenticated}
          onToggleAuthLock={handleLockSession}
        />

        {/* HUD & Hero Section */}
        <div className="w-full max-w-7xl mx-auto px-4 pt-2">
          <TelemetryHUD round="RND 4" isEvaluationConcluded={isEvaluationConcluded} />
        </div>

        {/* Podium Stage: Clean 2D Stepped Podium by Default (Live Mode), or 3D Stadium Ceremony when Evaluation is Concluded */}
        {!isEvaluationConcluded ? (
          <Podium teams={teams} />
        ) : (
          <div className="w-full flex flex-col items-center">
            {/* 3D WebGL Hero Podium Presentation Stage */}
            <Hero3D
              teams={teams.map(t => ({
                id: t.id,
                name: t.teamName,
                institution: t.institutionCode || t.institution,
                score: t.score,
                rankDelta: t.rankChange,
                logoUrl: t.logoUrl || t.logo || '',
                metric: t.metricLabel,
              }))}
              quality="auto"
              background="#07080b"
              onOvertake={() => {
                if (isSoundEnabled) soundFx.playRankUp();
              }}
              renderFallback={() => <Podium teams={teams} />}
            />

            {/* Scroll Down Prompt to View Other Team Final Positions */}
            <div 
              className="w-full flex flex-col items-center justify-center my-3 cursor-pointer group"
              onClick={() => {
                window.scrollBy({ top: 560, behavior: 'smooth' });
              }}
            >
              <div className="flex items-center gap-2 px-5 py-2 rounded-full border border-[#f59e0b]/40 bg-[#0d1017]/90 hover:border-[#f59e0b] hover:bg-[#161b26] text-xs font-bold tracking-[0.2em] text-[#f59e0b] uppercase shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all duration-300">
                <span className="animate-bounce">▼</span>
                <span>SCROLL TO VIEW OTHER TEAM FINAL POSITIONING (#4 — #10)</span>
                <span className="animate-bounce">▼</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Live / Final Leaderboard Table */}
        <LeaderboardTable teams={teams} />

        {/* Bottom System Bar */}
        <div className="w-full py-2.5 px-6 border-t border-[#1c212c]/60 bg-[#07080b]/90 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between text-xs text-[#6b7280]">
          <div className="flex items-center gap-3">
            <span className="text-[#f59e0b]/80">● KINETICS 2026 AUTONOMOUS ROBOTICS DASHBOARD</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">SYSTEM STATUS: {isEvaluationConcluded ? 'EVALUATION CONCLUDED' : 'OPTIMAL'}</span>
          </div>
          <div className="flex items-center gap-4 mt-1 sm:mt-0">
            <span>ENGINE: {dataSource.toUpperCase()}</span>
            <span>POLL: {sheetConfig.pollIntervalMs}ms</span>
            <span>MODE: {isEvaluationConcluded ? '3D CEREMONY' : 'LIVE DASHBOARD'}</span>
          </div>
        </div>

        {/* Official Kinetic Robotics Club Institutional Footer */}
        <Footer />
      </div>

      {/* Config Modal */}
      <ConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        config={sheetConfig}
        onSaveConfig={cfg => {
          setSheetConfig(cfg);
          setDataSource('google-sheets');
        }}
        dataSource={dataSource}
        onSelectDataSource={setDataSource}
        isSplineEnabled={isSplineEnabled}
        onToggleSpline={setIsSplineEnabled}
        isSoundEnabled={isSoundEnabled}
        onToggleSound={setIsSoundEnabled}
        isEvaluationConcluded={isEvaluationConcluded}
        onToggleEvaluationConcluded={setIsEvaluationConcluded}
        onLockSession={handleLockSession}
      />

      {/* Simulator Drawer */}
      <SimulatorDrawer
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        teams={teams}
        onUpdateTeams={handleUpdateTeamsFromSimulator}
        onResetTeams={handleResetToDefault}
        connectionState={connectionState}
        onSetConnectionState={setConnectionState}
        isEvaluationConcluded={isEvaluationConcluded}
        onToggleEvaluationConcluded={setIsEvaluationConcluded}
        onLockSession={handleLockSession}
      />

      {/* Admin Authentication Gate Modal */}
      <AdminAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        targetFeature={targetFeature}
      />
    </div>
  );
};
