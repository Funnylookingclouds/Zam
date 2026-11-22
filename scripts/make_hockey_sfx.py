#!/usr/bin/env python3
"""Synthesise ZAM hockey SFX (no external assets): goal horn, ice scrape, crowd roar.
Outputs video/public/sfx/{horn,scrape,crowd}.wav"""
import wave
from pathlib import Path
import numpy as np

OUT = Path(__file__).resolve().parent.parent / "video/public/sfx"
OUT.mkdir(parents=True, exist_ok=True)
SR = 48000
rng = np.random.default_rng(7)

def write(name, x, gain=0.8):
    x = x / (np.max(np.abs(x)) + 1e-9) * gain
    st = np.stack([x, x], 1)
    with wave.open(str(OUT / name), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((st * 32767).astype(np.int16).tobytes())

def lp(x, a):
    y = np.zeros_like(x); acc = 0.0
    for i, v in enumerate(x):
        acc += a * (v - acc); y[i] = acc
    return y

def t_(d): return np.arange(int(SR * d)) / SR

# goal horn: low brassy chord (saw stack) with slow attack + vibrato
t = t_(1.8)
horn = sum(((t * f * (1 + 0.004 * np.sin(2 * np.pi * 5 * t))) % 1 * 2 - 1) for f in (110, 138.6, 165, 220))
env = np.minimum(1, t / 0.08) * np.minimum(1, (1.8 - t) / 0.4)
write("horn.wav", lp(horn * env, 0.18), 0.7)

# ice scrape: band-limited noise sweep
t = t_(0.7)
n = rng.standard_normal(len(t))
scr = lp(n, 0.35) - lp(n, 0.05)
env = np.sin(np.pi * t / 0.7) ** 1.5
write("scrape.wav", scr * env * (0.6 + 0.4 * np.sin(2 * np.pi * 9 * t)), 0.55)

# crowd roar: filtered noise swell
t = t_(2.2)
n = rng.standard_normal(len(t))
crowd = lp(n, 0.12) - lp(n, 0.01)
env = np.minimum(1, t / 0.3) * np.minimum(1, (2.2 - t) / 0.9)
write("crowd.wav", crowd * env, 0.5)
print("hockey sfx ok")
