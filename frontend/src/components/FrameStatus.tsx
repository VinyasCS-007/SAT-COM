// frontend/src/components/FrameStatus.tsx
import React from 'react';
import { SimulationFrame } from '../hooks/useSimulation';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface FrameStatusProps {
  frames: SimulationFrame[];
}

export const FrameStatus: React.FC<FrameStatusProps> = ({ frames }) => {
  if (frames.length === 0) {
    return (
      <div className="text-center py-12 text-apple-light-gray">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No frames simulated yet</p>
        <p className="text-sm mt-2">Run a simulation to see frame transmission status</p>
      </div>
    );
  }

  const successCount = frames.filter(f => f.result.ecc_used && !f.result.ai_corrected).length;
  const aiCorrectedCount = frames.filter(f => f.result.ai_corrected).length;
  const failedCount = frames.filter(f => !f.result.ecc_used && !f.result.ai_corrected).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-semibold text-white">Frame Transmission Status</h3>
        <p className="text-apple-light-gray text-sm">Real-time frame success tracking</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-green-500/10 rounded-xl border border-green-500/20">
          <div className="text-2xl font-bold text-green-400">{successCount}</div>
          <div className="text-xs text-green-300">ECC Success</div>
        </div>
        <div className="text-center p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
          <div className="text-2xl font-bold text-yellow-400">{aiCorrectedCount}</div>
          <div className="text-xs text-yellow-300">AI Corrected</div>
        </div>
        <div className="text-center p-4 bg-red-500/10 rounded-xl border border-red-500/20">
          <div className="text-2xl font-bold text-red-400">{failedCount}</div>
          <div className="text-xs text-red-300">Failed</div>
        </div>
      </div>

      {/* Timeline */}
      <div>
        <div className="flex items-center justify-between text-sm text-apple-light-gray mb-3">
          <span>Frame Sequence</span>
          <span>{frames.length} total</span>
        </div>
        <div className="grid grid-cols-8 md:grid-cols-12 lg:grid-cols-16 gap-2">
          {frames.map((frame, index) => {
            let icon = <XCircle className="w-4 h-4" />;
            let color = 'bg-red-500/20 border-red-500/40 text-red-400';
            
            if (frame.result.ecc_used && !frame.result.ai_corrected) {
              icon = <CheckCircle className="w-4 h-4" />;
              color = 'bg-green-500/20 border-green-500/40 text-green-400';
            } else if (frame.result.ai_corrected) {
              icon = <AlertCircle className="w-4 h-4" />;
              color = 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400';
            }

            return (
              <div
                key={frame.id}
                className={`aspect-square rounded-lg border-2 flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-help ${color}`}
                title={`Frame ${index + 1}: BER ${frame.result.ber_after.toExponential(3)}`}
              >
                {icon}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-6 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-green-300">ECC Success</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <span className="text-yellow-300">AI Corrected</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span className="text-red-300">Failed</span>
        </div>
      </div>
    </div>
  );
};