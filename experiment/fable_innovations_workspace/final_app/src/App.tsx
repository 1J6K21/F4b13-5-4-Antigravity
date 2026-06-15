
import { Background3D } from './components/Background3D';
import { NexusDashboard } from './components/NexusDashboard';

function App() {
  return (
    <main className="relative w-full min-h-screen text-white overflow-hidden bg-black font-sans selection:bg-purple-500/30">
      <Background3D />
      <NexusDashboard />
    </main>
  );
}

export default App;
