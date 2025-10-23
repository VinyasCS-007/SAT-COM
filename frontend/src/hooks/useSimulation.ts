import { useState } from 'react';
import { SimulationConfig, SimulationResult, simulateTransmission } from '../services/api';

export interface SimulationFrame {
  id: number;
  result: SimulationResult;
  config: SimulationConfig;
}

export const useSimulation = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [frames, setFrames] = useState<SimulationFrame[]>([]);
  const [berHistory, setBerHistory] = useState<{ run: number; ber_before: number; ber_after: number }[]>([]);

  const runSimulation = async (config: SimulationConfig) => {
    setIsRunning(true);
    try {
      const result = await simulateTransmission(config);
      const newFrame = {
        id: Date.now(),
        result,
        config,
      };
      setFrames(prev => [...prev, newFrame]);
      setBerHistory(prev => [
        ...prev,
        {
          run: prev.length + 1,
          ber_before: result.ber_before,
          ber_after: result.ber_after,
        },
      ]);
      return result;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setIsRunning(false);
    }
  };

  const clearResults = () => {
    setFrames([]);
    setBerHistory([]);
  };

  return { isRunning, frames, berHistory, runSimulation, clearResults };
};