#!/usr/bin/env python3
"""Remove near-white background from RGBA PNG via edge flood fill."""

from __future__ import annotations

import struct
import sys
import zlib
from collections import deque
from pathlib import Path


def paeth(a: int, b: int, c: int) -> int:
    p = a + b - c
    pa = abs(p - a)
    pb = abs(p - b)
    pc = abs(p - c)
    if pa <= pb and pa <= pc:
        return a
    if pb <= pc:
        return b
    return c


def decode_png_rgba(path: Path) -> tuple[int, int, bytearray]:
    data = path.read_bytes()
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError(f"{path} is not a PNG file")

    width = height = 0
    idat = bytearray()
    pos = 8

    while pos < len(data):
        length = struct.unpack(">I", data[pos : pos + 4])[0]
        chunk_type = data[pos + 4 : pos + 8]
        chunk_data = data[pos + 8 : pos + 8 + length]
        pos += 12 + length

        if chunk_type == b"IHDR":
            width, height, bit_depth, color_type = struct.unpack(">IIBBBBB", chunk_data[:13])[:4]
            if bit_depth != 8 or color_type != 6:
                raise ValueError("Only 8-bit RGBA PNG is supported")
        elif chunk_type == b"IDAT":
            idat.extend(chunk_data)
        elif chunk_type == b"IEND":
            break

    raw = zlib.decompress(bytes(idat))
    bpp = 4
    row_bytes = width * bpp
    out = bytearray()
    prev = bytearray(row_bytes)
    src = 0

    for _ in range(height):
        filt = raw[src]
        src += 1
        scan = bytearray(raw[src : src + row_bytes])
        src += row_bytes

        if filt == 0:
            recon = scan
        elif filt == 1:
            recon = bytearray(row_bytes)
            for i in range(row_bytes):
                left = recon[i - bpp] if i >= bpp else 0
                recon[i] = (scan[i] + left) & 0xFF
        elif filt == 2:
            recon = bytearray((scan[i] + prev[i]) & 0xFF for i in range(row_bytes))
        elif filt == 3:
            recon = bytearray(row_bytes)
            for i in range(row_bytes):
                left = recon[i - bpp] if i >= bpp else 0
                up = prev[i]
                recon[i] = (scan[i] + ((left + up) // 2)) & 0xFF
        elif filt == 4:
            recon = bytearray(row_bytes)
            for i in range(row_bytes):
                left = recon[i - bpp] if i >= bpp else 0
                up = prev[i]
                up_left = prev[i - bpp] if i >= bpp else 0
                recon[i] = (scan[i] + paeth(left, up, up_left)) & 0xFF
        else:
            raise ValueError(f"Unsupported PNG filter: {filt}")

        out.extend(recon)
        prev = recon

    return width, height, out


def encode_png_rgba(path: Path, width: int, height: int, pixels: bytearray) -> None:
    row_bytes = width * 4
    filtered = bytearray()

    for row in range(height):
        start = row * row_bytes
        filtered.append(0)
        filtered.extend(pixels[start : start + row_bytes])

    compressed = zlib.compress(bytes(filtered), level=9)

    def chunk(tag: bytes, payload: bytes) -> bytes:
        crc = zlib.crc32(tag + payload) & 0xFFFFFFFF
        return struct.pack(">I", len(payload)) + tag + payload + struct.pack(">I", crc)

    ihdr = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    png = b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(b"IDAT", compressed) + chunk(b"IEND", b"")
    path.write_bytes(png)


def is_background(r: int, g: int, b: int, a: int) -> bool:
    if a < 10:
        return True
    return r > 235 and g > 235 and b > 235


def remove_background(width: int, height: int, pixels: bytearray) -> int:
    visited: set[tuple[int, int]] = set()
    queue: deque[tuple[int, int]] = deque()

    def push(x: int, y: int) -> None:
        if 0 <= x < width and 0 <= y < height:
            queue.append((x, y))

    for x in range(width):
        push(x, 0)
        push(x, height - 1)
    for y in range(height):
        push(0, y)
        push(width - 1, y)

    removed = 0
    while queue:
        x, y = queue.popleft()
        if (x, y) in visited:
            continue
        idx = (y * width + x) * 4
        r, g, b, a = pixels[idx : idx + 4]
        if not is_background(r, g, b, a):
            continue
        visited.add((x, y))
        pixels[idx + 3] = 0
        removed += 1
        push(x + 1, y)
        push(x - 1, y)
        push(x, y + 1)
        push(x, y - 1)

    return removed


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    targets = [Path(arg) for arg in sys.argv[1:]] or [
        root / "public/logo.png",
        root / "app/icon.png",
        root / "app/apple-icon.png",
    ]

    for path in targets:
        if not path.exists():
            continue
        width, height, pixels = decode_png_rgba(path)
        removed = remove_background(width, height, pixels)
        encode_png_rgba(path, width, height, pixels)
        print(f"{path.relative_to(root)}: {width}x{height}, removed {removed} background pixels")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
