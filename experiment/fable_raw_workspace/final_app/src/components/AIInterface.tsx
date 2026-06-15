import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Terminal, ChevronRight } from 'lucide-react';

const commands = [
  "Initializing Nexus Core...",
  "Bypassing security protocols...",
  "Establishing quantum encryption link...",
  "Analyzing global data streams...",
  "System online. Ready for command."
];

export function AIInterface() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const elements = Array.from(containerRef.current.children) as HTMLElement[];
      
      const tl = gsap.timeline();
      
      elements.forEach((el, index) => {
        const text = commands[index];
        el.innerText = '';
        
        text.split('').forEach(char => {
          const span = document.createElement('span');
          span.innerText = char;
          span.style.opacity = '0';
          span.style.color = index === commands.length - 1 ? '#00e5ff' : '#ffffff';
          el.appendChild(span);
        });

        tl.to(el.children, {
          opacity: 1,
          stagger: 0.02,
          duration: 0.1,
          ease: 'power2.inOut',
        });
      });
    }
  }, [isOpen]);

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 w-full max-w-2xl px-4 pointer-events-auto">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="glass-panel p-6 mb-4 w-full border border-brand/30 shadow-[0_0_30px_rgba(0,229,255,0.15)]"
          >
            <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4">
              <Terminal className="text-brand w-5 h-5" />
              <div className="text-sm font-mono text-brand tracking-widest uppercase text-glow">Nexus AI Terminal</div>
            </div>
            <div 
              ref={containerRef} 
              className="text-sm font-mono text-white/90 leading-relaxed min-h-[8rem] flex flex-col gap-2"
            >
              {commands.map((_, i) => (
                <div key={i} className="min-h-[1.5rem]" />
              ))}
            </div>
            
            {/* Blinking Cursor after animations */}
            <div className="mt-4 flex items-center gap-2">
              <span className="text-brand">{'>'}</span>
              <div className="w-2 h-4 bg-brand animate-pulse" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-panel w-full py-4 px-6 flex items-center justify-between group hover:bg-white/10 transition-all border border-transparent hover:border-brand/30 hover:shadow-[0_0_20px_rgba(0,229,255,0.2)]"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-brand animate-pulse shadow-[0_0_10px_rgba(0,229,255,0.8)]" />
          <span className="text-white/70 font-mono tracking-wide group-hover:text-white transition-colors uppercase text-sm">
            {isOpen ? 'Close Terminal' : 'Initialize Command Interface'}
          </span>
        </div>
        <div className="flex items-center gap-4 text-white/50">
          <Mic size={18} className="hover:text-brand transition-colors cursor-pointer" />
          <ChevronRight size={20} className={`transition-transform duration-300 ${isOpen ? 'rotate-90 text-brand' : ''}`} />
        </div>
      </motion.button>
    </div>
  );
}
