import { motion } from 'framer-motion';
import { Activity, Cpu, Database, Network, Shield, Zap } from 'lucide-react';
import NetworkGraph from './NetworkGraph';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut" as const
    }
  })
};

const stats = [
  { label: 'System Latency', value: '12ms', icon: <Activity className="w-5 h-5 text-blue-400" /> },
  { label: 'Neural Cores', value: '1,024', icon: <Cpu className="w-5 h-5 text-purple-400" /> },
  { label: 'Active Nodes', value: '8.4M', icon: <Network className="w-5 h-5 text-pink-400" /> },
];

export default function Dashboard() {
  return (
    <div className="relative z-10 min-h-screen p-8 pt-24 text-white max-w-7xl mx-auto flex flex-col gap-8">
      
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex justify-between items-end"
      >
        <div>
          <h1 className="text-5xl font-light tracking-tight mb-2">Nexus<span className="font-semibold">OS</span></h1>
          <p className="text-gray-400 text-lg">Palantir-inspired AI Infrastructure Dashboard</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 glass-panel px-4 py-2 rounded-full text-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            System Optimal
          </div>
        </div>
      </motion.div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="glass-panel rounded-2xl p-6 glass-panel-hover transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 font-medium">{stat.label}</span>
              {stat.icon}
            </div>
            <div className="text-3xl font-semibold tracking-tight">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        
        {/* Left Col - Data Flow */}
        <motion.div 
          custom={3} initial="hidden" animate="visible" variants={cardVariants}
          className="lg:col-span-2 glass-panel rounded-2xl p-6 flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium">Neural Architecture Map</h2>
            <Database className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex-1 rounded-xl overflow-hidden bg-black/20 border border-white/5 relative">
            {/* D3 Network Graph */}
            <NetworkGraph />
          </div>
        </motion.div>

        {/* Right Col - Activity Log */}
        <motion.div 
          custom={4} initial="hidden" animate="visible" variants={cardVariants}
          className="glass-panel rounded-2xl p-6 flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium">Security Event Stream</h2>
            <Shield className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4 flex-1">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="p-4 rounded-xl bg-white/5 border border-white/5 flex gap-4 items-start">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Zap className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Anomaly Detected</div>
                  <div className="text-xs text-gray-400">Node cluster {item}04x required re-routing due to high latency spikes.</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
