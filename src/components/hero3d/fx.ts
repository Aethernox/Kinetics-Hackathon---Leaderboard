import type { MutableRefObject } from 'react';

/** Critically-tunable spring used for every physical motion in the scene. */
export class Spring {
  value: number;
  velocity = 0;
  constructor(initial = 0) {
    this.value = initial;
  }
  step(target: number, dt: number, stiffness = 120, damping = 14): number {
    const h = Math.min(dt, 1 / 30);
    const n = 2; // sub-steps keep it stable on slow frames
    const s = h / n;
    for (let i = 0; i < n; i++) {
      const a = -stiffness * (this.value - target) - damping * this.velocity;
      this.velocity += a * s;
      this.value += this.velocity * s;
    }
    return this.value;
  }
}

/** Shared mutable state read inside useFrame (no React re-renders). */
export interface FxState {
  /** Clock time (s) at which the last overtake started. */
  overtakeAt: number;
}
export type FxRef = MutableRefObject<FxState>;
export const createFx = (): FxState => ({ overtakeAt: -1e9 });

export const OVERTAKE_DURATION = 2.8;

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
const smoothstep = (x: number, a: number, b: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** 0 → 1 → 0 envelope for the "overtake" moment (push-in, light boost). */
export function overtakeEnvelope(elapsed: number): number {
  if (elapsed < 0 || elapsed > OVERTAKE_DURATION) return 0;
  return smoothstep(elapsed, 0, 0.55) * (1 - smoothstep(elapsed, 1.1, OVERTAKE_DURATION));
}
