
import { Dashboard } from './components/Dashboard.tsx';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4 shadow">
        <h1 className="text-2xl font-bold text-cyan-400">
          🛰️ Fault-Tolerant Satellite Communication Simulator
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          AI-augmented error correction for space-grade reliability
        </p>
      </header>
      <main className="p-6">
        <Dashboard />
      </main>
    </div>
  );
}

export default App;