import React, { useState } from 'react';
import { SimulationConfig } from '../services/api';
import { useSimulation } from '../hooks/useSimulation';
import { Play, Square, Settings } from 'lucide-react';

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
    <div className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-3xl border border-white/10 p-8 shadow-2xl">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">Simulation Controls</h2>
            <p className="text-apple-light-gray text-sm">Configure transmission parameters</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Payload Size */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-white">Payload Size</label>
            <span className="text-cyan-400 font-mono text-sm">{config.payload_size} bytes</span>
          </div>
          <input
            type="range"
            name="payload_size"
            min="4"
            max="223"
            value={config.payload_size}
            onChange={handleChange}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer 
                       accent-cyan-400 hover:accent-blue-500 transition-all duration-300"
          />
          <div className="flex justify-between text-xs text-apple-light-gray">
            <span>4B</span>
            <span>223B</span>
          </div>
        </div>

        {/* SNR */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-white">Signal-to-Noise Ratio</label>
            <span className="text-blue-400 font-mono text-sm">{config.snr_db} dB</span>
          </div>
          <input
            type="range"
            name="snr_db"
            min="0"
            max="20"
            step="0.5"
            value={config.snr_db}
            onChange={handleChange}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer 
                       accent-blue-400 hover:accent-cyan-500 transition-all duration-300"
          />
          <div className="flex justify-between text-xs text-apple-light-gray">
            <span>0 dB</span>
            <span>20 dB</span>
          </div>
        </div>

        {/* Noise Type */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-white">Noise Environment</label>
          <select
            name="noise_type"
            value={config.noise_type}
            onChange={handleChange}
            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white text-sm 
                       focus:border-cyan-500/50 focus:outline-none transition-all duration-300"
          >
            <option value="awgn">Additive White Gaussian Noise (AWGN)</option>
            <option value="burst">Burst Errors</option>
            <option value="fading">Rayleigh Fading</option>
          </select>
        </div>

        {/* ECC Scheme */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-white">ECC Scheme</label>
          <select
            name="ecc_scheme"
            value={config.ecc_scheme}
            onChange={handleChange}
            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white text-sm 
                       focus:border-blue-500/50 focus:outline-none transition-all duration-300"
          >
            <option value="reed_solomon">Reed–Solomon (255,223)</option>
            <option value="hamming">Hamming (7,4)</option>
            <option value="crc">CRC-32</option>
          </select>
        </div>

        {/* Adaptive ECC Toggle */}
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
          <div>
            <div className="text-sm font-medium text-white">Adaptive AI Controller</div>
            <div className="text-xs text-apple-light-gray">Dynamic error correction switching</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="auto_ecc"
              checked={config.auto_ecc}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-12 h-6 bg-white/20 peer-focus:outline-none rounded-full relative 
                            peer-checked:after:translate-x-6 after:content-[''] after:absolute 
                            after:top-[2px] after:left-[2px] after:bg-white after:rounded-full 
                            after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isRunning}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 
                       hover:to-blue-700 disabled:opacity-50 text-white font-medium py-4 px-6 
                       rounded-xl transition-all duration-300 flex items-center justify-center 
                       space-x-2 shadow-lg shadow-cyan-500/25"
          >
            {isRunning ? (
              <>
                <Square className="w-4 h-4" />
                <span>Stop Simulation</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Run Simulation</span>
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={onClear}
            className="px-6 py-4 border border-white/20 hover:border-white/40 text-white font-medium 
                       rounded-xl transition-all duration-300 hover:bg-white/5"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};
