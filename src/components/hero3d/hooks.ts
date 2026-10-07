import { useEffect, useRef, useState, type RefObject } from 'react';
import { rankTeams } from './theme';
import type { HeroEnvironment, HeroTeam, LeaderEvent } from './types';

/** One-time capability probe (client only). Releases the probe's WebGL context. */
export function detectEnvironment(): HeroEnvironment {
  let webgl = false;
  try {
    const c = document.createElement('canvas');
    const gl = (c.getContext('webgl2') || c.getContext('webgl')) as WebGLRenderingContext | null;
    webgl = !!gl;
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    webgl = false;
  }
  const mq = (q: string) => window.matchMedia(q).matches;
  const nav = navigator as Navigator & { deviceMemory?: number };
  return {
    webgl,
    reducedMotion: mq('(prefers-reduced-motion: reduce)'),
    mobile: mq('(max-width: 767px)') || mq('(pointer: coarse)'),
    lowEnd: (navigator.hardwareConcurrency ?? 8) <= 2 || (nav.deviceMemory ?? 8) <= 2,
  };
}

/** Smooth numeric count-up used by the score readouts. */
export function useCountUp(value: number, duration = 900): number {
  const [v, setV] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const a = from.current;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / duration);
      const cur = a + (value - a) * (1 - Math.pow(1 - k, 3));
      from.current = cur;
      setV(Math.round(cur));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return v;
}

/** True while the element intersects the viewport (used to pause rendering). */
export function useInView(ref: RefObject<Element>): boolean {
  const [inView, setInView] = useState(true);
  useEffect(() => {
    if (!ref.current || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setInView(!!e?.isIntersecting), { threshold: 0.01 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [ref]);
  return inView;
}

/**
 * Watches the data and fires when the #1 team changes.
 * Returns a counter that increments per overtake (drives the 3D sequence)
 * and calls `onOvertake` so tickers / sounds can hook into the same event.
 */
export function useLeaderChange(teams: HeroTeam[], onOvertake?: (e: LeaderEvent) => void): number {
  const [count, setCount] = useState(0);
  const prev = useRef<string | null>(null);
  const cb = useRef(onOvertake);
  cb.current = onOvertake;

  useEffect(() => {
    const leader = rankTeams(teams)[0]?.id ?? null;
    if (prev.current && leader && leader !== prev.current) {
      setCount((n) => n + 1);
      cb.current?.({ type: 'NEW_LEADER', teamId: leader, previousLeaderId: prev.current });
    }
    prev.current = leader;
  }, [teams]);

  return count;
}
