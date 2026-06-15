import { motion } from 'framer-motion';
import { NetworkGraph } from './NetworkGraph';
import { Activity, Database, Cpu, Shield, Zap, Globe, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';

const stats = [
  { label: 'Active Nodes', value: '1,429', icon: Database, color: 'text-brand' },
  { label: 'Compute Power', value: '98.4 TFLOPS', icon: Cpu, color: 'text-purple-400' },
  { label: 'Network Integrity', value: '99.99%', icon: Shield, color: 'text-green-400' },
  { label: 'Processing Latency', value: '1.2ms', icon: Zap, color: 'text-yellow-400' },
];

export function MetricsOverlay() {
  const [dataFlow, setDataFlow] = useState(0);
  const [alerts, setAlerts] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDataFlow(prev => (prev + Math.random() * 10) % 100);
      if (Math.random() > 0.9) {
        setAlerts(prev => {
          const newAlerts = [...prev, `Anomaly detected in Sector ${Math.floor(Math.random() * 99)}`].slice(-3);
          return newAlerts;
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between z-10 font-mono">
      
      {/* Top Bar */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="flex justify-between items-start"
      >
        <div className="glass-panel p-4 flex items-center gap-4 border border-brand/20 shadow-[0_0_15px_rgba(0,229,255,0.1)]">
          <Activity className="text-brand animate-pulse" />
          <div>
            <div className="text-[10px] text-white/50 uppercase tracking-widest">System Status</div>
            <div className="text-sm font-medium text-brand tracking-wide text-glow uppercase">Nexus Online</div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="glass-panel p-4 flex flex-col items-end border border-white/5">
            <div className="text-[10px] text-white/50 uppercase tracking-widest">Global Sync</div>
            <div className="text-sm font-medium text-white flex items-center gap-2">
              <Globe size={14} className="text-purple-400 animate-[spin_4s_linear_infinite]" />
              Secured
            </div>
          </div>

          <div className="glass-panel p-4 flex items-center gap-4 border border-white/5">
            <div className="text-right">
              <div className="text-[10px] text-white/50 uppercase tracking-widest">Data Flow</div>
              <div className="text-sm text-brand">{dataFlow.toFixed(1)} TB/s</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Side Panels */}
      <div className="flex justify-between items-end mb-24 flex-1 pointer-events-none">
        
        {/* Left Side Stats */}
        <div className="flex flex-col gap-3 w-64 pointer-events-auto">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
              className="glass-panel p-3 flex items-center gap-4 hover:bg-white/10 transition-all cursor-pointer border border-white/5 hover:border-brand/30 hover:shadow-[0_0_15px_rgba(0,229,255,0.15)] group"
            >
              <div className={`p-2 rounded-lg bg-white/5 group-hover:bg-brand/10 transition-colors ${stat.color}`}>
                <stat.icon size={18} />
              </div>
              <div>
                <div className="text-[10px] text-white/50 uppercase tracking-wider">{stat.label}</div>
                <div className="text-base text-white/90">{stat.value}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right Side Graph & Alerts */}
        <div className="flex flex-col gap-4 pointer-events-auto w-80">
          
          {/* Alerts Panel */}
          {alerts.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel p-3 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={14} className="text-red-400" />
                <div className="text-[10px] text-red-400 uppercase tracking-widest">Live Alerts</div>
              </div>
              <div className="flex flex-col gap-1">
                {alerts.map((alert, i) => (
                  <div key={i} className="text-xs text-white/80 border-l-2 border-red-500/50 pl-2">
                    {alert}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="glass-panel p-4 h-64 flex flex-col border border-brand/20 shadow-[0_0_20px_rgba(0,229,255,0.1)]"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="text-[10px] text-brand uppercase tracking-wider text-glow">Topological Map</div>
              <div className="w-2 h-2 rounded-full bg-brand animate-ping" />
            </div>
            <div className="flex-1 rounded-lg bg-black/40 overflow-hidden relative border border-white/10 inset-shadow">
              <NetworkGraph />
            </div>
          </motion.div>
        </div>

      </div>
      
    </div>
  );
}
