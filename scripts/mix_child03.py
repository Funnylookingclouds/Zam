"""Mix the long-form Child Edition audio with numpy: baby lines + 2 songs + instrumental bed + birds."""
import json, subprocess, numpy as np
D = "temp/child3/"; SR = 48000; TOTAL = 299.0; SA, SB = 117.0, 263.0
def load(path, lufs):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-af", f"loudnorm=I={lufs}:TP=-2", "-ar", str(SR), "-ac", "2", "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()
out = np.zeros((int(TOTAL * SR), 2), np.float32)
def place(x, at, gain=1.0):
    i = int(at * SR); n = min(len(x), len(out) - i); out[i:i + n] += x[:n] * gain
def fade(x, fin=0.0, fout=0.0):
    n = len(x)
    if fin: k = int(fin * SR); x[:k] *= np.linspace(0, 1, k)[:, None]
    if fout: k = int(fout * SR); x[n - k:] *= np.linspace(1, 0, k)[:, None]
    return x
for l in json.load(open(D + "lines.json")): place(load(l["dir"] + "/baby.wav", -16), l["at"])
place(fade(load(D + "songA.mp3", -17), fout=3), SA)
place(fade(load(D + "songB.mp3", -17), fout=3), SB)
bed = load(D + "bed.mp3", -29); bed = np.concatenate([bed] * 4)
place(fade(bed[: int((SA - 0.5) * SR)].copy(), 3, 3), 0)
place(fade(bed[int(60 * SR): int((60 + SB - 163.5) * SR)].copy(), 3, 3), 163)
birds = load(D + "birds.mp3", -30); birds = np.concatenate([birds] * 15)[: len(out)].copy()
t = np.arange(len(out)) / SR
g = np.where(((t >= SA) & (t < SA + 46)) | ((t >= SB) & (t < SB + 36)), 0.15, np.where(t < 40, 1.0, 0.55))
g = np.convolve(g, np.ones(SR) / SR, mode="same")  # 1 s smoothing
out += birds * g[:, None] * np.minimum(1, (len(out) - np.arange(len(out))) / (4 * SR))[:, None]
out = np.clip(out, -0.95, 0.95)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", "-b:a", "192k", D + "child03.mp3"], input=out.tobytes(), check=True)
print("ok", len(out) / SR)
