#!/usr/bin/env bash
# Full pipeline: TTS -> audio assets -> Remotion render -> loudness check -> output/
# Edit scripts/episode.json for each week (after the script is approved).
set -euo pipefail
cd "$(dirname "$0")/.."

attempt() { # retry up to 3 times (CLAUDE.md §5)
  local n=1; until "$@"; do
    [[ $n -ge 3 ]] && { echo "FAILED after 3 attempts: $*"; return 1; }
    echo "Retry $n: $*"; n=$((n+1)); sleep 2; done
}

attempt python3 scripts/tts.py
attempt python3 scripts/make_audio_assets.py
cp output/voiceover.mp3 video/public/voiceover.mp3
cp temp/words.json video/src/data/words.json
(cd video && [[ -d node_modules ]] || npm install --no-audit --no-fund)
(cd video && attempt npx remotion render src/index.ts WeeklyShort ../temp/video_raw.mp4 --codec=h264 --video-bitrate=5.5M --audio-bitrate=256k --log=error)
# Two-pass loudnorm of the final mix to -14 LUFS (video stream copied)
J=$(ffmpeg -hide_banner -i temp/video_raw.mp4 -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$J" | python3 -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }
ffmpeg -y -loglevel error -i temp/video_raw.mp4 -c:v copy \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true" \
  -ar 48000 -c:a aac -b:a 256k -movflags +faststart output/weekly_short.mp4
ffmpeg -hide_banner -i output/weekly_short.mp4 -af ebur128 -f null - 2>&1 | grep -A1 "Integrated loudness" | tail -1
ffprobe -v error -show_entries format=duration:stream=width,height,r_frame_rate -of compact output/weekly_short.mp4
