#!/usr/bin/env bash
# Render an archived episode without re-running TTS.
# Usage: scripts/render_episode.sh 2026-w46-en w46
#   $1 = episode id in scripts/episodes/, $2 = scene module in video/src/episodes/
# Needs output/voiceover.mp3 to match the episode (run scripts/tts.py first if not).
set -euo pipefail
cd "$(dirname "$0")/.."
ID=$1; MOD=$2
cp "scripts/episodes/$ID.json" scripts/episode.json
cp "scripts/episodes/$ID.words.json" temp/words.json
cp temp/words.json video/src/data/words.json
cp output/voiceover.mp3 video/public/voiceover.mp3
printf '// Active episode – change this one line to rebuild another week\n// (also copy the matching scripts/episodes/<id>.json to scripts/episode.json).\nexport * from "./episodes/%s";\n' "$MOD" > video/src/episode.ts
(cd video && npx tsc && npx remotion render src/index.ts WeeklyShort ../temp/video_raw.mp4 --codec=h264 --video-bitrate=5.5M --audio-bitrate=256k --log=error)
J=$(ffmpeg -hide_banner -i temp/video_raw.mp4 -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$J" | python3 -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }
ffmpeg -y -loglevel error -i temp/video_raw.mp4 -c:v copy \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true" \
  -ar 48000 -c:a aac -b:a 256k -movflags +faststart output/weekly_short.mp4
cp "scripts/episodes/$ID.youtube.md" output/youtube_description.md 2>/dev/null || true
du -h output/weekly_short.mp4
ffprobe -v error -show_entries format=duration -of csv=p=0 output/weekly_short.mp4
ffmpeg -hide_banner -i output/weekly_short.mp4 -af ebur128=peak=true -f null - 2>&1 | grep -A14 Summary | grep -E " I:|Peak:"
