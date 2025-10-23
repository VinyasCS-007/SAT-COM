# backend/core/channel/noise.py
import numpy as np

def add_awgn(bits: np.ndarray, snr_db: float) -> np.ndarray:
    """Add Additive White Gaussian Noise based on SNR (dB)."""
    snr_linear = 10 ** (snr_db / 10)
    signal_power = np.mean(bits ** 2)
    noise_power = signal_power / snr_linear
    noise = np.random.normal(0, np.sqrt(noise_power), bits.shape)
    noisy = bits + noise
    return (noisy > 0.5).astype(np.uint8)

def add_burst_errors(bits: np.ndarray, burst_prob: float = 0.03, max_length: int = 6) -> np.ndarray:
    """Flip bits in random burst regions."""
    bits = bits.copy()
    if np.random.random() < burst_prob:
        start = np.random.randint(0, max(1, len(bits) - max_length))
        length = np.random.randint(2, max_length + 1)
        bits[start:start+length] = 1 - bits[start:start+length]
    return bits

def add_rayleigh_fading(bits: np.ndarray, snr_db: float) -> np.ndarray:
    """Simulate Rayleigh fading channel (simplified)."""
    # Generate Rayleigh envelope
    rayleigh = np.abs(np.random.randn(*bits.shape) + 1j * np.random.randn(*bits.shape))
    faded = bits * rayleigh
    # Add noise based on effective SNR
    return add_awgn(faded, snr_db)