# backend/controller/adaptive.py
"""
Adaptive ECC controller that selects optimal error correction scheme
based on real-time channel conditions.
"""

from typing import List, Dict, Any
from utils.metrics import moving_average

class AdaptiveController:
    def __init__(self, window_size: int = 10):
        self.window_size = window_size
        self.history: List[Dict[str, Any]] = []
        self.ecc_priority = {
            "reed_solomon": 3,  # Best for bursts
            "hamming": 2,       # Good for low noise
            "crc": 1            # Detection only
        }

    def log_frame(self, snr_db: float, ber: float, ecc_used: str, success: bool):
        """Log frame result for adaptive decision-making."""
        self.history.append({
            "snr_db": snr_db,
            "ber": ber,
            "ecc_used": ecc_used,
            "success": int(success)
        })

    def get_optimal_ecc(self, current_snr: float) -> str:
        """
        Select best ECC scheme based on SNR and historical performance.
        
        Decision logic:
        - SNR > 12 dB → Hamming (lightweight, sufficient)
        - 6 dB ≤ SNR ≤ 12 dB → Reed–Solomon (burst resilience)
        - SNR < 6 dB → Reed–Solomon (strongest correction)
        - If recent BER > 0.1 with current ECC → escalate to stronger ECC
        """
        if not self.history:
            # Default to Reed–Solomon for unknown conditions
            return "reed_solomon"

        # Get recent metrics
        recent_snrs = [f["snr_db"] for f in self.history[-self.window_size:]]
        recent_bers = [f["ber"] for f in self.history[-self.window_size:]]
        recent_success = [f["success"] for f in self.history[-self.window_size:]]
        
        avg_snr = moving_average(recent_snrs, self.window_size)
        avg_ber = moving_average(recent_bers, self.window_size)
        success_rate = moving_average(recent_success, self.window_size)

        # Rule 1: High SNR → use lightweight Hamming
        if current_snr > 12.0 and avg_ber < 0.01:
            return "hamming"
        
        # Rule 2: Medium SNR → Reed–Solomon
        if 6.0 <= current_snr <= 12.0:
            return "reed_solomon"
        
        # Rule 3: Low SNR → Reed–Solomon
        if current_snr < 6.0:
            return "reed_solomon"
        
        # Rule 4: If current ECC is failing (BER > 0.1), escalate
        last_ecc = self.history[-1]["ecc_used"]
        if avg_ber > 0.1:
            if last_ecc == "crc":
                return "hamming"
            elif last_ecc == "hamming":
                return "reed_solomon"
            else:
                return "reed_solomon"  # already strongest

        # Default fallback
        return last_ecc if last_ecc in self.ecc_priority else "reed_solomon"

    def should_use_ai(self, ber_before: float, ecc_success: bool) -> bool:
        """
        Determine if AI correction should be attempted.
        """
        BER_THRESHOLD = 0.1
        return not ecc_success or ber_before > BER_THRESHOLD