import type { HeroTeam, Rank } from './types';

/** Design tokens (mirrors the CSS variables in hero3d.css). */
export const COLORS = {
  bg: '#06070a',
  gold: '#f5a623',
  silver: '#8fb4e8',
  bronze: '#e0702f',
  cyan: '#38d6ff', // live-signal accent: only the LiDAR scan line uses it
} as const;

export const RANK_COLOR: Record<Rank, string> = { 1: COLORS.gold, 2: COLORS.silver, 3: COLORS.bronze };
export const RANK_LABEL: Record<Rank, string> = { 1: '1st', 2: '2nd', 3: '3rd' };

/** Symmetric 2-1-3 layout: 2nd and 3rd are mirrored about the 1st-place axis. */
export const SLOT_X: Record<Rank, number> = { 1: 0, 2: -3.3, 3: 3.3 };
export const PILLAR = { width: 2.6, depth: 2.6 } as const;
export const BADGE_LIFT = 1.55;

/** Entrance choreography (seconds): 3rd, 2nd, then 1st rises. Whole intro < 2.5s. */
export const ENTRANCE_DELAY: Record<Rank, number> = { 3: 0.2, 2: 0.4, 1: 0.6 };

/** Sort by score (desc). Ties fall back to name so the order is stable. */
export function rankTeams(teams: HeroTeam[]): HeroTeam[] {
  return [...teams].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
}

/**
 * Pillar heights proportional to score gaps, clamped for readability.
 * - 3rd place is the baseline height.
 * - Every step up has a minimum rise (so 1st is always visibly taller).
 * - The span is never normalised by less than 3% of the top score, so a
 *   10-point gap does not look like a 500-point gap.
 */
export function computeHeights(s1: number, s2: number, s3: number): Record<Rank, number> {
  const MIN = 1.8;
  const STEP = 0.4;
  const EXTRA = 1.0;
  const span = Math.max(s1 - s3, s1 * 0.03, 1);
  const t = (s: number) => Math.min(1, Math.max(0, (s - s3) / span));
  return {
    3: MIN,
    2: MIN + STEP + t(s2) * EXTRA,
    1: MIN + 2 * STEP + t(s1) * EXTRA,
  };
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');
}
