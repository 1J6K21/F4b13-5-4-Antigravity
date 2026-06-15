import React from 'react';
import { motion } from 'framer-motion';

interface DataPanelProps {
  title: string;
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const DataPanel: React.FC<DataPanelProps> = ({ title, children, delay = 0, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`glass-dark rounded-2xl p-6 relative overflow-hidden group ${className}`}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <h3 className="text-gray-400 text-sm font-semibold tracking-widest uppercase mb-6 flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
        {title}
      </h3>
      <div className="relative z-10 w-full h-[calc(100%-2rem)]">
        {children}
      </div>
    </motion.div>
  );
};
