
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, MeshWobbleMaterial, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Soft Clay-like Material Utility
const ClayMaterial = ({ color, distort = 0.2, speed = 1.5 }: { color: string, distort?: number, speed?: number }) => (
  <MeshDistortMaterial
    color={color}
    distort={distort}
    speed={speed}
    roughness={0.6}
    metalness={0.1}
    flatShading={false}
  />
);

export const SoftEarth: React.FC<{ scale: number }> = ({ scale }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group scale={scale}>
      <Sphere ref={meshRef} args={[1, 64, 64]}>
        <MeshDistortMaterial
          color="#4ade80" // Green for continents
          distort={0.15}
          speed={1.5}
          roughness={0.7}
          metalness={0.05}
        />
      </Sphere>
      <Sphere args={[0.98, 64, 64]}>
        <meshStandardMaterial color="#3b82f6" roughness={0.8} />
      </Sphere>
      {/* Atmosphere / Glow */}
      <Sphere args={[1.1, 32, 32]}>
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.1} wireframe />
      </Sphere>
    </group>
  );
};

export const ClayTree: React.FC<{ growing: boolean }> = ({ growing }) => {
  const scale = growing ? 1 : 0.01;
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={groupRef} scale={[scale, scale, scale]} position={[0, -1, 0]}>
        {/* Trunk */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.15, 0.25, 1.2, 8]} />
          <meshStandardMaterial color="#92400e" roughness={0.9} />
        </mesh>
        
        {/* Leaves - Soft Clay Spheres */}
        <mesh position={[0, 1.2, 0]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <MeshWobbleMaterial color="#22c55e" speed={1} factor={0.6} />
        </mesh>
        <mesh position={[0.3, 0.9, 0.2]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <MeshWobbleMaterial color="#4ade80" speed={1.2} factor={0.4} />
        </mesh>
        <mesh position={[-0.3, 1, -0.2]}>
          <sphereGeometry args={[0.35, 16, 16]} />
          <MeshWobbleMaterial color="#16a34a" speed={0.8} factor={0.5} />
        </mesh>
      </group>
    </Float>
  );
};

interface PlanetProps {
  color: string;
  position: [number, number, number];
  size: number;
  distort?: number;
}

export const GalaxyPlanet: React.FC<PlanetProps> = ({ color, position, size, distort = 0.3 }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.002;
      meshRef.current.rotation.y += 0.003;
    }
  });

  return (
    <Float speed={3} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[size, 32, 32]} />
        <MeshDistortMaterial
          color={color}
          distort={distort}
          speed={2}
          roughness={0.5}
          metalness={0.1}
        />
      </mesh>
    </Float>
  );
};
