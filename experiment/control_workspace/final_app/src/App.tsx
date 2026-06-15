import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import ThreeBackground from './components/ThreeBackground';
import Dashboard from './components/Dashboard';

function App() {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial entrance animation
    const ctx = gsap.context(() => {
      gsap.fromTo(overlayRef.current, 
        { backgroundColor: 'rgba(0,0,0,1)' }, 
        { backgroundColor: 'rgba(0,0,0,0)', duration: 2, ease: 'power2.inOut' }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-black font-sans">
      <ThreeBackground />
      <div 
        ref={overlayRef} 
        className="absolute inset-0 z-20 pointer-events-none"
      />
      <Dashboard />
    </div>
  );
}

export default App;
