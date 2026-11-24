"""Insert comic pauses before given segments: shifts audio + word timings.  Usage: insert_pauses.py <dir> seg=sec ..."""
import json, subprocess, sys
import numpy as np
d = sys.argv[1]; pauses = {a.split("=")[0]: float(a.split("=")[1]) for a in sys.argv[2:]}
SR = 48000
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", f"{d}/voiceover.mp3", "-ar", str(SR), "-ac", "1", "-f", "f32le", "-"], capture_output=True, check=True).stdout
x = np.frombuffer(raw, np.float32)
words = json.load(open(f"{d}/words.json"))
cuts = []
for seg, p in pauses.items():
    first = next(w for w in words if w["segment"] == seg)
    prev_end = max([w["end"] for w in words if w["end"] <= first["start"]] or [0])
    cuts.append(((prev_end + first["start"]) / 2, p))
cuts.sort()
parts, last, shift = [], 0, 0.0
for t, p in cuts:
    i = int(t * SR); parts += [x[last:i], np.zeros(int(p * SR), np.float32)]; last = i
parts.append(x[last:]); y = np.concatenate(parts)
for w in words:
    s = sum(p for t, p in cuts if t <= w["start"]); w["start"] = round(w["start"] + s, 3); w["end"] = round(w["end"] + s, 3)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-", "-b:a", "192k", f"{d}/voiceover_paced.mp3"], input=y.tobytes(), check=True)
json.dump(words, open(f"{d}/words_paced.json", "w"), indent=1)
print("duration", len(y) / SR)
