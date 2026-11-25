#!/usr/bin/env python3
"""Generate voiceover via ElevenLabs with word-level timestamps.

Usage: tts.py [episode.json] [out_dir]
Outputs (default dirs):
  temp/voiceover_raw.mp3      raw TTS audio
  temp/words.json             [{word, display, start, end, segment, keyword}]
  output/voiceover.mp3        loudness-normalised (-14 LUFS)

Multi-voice: a segment may set its own "voice_id" (and "speed") (e.g. dialogue between two hosts).
Consecutive segments with the same voice are synthesised together; groups are joined
with a short pause and timings are offset accordingly.

The API key is injected by the session's network proxy; set ELEVENLABS_API_KEY
locally if running elsewhere.
"""
import base64, json, os, re, subprocess, sys, tempfile, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EP_PATH = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "scripts/episode.json"
OUT_DIR = Path(sys.argv[2]) if len(sys.argv) > 2 else None
ep = json.loads(EP_PATH.read_text())
(ROOT / "temp").mkdir(exist_ok=True)
(ROOT / "output").mkdir(exist_ok=True)
GAP = float(ep.get("voice_gap", 0.3))


def synth(text, voice, speed=None):
    body = json.dumps({
        "text": text, "model_id": ep["model_id"], "language_code": ep.get("language", "en"),
        "voice_settings": {"stability": 0.4, "similarity_boost": 0.8, "style": 0.35,
                           "use_speaker_boost": True, "speed": speed or ep["speed"]},
    }).encode()
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice}/with-timestamps", data=body,
        headers={"Content-Type": "application/json",
                 "xi-api-key": os.environ.get("ELEVENLABS_API_KEY", "proxy-injected")})
    with urllib.request.urlopen(req, timeout=180) as r:
        data = json.load(r)
    al = data.get("normalized_alignment") or data["alignment"]
    return base64.b64decode(data["audio_base64"]), al


def duration(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
                         capture_output=True, text=True, check=True).stdout
    return float(out.strip())


kw = {k.lower() for k in ep["keywords"]}
dmap = ep["display_map"]


def parse_words(al, segs, offset):
    chars, starts, ends = al["characters"], al["character_start_times_seconds"], al["character_end_times_seconds"]
    bounds, pos = [], 0
    for s in segs:
        bounds.append((pos, pos + len(s["tts"]), s["id"]))
        pos += len(s["tts"]) + 1

    def seg_at(i):
        for a, b, sid in bounds:
            if a <= i < b + 1:
                return sid
        return bounds[-1][2]

    out, cur, cs, ce, ci = [], "", None, None, 0
    for i, ch in enumerate(chars + [" "]):
        if ch.isspace():
            if cur.strip("–-—"):
                clean = re.sub(r"[^\wåäöÅÄÖ:]", "", cur).rstrip(":")
                base = clean.lower()
                disp = re.sub(re.escape(clean), dmap[base], cur, flags=re.I) if base in dmap else cur
                out.append({"word": cur, "display": disp, "start": round(cs + offset, 3), "end": round(ce + offset, 3),
                            "segment": seg_at(ci), "keyword": base in kw or base.split(":")[0] in kw})
            cur, cs = "", None
        else:
            if cs is None:
                cs, ci = starts[i], i
            cur += ch
            ce = ends[i]
    return out


# group consecutive segments by voice
groups = []
for s in ep["segments"]:
    v = s.get("voice_id", ep["voice_id"])
    if groups and groups[-1][0] == v and groups[-1][1][-1].get("speed") == s.get("speed"):
        groups[-1][1].append(s)
    else:
        groups.append((v, [s]))

raw = (OUT_DIR or ROOT / "temp") / "voiceover_raw.mp3"
words, offset = [], 0.0
with tempfile.TemporaryDirectory() as td:
    parts = []
    for k, (voice, segs) in enumerate(groups):
        audio, al = synth(" ".join(s["tts"] for s in segs), voice, segs[0].get("speed"))
        mp3 = Path(td) / f"g{k}.mp3"
        mp3.write_bytes(audio)
        wav = Path(td) / f"g{k}.wav"
        # normalise each voice to the same loudness before joining, then pad with GAP silence
        pad = GAP if k < len(groups) - 1 else 0
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(mp3), "-af",
                        f"loudnorm=I=-16:TP=-2,apad=pad_dur={pad}", "-ar", "48000", "-ac", "1", str(wav)], check=True)
        words += parse_words(al, segs, offset)
        offset += duration(wav)
        parts.append(wav)
    lst = Path(td) / "list.txt"
    lst.write_text("".join(f"file '{p}'\n" for p in parts))
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(lst),
                    "-b:a", "192k", str(raw)], check=True)

((OUT_DIR or ROOT / "temp") / "words.json").write_text(json.dumps(words, ensure_ascii=False, indent=1))
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(raw),
                "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", "48000",
                "-b:a", "192k", str((OUT_DIR or ROOT / "output") / "voiceover.mp3")], check=True)
print(f"{len(words)} words, {len(groups)} voice group(s), duration {words[-1]['end']:.2f}s")
