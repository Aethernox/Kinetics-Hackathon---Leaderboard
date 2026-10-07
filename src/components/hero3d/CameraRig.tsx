import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils, Vector3, type PerspectiveCamera } from 'three';
import { clamp01, easeOutCubic, overtakeEnvelope, type FxRef } from './fx';

const TARGET = new Vector3(0, 2.9, 0);
const BASE_DIST = 14.5;
const BASE_PITCH = 0.1;
const PARALLAX_YAW = MathUtils.degToRad(3); // ±3° mouse parallax
const PARALLAX_PITCH = MathUtils.degToRad(1.5);
const IDLE_YAW = MathUtils.degToRad(8); // slow idle sweep
const IDLE_PITCH = MathUtils.degToRad(2);
const IDLE_AFTER = 3; // seconds without pointer movement

interface Props {
  fx: FxRef;
  motion: boolean;
  interactive: boolean;
}

/** Intro dolly, mouse parallax, idle orbit, overtake push-in, responsive framing. */
export function CameraRig({ fx, motion, interactive }: Props) {
  const k = useRef({ yaw: 0, pitch: 0, idle: 0, lastMove: 0, px: 0, py: 0 });

  useFrame((state, dt) => {
    const cam = state.camera as PerspectiveCamera;
    const t = state.clock.elapsedTime;
    const s = k.current;
    const intro = motion ? easeOutCubic(clamp01(t / 2.4)) : 1;

    let yawT = 0;
    let pitchT = 0;
    let env = 0;

    if (motion) {
      const { x, y } = state.pointer;
      if (interactive && Math.abs(x - s.px) + Math.abs(y - s.py) > 0.002) {
        s.lastMove = t;
        s.px = x;
        s.py = y;
      }
      s.idle = MathUtils.damp(s.idle, t - s.lastMove > IDLE_AFTER ? 1 : 0, 1.2, dt);
      const live = interactive ? 1 - s.idle : 0;
      yawT = live * x * PARALLAX_YAW + s.idle * Math.sin(t * 0.18) * IDLE_YAW;
      pitchT = live * -y * PARALLAX_PITCH + s.idle * Math.sin(t * 0.13 + 1) * IDLE_PITCH;
      env = overtakeEnvelope(t - fx.current.overtakeAt);
    }

    s.yaw = MathUtils.damp(s.yaw, yawT, 3, dt);
    s.pitch = MathUtils.damp(s.pitch, pitchT, 3, dt);

    // Keep the podium fully framed on narrow containers (mobile / small windows).
    const aspect = state.size.width / state.size.height;
    const halfTan = Math.tan(MathUtils.degToRad(cam.fov) / 2);
    const base = Math.max(BASE_DIST, 7.2 / (halfTan * aspect));

    const dist = base * (1 + 0.3 * (1 - intro)) * (1 - 0.2 * env);
    const pitch = BASE_PITCH + s.pitch + 0.12 * (1 - intro);
    const cp = Math.cos(pitch);

    cam.position.set(
      TARGET.x + Math.sin(s.yaw) * cp * dist,
      TARGET.y + Math.sin(pitch) * dist,
      TARGET.z + Math.cos(s.yaw) * cp * dist,
    );
    cam.lookAt(TARGET.x, TARGET.y + env * 0.8, TARGET.z);
  });

  return null;
}
