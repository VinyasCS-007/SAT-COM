# backend/api/routes.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.database import SessionLocal, TelemetryLog
from core.ai.model_loader import get_ai_model
from core.ecc import encode_rs, decode_rs, encode_hamming, decode_hamming, encode_crc32, decode_crc32
from core.channel import add_awgn, add_burst_errors, add_rayleigh_fading
from controller.adaptive import AdaptiveController
from utils.metrics import calculate_ber
import numpy as np
import time

router = APIRouter()
_controller = AdaptiveController()  # Singleton controller

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/transmit")
async def transmit(config: dict, db: Session = Depends(get_db)):
    start_time = time.time()
    
    # 1. Generate payload (in bytes; default 223 bytes for RS)
    payload_bytes_count = config.get("payload_size", 223)
    total_bits = payload_bytes_count * 8
    payload_bits = np.random.randint(0, 2, total_bits).astype(np.uint8)
    payload_bytes = np.packbits(payload_bits).tobytes()

    # 2. Determine ECC scheme (manual or auto)
    ecc_scheme = config.get("ecc_scheme", "reed_solomon")
    if config.get("auto_ecc", False):
        snr_db = config.get("snr_db", 10.0)
        ecc_scheme = _controller.get_optimal_ecc(snr_db)

    # 3. ECC Encode
    if ecc_scheme == "reed_solomon":
        encoded = encode_rs(payload_bytes)
    elif ecc_scheme == "hamming":
        encoded = encode_hamming(payload_bytes)
    elif ecc_scheme == "crc":
        encoded = encode_crc32(payload_bytes)
    else:
        encoded = payload_bytes

    # 4. Apply channel noise
    snr_db = config.get("snr_db", 10.0)
    noise_type = config.get("noise_type", "awgn")
    encoded_bits = np.frombuffer(encoded, dtype=np.uint8)

    if noise_type == "fading":
        noisy_bits = add_rayleigh_fading(encoded_bits, snr_db)
    else:
        noisy_bits = add_awgn(encoded_bits, snr_db)
        if noise_type == "burst":
            noisy_bits = add_burst_errors(noisy_bits, burst_prob=0.03)

    noisy_bytes = noisy_bits.tobytes()

    # 5. ECC Decode
    ecc_success = False
    if ecc_scheme == "reed_solomon":
        _, ecc_success = decode_rs(noisy_bytes)
    elif ecc_scheme == "hamming":
        _, ecc_success = decode_hamming(noisy_bytes)
    elif ecc_scheme == "crc":
        _, ecc_success = decode_crc32(noisy_bytes)
    else:
        # No ECC: assume success if payload matches (not realistic, but fallback)
        ecc_success = True

    # 6. Calculate BER before AI
    clean_bits = np.unpackbits(np.frombuffer(encoded, dtype=np.uint8))
    # Pad noisy_bits to byte boundary if needed
    if len(noisy_bits) % 8 != 0:
        noisy_bits_padded = np.pad(noisy_bits, (0, 8 - len(noisy_bits) % 8))
    else:
        noisy_bits_padded = noisy_bits
    noisy_unpacked = np.unpackbits(noisy_bits_padded.astype(np.uint8))
    ber_before = calculate_ber(clean_bits, noisy_unpacked)

    # 7. AI Correction (if needed)
    ai_corrected = False
    ber_after = ber_before

    # Use adaptive logic to decide AI usage
    if _controller.should_use_ai(ber_before, ecc_success):
        try:
            model = get_ai_model()
            # Prepare input: [255 bits + 1 SNR] = 256 features
            codeword_input = noisy_bits[:255] if len(noisy_bits) >= 255 else np.pad(noisy_bits, (0, 255 - len(noisy_bits)))
            ai_input = np.concatenate([codeword_input.astype(np.float32), [snr_db]]).reshape(1, -1)
            
            pred = model.predict(ai_input, verbose=0)
            corrected_payload_bits = (pred[0] > 0.5).astype(int)  # Shape: (223,)
            
            # Compare to original first 223 bits of payload
            original_223_bits = payload_bits[:223]
            ber_after = calculate_ber(original_223_bits, corrected_payload_bits)
            ai_corrected = True
            
        except Exception as e:
            print(f"AI correction failed: {e}")

    # 8. Log telemetry
    latency_ms = (time.time() - start_time) * 1000
    log_entry = TelemetryLog(
        snr_db=snr_db,
        noise_type=noise_type,
        ecc_scheme=ecc_scheme,
        ber_before=float(ber_before),
        ber_after=float(ber_after),
        ai_corrected=int(ai_corrected),
        latency_ms=latency_ms
    )
    db.add(log_entry)
    db.commit()

    # 9. Update adaptive controller history
    _controller.log_frame(snr_db, ber_before, ecc_scheme, ecc_success)

    return {
        "success": True,
        "ber_before": float(ber_before),
        "ber_after": float(ber_after),
        "ecc_used": ecc_scheme,
        "noise_type": noise_type,
        "ai_corrected": ai_corrected,
        "latency_ms": latency_ms
    }