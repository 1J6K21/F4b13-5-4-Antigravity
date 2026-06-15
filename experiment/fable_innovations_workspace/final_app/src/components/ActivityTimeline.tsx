import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const ActivityTimeline: React.FC = () => {
  const pathRef = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pathRef.current) return;
    
    const length = pathRef.current.getTotalLength();
    
    gsap.set(pathRef.current, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });

    const tl = gsap.timeline({ repeat: -1 });
    
    tl.to(pathRef.current, {
      strokeDashoffset: 0,
      duration: 3,
      ease: "power2.inOut"
    }).to(pathRef.current, {
      strokeDashoffset: -length,
      duration: 3,
      ease: "power2.inOut"
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full flex items-end justify-between relative pt-8">
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        <path
          d="M 0,100 C 20,80 30,90 50,40 C 70,-10 80,60 100,20"
          fill="none"
          stroke="rgba(168, 85, 247, 0.2)"
          strokeWidth="2"
        />
        <path
          ref={pathRef}
          d="M 0,100 C 20,80 30,90 50,40 C 70,-10 80,60 100,20"
          fill="none"
          stroke="#a855f7"
          strokeWidth="2"
          className="drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]"
        />
      </svg>
      
      {/* Decorative grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      <div className="flex flex-col z-10 p-2">
        <span className="text-4xl font-light text-white tracking-tighter">42.8k</span>
        <span className="text-xs text-purple-400 uppercase tracking-widest font-semibold">Active Ops</span>
      </div>
      <div className="flex flex-col z-10 items-end p-2">
        <span className="text-4xl font-light text-white tracking-tighter">+12%</span>
        <span className="text-xs text-teal-400 uppercase tracking-widest font-semibold">Efficiency</span>
      </div>
    </div>
  );
};
