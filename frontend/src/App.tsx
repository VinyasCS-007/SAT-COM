// frontend/src/App.tsx
import { Dashboard } from './components/Dashboard';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';

function App() {
  return (
    <div className="min-h-screen bg-black text-white font-sf-pro">
      <Navigation />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Main Content */}
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <Dashboard />
        </div>
      </main>

      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}

export default App;