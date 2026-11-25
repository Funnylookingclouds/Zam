# Project: ZAM – Faceless NHL Shorts

Producer/director for YouTube channel **ZAM** (@ZamHockey – https://www.youtube.com/@ZamHockey). Fast, funny, **fact-based** animated Shorts (9:16, 1080×1920, 60 fps, ≤ 58 s) about NHL moments, records and history, hosted by the code-drawn gang **Zam, Pucky, Biscuit, Helmy, Clubby, Agenty**. All video content in **English** (chat may be Swedish).
Full older spec (paper-board "Daily Facts", Special Edition toon, Hockey Life, Child Edition details): `docs/legacy_style.md`.

## Hard rules
* **Never** NHL footage, NHL/team logos, wordmarks, crested jerseys, player photos/likenesses. Players/teams named only in narration/captions; plays recreated as illustrations.
* **Never say "Zamboni"** → "ice machine" / "ice resurfacer". No copyrighted music (own/ElevenLabs only).
* Verify every fact (date, score, player, record) – NHL.com first, then a reputable outlet. Rumours only as "reportedly".
* **Always pause for my approval of topic + script** before TTS/animation.
* ElevenLabs key = network secret on the cloud env (header `xi-api-key: proxy-injected`) – never paste or commit it.

## House style "ZAM 2.5D Arena" (reference: `video/src/episodes/cup_pilot_25d.tsx`)
* **World:** `Diorama` (`video/src/hl3d/Diorama.tsx`) – CSS-3D neon miniature arena: paper ice, ad boards, stands with joke-sign fans, jumbotron (`jumbo` comments every shot), neon "ZAM" sign, light beams, dust, vignette + grain. Camera `dframe(x,y,z,dist,screenY,{rx,ry})` / `dlerp`; characters via `<Cut … toon>`. Other sets: `hl3d/Camp.tsx` (`CampDiorama`, `Octo`).
* **Characters:** `<Mascot who=… noSticker>` (`video/src/mascots/Gang.tsx`) – original full Babblarna-like designs, never cardboard/sticker/bean bodies.
* **Expressions 2.0:** moods `talk laugh angry wow shock sad smug proud love scared grumpy sweat sleep dizzy bliss tired determined starry`; brows, heart/squint eyes, `lookAt`, viseme mouths, tilt, emotion FX (`fx`). **Change mood almost every line.**
* **Layout:** full-screen 2.5D shot; tag top-left `ZAM · <TITLE>` (magenta); big centred word-by-word captions (uppercase, white + black stroke, current word yellow, top ≈ 1440); torn-paper fact sticker with source line at y ≈ 1215. Safe zones: right 170 px, bottom 300 px.
* **Every episode:** ≥ 2 `SplitDepth` breakouts; sepia flashback photo cards for history (year badge, "true story · source"); ≥ 8 hidden details; a hidden 🐙 octopus in 2–3 shots, ending "Did you find the octopus?".
* **Pacing:** pattern interrupt every 1.5–2 s; no static shot > ~2.5 s.
* **Intro (2.9 s):** `Intro2` + jingle `video/public/brand/jingle_zam.mp3` (gang shouts "ZAM!"). **Music:** `video/public/music_happy.mp3` ≈ 0.24 under dialogue, 0.4 under outro. **Outro (3 s):** `Outro2` – gang, logo, "Follow for more 👀" + octopus question, `brand/outro_vo.mp3`.

## Cast & voices (ElevenLabs `eleven_multilingual_v2`; stability 0.35, similarity 0.8, style 0.45, boost)
| Mascot | Look | Personality | Voice id |
|---|---|---|---|
| Zam (blue `#3b82f6`) | ice machine, cab window, googly eyes | naive helper, his help makes it worse | Gus `wGkprrTXgBM5EC3Znt6U` |
| Pucky (red `#d94b3b`) | black puck, red headband, gap tooth | cocky hype man who gets punished | Little Dude II `fBD19tfE58bkETeiwUoC` |
| Biscuit (mustard `#e0a526`) | walrus goalie, mask, tusks | **the sarcastic one** – dry deflating one-liners | Fin `D38z5RcWu1voky8WS1ja` |
| Helmy (teal `#2a9d8f`) | helmet, visor face | stats nerd ("Historically? Everything.") | Dr. Quibble `RDSy0QN68yhrjuOgqzQ4` |
| Clubby (green `#5a8f3e`) | taped hockey stick, bushy brows | "back in my day", stubborn logic | Matthew Schmitz `Q4oILuo4P8VeXtE6FMLI` |
| Agenty (purple `#8b5cf6`) | scout clipboard, sunglasses, tie | fast-talking agent, "Sign here." (speed ~1.18) | Witty McGee `R9RZPy40Zzy1wNxrgQpj` |
Zam, Pucky, Biscuit every episode + Helmy and/or Clubby; max ~4 speakers. Pairs: Pucky vs Biscuit, Pucky & Clubby, Helmy vs Clubby. Other casts (Hockey Life sticks, Gang 2.0, Baby Gang) share these voices – see legacy doc.

## Comedy rules
* Fact-based, but the job is to be **funny**: each fact = set-up → reaction → twist, funny word **last**, joke lines ≤ ~8 words.
* Visual gag on the punchline (BONK, sparks, octopus) + a **callback** ending.
* Before scripting, review/score the last episode's jokes and cut the flat ones.

## Workflow
1. Research & verify (list sources). 2. Script as dialogue → **wait for approval**. 3. TTS: `scripts/tts.py` with `scripts/episodes/<name>.json` (segment id prefix = speaker; speed 1.1, gap 0.22); comic pauses `scripts/insert_pauses.py <dir> seg=sec …`; merge multi-word numbers in words JSON. 4. Episode `video/src/episodes/<name>_25d.tsx`, data `video/src/data/`, audio `video/public/ep/`, register in `Root.tsx` (comp ids: a–z, 0–9, `-`). 5. Render. 6. Stills check → deliver → description.

**Script:** ≤ ~135 words, VO ≤ 52.5 s (intro 2.9 s + outro 3 s ≤ 58 s). Hook first (no greetings), short alternating lines (≤ 12 words), end on a punchline with a full stop, no subscribe lines.

## Render & audio
* `REMOTION_EXTRA="--concurrency=2 --timeout=180000" bash scripts/render_comp.sh <CompId> <outname>` (~1.5 h, run in background). Long-form: 16:9, 30 fps, `BITRATE=2M`.
* Avoid `backdrop-filter`, root-level CSS filters, duplicated SVG copies (4× slower).
* Voice -14 LUFS, music ≈ -28 LUFS, final -14 LUFS; video 5.5 Mbps (≈ 40 MB, < 50 MB).
* Raw files in `temp/`, finished video in `output/`. Check stills (numbers, overlaps, safe zones). On errors: fix and retry up to 3×.

## Delivery (after every render)
Commit + push the mp4, send it in chat, and give links with the **commit SHA**:
`https://github.com/Funnylookingclouds/Zam/blob/<sha>/output/<file>.mp4` and `…/raw/<sha>/output/<file>.mp4`.

## YouTube description (`output/youtube_description_<name>.md`, paste in chat)
3 titles (≤ ~60 chars, curiosity, name early; mark recommended) · hook + keywords in first lines · one paragraph per fact with sources (NHL.com first) · "🐙 Did you find the octopus?" · `🔔 Subscribe to @ZamHockey … https://www.youtube.com/@ZamHockey` · 3–5 hashtags (`#Shorts #ZAM` first) · 15–25 tags (< 500 chars) · pinned comment (octopus or engagement question).
