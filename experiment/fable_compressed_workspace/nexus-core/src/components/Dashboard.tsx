import React from 'react';
import { motion } from 'framer-motion';
import { DataVisualizer } from './DataVisualizer';
import { Shield, Zap, Database, Server, ArrowUpRight } from 'lucide-react';

export function Dashboard() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.5
      }
    }
  };

  const itemVariants: any = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="relative z-10 pt-32 px-8 pb-12 w-full max-w-7xl mx-auto min-h-screen flex flex-col pointer-events-none">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="mb-12 pointer-events-auto"
      >
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
          Data <span className="text-gradient-accent">Intelligence</span>
        </h1>
        <p className="text-lg text-white/50 max-w-xl">
          Advanced analytics platform. Processing neural pathways and system telemetry in real-time.
        </p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 pointer-events-auto"
      >
        <motion.div variants={itemVariants} className="md:col-span-2 flex flex-col">
          <DataVisualizer />
        </motion.div>

        <motion.div variants={itemVariants} className="glass-panel p-6 flex flex-col gap-6">
          <div>
            <h3 className="text-sm font-medium tracking-wider text-white/50 mb-4">SYSTEM STATUS</h3>
            <div className="space-y-4">
              <StatusItem icon={<Shield />} label="Security" value="Optimal" status="good" />
              <StatusItem icon={<Zap />} label="Compute" value="94%" status="warning" />
              <StatusItem icon={<Database />} label="Storage" value="2.4 PB" status="good" />
              <StatusItem icon={<Server />} label="Nodes" value="1,402" status="good" />
            </div>
          </div>
          
          <div className="mt-auto pt-6 border-t border-glass-border">
            <button className="w-full py-3 px-4 rounded-xl bg-accent/10 hover:bg-accent/20 border border-accent/20 text-accent font-medium transition-all flex items-center justify-center gap-2 group">
              View Full Report
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="md:col-span-3 glass-panel p-6">
          <div className="flex items-center justify-between mb-6">
             <h3 className="text-sm font-medium tracking-wider text-white/50">LIVE EVENT STREAM</h3>
             <div className="flex gap-2">
               <span className="px-2 py-1 rounded bg-white/5 text-xs text-white/50 border border-white/5">FILTER</span>
               <span className="px-2 py-1 rounded bg-accent/10 text-xs text-accent border border-accent/20">ALL EVENTS</span>
             </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <EventCard time="10:42:01" title="Node re-balancing" desc="Cluster alpha re-distributed 400TB." />
            <EventCard time="10:41:15" title="Auth Request" desc="Admin access from IP 192.168.x." alert />
            <EventCard time="10:39:55" title="Model Training" desc="Epoch 44 completed. Loss: 0.021" />
            <EventCard time="10:35:10" title="Ingestion Pipeline" desc="Stream throughput peaked at 5GB/s." />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function StatusItem({ icon, label, value, status }: { icon: React.ReactNode, label: string, value: string, status: 'good' | 'warning' | 'error' }) {
  const colorClass = status === 'good' ? 'text-green-400' : status === 'warning' ? 'text-yellow-400' : 'text-red-400';
  
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
      <div className="flex items-center gap-3 text-white/70">
        <div className="p-2 rounded-lg bg-dark">
          {React.cloneElement(icon as React.ReactElement, { className: "w-4 h-4" } as any)}
        </div>
        <span className="font-medium">{label}</span>
      </div>
      <span className={`font-semibold ${colorClass}`}>{value}</span>
    </div>
  );
}

function EventCard({ time, title, desc, alert = false }: { time: string, title: string, desc: string, alert?: boolean }) {
  return (
    <div className={`p-4 rounded-xl border ${alert ? 'bg-red-500/5 border-red-500/20' : 'bg-white/5 border-white/5'} hover:scale-[1.02] transition-transform cursor-pointer`}>
      <div className="text-xs text-white/40 font-mono mb-2">{time}</div>
      <div className={`font-medium mb-1 ${alert ? 'text-red-400' : 'text-white/90'}`}>{title}</div>
      <div className="text-sm text-white/50">{desc}</div>
    </div>
  );
}
