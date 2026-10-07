import { useEffect, useLayoutEffect, useMemo, useRef, type CSSProperties } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { AdditiveBlending, Color, DoubleSide, MeshBasicMaterial, Object3D, type Group, type InstancedMesh, type Material } from 'three';
import { BADGE_LIFT, ENTRANCE_DELAY, RANK_COLOR, RANK_LABEL, SLOT_X, initials } from './theme';
import { Spring } from './fx';
import { makeVerticalFade } from './textures';
import { useCountUp } from './hooks';
import type { HeightsRef } from './Podium';
import type { HeroTeam, Rank } from './types';

const HDR = 1.8; // >1 so the rings bloom on the High tier

/* ---------- radial tick marks on the hologram ring ---------- */
function Ticks({ material, radius = 0.93, count = 60 }: { material: Material; radius?: number; count?: number }) {
  const ref = useRef<InstancedMesh>(null!);
  useLayoutEffect(() => {
    const o = new Object3D();
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      o.position.set(Math.cos(a) * radius, Math.sin(a) * radius, 0);
      o.rotation.z = a - Math.PI / 2;
      o.scale.set(1, i % 5 === 0 ? 2.4 : 1, 1);
      o.updateMatrix();
      ref.current.setMatrixAt(i, o.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  }, [count, radius]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <boxGeometry args={[0.012, 0.05, 0.004]} />
      <primitive object={material} attach="material" />
    </instancedMesh>
  );
}

/* ---------- crisp HTML overlays ---------- */
function Logo({ team, rank }: { team: HeroTeam; rank: Rank }) {
  return (
    <div className={`k-logo k-logo--r${rank}`}>
      {team.logoUrl ? <img src={team.logoUrl} alt="" draggable={false} /> : initials(team.name)}
    </div>
  );
}

function InfoCard({ team, rank }: { team: HeroTeam; rank: Rank }) {
  const score = useCountUp(team.score);
  const d = team.rankDelta ?? 0;
  const style = { '--delay': `${ENTRANCE_DELAY[rank] + 0.95}s` } as CSSProperties;
  return (
    <div className={`k-badge k-badge--r${rank}`} style={style}>
      <div className="k-badge__head">
        <span className="k-badge__rank">{RANK_LABEL[rank]}</span>
        <span className={`k-badge__delta ${d > 0 ? 'is-up' : d < 0 ? 'is-down' : ''}`}>
          {d > 0 ? `▲ ${d}` : d < 0 ? `▼ ${Math.abs(d)}` : '— 0'}
        </span>
      </div>
      <div className="k-badge__name">{team.name}</div>
      <div className="k-badge__inst">{team.institution}</div>
      <div className="k-badge__score">
        {score.toLocaleString('en-US')}
        <small>PTS</small>
      </div>
    </div>
  );
}

/* ---------- the floating holographic badge ---------- */
interface Props {
  team: HeroTeam;
  rank: Rank;
  liveHeights: HeightsRef;
  motion: boolean;
}

export function TeamBadge({ team, rank, liveHeights, motion }: Props) {
  const root = useRef<Group>(null!);
  const spin = useRef<Group>(null!);
  const gyro = useRef<Group>(null!);

  const x = useRef(new Spring(SLOT_X[rank]));
  const y = useRef(new Spring(0));
  const z = useRef(new Spring(0));
  const s = useRef(new Spring(0));

  const ringMat = useMemo(
    () => new MeshBasicMaterial({ color: new Color(RANK_COLOR[rank]).multiplyScalar(HDR), toneMapped: false }),
    [],
  );
  const columnMat = useMemo(
    () => new MeshBasicMaterial({ transparent: true, opacity: 0.2, depthWrite: false, side: DoubleSide, blending: AdditiveBlending, toneMapped: false }),
    [],
  );
  const fade = useMemo(() => makeVerticalFade(), []);
  useEffect(() => {
    columnMat.alphaMap = fade;
    columnMat.needsUpdate = true;
    return () => {
      ringMat.dispose();
      columnMat.dispose();
      fade.dispose();
    };
  }, [ringMat, columnMat, fade]);

  const target = useMemo(() => new Color(RANK_COLOR[rank]).multiplyScalar(HDR), [rank]);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const ready = t > ENTRANCE_DELAY[rank] + 0.35;

    const px = x.current.step(SLOT_X[rank], dt, 55, 10);
    const py = y.current.step(ready ? liveHeights.current[rank] + BADGE_LIFT : 0.4, dt, 140, 18);
    // arc toward the camera while travelling sideways (overtake swap)
    const pz = z.current.step(motion ? Math.min(Math.abs(SLOT_X[rank] - px) * 0.5, 1.6) : 0, dt, 80, 12);
    const ps = s.current.step(ready ? 1 : 0, dt, 90, 12);

    root.current.position.set(px, py + (motion ? Math.sin(t * 1.4 + rank) * 0.06 : 0), pz);
    root.current.scale.setScalar(Math.max(ps, 0.0001));

    if (motion) {
      spin.current.rotation.z -= dt * 0.35;
      gyro.current.rotation.z += dt * 0.6;
    }
    // colour travels with the medal when a team changes rank
    ringMat.color.lerp(target, 1 - Math.exp(-5 * dt));
    columnMat.color.copy(ringMat.color);
  });

  return (
    <group ref={root}>
      {/* in-plane ring + tick marks */}
      <group ref={spin}>
        <mesh>
          <torusGeometry args={[0.8, 0.014, 12, 128]} />
          <primitive object={ringMat} attach="material" />
        </mesh>
        <Ticks material={ringMat} />
      </group>

      {/* tilted gyroscope ring with an orbiting node */}
      <group rotation-x={1.15}>
        <group ref={gyro}>
          <mesh>
            <torusGeometry args={[1.0, 0.008, 8, 128]} />
            <primitive object={ringMat} attach="material" />
          </mesh>
          <mesh position-x={1.0}>
            <sphereGeometry args={[0.035, 12, 12]} />
            <primitive object={ringMat} attach="material" />
          </mesh>
        </group>
      </group>

      {/* glass disc behind the logo */}
      <mesh position-z={-0.02}>
        <circleGeometry args={[0.74, 48]} />
        <meshBasicMaterial color="#05060a" transparent opacity={0.55} depthWrite={false} />
      </mesh>

      {/* projector column down to the pillar */}
      <mesh position-y={-BADGE_LIFT / 2}>
        <cylinderGeometry args={[0.5, 0.78, BADGE_LIFT, 32, 1, true]} />
        <primitive object={columnMat} attach="material" />
      </mesh>

      <Html center distanceFactor={14.5} zIndexRange={[10, 0]} style={{ pointerEvents: 'none' }}>
        <Logo team={team} rank={rank} />
      </Html>
      <Html center position={[0, 1.7, 0]} distanceFactor={14.5} zIndexRange={[10, 0]} style={{ pointerEvents: 'none' }}>
        <InfoCard team={team} rank={rank} />
      </Html>
    </group>
  );
}
