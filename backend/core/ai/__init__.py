# backend/core/ai/__init__.py
"""
AI module for satellite communication error correction.
Exposes the neural denoiser for payload recovery.
"""
from .model_loader import get_ai_model

__all__ = [
    "get_ai_model"
]