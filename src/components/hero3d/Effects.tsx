import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { AdditiveBlending, BufferAttribute, BufferGeometry, MathUtils, type PointLight, type ShaderMaterial } from 'three';
import type { FxRef } from './fx';
import type { HeightsRef } from './Podium';

/* ---------- light sweep across the podium faces ---------- */
export function SweepLight({ fx, motion }: { fx: FxRef; motion: boolean }) {
  const light = useRef<PointLight>(null!);
  useFrame((s) => {
    const k = (s.clock.elapsedTime - fx.current.overtakeAt) / 1.1;
    if (!motion || k < 0 || k > 1) {
      light.current.intensity = 0;
      return;
    }
    const e = k * k * (3 - 2 * k);
    light.current.position.x = MathUtils.lerp(-8, 8, e);
    light.current.intensity = 420 * Math.sin(Math.PI * k);
  });
  return <pointLight ref={light} position={[-8, 2.4, 3.5]} intensity={0} distance={14} decay={2} color="#ffd9a0" />;
}

/* ---------- ember burst (single draw call, mutated in place) ---------- */
const COUNT = 260;

const P_VERT = /* glsl */ `
  attribute float aLife; attribute float aSize; uniform float uPR; varying float vLife;
  void main(){
    vLife = aLife;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uPR * (90.0 / -mv.z) * (0.4 + aLife);
    gl_Position = projectionMatrix * mv;
  }
`;
const P_FRAG = /* glsl */ `
  varying float vLife;
  void main(){
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5 || vLife <= 0.0) discard;
    vec3 col = mix(vec3(1.0, 0.45, 0.08), vec3(1.0, 0.82, 0.4), vLife);
    gl_FragColor = vec4(col * 1.6, smoothstep(0.5, 0.0, d) * vLife);
  }
`;

export function Burst({ fx, liveHeights, enabled }: { fx: FxRef; liveHeights: HeightsRef; enabled: boolean }) {
  const dpr = useThree((s) => s.viewport.dpr);
  const mat = useRef<ShaderMaterial>(null!);
  const seen = useRef(fx.current.overtakeAt);
  const active = useRef(false);

  const sim = useMemo(() => ({ vel: new Float32Array(COUNT * 3), age: new Float32Array(COUNT), life: new Float32Array(COUNT) }), []);
  const geo = useMemo(() => {
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(new Float32Array(COUNT * 3), 3));
    g.setAttribute('aLife', new BufferAttribute(new Float32Array(COUNT), 1));
    g.setAttribute('aSize', new BufferAttribute(Float32Array.from({ length: COUNT }, () => 0.6 + Math.random() * 1.4), 1));
    return g;
  }, []);
  useEffect(() => () => geo.dispose(), [geo]);
  const uniforms = useMemo(() => ({ uPR: { value: dpr } }), [dpr]);

  useFrame((_, dt) => {
    if (!enabled) return;
    const pos = geo.getAttribute('position') as BufferAttribute;
    const life = geo.getAttribute('aLife') as BufferAttribute;

    if (fx.current.overtakeAt !== seen.current) {
      seen.current = fx.current.overtakeAt;
      active.current = true;
      const top = liveHeights.current[1] + 0.3;
      for (let i = 0; i < COUNT; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = 1.5 + Math.random() * 4.5;
        pos.setXYZ(i, (Math.random() - 0.5) * 1.6, top, (Math.random() - 0.5) * 1.6);
        sim.vel[i * 3] = Math.cos(a) * sp;
        sim.vel[i * 3 + 1] = 3 + Math.random() * 6;
        sim.vel[i * 3 + 2] = Math.sin(a) * sp * 0.6;
        sim.age[i] = 0;
        sim.life[i] = 1.2 + Math.random() * 1.4;
      }
    }
    if (!active.current) return;

    const h = Math.min(dt, 1 / 30);
    let alive = 0;
    for (let i = 0; i < COUNT; i++) {
      if (sim.age[i]! >= sim.life[i]!) {
        life.setX(i, 0);
        continue;
      }
      alive++;
      sim.age[i]! += h;
      sim.vel[i * 3 + 1]! -= 7 * h;
      pos.setXYZ(i, pos.getX(i) + sim.vel[i * 3]! * h, pos.getY(i) + sim.vel[i * 3 + 1]! * h, pos.getZ(i) + sim.vel[i * 3 + 2]! * h);
      life.setX(i, Math.max(0, 1 - sim.age[i]! / sim.life[i]!));
    }
    pos.needsUpdate = true;
    life.needsUpdate = true;
    if (!alive) active.current = false;
  });

  if (!enabled) return null;
  return (
    <points geometry={geo} frustumCulled={false}>
      <shaderMaterial ref={mat} vertexShader={P_VERT} fragmentShader={P_FRAG} uniforms={uniforms} transparent depthWrite={false} blending={AdditiveBlending} />
    </points>
  );
}
