#!/usr/bin/env python3
"""Synthesise brand SFX for intro/outro stingers (no external assets) and
generate the outro voice line via ElevenLabs.

Outputs (video/public/brand/):
  riser.wav   rising noise + pitch sweep (build-up)
  impact.wav  sub boom + noise burst (logo hit)
  boing.wav   cartoon bounce
  ding.wav    bell (subscribe)
  outro_vo.mp3  "Follow for more – and please subscribe!" (-14 LUFS)
"""
import json, os, subprocess, urllib.request, wave
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "video/public/brand"
OUT.mkdir(parents=True, exist_ok=True)
SR = 48000
rng = np.random.default_rng(7)


def write(name, x, gain=0.8):
    x = x / (np.max(np.abs(x)) + 1e-9) * gain
    st = np.stack([x, x], 1) if x.ndim == 1 else x
    with wave.open(str(OUT / name), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(st, -1, 1) * 32767).astype(np.int16).tobytes())


def lp(x, a):
    y = np.empty_like(x); acc = 0.0
    for i, v in enumerate(x):
        acc += a * (v - acc); y[i] = acc
    return y


def t_(d):
    return np.arange(int(SR * d)) / SR


# riser: 1.4 s noise getting brighter + upward sine sweep
t = t_(1.4)
env = (t / t[-1]) ** 2
noise = rng.standard_normal(len(t))
bright = noise - lp(noise, 0.05 + 0.4 * 0)  # high-passed
sweep = np.sin(2 * np.pi * np.cumsum(200 + 1800 * (t / t[-1]) ** 2) / SR)
write("riser.wav", env * (0.5 * bright + 0.6 * sweep), 0.55)

# impact: sub drop + noise crack + tail
t = t_(1.2)
sub = np.sin(2 * np.pi * np.cumsum(120 * np.exp(-t * 6) + 38) / SR) * np.exp(-t * 3.2)
crack = rng.standard_normal(len(t)) * np.exp(-t * 28)
tail = lp(rng.standard_normal(len(t)), 0.08) * np.exp(-t * 4) * 2
write("impact.wav", 1.2 * sub + 0.5 * crack + 0.3 * tail, 0.9)

# boing: pitch wobble
t = t_(0.45)
f = 180 + 260 * np.exp(-t * 9) + 40 * np.sin(2 * np.pi * 14 * t) * np.exp(-t * 5)
boing = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7)
write("boing.wav", boing, 0.6)

# ding: bell partials
t = t_(1.2)
ding = sum(a * np.sin(2 * np.pi * fr * t) * np.exp(-t * d) for fr, a, d in
           [(1320, 1, 3.5), (2640, 0.5, 5), (3960, 0.25, 7), (1760, 0.3, 4)])
write("ding.wav", ding, 0.5)

# outro voice line
ep = json.loads((ROOT / "scripts/episode.json").read_text())
body = json.dumps({
    "text": "Follow for more – and please subscribe!",
    "model_id": ep["model_id"], "language_code": "en",
    "voice_settings": {"stability": 0.35, "similarity_boost": 0.8, "style": 0.5,
                       "use_speaker_boost": True, "speed": 1.1},
}).encode()
req = urllib.request.Request(
    f"https://api.elevenlabs.io/v1/text-to-speech/{ep['voice_id']}", data=body,
    headers={"Content-Type": "application/json",
             "xi-api-key": os.environ.get("ELEVENLABS_API_KEY", "proxy-injected")})
raw = ROOT / "temp/outro_vo_raw.mp3"
with urllib.request.urlopen(req, timeout=120) as r:
    raw.write_bytes(r.read())
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(raw), "-af",
                "silenceremove=start_periods=1:start_threshold=-45dB,loudnorm=I=-14:TP=-1.5:LRA=11",
                "-ar", "48000", str(OUT / "outro_vo.mp3")], check=True)
print("brand audio ok")
