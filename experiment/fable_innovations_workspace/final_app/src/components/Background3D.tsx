import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

const ParticleNetwork = () => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const particlesCount = 2000;
  
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    const col = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
      
      col[i * 3] = 0.5 + Math.random() * 0.5; // R
      col[i * 3 + 1] = 0.5 + Math.random() * 0.5; // G
      col[i * 3 + 2] = 1.0; // B
    }
    
    return [pos, col];
  }, [particlesCount]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      pointsRef.current.rotation.x = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.6} sizeAttenuation={true} />
    </points>
  );
};

export const Background3D: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
          <ParticleNetwork />
        </Float>
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
};
