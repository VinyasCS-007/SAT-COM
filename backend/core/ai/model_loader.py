# backend/core/ai/model_loader.py
import os
from tensorflow.keras.models import load_model
from dotenv import load_dotenv

load_dotenv()
MODEL_PATH = os.getenv("AI_MODEL_PATH", "models/cnn_denoiser.keras")

_model = None

def get_ai_model():
    global _model
    if _model is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"AI model not found at {MODEL_PATH}")
        _model = load_model(MODEL_PATH)
        print(f"✅ Loaded AI model from {MODEL_PATH}")
    return _model