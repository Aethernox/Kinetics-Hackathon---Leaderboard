import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Team, ConnectionState, GoogleSheetConfig } from './types/leaderboard';
import { INITIAL_TEAMS } from './services/mockData';
import { fetchGoogleSheetData } from './services/googleSheets';
import { soundFx } from './services/audioEffects';
import { isSessionAuthenticated, setSessionAuthenticated } from './services/auth';
import { getCinematicConfig } from './config/cinematic.config';
import { Header } from './components/layout/Header';
import { LeftCommandRail } from './components/layout/LeftCommandRail';
import { Footer } from './components/layout/Footer';
import {
  TerminalBoot,
  HeroCinematicSection,
  CinematicVideoBackground,
} from './components/cinematic';
import { Podium } from './components/podium/Podium';
import { LeaderboardTable } from './components/leaderboard/LeaderboardTable';
import { ConfigModal } from './components/common/ConfigModal';
import { SimulatorDrawer } from './components/common/SimulatorDrawer';
import { AdminAuthModal, ProtectedFeature } from './components/common/AdminAuthModal';

export const App: React.FC = () => {
  const cinematicConfig = getCinematicConfig();

  // Cinematic Boot Sequence State Machine
  const [isBootCompleted, setIsBootCompleted] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('skipBoot') === 'true' || urlParams.get('boot') === 'false') {
        return true;
      }
    }
    return !cinematicConfig.bootEnabled;
  });

  // Dynamic Scroll Progress State (0 to 1) for the cinematic scroll transformation
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [connectionState, setConnectionState] = useState<ConnectionState>('LIVE');
  const [lastSyncTimestamp, setLastSyncTimestamp] = useState<number | null>(Date.now());
  const [dataSource, setDataSource] = useState<'google-sheets' | 'mock' | 'simulator'>('mock');
  const [isSplineEnabled, setIsSplineEnabled] = useState(true);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(() => {
    return soundFx.getPreference() !== 'disabled';
  });
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

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
  const heroRef = useRef<HTMLDivElement | null>(null);
  const podiumRef = useRef<HTMLDivElement | null>(null);
  const tableRef = useRef<HTMLDivElement | null>(null);

  // Smooth Scroll Tracker
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY || window.pageYOffset || 0;
          const heroHeight = window.innerHeight * 0.85 || 650;
          const progress = Math.min(1, Math.max(0, scrollY / heroHeight));
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    soundFx.isMuted = !isSoundEnabled;
    if (!isSoundEnabled) {
      soundFx.stopAmbientHum();
    }
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

  const handleBootComplete = (withSound: boolean) => {
    setIsSoundEnabled(withSound);
    soundFx.setPreference(withSound);
    setIsBootCompleted(true);
  };

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

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToPodium = () => {
    if (podiumRef.current) {
      podiumRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToTable = () => {
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: 'smooth' });
    }
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
    <div className="min-h-screen w-full bg-[#050505] text-[#fafafa] flex flex-col justify-between relative overflow-x-hidden font-sans select-none antialiased">
      {/* 1. Cinematic Terminal Boot Overlay */}
      {!isBootCompleted && (
        <TerminalBoot onComplete={handleBootComplete} />
      )}

      {/* 2. Full-Bleed CloudFront Cinematic Video Background Plane (Behind 2D Live Leaderboard) */}
      <CinematicVideoBackground
        scrollProgress={scrollProgress}
      />

      {/* 3. Minimal Left Vertical Command Rail */}
      <LeftCommandRail
        onScrollToTop={handleScrollToTop}
        onScrollToPodium={handleScrollToPodium}
        onScrollToTable={handleScrollToTable}
        onOpenSimulator={handleOpenSimulator}
        onOpenConfig={handleOpenConfig}
      />

      {/* 4. Main Dashboard UI Container */}
      <div className="relative z-10 flex flex-col min-h-screen lg:pl-16">
        {/* Top Header with Navigation Tabs, Telemetry & Sound Controls */}
        <Header
          connectionState={connectionState}
          lastSyncTimestamp={lastSyncTimestamp}
          isSoundEnabled={isSoundEnabled}
          onToggleSound={() => setIsSoundEnabled(!isSoundEnabled)}
          onOpenConfig={handleOpenConfig}
          onOpenSimulator={handleOpenSimulator}
          onManualRefresh={performSync}
          dataSource={dataSource}
          isAuthenticated={isAuthenticated}
          onToggleAuthLock={handleLockSession}
          onScrollToTop={handleScrollToTop}
          onScrollToPodium={handleScrollToPodium}
          onScrollToTable={handleScrollToTable}
        />

        {/* 5. PRIMARY CONTENT STAGE: Live Cinematic Hero + Top 3 Spotlight Podium */}
        <div className="w-full flex flex-col">
          {/* Full-Screen Hero */}
          <div ref={heroRef} className="w-full">
            <HeroCinematicSection
              scrollProgress={scrollProgress}
              onScrollToTable={handleScrollToTable}
              onOpenSimulator={handleOpenSimulator}
              onOpenConfig={handleOpenConfig}
            />
          </div>

          {/* Telemetry Status Bar */}
          <div
            ref={podiumRef}
            className="w-full max-w-6xl mx-auto px-4 sm:px-8 pt-6 pb-3 flex items-center justify-between border-t border-white/[0.08] text-xs font-mono text-[#a7a6a6] tracking-wider"
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-subtlePulse" />
              <span className="text-white font-medium uppercase tracking-[0.2em]">
                TELEMETRY ARENA // ROUND 04 ACTIVE
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-4 text-[11px] text-[#71717a]">
              <span>28.6139° N, 77.2090° E</span>
              <span>•</span>
              <span className="text-[#a7a6a6]">STATUS: LIVE FEED</span>
            </div>
          </div>

          {/* Top 3 Cyber Spotlight Podium */}
          <Podium teams={teams} onScrollToTable={handleScrollToTable} />
        </div>

        {/* 6. Main Flat Continuous Leaderboard Table */}
        <div ref={tableRef} className="pt-2">
          <LeaderboardTable teams={teams} />
        </div>

        {/* 7. Bottom System Telemetry Bar */}
        <div className="w-full py-3 px-6 border-t border-white/[0.08] bg-[#050505]/90 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between text-xs text-[#71717a]">
          <div className="flex items-center gap-3">
            <span className="text-[#a7a6a6] font-mono">
              ● {cinematicConfig.title.toUpperCase()}
            </span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">
              STATUS: OPTIMAL
            </span>
          </div>
          <div className="flex items-center gap-4 mt-1 sm:mt-0 font-mono">
            <span>ENGINE: {dataSource.toUpperCase()}</span>
            <span>POLL: {sheetConfig.pollIntervalMs}ms</span>
            <span>MODE: 2D LIVE DASHBOARD</span>
          </div>
        </div>

        {/* 8. Official Footer */}
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
