import { motion } from 'framer-motion';
import { Hexagon, Command, Cpu, Sparkles } from 'lucide-react';

export function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 backdrop-blur-md bg-dark/30 border-b border-white/5"
    >
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-transparent border border-accent/30 overflow-hidden">
          <Hexagon className="w-5 h-5 text-accent relative z-10" />
          <div className="absolute inset-0 bg-accent/20 blur-xl animate-pulse" />
        </div>
        <span className="font-semibold tracking-widest text-lg text-gradient-accent uppercase">Nexus</span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        <NavLink icon={<Cpu size={16} />} text="System" active />
        <NavLink icon={<Command size={16} />} text="Modules" />
        <NavLink icon={<Sparkles size={16} />} text="Intelligence" />
      </div>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm font-medium text-white/80">System Online</span>
        </button>
      </div>
    </motion.nav>
  );
}

function NavLink({ icon, text, active = false }: { icon: React.ReactNode, text: string, active?: boolean }) {
  return (
    <a href="#" className={`flex items-center gap-2 text-sm font-medium transition-colors ${active ? 'text-accent' : 'text-white/50 hover:text-white/90'}`}>
      {icon}
      <span>{text}</span>
      {active && (
        <motion.div 
          layoutId="nav-indicator"
          className="absolute bottom-[-1.5rem] w-8 h-[2px] bg-accent"
        />
      )}
    </a>
  );
}
