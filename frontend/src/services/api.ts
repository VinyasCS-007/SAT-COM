export interface SimulationConfig {
  payload_size: number;      // in bytes (e.g., 223 for RS)
  snr_db: number;            // 0–20 dB
  noise_type: 'awgn' | 'burst' | 'fading';
  ecc_scheme: 'crc' | 'hamming' | 'reed_solomon';
  auto_ecc?: boolean;        // enable adaptive controller
}

export interface SimulationResult {
  success: boolean;
  ber_before: number;
  ber_after: number;
  ecc_used: string;
  noise_type: string;
  ai_corrected: boolean;
  latency_ms: number;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const simulateTransmission = async (
  config: SimulationConfig
): Promise<SimulationResult> => {
  const response = await fetch(`${API_BASE}/api/transmit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });

  if (!response.ok) {
    throw new Error('Simulation failed');
  }

  return response.json();
};