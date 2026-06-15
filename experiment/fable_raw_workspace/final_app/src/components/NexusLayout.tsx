import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { NeuralGlobe } from './NeuralGlobe';
import { MetricsOverlay } from './MetricsOverlay';
import { AIInterface } from './AIInterface';

export function NexusLayout() {
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans selection:bg-brand selection:text-black">
      
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-brand/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
          <color attach="background" args={['#050505']} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#00e5ff" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#aa3bff" />
          <NeuralGlobe />
          <OrbitControls 
            enablePan={false}
            enableZoom={true}
            minDistance={3}
            maxDistance={10}
            autoRotate
            autoRotateSpeed={0.5}
          />
          <EffectComposer>
            <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={1.5} />
          </EffectComposer>
        </Canvas>
      </div>

      {/* UI Overlay */}
      <MetricsOverlay />
      
      {/* Interactive Terminal */}
      <AIInterface />
      
    </div>
  );
}
