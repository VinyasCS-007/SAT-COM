# backend/utils/metrics.py
"""
Utility functions for communication performance metrics.
"""

import numpy as np
from typing import Tuple

def calculate_ber(original: np.ndarray, received: np.ndarray) -> float:
    """
    Calculate Bit Error Rate (BER) between two binary arrays.
    
    Args:
        original: Ground truth bits (np.ndarray of 0/1)
        received: Received/corrected bits (np.ndarray of 0/1)
    
    Returns:
        BER as float (0.0 to 1.0)
    """
    if original.shape != received.shape:
        min_len = min(len(original), len(received))
        original = original[:min_len]
        received = received[:min_len]
    return np.mean(original != received)

def calculate_frame_success(original: np.ndarray, received: np.ndarray) -> bool:
    """
    Check if a frame was fully recovered (no bit errors).
    """
    if original.shape != received.shape:
        min_len = min(len(original), len(received))
        original = original[:min_len]
        received = received[:min_len]
    return bool(np.all(original == received))

def moving_average(data: list, window_size: int = 10) -> float:
    """
    Compute moving average of last N values.
    """
    if not data:
        return 0.0
    return sum(data[-window_size:]) / min(len(data), window_size)