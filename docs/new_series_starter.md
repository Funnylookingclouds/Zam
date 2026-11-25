# Starter kit: new cartoon YouTube series (lessons from ZAM)

Paste this whole file into a new chat (or point the session at it) to start a new animated series. Everything referenced lives in the **Funnylookingclouds/Zam** repo – attach that repo (read access) to copy code.

## 1. What worked (owner-approved)
* **Characters:** full, round, Babblarna-like code-drawn characters (SVG in React) – *not* cardboard cut-outs, stickers or stick/bean bodies. Each has one clear silhouette + one accent colour.
* **Faces carry the jokes:** big expression system – brows, squint/wide/heart eyes, saccade glances, viseme mouths (A/E/O/M) from word timestamps, head tilt, body shake, emotion FX (steam, hearts, sweat, "HA!", zzz). Change mood on almost every line.
* **World:** 2.5D CSS-3D miniature diorama with neon lighting, light beams, dust, vignette, grain, depth-of-field, and a jumbotron/sign that comments on every shot.
* **Eye magnets:** split-depth breakouts (white bars, object breaks out over them), sepia flashback "photo" cards for real facts, ≥ 8 hidden background details, one recurring hidden mascot (🐙) + "Did you find it?" in outro & pinned comment.
* **Pacing:** pattern interrupt every 1.5–2 s (cut, camera whip/push, mood flip, Pow word, sound hit). Never a static shot > 2.5 s.
* **Audio identity:** a 2.9 s catchy jingle intro (drums, guitar, piano stabs, claps + cast shouting the show name) and one happy recurring background theme (ukulele/pizzicato/whistle) at low volume.
* **Comedy:** fact-based but funny. Set-up → reaction → twist; funny word last; joke lines ≤ 8 words; one dry sarcastic character who deflates everyone; a callback ending. Review/score the previous episode's jokes before each new script.

## 2. Tech stack (copy from Zam repo)
| Piece | File in Zam repo |
|---|---|
| Remotion project (React, 1080×1920, 60 fps) | `video/` (`package.json`, `Root.tsx`) |
| Character drawing + Expressions 2.0 | `video/src/mascots/Gang.tsx` (expression sheet: `output/expression_sheet.png`) |
| 2.5D diorama, camera, cut-outs, split-depth | `video/src/hl3d/Diorama.tsx` (`Diorama`, `dframe`, `dlerp`, `Cut`, `SplitDepth`), `hl3d/Camp.tsx` (outdoor set) |
| Full reference episode (intro, outro, captions, fact stickers, flashback) | `video/src/episodes/cup_pilot_25d.tsx`, `zam_goalie_25d.tsx` |
| Multi-voice TTS with word timestamps | `scripts/tts.py` + `scripts/episodes/<name>.json` (segment id prefix → speaker/voice) |
| Comic pauses | `scripts/insert_pauses.py <dir> seg=sec …` |
| Render + mux + loudness | `scripts/render_comp.sh <CompId> <outname>` (`REMOTION_EXTRA`, `BITRATE`) |
| SFX / brand audio | `scripts/make_audio_assets.py`, `scripts/make_brand_audio.py` |

**ElevenLabs** (key stored as a network secret on the cloud environment; header `xi-api-key: proxy-injected`, never commit it):
* TTS with timestamps: `/v1/text-to-speech/<voice>/with-timestamps`, model `eleven_multilingual_v2`, stability 0.35, similarity 0.8, style 0.45, speed ~1.1.
* Music (jingles/themes): `POST /v1/music?output_format=mp3_44100_128` with `prompt` + `music_length_ms`.
* Sound effects: `/v1/sound-generation`. Speech-to-text (alignment checks): `/v1/speech-to-text`, `scribe_v1`.

## 3. Hard-won lessons
* **Render speed:** avoid `backdrop-filter`, root-level CSS filters and duplicated SVG copies (4× slower). Render heavy scenes with `--concurrency=2 --timeout=180000`; a 50 s Short ≈ 1.5 h → run in background.
* Composition ids: only a–z, A–Z, 0–9, `-` (no underscores).
* Post-process word timestamps: merge multi-word numbers into one caption token ("1924", "6–3").
* Dutch-angle camera → zoom in or you get black corners. Crossfades into not-yet-started shots → clamp shot index.
* Always check a contact sheet of stills before delivering (numbers, overlaps, safe zones: right 170 px, bottom 300 px).
* Audio: voice -14 LUFS, music ≈ -28 LUFS, final -14 LUFS; video 5.5 Mbps ≈ 40 MB (< GitHub's 50 MB warning).
* Cloud session: `node_modules` must be installed (`npm install` in `video/`). Commit + push everything; containers are ephemeral.

## 4. Workflow that worked
1. Pitch 3 topics → owner picks. 2. Research & verify facts (sources listed). 3. Script as dialogue (≤ 135 words, ≤ 52.5 s VO) → **wait for approval**. 4. TTS + pauses. 5. Build episode, stills check. 6. Render in background. 7. Commit + push, send file, give SHA-locked blob/raw links. 8. YouTube description file (3 titles, sources, hashtags, 15–25 tags, pinned comment).

## 5. Decide for the new series (answer these first)
* Channel name, handle, niche & audience (kids? adults? which topic?), language.
* Format: Shorts (9:16, ≤ 58 s) or long-form (16:9)? Fact-based or pure story?
* Cast: 3–5 characters – look, personality, accent colour, voice (pick ElevenLabs voices, make samples, approve).
* World/set style (reuse 2.5D diorama or a new set), intro jingle, background theme, recurring hidden gag.
* Hard rules (copyright, trademarks, what never to show).
* Then write the new repo's `CLAUDE.md` in the same shape as Zam's (Hard rules → House style → Cast & voices → Comedy rules → Workflow → Render & audio → Delivery → Description).

## 6. Starter prompt for the new chat
> I want to start a new animated cartoon YouTube series. Read `docs/new_series_starter.md` from the Funnylookingclouds/Zam repo – it holds the tech and lessons from my ZAM channel. Help me decide the points in section 5, then set up a new repo with Remotion copied from Zam, a `CLAUDE.md`, character designs and a pilot. Always wait for my approval of characters and script before generating audio.
