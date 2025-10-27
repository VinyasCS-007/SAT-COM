// frontend/src/components/PerformanceMetrics.tsx
import React from 'react';
import { Cpu, Zap, Clock, Target } from 'lucide-react';

interface PerformanceMetricsProps {
  stats: {
    averageBERImprovement: number;
    totalFrames: number;
    successRate: number;
    averageLatency: number;
  };
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ stats }) => {
  const metrics = [
    {
      icon: Target,
      label: 'Success Rate',
      value: `${stats.successRate}%`,
      color: 'text-green-400',
      bg: 'bg-green-500/10'
    },
    {
      icon: Zap,
      label: 'BER Improvement',
      value: `${stats.averageBERImprovement}x`,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10'
    },
    {
      icon: Cpu,
      label: 'Total Frames',
      value: stats.totalFrames.toString(),
      color: 'text-purple-400',
      bg: 'bg-purple-500/10'
    },
    {
      icon: Clock,
      label: 'Avg Latency',
      value: `${stats.averageLatency}ms`,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-3xl border border-white/10 p-6 shadow-2xl">
      <h3 className="text-xl font-semibold text-white mb-6">Performance Metrics</h3>
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <div key={index} className={`p-4 rounded-xl border border-white/10 ${metric.bg} transition-all duration-300 hover:scale-105`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${metric.bg}`}>
                  <metric.icon className={`w-4 h-4 ${metric.color}`} />
                </div>
                <span className="text-sm text-apple-light-gray">{metric.label}</span>
              </div>
              <span className={`font-mono font-bold ${metric.color}`}>{metric.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};