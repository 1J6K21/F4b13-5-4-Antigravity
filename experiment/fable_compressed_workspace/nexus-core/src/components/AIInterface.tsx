import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Search, ChevronRight, Activity } from 'lucide-react';
import gsap from 'gsap';

export function AIInterface() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pulseRef.current) {
      gsap.to(pulseRef.current, {
        scale: 1.5,
        opacity: 0,
        duration: 2,
        repeat: -1,
        ease: "power2.out"
      });
    }
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200, damping: 20 }}
        onClick={handleOpen}
        className="fixed bottom-8 right-8 z-40 w-14 h-14 rounded-full bg-dark border border-white/10 shadow-[0_0_30px_rgba(0,240,255,0.2)] flex items-center justify-center hover:scale-110 transition-transform group"
      >
        <div ref={pulseRef} className="absolute inset-0 rounded-full border border-accent/50" />
        <Activity className="w-6 h-6 text-accent group-hover:animate-pulse" />
      </motion.button>

      {/* Overlay Command Palette */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-dark/60"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsOpen(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full max-w-2xl bg-dark/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-white/10 flex items-center gap-3">
                <Search className="w-5 h-5 text-white/50" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask Nexus AI..."
                  className="flex-1 bg-transparent border-none outline-none text-lg text-white placeholder-white/30"
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setIsOpen(false);
                    if (e.key === 'Enter') {
                      setQuery('');
                      // handle submit logic here
                    }
                  }}
                />
                <button className="p-2 rounded-full hover:bg-white/5 transition-colors">
                  <Mic className="w-5 h-5 text-white/50 hover:text-accent transition-colors" />
                </button>
              </div>
              
              <div className="p-2 max-h-[60vh] overflow-y-auto">
                {query.length > 0 ? (
                  <div className="p-4 flex items-center gap-3 text-white/70">
                    <div className="w-4 h-4 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                    Processing query: "{query}"...
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="px-3 py-2 text-xs font-semibold text-white/30 uppercase tracking-wider">Suggested</div>
                    <SuggestionItem text="Analyze recent network anomalies" />
                    <SuggestionItem text="Generate system health report" />
                    <SuggestionItem text="Optimize routing protocols" />
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function SuggestionItem({ text }: { text: string }) {
  return (
    <button className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-white/5 transition-colors group text-left">
      <span className="text-white/80 group-hover:text-white transition-colors">{text}</span>
      <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-accent transition-colors" />
    </button>
  );
}
