
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, MeshWobbleMaterial, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Soft Clay-like Material Utility
const ClayMaterial = ({ color, distort = 0.2, speed = 1.5, opacity = 1 }: { color: string, distort?: number, speed?: number, opacity?: number }) => (
  <MeshDistortMaterial
    color={color}
    distort={distort}
    speed={speed}
    roughness={0.6}
    metalness={0.1}
    flatShading={false}
    transparent={opacity < 1}
    opacity={opacity}
  />
);

const TreeDetail = ({ position, scale = 0.05 }: { position: [number, number, number], scale?: number }) => {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.2, 0.4, 1, 6]} />
        <meshStandardMaterial color="#78350f" roughness={1} />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.8, 12, 12]} />
        <meshStandardMaterial color="#22c55e" roughness={0.8} />
      </mesh>
    </group>
  );
};

const CloudDetail = ({ position, scale = 0.15 }: { position: [number, number, number], scale?: number }) => {
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group position={position} scale={scale}>
        <Sphere args={[1, 16, 16]}>
          <meshStandardMaterial color="white" roughness={0.9} transparent opacity={0.9} />
        </Sphere>
        <Sphere args={[0.7, 16, 16]} position={[0.8, -0.2, 0]}>
          <meshStandardMaterial color="white" roughness={0.9} transparent opacity={0.9} />
        </Sphere>
        <Sphere args={[0.6, 16, 16]} position={[-0.7, -0.3, 0.2]}>
          <meshStandardMaterial color="white" roughness={0.9} transparent opacity={0.9} />
        </Sphere>
      </group>
    </Float>
  );
};

export const SoftEarth: React.FC<{ scale: number }> = ({ scale }) => {
  const groupRef = useRef<THREE.Group>(null);
  const waterRef = useRef<THREE.Mesh>(null);
  
  // Pre-calculate random positions for surface details
  const details = useMemo(() => {
    const trees: [number, number, number][] = [];
    const flowers: { pos: [number, number, number], color: string }[] = [];
    const clouds: [number, number, number][] = [];
    
    const flowerColors = ['#f472b6', '#fbbf24', '#a78bfa'];

    for (let i = 0; i < 40; i++) {
      const phi = Math.acos(-1 + (2 * i) / 40);
      const theta = Math.sqrt(40 * Math.PI) * phi;
      const x = Math.cos(theta) * Math.sin(phi);
      const y = Math.sin(theta) * Math.sin(phi);
      const z = Math.cos(phi);
      
      // Trees and flowers only on "continents" (pseudo-randomly)
      if (Math.random() > 0.4) {
        trees.push([x * 1.02, y * 1.02, z * 1.02]);
      } else {
        flowers.push({
          pos: [x * 1.01, y * 1.01, z * 1.01],
          color: flowerColors[Math.floor(Math.random() * flowerColors.length)]
        });
      }
    }

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      clouds.push([
        Math.cos(angle) * 1.4,
        (Math.random() - 0.5) * 0.8,
        Math.sin(angle) * 1.4
      ]);
    }

    return { trees, flowers, clouds };
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003;
    }
    if (waterRef.current) {
      waterRef.current.rotation.y -= 0.001;
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      {/* Water Layer */}
      <Sphere ref={waterRef} args={[0.98, 64, 64]}>
        <MeshWobbleMaterial color="#3b82f6" speed={1} factor={0.2} roughness={0.4} />
      </Sphere>

      {/* Continents Layer */}
      <Sphere args={[1, 64, 64]}>
        <MeshDistortMaterial
          color="#4ade80"
          distort={0.2}
          speed={1.2}
          roughness={0.7}
          metalness={0.05}
        />
      </Sphere>

      {/* Flora: Trees */}
      {details.trees.map((pos, i) => (
        <TreeDetail key={`tree-${i}`} position={pos} scale={0.03 + Math.random() * 0.02} />
      ))}

      {/* Flora: Flowers */}
      {details.flowers.map((f, i) => (
        <mesh key={`flower-${i}`} position={f.pos}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshStandardMaterial color={f.color} />
        </mesh>
      ))}

      {/* Clouds */}
      {details.clouds.map((pos, i) => (
        <CloudDetail key={`cloud-${i}`} position={pos} scale={0.1 + Math.random() * 0.1} />
      ))}

      {/* Fauna: Orbiting Birds */}
      <Float speed={5} rotationIntensity={2} floatIntensity={1}>
        <group position={[1.5, 0.5, 0]}>
          <Sphere args={[0.03, 8, 8]}>
            <meshStandardMaterial color="#f8fafc" />
          </Sphere>
          <mesh position={[0.04, 0, 0]} rotation={[0, 0, 0.5]}>
            <boxGeometry args={[0.06, 0.01, 0.03]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          <mesh position={[-0.04, 0, 0]} rotation={[0, 0, -0.5]}>
            <boxGeometry args={[0.06, 0.01, 0.03]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
        </group>
      </Float>

      {/* Atmosphere Glow */}
      <Sphere args={[1.2, 32, 32]}>
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.05} wireframe />
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
    <Float speed={3} rotationIntensity={0.5} floatIntensity={0.5}>
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
