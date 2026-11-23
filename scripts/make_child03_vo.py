"""Child Edition long-form: one TTS run per line (slow, soft), pitched up to baby voices, placed on a long timeline.
Writes temp/child3/lines/<id>/ and temp/child3/lines.json (id, at, path)."""
import json, subprocess, os
V = {"z": "wGkprrTXgBM5EC3Znt6U", "p": "fBD19tfE58bkETeiwUoC", "b": "D38z5RcWu1voky8WS1ja", "h": "RDSy0QN68yhrjuOgqzQ4", "c": "Q4oILuo4P8VeXtE6FMLI", "a": "R9RZPy40Zzy1wNxrgQpj"}
LINES = [  # (segment id, news-time seconds, text)
  ("z_morning", 6, "Good morning… sunshine."),
  ("p_hi", 12.5, "Hi!"), ("b_hi", 16.5, "Hi!"), ("h_hi", 20.5, "Hi!"), ("c_hi", 24.5, "Hi!"), ("a_hi", 28.5, "Hi!"),
  ("p_count", 45, "One… two… three… wheee!"), ("b_higher", 61, "Higher… please."),
  ("b_pat", 86, "Pat… pat… castle!"), ("a_stars", 102, "Big castle. Five stars!"),
  ("c_updown", 170, "Up… down…"), ("h_bubbles", 186, "Pink… blue… pop!"),
  ("p_goal", 217, "Goal!"), ("b_again", 223, "Again!"),
  ("z_apple", 240, "Yum… apple."), ("h_cloud", 252, "Look… a puck cloud!"),
]
os.makedirs("temp/child3/lines", exist_ok=True)
out = []
for sid, at, text in LINES:
    d = f"temp/child3/lines/{sid}"; os.makedirs(d, exist_ok=True)
    ep = {"id": f"child-03-{sid}", "language": "en", "voice_id": V[sid[0]], "model_id": "eleven_multilingual_v2", "speed": 0.8, "voice_gap": 0.5,
          "segments": [{"id": sid, "tts": text}], "display_map": {}, "keywords": ["sunshine", "wheee", "castle", "stars", "pop", "goal", "again", "apple", "cloud", "higher"]}
    p = f"scripts/episodes/child03/{sid}.json"; json.dump(ep, open(p, "w"), indent=1)
    subprocess.run(["python3", "scripts/tts.py", p, d], check=True, capture_output=True)
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", f"{d}/voiceover.mp3", "-af", "asetrate=48000*1.18,aresample=48000,atempo=0.847458", "-ar", "48000", f"{d}/baby.wav"], check=True)
    out.append({"id": sid, "at": at, "dir": d}); print(sid, "ok")
json.dump(out, open("temp/child3/lines.json", "w"), indent=1)
