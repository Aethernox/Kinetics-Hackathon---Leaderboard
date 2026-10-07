import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Lightformer, MeshReflectorMaterial } from '@react-three/drei';
import { AdditiveBlending, Color, DoubleSide, Quaternion, Vector3, type Mesh, type ShaderMaterial, type SpotLight } from 'three';
import { COLORS, RANK_COLOR, SLOT_X } from './theme';
import { overtakeEnvelope, type FxRef } from './fx';
import { makeRadialGlow } from './textures';
import type { Rank, Tier } from './types';

/* ---- Tuning knobs ---------------------------------------------------------- */
const SPOT_BASE = 1100; // spotlight intensity at rest
const SPOT_BOOST = 2200; // extra intensity at the peak of an overtake
const FLOOR_RADIUS = 9.5;

/* ---- Lights + procedural studio environment (no HDR download needed) ------- */
export function Lights({ tier, fx, motion }: { tier: Tier; fx: FxRef; motion: boolean }) {
  const spot = useRef<SpotLight>(null!);

  useEffect(() => {
    spot.current.target.position.set(0, 2.4, 0);
    spot.current.target.updateMatrixWorld();
  }, []);

  useFrame((s) => {
    const env = motion ? overtakeEnvelope(s.clock.elapsedTime - fx.current.overtakeAt) : 0;
    spot.current.intensity = SPOT_BASE + SPOT_BOOST * env;
  });

  return (
    <>
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 8, 2]} rotation-x={Math.PI / 2} scale={[14, 8, 1]} color="#fff3df" />
        <Lightformer form="rect" intensity={2.4} position={[-9, 3, 2]} rotation-y={Math.PI / 2} scale={[10, 5, 1]} color={COLORS.gold} />
        <Lightformer form="rect" intensity={2.4} position={[9, 3, 2]} rotation-y={-Math.PI / 2} scale={[10, 5, 1]} color={COLORS.gold} />
        <Lightformer form="ring" intensity={1.4} position={[0, 4, -10]} scale={7} color="#ffe2b0" />
      </Environment>

      <ambientLight intensity={0.12} color="#8aa0c0" />
      <spotLight
        ref={spot}
        position={[0, 10, 3]}
        angle={0.3}
        penumbra={0.85}
        decay={2}
        distance={32}
        color={COLORS.gold}
        castShadow={tier === 'high'}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
      />
      <pointLight position={[-9, 3, -3]} intensity={90} distance={24} color={COLORS.gold} />
      <pointLight position={[9, 3, -3]} intensity={90} distance={24} color={COLORS.gold} />
      <pointLight position={[0, 2, 10]} intensity={40} distance={22} color="#9fb8d8" />
    </>
  );
}

/* ---- Reflective circular stage ---------------------------------------------- */
export function Floor({ tier }: { tier: Tier }) {
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <circleGeometry args={[FLOOR_RADIUS, 96]} />
        {tier === 'high' ? (
          <MeshReflectorMaterial
            blur={[320, 90]}
            resolution={512}
            mixBlur={1}
            mixStrength={34}
            roughness={1}
            depthScale={1.1}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#0d0e12"
            metalness={0.55}
            mirror={0}
          />
        ) : (
          <meshStandardMaterial color="#0c0d11" metalness={0.8} roughness={0.32} />
        )}
      </mesh>
      {/* amber rim + faint concentric guides */}
      <mesh rotation-x={-Math.PI / 2} position-y={0.006}>
        <ringGeometry args={[FLOOR_RADIUS - 0.08, FLOOR_RADIUS, 160]} />
        <meshBasicMaterial color={new Color(COLORS.gold).multiplyScalar(1.5)} toneMapped={false} />
      </mesh>
      {[5.2, 7.4].map((r) => (
        <mesh key={r} rotation-x={-Math.PI / 2} position-y={0.005}>
          <ringGeometry args={[r - 0.012, r + 0.012, 160]} />
          <meshBasicMaterial color={COLORS.gold} transparent opacity={0.18} />
        </mesh>
      ))}
    </group>
  );
}

/* ---- Amber / steel / copper light pools under each pillar ------------------- */
export function GlowPools() {
  const map = useMemo(() => makeRadialGlow(), []);
  useEffect(() => () => map.dispose(), [map]);
  return (
    <>
      {([1, 2, 3] as Rank[]).map((r) => (
        <mesh key={r} rotation-x={-Math.PI / 2} position={[SLOT_X[r], 0.012, 0.2]}>
          <planeGeometry args={[7.2, 7.2]} />
          <meshBasicMaterial
            map={map}
            color={RANK_COLOR[r]}
            transparent
            opacity={r === 1 ? 0.55 : 0.32}
            depthWrite={false}
            blending={AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      ))}
    </>
  );
}

/* ---- Volumetric spotlight cone on 1st place ---------------------------------- */
const BEAM_VERT = /* glsl */ `
  varying vec3 vN; varying vec3 vV; varying float vY;
  void main(){
    vY = uv.y;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;
const BEAM_FRAG = /* glsl */ `
  uniform vec3 uColor; uniform float uIntensity;
  varying vec3 vN; varying vec3 vV; varying float vY;
  void main(){
    float soft = pow(abs(dot(normalize(vN), normalize(vV))), 2.2);
    float along = pow(vY, 1.1);
    gl_FragColor = vec4(uColor, soft * along * uIntensity);
  }
`;

export function Beam({ fx, motion }: { fx: FxRef; motion: boolean }) {
  const mat = useRef<ShaderMaterial>(null!);
  const mesh = useRef<Mesh>(null!);
  const uniforms = useMemo(() => ({ uColor: { value: new Color(COLORS.gold) }, uIntensity: { value: 0.35 } }), []);

  const geo = useMemo(() => {
    const L = new Vector3(0, 11, 3); // light source
    const T = new Vector3(0, 3.2, 0); // beam lands on top of the 1st pillar
    const dir = L.clone().sub(T);
    const height = dir.length();
    return {
      height,
      radius: Math.tan(0.24) * height,
      position: L.clone().add(T).multiplyScalar(0.5),
      quaternion: new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), dir.normalize()),
    };
  }, []);

  useEffect(() => {
    mesh.current.quaternion.copy(geo.quaternion);
  }, [geo]);

  useFrame((s) => {
    const env = motion ? overtakeEnvelope(s.clock.elapsedTime - fx.current.overtakeAt) : 0;
    mat.current.uniforms.uIntensity.value = 0.32 + 0.55 * env;
  });

  return (
    <mesh ref={mesh} position={geo.position} frustumCulled={false}>
      <coneGeometry args={[geo.radius, geo.height, 48, 1, true]} />
      <shaderMaterial
        ref={mat}
        vertexShader={BEAM_VERT}
        fragmentShader={BEAM_FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={DoubleSide}
        blending={AdditiveBlending}
      />
    </mesh>
  );
}
