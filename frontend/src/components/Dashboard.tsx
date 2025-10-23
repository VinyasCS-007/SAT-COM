import React from 'react';
import { ControlPanel } from './ControlPanel.tsx';
import { BERChart } from './BERChart.tsx';
import { FrameStatus } from './FrameStatus.tsx';
import { useSimulation } from '../hooks/useSimulation';

export const Dashboard: React.FC = () => {
  const { frames, berHistory, clearResults } = useSimulation();

  return (
    <div className="space-y-6">
      <ControlPanel onClear={clearResults} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BERChart data={berHistory} />
        <FrameStatus frames={frames} />
      </div>
    </div>
  );
};