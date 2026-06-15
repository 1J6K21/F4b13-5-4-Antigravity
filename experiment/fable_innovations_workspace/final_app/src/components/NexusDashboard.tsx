import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DataPanel } from './DataPanel';
import { NetworkGraph } from './NetworkGraph';
import { ActivityTimeline } from './ActivityTimeline';
import { Activity, Cpu, Globe2, Shield, Zap, Search, Bell } from 'lucide-react';

export const NexusDashboard: React.FC = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: false }));
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' }) + '.' + Math.floor(Math.random() * 99).toString().padStart(2, '0'));
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative z-10 min-h-screen w-full flex flex-col p-6 md:p-12 overflow-hidden selection:bg-purple-500/30">
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="flex justify-between items-center mb-12"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl glass-dark flex items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
            <Zap className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">Antigravity Nexus</h1>
            <p className="text-xs text-gray-400 tracking-widest uppercase font-mono mt-1">Global Command Center</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4 px-6 py-2 glass rounded-full">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-sm font-mono text-teal-400 font-semibold tracking-widest uppercase">System Optimal</span>
          </div>
          
          <div className="glass w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
            <Search className="w-4 h-4 text-gray-300" />
          </div>
          <div className="glass w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors relative">
            <Bell className="w-4 h-4 text-gray-300" />
            <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-purple-500 border-2 border-black" />
          </div>
        </div>
      </motion.header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1">
        {/* Left Column */}
        <div className="md:col-span-3 flex flex-col gap-6">
          <DataPanel title="Live Diagnostics" delay={0.2} className="h-48">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm font-mono">CPU Load</span>
                <span className="text-white font-mono">14.2%</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "14.2%" }}
                  className="h-full bg-purple-500 rounded-full"
                />
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-400 text-sm font-mono">Memory</span>
                <span className="text-white font-mono">8.4GB / 32GB</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "26%" }}
                  className="h-full bg-teal-400 rounded-full"
                />
              </div>
            </div>
          </DataPanel>

          <DataPanel title="Active Nodes" delay={0.3} className="flex-1 min-h-[300px]">
            <div className="space-y-4">
              {[
                { name: 'US-East-1', status: 'optimal', load: '32%', icon: Globe2 },
                { name: 'EU-West-2', status: 'optimal', load: '45%', icon: Globe2 },
                { name: 'AP-South-1', status: 'warning', load: '89%', icon: Activity },
                { name: 'Neural-Core', status: 'optimal', load: '12%', icon: Cpu },
              ].map((node, i) => (
                <motion.div 
                  key={node.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <node.icon className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                    <span className="text-sm font-medium text-gray-300">{node.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-gray-500">{node.load}</span>
                    <span className={`w-2 h-2 rounded-full ${node.status === 'optimal' ? 'bg-teal-400' : 'bg-amber-400'} shadow-[0_0_10px_currentColor]`} />
                  </div>
                </motion.div>
              ))}
            </div>
          </DataPanel>
        </div>

        {/* Center Column */}
        <div className="md:col-span-6 flex flex-col gap-6">
          <DataPanel title="Global Topology" delay={0.4} className="flex-1 min-h-[500px]">
             <NetworkGraph />
          </DataPanel>
          
          <div className="grid grid-cols-2 gap-6 h-48">
            <DataPanel title="Security" delay={0.5}>
              <div className="flex items-center justify-center h-full pb-8">
                <Shield className="w-16 h-16 text-purple-500/50" />
                <div className="absolute inset-0 flex items-center justify-center pt-8">
                  <span className="text-3xl font-light text-white tracking-tighter">100%</span>
                </div>
              </div>
            </DataPanel>
            <DataPanel title="Throughput" delay={0.6}>
              <ActivityTimeline />
            </DataPanel>
          </div>
        </div>

        {/* Right Column */}
        <div className="md:col-span-3 flex flex-col gap-6">
          <DataPanel title="Time Synchronicity" delay={0.7} className="h-32 flex flex-col justify-center items-center">
            <span className="text-4xl font-mono text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500 tracking-tight font-light">{time}</span>
          </DataPanel>

          <DataPanel title="Event Log" delay={0.8} className="flex-1 min-h-[400px]">
            <div className="space-y-4 font-mono text-xs h-[calc(100%-2rem)] overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-10 pointer-events-none" />
              {[
                "Connection established with AP-South-1",
                "Neural core synchronization complete",
                "Anomaly detected in datastream Alpha",
                "Rerouting traffic through EU-West-2",
                "System architecture optimal",
                "Quantum handshake verified",
                "Deploying autonomous countermeasures",
                "Garbage collection triggered",
                "Memory heap stabilized at 42%",
              ].map((log, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1 - (i * 0.15), x: 0 }}
                  transition={{ delay: 1 + i * 0.1 }}
                  className="flex gap-4 text-gray-400"
                >
                  <span className="text-purple-500/70">{`[${10 - i}s]` }</span>
                  <span className="truncate">{log}</span>
                </motion.div>
              ))}
            </div>
          </DataPanel>
        </div>
      </div>
    </div>
  );
};
