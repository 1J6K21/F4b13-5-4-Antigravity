import { Hero3D } from './components/Hero3D';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { AIInterface } from './components/AIInterface';
import { motion } from 'framer-motion';

function App() {
  return (
    <div className="relative min-h-screen w-full bg-dark overflow-hidden font-sans text-white">
      {/* 3D Background */}
      <Hero3D />
      
      {/* Overlay gradient to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark/20 via-transparent to-dark pointer-events-none" />

      {/* Main Content Area */}
      <div className="relative z-10 w-full h-full overflow-y-auto">
        <Navbar />
        
        <main className="w-full">
          <Dashboard />
        </main>

        <AIInterface />
      </div>

      {/* Ambient glowing orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-accent/20 blur-[120px] pointer-events-none z-0"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.05, 0.15, 0.05],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/20 blur-[150px] pointer-events-none z-0"
      />
    </div>
  );
}

export default App;
