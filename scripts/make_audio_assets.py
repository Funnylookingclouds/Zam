#!/usr/bin/env python3
"""Synthesise royalty-free background music and SFX (no external assets).

Outputs (video/public/):
  music.wav   ambient tech bed, normalised to -28 LUFS
  whoosh.wav  scene-change whoosh
  pop.wav     UI pop
"""
import subprocess, wave
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
PUB = ROOT / "video/public"
TMP = ROOT / "temp"
PUB.mkdir(parents=True, exist_ok=True)
SR = 48000
rng = np.random.default_rng(47)


def write(path, x):
    x = np.clip(x, -1, 1)
    st = np.stack([x, x], 1) if x.ndim == 1 else x
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((st * 32767).astype(np.int16).tobytes())


def lowpass(x, a):
    # one-pole low-pass, a in (0,1): smaller = darker
    y = np.empty_like(x); acc = 0.0
    for i, v in enumerate(x):
        acc += a * (v - acc); y[i] = acc
    return y


def note(f):
    return 440 * 2 ** ((f - 69) / 12)


# ---------- music: 112 BPM, A minor progression ----------
dur, bpm = 58.0, 112
n = int(SR * dur); t = np.arange(n) / SR
beat = 60 / bpm
bar = beat * 4
chords = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]  # Am F C G
pad = np.zeros(n); arp = np.zeros(n)
for i in range(int(dur / bar) + 1):
    s, e = int(i * bar * SR), min(n, int((i + 1) * bar * SR))
    if s >= n: break
    tt = t[s:e] - t[s]
    env = np.minimum(1, tt / 0.6) * np.minimum(1, (bar - tt) / 0.4)
    for m in chords[i % 4]:
        f = note(m)
        pad[s:e] += env * (np.sin(2*np.pi*f*tt) + 0.3*np.sin(2*np.pi*f*1.003*tt) + 0.15*np.sin(4*np.pi*f*tt))
    # 16th-note arpeggio
    seq = chords[i % 4] + [chords[i % 4][1] + 12]
    for k in range(16):
        a = s + int(k * beat / 4 * SR); b = min(e, a + int(0.18 * SR))
        if a >= e: break
        ta = t[a:b] - t[a]
        f = note(seq[k % 4] + 12)
        arp[a:b] += np.exp(-ta * 18) * np.sign(np.sin(2*np.pi*f*ta)) * 0.5
arp = lowpass(arp, 0.12)
kick = np.zeros(n)
for k in range(int(dur / beat)):
    a = int(k * beat * SR); b = min(n, a + int(0.25 * SR)); ta = t[a:b] - t[a]
    kick[a:b] += np.sin(2*np.pi*(50 + 90*np.exp(-ta*30))*ta) * np.exp(-ta*12)
hat = np.zeros(n); noise = rng.standard_normal(n)
for k in range(int(dur / (beat/2))):
    if k % 2 == 0: continue
    a = int(k * beat/2 * SR); b = min(n, a + int(0.05 * SR)); ta = t[a:b] - t[a]
    hat[a:b] += noise[a:b] * np.exp(-ta*90)
hat = hat - lowpass(hat, 0.3)
music = 0.18*pad + 0.25*arp + 0.5*kick + 0.12*hat
fade = np.minimum(1, t / 1.0) * np.minimum(1, (dur - t) / 2.0)
music *= fade / np.max(np.abs(music))
write(TMP / "music_raw.wav", music * 0.8)
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(TMP / "music_raw.wav"),
                "-af", "loudnorm=I=-28:TP=-6:LRA=11", "-ar", str(SR), str(PUB / "music.wav")], check=True)

# ---------- whoosh: band-swept noise ----------
d = 0.55; m = int(SR*d); tt = np.arange(m)/SR
nz = rng.standard_normal(m)
env = np.sin(np.pi * np.minimum(1, tt/d)) ** 2
# crude sweep: crossfade a dark and bright filtered noise
dark, bright = lowpass(nz, 0.03), nz - lowpass(nz, 0.25)
mix = tt / d
wh = (dark*(1-mix)*3 + bright*mix*0.6) * env
pan = np.stack([wh*(1-0.6*mix), wh*(0.4+0.6*mix)], 1)
write(PUB / "whoosh.wav", pan / np.max(np.abs(pan)) * 0.35)

# ---------- pop ----------
d = 0.12; m = int(SR*d); tt = np.arange(m)/SR
pop = np.sin(2*np.pi*(900*np.exp(-tt*25) + 300)*tt) * np.exp(-tt*35)
write(PUB / "pop.wav", pop / np.max(np.abs(pop)) * 0.3)
print("audio assets ok")
