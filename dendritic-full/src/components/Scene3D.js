// src/components/Scene3D.js
import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

function DeliveryBox({ position, scale = 1, speed = 1, color = '#C9A84C' }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed;
    ref.current.rotation.y += 0.007 * speed;
    ref.current.position.y = position[1] + Math.sin(t * 0.5) * 0.28;
  });
  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh castShadow>
        <boxGeometry args={[1, 0.85, 1]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.47, 0]}>
        <boxGeometry args={[1.06, 0.11, 1.06]} />
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.02, 0.85, 0.055]} />
        <meshStandardMaterial color="#8B6914" />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.055, 0.85, 1.02]} />
        <meshStandardMaterial color="#8B6914" />
      </mesh>
      <pointLight position={[0, -0.8, 0]} color={color} intensity={0.5} distance={3} />
    </group>
  );
}

function GlowOrb({ position, color, size = 1 }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) ref.current.distort = 0.28 + Math.sin(clock.elapsedTime * 0.8) * 0.14;
  });
  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={1.4}>
      <Sphere ref={ref} position={position} args={[size, 48, 48]}>
        <MeshDistortMaterial
          color={color} speed={2} distort={0.28} transparent
          opacity={0.16} emissive={color} emissiveIntensity={0.4}
        />
      </Sphere>
    </Float>
  );
}

function ParticleRing() {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      const a = (i / 200) * Math.PI * 2;
      const r = 6 + Math.random() * 2;
      arr[i * 3]     = Math.cos(a) * r;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 2;
      arr[i * 3 + 2] = Math.sin(a) * r;
    }
    return arr;
  }, []);
  useFrame(({ clock }) => { ref.current.rotation.y = clock.elapsedTime * 0.04; });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={200} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#C9A84C" size={0.04} transparent opacity={0.6} />
    </points>
  );
}

function CityNode({ position }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    ref.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 2 + position[0]) * 0.16);
  });
  return (
    <group position={position}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial color="#C9A84C" emissive="#C9A84C" emissiveIntensity={1.5} />
      </mesh>
      <pointLight color="#C9A84C" intensity={0.8} distance={2.5} />
    </group>
  );
}

function SceneContent() {
  const group = useRef();
  useFrame(({ clock }) => { group.current.rotation.y = clock.elapsedTime * 0.035; });

  const cities = [[0,0,0],[1.5,-1,1],[-2,-2,1.5],[2.5,-1.5,-1],[-1,0.5,-2],[0.5,1,2]];
  const connections = [[0,1],[0,2],[0,3],[0,4],[1,3],[2,4],[3,5]];

  return (
    <group ref={group}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10,10,5]} intensity={1} color="#FFF5DC" castShadow />
      <directionalLight position={[-10,-5,-5]} intensity={0.3} color="#C9A84C" />
      <pointLight position={[0,5,0]} color="#C9A84C" intensity={2} distance={15} />
      <Stars radius={80} depth={60} count={2000} factor={3} fade speed={0.5} />

      <Float speed={1.5} floatIntensity={1}>
        <DeliveryBox position={[0,0,0]} scale={1.2} speed={0.8} color="#C9A84C" />
      </Float>
      <DeliveryBox position={[-3.5,1,-2]} scale={0.7} speed={1.2} color="#8B6914" />
      <DeliveryBox position={[3.8,-0.5,-1.5]} scale={0.5} speed={0.6} color="#E8C97A" />
      <DeliveryBox position={[-2,-2,2]} scale={0.4} speed={1.5} color="#C9A84C" />
      <DeliveryBox position={[2,2.5,1]} scale={0.35} speed={1} color="#D4A853" />

      <GlowOrb position={[0,0,0]} color="#C9A84C" size={3} />
      <GlowOrb position={[-4,2,-3]} color="#8B4513" size={1.4} />
      <GlowOrb position={[5,-2,0]} color="#C9A84C" size={1.2} />

      {cities.map((c, i) => <CityNode key={i} position={c} />)}
      {connections.map(([a, b], i) => {
        const pts = [new THREE.Vector3(...cities[a]), new THREE.Vector3(...cities[b])];
        return (
          <line key={i} geometry={new THREE.BufferGeometry().setFromPoints(pts)}>
            <lineBasicMaterial color="#C9A84C" transparent opacity={0.18} />
          </line>
        );
      })}
      <ParticleRing />
    </group>
  );
}

export default function Scene3D({ style }) {
  return (
    <Canvas style={style} camera={{ position: [0, 2, 10], fov: 55 }} shadows dpr={[1,2]}>
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  );
}
