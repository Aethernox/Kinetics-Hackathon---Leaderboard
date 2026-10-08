import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { WebGLErrorBoundary } from './WebGLErrorBoundary';
import { AtmosphericBackground } from './AtmosphericBackground';

interface WebGLAtmosphereProps {
  accentColor?: 'red' | 'amber';
  interactive?: boolean;
  scrollProgress?: number; // 0 to 1
}

/**
 * Camera Controller with Smooth Parallax Drift & Scroll Z-Push
 */
const CameraRig: React.FC<{ interactive: boolean; scrollProgress: number }> = ({
  interactive,
  scrollProgress,
}) => {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!interactive) return;

    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [interactive]);

  useFrame(() => {
    // Parallax
    const targetX = mouse.current.x * 0.8;
    const targetY = -mouse.current.y * 0.5;

    // Scroll forward push
    const targetZ = 5 - scrollProgress * 3.5;

    camera.position.x += (targetX - camera.position.x) * 0.04;
    camera.position.y += (targetY - camera.position.y) * 0.04;
    camera.position.z += (targetZ - camera.position.z) * 0.05;

    camera.lookAt(0, 0, -10);
  });

  return null;
};

/**
 * Concentric 3D Robotic Telemetry Rings with Scroll Dynamic Scale
 */
const CyberCoreRings: React.FC<{ accentColor: 'red' | 'amber'; scrollProgress: number }> = ({
  accentColor,
  scrollProgress,
}) => {
  const outerRingRef = useRef<THREE.Mesh>(null);
  const midRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);

  const primaryColor = accentColor === 'red' ? '#dc2626' : '#f59e0b';
  const emissiveColor = accentColor === 'red' ? '#ef4444' : '#fbbf24';

  useFrame((_, delta) => {
    const speedBoost = 1 + scrollProgress * 2;

    if (outerRingRef.current) {
      outerRingRef.current.rotation.z += delta * 0.08 * speedBoost;
      outerRingRef.current.rotation.x = Math.sin(Date.now() * 0.0005) * 0.15;
      const s = 1 + scrollProgress * 0.4;
      outerRingRef.current.scale.set(s, s, s);
    }
    if (midRingRef.current) {
      midRingRef.current.rotation.z -= delta * 0.12 * speedBoost;
      midRingRef.current.rotation.y = Math.cos(Date.now() * 0.0006) * 0.2;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z += delta * 0.18 * speedBoost;
    }
  });

  return (
    <group position={[0, 0.5, -12]}>
      {/* Outer Segmented Ring */}
      <mesh ref={outerRingRef}>
        <torusGeometry args={[5.2, 0.04, 16, 64]} />
        <meshStandardMaterial
          color="#1e2433"
          emissive={primaryColor}
          emissiveIntensity={0.6 + scrollProgress * 0.6}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* Middle Ring with Notch Detail */}
      <mesh ref={midRingRef}>
        <torusGeometry args={[4.2, 0.06, 16, 48]} />
        <meshStandardMaterial
          color="#111827"
          emissive={emissiveColor}
          emissiveIntensity={0.8 + scrollProgress * 0.5}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Inner Telemetry Collar */}
      <mesh ref={innerRingRef}>
        <torusGeometry args={[3.0, 0.03, 16, 32]} />
        <meshStandardMaterial
          color="#374151"
          emissive={primaryColor}
          emissiveIntensity={0.4}
          roughness={0.4}
          metalness={0.7}
          wireframe
        />
      </mesh>
    </group>
  );
};

/**
 * High-Performance GPU Particles & Floating Embers
 */
const ParticleField: React.FC<{
  count?: number;
  accentColor: 'red' | 'amber';
  scrollProgress: number;
}> = ({ count = 100, accentColor, scrollProgress }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sc = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 32;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 24;
      pos[i * 3 + 2] = -Math.random() * 25;
      sc[i] = Math.random() * 0.8 + 0.2;
    }

    return [pos, sc];
  }, [count]);

  const pColor = accentColor === 'red' ? new THREE.Color('#ef4444') : new THREE.Color('#f59e0b');

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    const verticalSpeed = 0.6 + scrollProgress * 1.8;

    for (let i = 0; i < count; i++) {
      // Float upward
      array[i * 3 + 1] += delta * verticalSpeed;
      // Slight horizontal drift
      array[i * 3 + 0] += Math.sin(Date.now() * 0.001 + i) * 0.005;

      // Wrap around
      if (array[i * 3 + 1] > 14) {
        array[i * 3 + 1] = -14;
        array[i * 3 + 0] = (Math.random() - 0.5) * 32;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-scale"
          count={count}
          array={scales}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.14}
        color={pColor}
        transparent
        opacity={0.75}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

/**
 * Cyber Grid Floor Plane
 */
const CyberFloor: React.FC<{ accentColor: 'red' | 'amber' }> = ({ accentColor }) => {
  const gridColor = accentColor === 'red' ? '#dc2626' : '#f59e0b';

  return (
    <group position={[0, -5, -10]} rotation={[-Math.PI / 2.2, 0, 0]}>
      <gridHelper args={[60, 40, gridColor, '#111827']} />
    </group>
  );
};

/**
 * Pure 3D Canvas Scene
 */
const SceneContent: React.FC<{
  accentColor: 'red' | 'amber';
  interactive: boolean;
  scrollProgress: number;
}> = ({ accentColor, interactive, scrollProgress }) => {
  return (
    <>
      <CameraRig interactive={interactive} scrollProgress={scrollProgress} />

      {/* Atmospheric Lighting */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} color="#ffffff" />
      <pointLight
        position={[0, 0, -10]}
        intensity={accentColor === 'red' ? 2.5 + scrollProgress * 1.5 : 2.0}
        color={accentColor === 'red' ? '#dc2626' : '#f59e0b'}
        distance={28}
        decay={2}
      />

      {/* 3D Elements */}
      <CyberCoreRings accentColor={accentColor} scrollProgress={scrollProgress} />
      <ParticleField count={100} accentColor={accentColor} scrollProgress={scrollProgress} />
      <CyberFloor accentColor={accentColor} />
    </>
  );
};

export const WebGLAtmosphere: React.FC<WebGLAtmosphereProps> = ({
  accentColor = 'red',
  interactive = true,
  scrollProgress = 0,
}) => {
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
      }
    } catch {
      setHasWebGL(false);
    }
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#050608]">
      {/* 1. Underlying Base CSS & Canvas Atmosphere */}
      <AtmosphericBackground accentColor={accentColor} />

      {/* 2. Real-time 3D WebGL Atmosphere */}
      {hasWebGL && (
        <WebGLErrorBoundary fallback={<AtmosphericBackground accentColor={accentColor} />}>
          <Canvas
            className="absolute inset-0 w-full h-full opacity-70 mix-blend-screen"
            camera={{ position: [0, 0, 5], fov: 60 }}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: 'high-performance',
              precision: 'mediump',
            }}
            dpr={[1, Math.min(window.devicePixelRatio || 1, 2)]}
          >
            <SceneContent
              accentColor={accentColor}
              interactive={interactive}
              scrollProgress={scrollProgress}
            />
          </Canvas>
        </WebGLErrorBoundary>
      )}
    </div>
  );
};
