import React from 'react';
import { SimulationFrame } from '../hooks/useSimulation';

interface FrameStatusProps {
  frames: SimulationFrame[];
}

export const FrameStatus: React.FC<FrameStatusProps> = ({ frames }) => {
  if (frames.length === 0) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-2 text-cyan-300">Frame Status Timeline</h3>
        <p className="text-gray-500">No frames simulated yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-2 text-cyan-300">Frame Status Timeline</h3>
      <div className="flex flex-wrap gap-1 mb-2">
        {frames.map(frame => {
          let color = 'bg-gray-600'; // failed
          if (frame.result.ecc_used && !frame.result.ai_corrected) color = 'bg-green-500';
          else if (frame.result.ai_corrected) color = 'bg-yellow-500';

          return (
            <div
              key={frame.id}
              title={`ECC: ${frame.result.ecc_used}, BER: ${frame.result.ber_after.toFixed(4)}`}
              className={`w-6 h-6 rounded flex items-center justify-center ${color} text-xs`}
            >
              {frames.indexOf(frame) + 1}
            </div>
          );
        })}
      </div>
      <div className="text-xs text-gray-400">
        <span className="inline-block w-2 h-2 bg-green-500 rounded mr-1"></span> ECC Success  
        <span className="inline-block w-2 h-2 bg-yellow-500 rounded mx-1"></span> AI Corrected  
        <span className="inline-block w-2 h-2 bg-gray-600 rounded mr-1"></span> Failed
      </div>
    </div>
  );
};