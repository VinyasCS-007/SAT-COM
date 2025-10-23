# backend/core/ecc/crc.py
import crcmod

# Precompute CRC-32 function (IEEE 802.3 standard)
_crc32_func = crcmod.mkCrcFun(0x104C11DB7, initCrc=0xFFFFFFFF, rev=True, xorOut=0xFFFFFFFF)

def encode_crc32(data: bytes) -> bytes:
    """Append CRC-32 checksum to data."""
    crc = _crc32_func(data)
    return data + crc.to_bytes(4, 'big')

def decode_crc32(encoded: bytes) -> tuple[bytes, bool]:
    """Verify CRC-32 and return payload if valid."""
    if len(encoded) < 4:
        return b"", False
    payload = encoded[:-4]
    received_crc = int.from_bytes(encoded[-4:], 'big')
    computed_crc = _crc32_func(payload)
    return payload, (computed_crc == received_crc)