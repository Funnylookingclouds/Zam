"""Soft music-box SFX for the Child Edition: chime.wav (scene change), musicbox_intro.wav, musicbox_outro.wav."""
import numpy as np, wave, os
SR = 48000
OUT = os.path.join(os.path.dirname(__file__), "..", "video", "public", "sfx")
def note(freq, dur=1.6, amp=0.35):
    t = np.arange(int(SR * dur)) / SR
    env = np.exp(-t * 3.2) * np.minimum(1, t / 0.004)
    s = np.sin(2 * np.pi * freq * t) + 0.35 * np.sin(2 * np.pi * freq * 2.01 * t) * np.exp(-t * 6) + 0.12 * np.sin(2 * np.pi * freq * 4.2 * t) * np.exp(-t * 10)
    return s * env * amp
def seq(notes, total):
    buf = np.zeros(int(SR * total))
    for at, f in notes:
        n = note(f); i = int(at * SR); buf[i:i + len(n)] += n[: len(buf) - i]
    return buf
def save(name, x):
    x = x / max(1e-9, np.abs(x).max()) * 0.6
    st = np.stack([x, np.roll(x, 240)], 1)
    with wave.open(os.path.join(OUT, name), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype(np.int16).tobytes())
C5, D5, E5, G5, A5, C6, E6, G6 = 523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1318.5, 1568.0
save("chime.wav", seq([(0, E6), (0.12, C6)], 1.8))
save("musicbox_intro.wav", seq([(0, C6), (0.25, G5), (0.5, E5), (0.75, G5), (1.0, C6), (1.25, E6), (1.6, G6)], 3.4))
save("musicbox_outro.wav", seq([(0, G5), (0.4, E5), (0.8, C5), (1.2, D5), (1.6, E5), (2.0, G5), (2.5, C6), (2.5, E5)], 4.4))
print("ok")
