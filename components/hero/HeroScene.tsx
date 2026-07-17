'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, Stars } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

function StadiumBowl() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.03;
  });

  const tiers = useMemo(() => {
    const arr: { radius: number; tube: number; y: number; color: string; opacity: number }[] = [];
    for (let i = 0; i < 6; i++) {
      arr.push({
        radius: 5.2 + i * 0.55,
        tube: 0.3,
        y: -2.6 + i * 0.7,
        color: i % 2 === 0 ? '#11111e' : '#0a0a14',
        opacity: 0.85 - i * 0.08,
      });
    }
    return arr;
  }, []);

  return (
    <group ref={group} rotation={[0.4, 0, 0]} position={[0, -1.6, 0]}>
      {/* Stadium Field */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.6, 0]}>
        <circleGeometry args={[4.8, 64]} />
        <meshStandardMaterial
          color="#061a10"
          emissive="#0d331f"
          emissiveIntensity={0.25}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.59, 0]}>
        <ringGeometry args={[4.78, 4.88, 64]} />
        <meshBasicMaterial color="#5eead4" transparent opacity={0.35} />
      </mesh>

      {/* Stadium outer rings */}
      {tiers.map((t, i) => (
        <mesh key={i} position={[0, t.y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[t.radius, t.tube, 12, 72]} />
          <meshStandardMaterial
            color={t.color}
            metalness={0.6}
            roughness={0.4}
            transparent
            opacity={t.opacity}
          />
        </mesh>
      ))}

      {/* Light pylons with volumetric searchlight cone meshes */}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        const r = 8.8;
        const x = Math.cos(a) * r;
        const z = Math.sin(a) * r;
        return (
          <group key={`p-${i}`} position={[x, 0.2, z]}>
            {/* Pylon pole */}
            <mesh position={[0, 1, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 2, 8]} />
              <meshStandardMaterial
                color="#161624"
                emissive="#ff6b2c"
                emissiveIntensity={0.4}
              />
            </mesh>
            {/* Volumetric spotlight cone */}
            <mesh position={[0, 3.5, 0]} rotation={[0.15, 0, 0.15]}>
              <coneGeometry args={[0.9, 5, 16, 1, true]} />
              <meshBasicMaterial
                color={i % 2 === 0 ? '#ff6b2c' : '#5eead4'}
                transparent
                opacity={0.06}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function AICore() {
  const group = useRef<THREE.Group>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const orbitRingRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!group.current || !shellRef.current || !orbitRingRef.current) return;
    
    // Core rotation
    group.current.rotation.y = state.clock.elapsedTime * 0.3;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.15;
    
    // Core pulse size
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 2.5) * 0.04;
    group.current.scale.set(pulse, pulse, pulse);

    // Orbit speed
    orbitRingRef.current.rotation.y = state.clock.elapsedTime * 0.8;
    orbitRingRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    
    shellRef.current.rotation.y = -state.clock.elapsedTime * 0.15;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.8}>
      <group ref={group} position={[0, 2.5, 0]}>
        {/* Core center */}
        <mesh>
          <icosahedronGeometry args={[0.7, 3]} />
          <meshStandardMaterial
            color="#ff6b2c"
            emissive="#ff6b2c"
            emissiveIntensity={1.2}
            metalness={0.6}
            roughness={0.2}
          />
        </mesh>
        
        {/* Holographic shell */}
        <mesh ref={shellRef} scale={1.35}>
          <sphereGeometry args={[0.7, 24, 24]} />
          <meshBasicMaterial color="#ff8a4c" transparent opacity={0.12} wireframe />
        </mesh>
        
        {/* Outer wireframe shell */}
        <mesh scale={1.7}>
          <icosahedronGeometry args={[0.7, 1]} />
          <meshBasicMaterial color="#8b5cf6" wireframe transparent opacity={0.3} />
        </mesh>

        {/* Dynamic orbit ring */}
        <mesh ref={orbitRingRef} rotation={[Math.PI / 2.2, 0, 0]}>
          <torusGeometry args={[1.5, 0.015, 8, 64]} />
          <meshBasicMaterial color="#5eead4" transparent opacity={0.5} />
        </mesh>
        
        {/* Inner secondary orbit ring */}
        <mesh rotation={[-Math.PI / 2.5, 0, 0]}>
          <torusGeometry args={[1.8, 0.01, 6, 48]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.25} />
        </mesh>
      </group>
    </Float>
  );
}

function Drones() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.18;
  });
  
  const drones = useMemo(
    () =>
      Array.from({ length: 4 }).map((_, i) => {
        const a = (i / 4) * Math.PI * 2;
        const r = 7.2 + (i % 2) * 0.8;
        const y = 2.2 + Math.sin(i) * 0.8;
        return { pos: [Math.cos(a) * r, y, Math.sin(a) * r] as [number, number, number], key: i };
      }),
    []
  );

  return (
    <group ref={ref}>
      {drones.map((d) => (
        <Float key={d.key} speed={2.5} rotationIntensity={0.6} floatIntensity={1.2}>
          <mesh position={d.pos}>
            <boxGeometry args={[0.16, 0.06, 0.16]} />
            <meshStandardMaterial
              color="#11111c"
              emissive="#5eead4"
              emissiveIntensity={1}
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 3.8, 14.5], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <fog attach="fog" args={['#06060a', 15, 26]} />
      <ambientLight intensity={0.25} />
      
      {/* Dynamic light sources */}
      <pointLight position={[0, 6, 0]} intensity={2.2} color="#ff6b2c" distance={18} />
      <pointLight position={[8, 3, 6]} intensity={1.2} color="#8b5cf6" distance={16} />
      <pointLight position={[-8, 2, -4]} intensity={0.8} color="#5eead4" distance={14} />

      <StadiumBowl />
      <AICore />
      <Drones />

      {/* Sparkle groups */}
      <Sparkles count={55} scale={[16, 12, 16]} size={1.8} speed={0.2} color="#ff8a4c" opacity={0.35} />
      <Sparkles count={40} scale={[14, 10, 14]} size={1.2} speed={0.12} color="#5eead4" opacity={0.3} />
      
      {/* Background star depth field */}
      <Stars radius={40} depth={18} count={500} factor={3} fade speed={0.4} />
    </Canvas>
  );
}
