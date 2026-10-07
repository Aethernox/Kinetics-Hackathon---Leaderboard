import { useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { AdditiveBlending, Color } from 'three';
import { COLORS } from './theme';
import { overtakeEnvelope, type FxRef } from './fx';
import type { Tier } from './types';

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPR;
  uniform float uBoost;
  varying float vAlpha;
  varying float vSweep;
  varying float vH;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }
  float fbm(vec2 p){
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++){ v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }

  void main(){
    vec3 p = position;
    float r = length(p.xz);
    float ridge = smoothstep(10.0, 34.0, r);            // hills rise away from the stage
    float h = fbm(p.xz * 0.075 + vec2(3.1, 7.7)) * 7.5 * ridge;
    h = floor(h * 2.0) / 2.0;                           // terraced, scan-layer look
    p.y = -1.6 + h;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);

    // scanning sweep travelling toward the camera, with a fading trail
    float sweepZ = mix(-78.0, 14.0, fract(uTime * 0.06));
    float d = p.z - sweepZ;
    float sweep = exp(-d * d * 0.35) + (d < 0.0 ? exp(d * 0.22) * 0.28 : 0.0);
    sweep *= 1.0 + uBoost * 1.5;

    float edgeX = 1.0 - smoothstep(38.0, 64.0, abs(p.x));
    float farZ  = smoothstep(-75.0, -35.0, p.z);
    float nearZ = 1.0 - smoothstep(2.0, 14.0, p.z);
    float clear = smoothstep(9.0, 15.0, r);             // keep the stage area clean

    vAlpha = edgeX * farZ * nearZ * clear;
    vSweep = sweep;
    vH = clamp(h / 7.5, 0.0, 1.0);
    gl_PointSize = max(1.0, uSize * uPR * (1.0 + sweep * 1.4) * (28.0 / -mv.z));
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  uniform vec3 uBase;
  uniform vec3 uScan;
  varying float vAlpha;
  varying float vSweep;
  varying float vH;
  void main(){
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float soft = smoothstep(0.5, 0.12, d);
    vec3 col = mix(uBase * (0.55 + vH * 0.9), uScan, clamp(vSweep, 0.0, 1.0));
    float a = vAlpha * soft * (0.30 + vSweep * 0.9);
    gl_FragColor = vec4(col, a);
  }
`;

interface Props {
  tier: Tier;
  fx: FxRef;
  motion: boolean;
}

/** Dim LiDAR-style point-cloud terrain with a slow scanning sweep. Computed on the GPU. */
export function Terrain({ tier, fx, motion }: Props) {
  const dpr = useThree((s) => s.viewport.dpr);
  const [nx, nz, size] = tier === 'high' ? [170, 110, 2.4] : [100, 66, 3.1];

  const positions = useMemo(() => {
    const W = 130;
    const D = 90;
    const arr = new Float32Array(nx * nz * 3);
    let i = 0;
    for (let ix = 0; ix < nx; ix++) {
      for (let iz = 0; iz < nz; iz++) {
        arr[i++] = (ix / (nx - 1) - 0.5) * W + (Math.random() - 0.5) * (W / nx) * 0.9;
        arr[i++] = 0;
        arr[i++] = -75 + (iz / (nz - 1)) * D + (Math.random() - 0.5) * (D / nz) * 0.9;
      }
    }
    return arr;
  }, [nx, nz]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: size },
      uPR: { value: dpr },
      uBoost: { value: 0 },
      uBase: { value: new Color(COLORS.gold) },
      uScan: { value: new Color(COLORS.cyan) },
    }),
    [size, dpr],
  );

  useFrame((state) => {
    uniforms.uTime.value = motion ? state.clock.elapsedTime : 20;
    uniforms.uBoost.value = motion ? overtakeEnvelope(state.clock.elapsedTime - fx.current.overtakeAt) : 0;
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}
