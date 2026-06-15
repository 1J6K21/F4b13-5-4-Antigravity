import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function NeuralGlobe() {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const particleCount = 1000;
  const radius = 2;

  const { positions, lines, colors } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;

      pos[i * 3] = radius * Math.cos(theta) * Math.sin(phi);
      pos[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      const mixedColor = new THREE.Color();
      mixedColor.lerpColors(
        new THREE.Color('#0044ff'),
        new THREE.Color('#00e5ff'),
        Math.random()
      );
      col[i * 3] = mixedColor.r;
      col[i * 3 + 1] = mixedColor.g;
      col[i * 3 + 2] = mixedColor.b;
    }

    const lineIndices = [];
    for (let i = 0; i < particleCount; i++) {
      for (let j = i + 1; j < particleCount; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
        if (dist < 0.4) {
          lineIndices.push(i, j);
        }
      }
    }

    return { 
      positions: pos, 
      lines: new Uint16Array(lineIndices),
      colors: col
    };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (pointsRef.current && linesRef.current) {
      pointsRef.current.rotation.y = t * 0.1;
      pointsRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;
      linesRef.current.rotation.y = t * 0.1;
      linesRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;
    }
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          vertexColors={true}
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="index"
            args={[lines, 1]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#0066ff"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}
