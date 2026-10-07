import { Component, Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { HeroFallback2D } from './HeroFallback2D';
import { detectEnvironment, useInView, useLeaderChange } from './hooks';
import { COLORS, RANK_LABEL, rankTeams } from './theme';
import type { HeroEnvironment, HeroTeam, LeaderEvent, Tier, VisualQuality } from './types';
import './hero3d.css';

// All Three.js code lives in this lazy chunk, so the table can render first.
const Scene3D = lazy(() => import('./Scene3D'));

export interface Hero3DProps {
  /** Any number of teams; the top 3 by score are shown. */
  teams: HeroTeam[];
  /** Wire this to Settings → Visual Quality. Default "auto". */
  quality?: VisualQuality;
  /** Scene background. Match your page background so the edges blend. */
  background?: string;
  /** 'fallback' (default): reduced-motion users get the 2D cards. 'static': 3D with all motion off. */
  reducedMotionMode?: 'fallback' | 'static';
  /** Fires when #1 changes. Hook your ticker / sounds here. */
  onOvertake?: (e: LeaderEvent) => void;
  /** Render your existing podium cards instead of the built-in 2D fallback. */
  renderFallback?: (top3: HeroTeam[]) => ReactNode;
  className?: string;
}

class HeroBoundary extends Component<{ fallback: ReactNode; onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export function Hero3D({
  teams,
  quality = 'auto',
  background = COLORS.bg,
  reducedMotionMode = 'fallback',
  onOvertake,
  renderFallback,
  className = '',
}: Hero3DProps) {
  const wrap = useRef<HTMLElement>(null);
  const inView = useInView(wrap);
  const top3 = useMemo(() => rankTeams(teams).slice(0, 3), [teams]);
  const overtakeId = useLeaderChange(teams, onOvertake);

  const [env, setEnv] = useState<HeroEnvironment | null>(null);
  const [autoTier, setAutoTier] = useState<Tier>('high');
  const [failed, setFailed] = useState(false);
  const mountedAt = useRef(0);

  useEffect(() => {
    const e = detectEnvironment();
    setEnv(e);
    setAutoTier(e.lowEnd ? 'low' : e.mobile ? 'medium' : 'high');
  }, []);

  const tier: Tier = quality === 'auto' ? autoTier : quality;
  const use3D =
    !!env && env.webgl && !failed && tier !== 'low' && top3.length === 3 && !(env.reducedMotion && reducedMotionMode === 'fallback');

  useEffect(() => {
    if (use3D) mountedAt.current = performance.now();
  }, [use3D, tier]);

  // Step down High → Medium → Low, but ignore the first seconds (shader compile hitches).
  const stepDown = useCallback(() => {
    if (quality !== 'auto' || performance.now() - mountedAt.current < 4500) return;
    setAutoTier((t) => (t === 'high' ? 'medium' : 'low'));
  }, [quality]);
  const dropToLow = useCallback(() => {
    if (quality === 'auto') setAutoTier('low');
  }, [quality]);

  const fallback = renderFallback ? renderFallback(top3) : <HeroFallback2D teams={top3} />;

  return (
    <section ref={wrap} className={`k-hero3d ${className}`} style={{ ['--k-bg' as string]: background }} aria-label="Top three teams">
      <div className="k-hero3d__stage" aria-hidden="true">
        {use3D && env ? (
          <HeroBoundary fallback={fallback} onError={() => setFailed(true)}>
            <Suspense fallback={fallback}>
              <Scene3D
                key={tier}
                top3={top3}
                tier={tier}
                motion={!env.reducedMotion}
                interactive={!env.mobile}
                active={inView}
                overtakeId={overtakeId}
                background={background}
                onDecline={stepDown}
                onFallback={dropToLow}
                onContextLost={() => setFailed(true)}
              />
            </Suspense>
          </HeroBoundary>
        ) : (
          fallback
        )}
      </div>

      <div className="k-hero3d__fade" aria-hidden="true" />

      {/* Screen-reader summary + live announcement when positions change */}
      <ol className="k-sr-only" aria-live="polite">
        {top3.map((t, i) => (
          <li key={t.id}>
            {RANK_LABEL[(i + 1) as 1 | 2 | 3]}: {t.name}, {t.institution}, {t.score.toLocaleString('en-US')} points
          </li>
        ))}
      </ol>
    </section>
  );
}
