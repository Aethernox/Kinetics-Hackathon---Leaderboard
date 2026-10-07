import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { Edges } from '@react-three/drei';
import { Color, type Mesh } from 'three';
import { ENTRANCE_DELAY, PILLAR, RANK_COLOR, SLOT_X, computeHeights } from './theme';
import { Spring } from './fx';
import { makeNumeralTexture } from './textures';
import { TeamBadge } from './TeamBadge';
import type { HeroTeam, Rank, Tier } from './types';

export type HeightsRef = MutableRefObject<Record<Rank, number>>;

interface PillarProps {
  rank: Rank;
  height: number;
  tier: Tier;
  liveHeights: HeightsRef;
}

/** One brushed-metal pillar. Height is driven by a spring, so score changes feel physical. */
function Pillar({ rank, height, tier, liveHeights }: PillarProps) {
  const body = useRef<Mesh>(null!);
  const cap = useRef<Mesh>(null!);
  const label = useRef<Mesh>(null!);
  const spring = useRef(new Spring(0.001));
  const color = RANK_COLOR[rank];

  const numeral = useMemo(() => makeNumeralTexture(String(rank), color), [rank, color]);
  useEffect(() => () => numeral.dispose(), [numeral]);
  const capColor = useMemo(() => new Color(color).multiplyScalar(1.7), [color]);

  useFrame((state, dt) => {
    const waiting = state.clock.elapsedTime < ENTRANCE_DELAY[rank];
    const h = Math.max(0.001, spring.current.step(waiting ? 0.001 : height, dt, 70, 12));
    body.current.scale.y = h;
    body.current.position.y = h / 2;
    cap.current.position.y = h + 0.03;
    label.current.position.y = h - 0.85;
    liveHeights.current[rank] = h;
  });

  return (
    <group position-x={SLOT_X[rank]}>
      <mesh ref={body} castShadow={tier === 'high'} receiveShadow>
        <boxGeometry args={[PILLAR.width, 1, PILLAR.depth]} />
        <meshPhysicalMaterial
          color="#23252c"
          metalness={0.88}
          roughness={0.4}
          anisotropy={0.7}
          clearcoat={0.3}
          clearcoatRoughness={0.5}
          envMapIntensity={1.15}
        />
        <Edges threshold={20} color={capColor} />
      </mesh>

      {/* emissive top plate */}
      <mesh ref={cap}>
        <boxGeometry args={[PILLAR.width + 0.1, 0.06, PILLAR.depth + 0.1]} />
        <meshBasicMaterial color={capColor} toneMapped={false} />
      </mesh>

      {/* engraved rank numeral */}
      <mesh ref={label} position-z={PILLAR.depth / 2 + 0.012}>
        <planeGeometry args={[1.5, 1.5]} />
        <meshBasicMaterial map={numeral} transparent depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

interface PodiumProps {
  top3: HeroTeam[];
  tier: Tier;
  motion: boolean;
  liveHeights: HeightsRef;
}

/** Slots (pillars) are fixed; teams (badges) travel between them when ranks change. */
export function Podium({ top3, tier, motion, liveHeights }: PodiumProps) {
  const heights = computeHeights(top3[0]!.score, top3[1]!.score, top3[2]!.score);
  return (
    <group>
      {([1, 2, 3] as Rank[]).map((r) => (
        <Pillar key={r} rank={r} height={heights[r]} tier={tier} liveHeights={liveHeights} />
      ))}
      {top3.map((team, i) => (
        <TeamBadge key={team.id} team={team} rank={(i + 1) as Rank} liveHeights={liveHeights} motion={motion} />
      ))}
    </group>
  );
}
