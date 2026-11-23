#!/usr/bin/env bash
# Render a Remotion composition to output/<name>.mp4 with 2-pass loudnorm (-14 LUFS).  Usage: scripts/render_comp.sh <CompId> <outname>
set -euo pipefail
cd "$(dirname "$0")/.."
ID=$1; OUT=$2
(cd video && npx remotion render src/index.ts "$ID" "../temp/${OUT}_raw.mp4" --codec=h264 --video-bitrate=${BITRATE:-5.5M} --audio-bitrate=256k --browser-executable=/opt/pw-browsers/chromium --log=error)
J=$(ffmpeg -hide_banner -i "temp/${OUT}_raw.mp4" -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$J" | python3 -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }
ffmpeg -y -loglevel error -i "temp/${OUT}_raw.mp4" -c:v copy \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true" \
  -ar 48000 -c:a aac -b:a 256k -movflags +faststart "output/${OUT}.mp4"
echo "$OUT: $(du -h output/${OUT}.mp4 | cut -f1) $(ffprobe -v error -show_entries format=duration -of csv=p=0 output/${OUT}.mp4)s $(ffmpeg -hide_banner -i output/${OUT}.mp4 -af ebur128 -f null - 2>&1 | grep -A1 'Integrated loudness' | tail -1 | xargs)"
