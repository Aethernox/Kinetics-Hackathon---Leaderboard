import { Suspense, useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import { CameraRig } from './CameraRig';
import { Terrain } from './Terrain';
import { Beam, Floor, GlowPools, Lights } from './Stage';
import { Podium, type HeightsRef } from './Podium';
import { Burst, SweepLight } from './Effects';
import { createFx, type FxRef } from './fx';
import type { HeroTeam, Tier } from './types';

export interface Scene3DProps {
  top3: HeroTeam[];
  tier: Tier;
  /** false → no camera moves, orbit, particles or bobbing (prefers-reduced-motion). */
  motion: boolean;
  /** false → no pointer parallax (touch / compact mode). */
  interactive: boolean;
  /** Pauses rendering when the hero is off-screen. */
  active: boolean;
  /** Increments every time the leader changes. */
  overtakeId: number;
  background: string;
  onDecline?: () => void;
  onFallback?: () => void;
  onContextLost?: () => void;
}

/** Turns the React-side overtake counter into a timestamp the render loop can read. */
function EventBridge({ fx, overtakeId }: { fx: FxRef; overtakeId: number }) {
  const clock = useThree((s) => s.clock);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    fx.current.overtakeAt = clock.getElapsedTime();
  }, [overtakeId, fx, clock]);
  return null;
}

export default function Scene3D({ top3, tier, motion, interactive, active, overtakeId, background, onDecline, onFallback, onContextLost }: Scene3DProps) {
  const fx = useRef(createFx());
  const liveHeights: HeightsRef = useRef({ 1: 0.001, 2: 0.001, 3: 0.001 });

  return (
    <Canvas
      flat
      dpr={tier === 'high' ? [1, 2] : [1, 1.5]}
      shadows={tier === 'high'}
      frameloop={active ? 'always' : 'never'}
      camera={{ fov: 36, near: 0.1, far: 220, position: [0, 4.6, 18] }}
      gl={{ antialias: tier !== 'high', powerPreference: 'high-performance' }}
      style={{ pointerEvents: interactive ? 'auto' : 'none' }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault();
          onContextLost?.();
        });
      }}
    >
      <color attach="background" args={[background]} />
      <fog attach="fog" args={[background, 22, 70]} />

      <PerformanceMonitor onDecline={onDecline} onFallback={onFallback} flipflops={3} />

      <Suspense fallback={null}>
        <EventBridge fx={fx} overtakeId={overtakeId} />
        <CameraRig fx={fx} motion={motion} interactive={interactive} />

        <Lights tier={tier} fx={fx} motion={motion} />
        <Terrain tier={tier} fx={fx} motion={motion} />
        <Floor tier={tier} />
        <GlowPools />
        <Beam fx={fx} motion={motion} />
        <Podium top3={top3} tier={tier} motion={motion} liveHeights={liveHeights} />

        <SweepLight fx={fx} motion={motion} />
        <Burst fx={fx} liveHeights={liveHeights} enabled={tier === 'high' && motion} />

        {tier === 'high' && (
          <EffectComposer multisampling={4}>
            <Bloom mipmapBlur intensity={0.9} luminanceThreshold={1} luminanceSmoothing={0.2} />
            <Vignette eskil={false} offset={0.15} darkness={0.75} />
          </EffectComposer>
        )}
      </Suspense>
    </Canvas>
  );
}
