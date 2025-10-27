// frontend/src/components/BERChart.tsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface BERChartProps {
  data: { run: number; ber_before: number; ber_after: number }[];
}

export const BERChart: React.FC<BERChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center text-apple-light-gray">
        <div className="text-center">
          <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No simulation data yet</p>
          <p className="text-sm mt-2">Run a simulation to see BER performance</p>
        </div>
      </div>
    );
  }

  const latestImprovement = data.length > 0 
    ? ((data[data.length - 1].ber_before - data[data.length - 1].ber_after) / data[data.length - 1].ber_before) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Chart Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-white">Bit Error Rate Performance</h3>
          <p className="text-apple-light-gray text-sm">Before and after AI correction</p>
        </div>
        {data.length > 0 && (
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            latestImprovement > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {latestImprovement > 0 ? (
              <TrendingDown className="w-4 h-4" />
            ) : (
              <TrendingUp className="w-4 h-4" />
            )}
            <span className="font-mono text-sm">
              {Math.abs(latestImprovement).toFixed(1)}% {latestImprovement > 0 ? 'improvement' : 'degradation'}
            </span>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="run" 
              label={{ value: 'Simulation Run', position: 'insideBottom', offset: -10, fill: '#9CA3AF' }}
              stroke="#6B7280"
              tick={{ fill: '#9CA3AF' }}
            />
            <YAxis 
              scale="log"
              domain={[0.000001, 0.2]}
              label={{ value: 'Bit Error Rate (BER)', angle: -90, position: 'insideLeft', offset: 10, fill: '#9CA3AF' }}
              stroke="#6B7280"
              tick={{ fill: '#9CA3AF' }}
              tickFormatter={(value) => value.toExponential(2)}
            />
            <Tooltip 
              formatter={(value: number) => [value.toExponential(6), 'BER']}
              labelFormatter={(label) => `Run ${label}`}
              contentStyle={{ 
                backgroundColor: 'rgba(17, 24, 39, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                backdropFilter: 'blur(16px)'
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="ber_before"
              name="Before AI Correction"
              stroke="#EF4444"
              strokeWidth={3}
              dot={{ r: 4, fill: '#EF4444' }}
              activeDot={{ r: 6, fill: '#EF4444' }}
            />
            <Line
              type="monotone"
              dataKey="ber_after"
              name="After AI Correction"
              stroke="#10B981"
              strokeWidth={3}
              dot={{ r: 4, fill: '#10B981' }}
              activeDot={{ r: 6, fill: '#10B981' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      {data.length > 0 && (
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">
              {data[data.length - 1].ber_before.toExponential(3)}
            </div>
            <div className="text-xs text-apple-light-gray">Initial BER</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {data[data.length - 1].ber_after.toExponential(3)}
            </div>
            <div className="text-xs text-apple-light-gray">Corrected BER</div>
          </div>
        </div>
      )}
    </div>
  );
};