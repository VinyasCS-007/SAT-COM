import React, { useState } from 'react';
import { SimulationConfig } from '../services/api';
import { useSimulation } from '../hooks/useSimulation';

interface ControlPanelProps {
  onClear: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ onClear }) => {
  const { runSimulation, isRunning } = useSimulation();
  const [config, setConfig] = useState<SimulationConfig>({
    payload_size: 223,
    snr_db: 10,
    noise_type: 'awgn',
    ecc_scheme: 'reed_solomon',
    auto_ecc: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setConfig(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setConfig(prev => ({
        ...prev,
        [name]: name === 'payload_size' || name === 'snr_db' ? Number(value) : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await runSimulation(config);
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow mb-6">
      <h2 className="text-xl font-semibold mb-4 text-cyan-300">Simulation Controls</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Payload Size (bytes)</label>
          <input
            type="range"
            name="payload_size"
            min="4"
            max="223"
            value={config.payload_size}
            onChange={handleChange}
            className="w-full"
          />
          <span className="text-xs">{config.payload_size}</span>
        </div>

        <div>
          <label className="block text-sm mb-1">SNR (dB)</label>
          <input
            type="range"
            name="snr_db"
            min="0"
            max="20"
            step="0.5"
            value={config.snr_db}
            onChange={handleChange}
            className="w-full"
          />
          <span className="text-xs">{config.snr_db} dB</span>
        </div>

        <div>
          <label className="block text-sm mb-1">Noise Type</label>
          <select
            name="noise_type"
            value={config.noise_type}
            onChange={handleChange}
            className="w-full p-1 bg-gray-700 rounded text-sm"
          >
            <option value="awgn">AWGN</option>
            <option value="burst">Burst Errors</option>
            <option value="fading">Rayleigh Fading</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">ECC Scheme</label>
          <select
            name="ecc_scheme"
            value={config.ecc_scheme}
            onChange={handleChange}
            className="w-full p-1 bg-gray-700 rounded text-sm"
          >
            <option value="reed_solomon">Reed–Solomon (255,223)</option>
            <option value="hamming">Hamming (7,4)</option>
            <option value="crc">CRC-32</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="auto_ecc"
            checked={config.auto_ecc}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="text-sm">Enable Adaptive ECC Controller</label>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={isRunning}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded disabled:opacity-50 text-sm"
          >
            {isRunning ? 'Simulating...' : 'Run Simulation'}
          </button>
          <button
            type="button"
            onClick={onClear}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded text-sm"
          >
            Clear Results
          </button>
        </div>
      </form>
    </div>
  );
};