# backend/core/ecc/reed_solomon.py
from reedsolo import RSCodec

def encode_rs(data: bytes, n=255, k=223) -> bytes:
    """Encode using Reed–Solomon (n, k)."""
    rsc = RSCodec(n - k)
    return rsc.encode(data)

def decode_rs(encoded: bytes, n=255, k=223) -> tuple[bytes, bool]:
    """Decode RS and return (payload, success)."""
    rsc = RSCodec(n - k)
    try:
        decoded, _, _ = rsc.decode(encoded)
        return decoded, True
    except Exception:
        return b"", False