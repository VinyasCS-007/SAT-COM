// frontend/src/components/Dashboard.tsx
import React, { useRef } from 'react';
import { ControlPanel } from './ControlPanel';
import { BERChart } from './BERChart';
import { FrameStatus } from './FrameStatus';
import { PerformanceMetrics } from './PerformanceMetrics';
import { useSimulation } from '../hooks/useSimulation';

export const Dashboard: React.FC = () => {
  const { frames, berHistory, clearResults, performanceStats } = useSimulation();
  const dashboardRef = useRef<HTMLDivElement>(null);

  return (
    <section id="dashboard" ref={dashboardRef} className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-apple-light-gray bg-clip-text text-transparent">
            Simulation Dashboard
          </h2>
          <p className="text-xl text-apple-light-gray max-w-2xl mx-auto">
            Real-time satellite communication simulation with AI-enhanced error correction
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left Column - Controls */}
          <div className="xl:col-span-1 space-y-8">
            <ControlPanel onClear={clearResults} />
            <PerformanceMetrics stats={performanceStats} />
          </div>

          {/* Right Column - Visualizations */}
          <div className="xl:col-span-2 space-y-8">
            <div className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-3xl border border-white/10 p-6 shadow-2xl">
              <BERChart data={berHistory} />
            </div>
            
            <div className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-3xl border border-white/10 p-6 shadow-2xl">
              <FrameStatus frames={frames} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};