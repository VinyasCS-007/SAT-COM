# backend/core/ecc/hamming.py
import numpy as np

def _int_to_bits(n: int, width: int) -> np.ndarray:
    return np.array([(n >> i) & 1 for i in range(width - 1, -1, -1)], dtype=np.uint8)

def _bits_to_int(bits: np.ndarray) -> int:
    return int(''.join(map(str, bits)), 2)

def encode_hamming(data: bytes) -> bytes:
    """
    Encode using Hamming(7,4) — 4 data bits → 7 encoded bits.
    Input: arbitrary bytes → output: encoded bytes (padded to 4-bit boundaries).
    """
    bits = np.unpackbits(np.frombuffer(data, dtype=np.uint8))
    # Pad to multiple of 4
    remainder = len(bits) % 4
    if remainder:
        bits = np.pad(bits, (0, 4 - remainder), constant_values=0)
    
    encoded_bits = []
    for i in range(0, len(bits), 4):
        d = bits[i:i+4]
        # Hamming(7,4) generator matrix (systematic form)
        p1 = d[0] ^ d[1] ^ d[3]
        p2 = d[0] ^ d[2] ^ d[3]
        p3 = d[1] ^ d[2] ^ d[3]
        codeword = np.array([p1, p2, d[0], p3, d[1], d[2], d[3]], dtype=np.uint8)
        encoded_bits.append(codeword)
    
    encoded_bits = np.concatenate(encoded_bits) if encoded_bits else np.array([], dtype=np.uint8)
    # Pad to byte boundary
    if len(encoded_bits) % 8:
        encoded_bits = np.pad(encoded_bits, (0, 8 - len(encoded_bits) % 8), constant_values=0)
    
    return np.packbits(encoded_bits).tobytes()

def decode_hamming(encoded: bytes) -> tuple[bytes, bool]:
    """
    Decode Hamming(7,4) with single-bit error correction.
    Returns (payload, success).
    """
    bits = np.unpackbits(np.frombuffer(encoded, dtype=np.uint8))
    # Trim to multiple of 7
    trim = len(bits) % 7
    if trim:
        bits = bits[:-trim]
    
    decoded_bits = []
    success = True
    
    for i in range(0, len(bits), 7):
        cw = bits[i:i+7]
        if len(cw) < 7:
            break
        # Syndrome calculation
        s1 = cw[0] ^ cw[2] ^ cw[4] ^ cw[6]
        s2 = cw[1] ^ cw[2] ^ cw[5] ^ cw[6]
        s3 = cw[3] ^ cw[4] ^ cw[5] ^ cw[6]
        syndrome = (s1 << 2) | (s2 << 1) | s3
        
        if syndrome != 0:
            # Correct single-bit error
            if syndrome <= 7:
                cw[syndrome - 1] ^= 1
            else:
                success = False  # Uncorrectable error
        
        # Extract data bits: positions 2,4,5,6 → [d0, d1, d2, d3]
        data_bits = cw[[2, 4, 5, 6]]
        decoded_bits.append(data_bits)
    
    if not decoded_bits:
        return b"", False
    
    decoded_bits = np.concatenate(decoded_bits)
    # Pad to byte boundary
    if len(decoded_bits) % 8:
        decoded_bits = np.pad(decoded_bits, (0, 8 - len(decoded_bits) % 8), constant_values=0)
    
    return np.packbits(decoded_bits).tobytes(), success