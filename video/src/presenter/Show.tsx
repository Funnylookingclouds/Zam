/** Presenter format: a rotating AI Bounce character presents paper boards. */
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT } from "../theme";
import { WORDS, FPS, TOTAL_SEC } from "../timing";
import { CHARACTERS, type Character, type Mood } from "./characters";
import { P, HAND, onTwos, clamp } from "./kit";
import { Bouncy, mouthOpen, type BouncyMood } from "./Bouncy";

export type PlateMood = Mood | "group";
export type Plate = { t: number; C: React.FC; mood: PlateMood; from?: "left" | "right" | "top"; who?: Character; bouncy?: BouncyMood };
export type Show = { presenter: Character; plates: Plate[] };

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
/** Start time of the nth word in a segment that matches exactly (punctuation ignored). */
export const word = (segment: string, w: string, nth = 0): number => {
  const hits = WORDS.filter((x) => x.segment === segment && norm(x.word) === norm(w));
  if (!hits[nth]) throw new Error(`show: no word "${w}" #${nth} in ${segment}`);
  return hits[nth].start;
};
export const seg = (segment: string) => WORDS.find((w) => w.segment === segment)!.start;

/** 0..1 pulse right after word onsets (all words or keywords only). */
const pulseAt = (t: number, onlyKeywords: boolean, len: number) => {
  const d = WORDS.filter((w) => (!onlyKeywords || w.keyword)).map((w) => t - w.start).filter((x) => x >= 0 && x < len);
  return d.length ? Math.sin((Math.min(...d) / len) * Math.PI) : 0;
};

// ---------------------------------------------------------------------------
/** All four presenters hop in one after another. */
const Group: React.FC<{ t: number }> = ({ t }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tq = onTwos(Math.round(t * FPS)) / FPS;
  const talk = pulseAt(tq, false, 0.18);
  const ids = ["rune", "saga", "ture", "cara"] as const;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1180, display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 0 }}>
      {ids.map((id, k) => {
        const s = spring({ frame: f - k * 6, fps, config: { damping: 8, stiffness: 170 } });
        const hop = Math.abs(Math.sin((onTwos(f) + k * 15) / 12)) * 22 + talk * 10;
        return (
          <div key={id} style={{ transform: `translateY(${(1 - s) * 600 - hop}px) rotate(${Math.sin((onTwos(f) + k * 20) / 14) * 3}deg)`, marginLeft: k ? -40 : 0, transformOrigin: "50% 100%" }}>
            <Img src={staticFile(CHARACTERS[id].art.body)} style={{ height: 760, filter: "drop-shadow(0 16px 20px #0008)" }} />
          </div>
        );
      })}
    </div>
  );
};

const Presenter: React.FC<{ ch: Character; mood: PlateMood; i: number; t: number }> = ({ ch, mood, i, t }) => {
  if (mood === "group") return <Group t={t} />;
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const g = onTwos(f);
  const tq = onTwos(Math.round(t * FPS)) / FPS; // stepped global time
  const talk = pulseAt(tq, false, 0.18);
  const key = pulseAt(tq, true, 0.42);
  const flip = interpolate(g, [0, 10], [90, 0], clamp);
  const hop = spring({ frame: f, fps, config: { damping: 7, stiffness: 180 } });
  const bob = Math.sin(g / 9) * 6 - talk * 8 - key * 26 - (1 - hop) * 60;
  let rot = Math.sin(g / 13) * 1.4 + key * 3;
  let scale = 1;
  if (mood === "happy") rot += Math.sin(g / 2) * 1.6 * Math.max(0, 1 - f / 70);
  if (mood === "serious") scale = 1 + Math.min(f / 600, 0.06);
  if (mood === "curious") rot += 4;
  const squash = `scale(${(1 - talk * 0.02) * scale}, ${(1 + talk * 0.035) * scale})`;
  if (mood === "body") {
    const mirror = i % 2 ? -1 : 1;
    return (
      <div style={{ position: "absolute", left: 40, top: 1150 + bob, transform: `perspective(1200px) rotateY(${flip}deg) rotate(${rot}deg) ${squash} scaleX(${mirror})`, transformOrigin: "50% 100%" }}>
        <Img src={staticFile(ch.art.body)} style={{ height: 1400, filter: "drop-shadow(0 20px 26px #0008)" }} />
      </div>
    );
  }
  return (
    <div style={{ position: "absolute", left: 24, top: 1175 + bob, transform: `perspective(1200px) rotateY(${flip}deg) rotate(${rot - 3}deg) ${squash}`, transformOrigin: "30% 100%" }}>
      <Img src={staticFile(ch.art[mood])} style={{ width: 560, filter: "drop-shadow(0 20px 26px #0008)" }} />
    </div>
  );
};

/** Ink doodles that pop next to the presenter on keywords (! and motion lines). */
const Doodles: React.FC<{ t: number }> = ({ t }) => {
  const tq = onTwos(Math.round(t * FPS)) / FPS;
  const k = WORDS.filter((w) => w.keyword && tq - w.start >= 0 && tq - w.start < 0.5)[0];
  if (!k) return null;
  const p = (tq - k.start) / 0.5;
  const s = p < 0.3 ? p / 0.3 : 1;
  const o = p > 0.7 ? (1 - p) / 0.3 : 1;
  const seed = Math.round(k.start * 10) % 3;
  return (
    <div style={{ position: "absolute", left: 540, top: 1200, opacity: o, transform: `scale(${s}) rotate(${(seed - 1) * 10}deg)` }}>
      <svg width={220} height={200}>
        {[0, 1, 2].map((j) => <path key={j} d={`M${20 + j * 30} ${150 - j * 40} q 30 -30 70 -10`} stroke={P.paper2} strokeWidth={7} fill="none" strokeLinecap="round" />)}
        <text x={150} y={110} fontFamily={HAND} fontSize={120} fontWeight={700} fill={P.mustard} stroke={P.ink} strokeWidth={2}>{seed === 2 ? "?!" : "!"}</text>
      </svg>
    </div>
  );
};

const CaptionStrip: React.FC<{ ch: Character; t: number; group?: boolean }> = ({ ch, t, group }) => {
  const chunks: (typeof WORDS)[] = [];
  let cur: typeof WORDS = [];
  WORDS.forEach((w, i) => {
    const prev = cur[cur.length - 1];
    if (prev && /^%/.test(w.display)) { cur[cur.length - 1] = { ...prev, display: prev.display + w.display, end: w.end }; }
    else cur.push(w);
    const nextSeg = WORDS[i + 1]?.segment;
    if (/[.?!,:–]$/.test(w.word) || cur.length >= 7 || i === WORDS.length - 1 || nextSeg !== w.segment) { chunks.push(cur); cur = []; }
  });
  const c = chunks.find((x, i) => t >= x[0].start - 0.1 && t < (chunks[i + 1]?.[0].start ?? 999) - 0.1);
  if (!c || t > c[c.length - 1].end + 0.8) return null;
  return (
    <div style={{ position: "absolute", left: 60, right: 170, top: 1010, background: "#fffdf7", borderLeft: `12px solid ${ch.accent}`, borderRadius: 8, padding: "22px 28px", boxShadow: "0 10px 30px #0006", fontFamily: FONT, fontSize: 44, fontWeight: 800, color: P.ink, lineHeight: 1.25 }}>
      {/* speaker names intentionally not shown (owner preference); accent bar still marks who speaks */}
      {c.map((w, i) => {
        const on = t >= w.start, active = on && t < w.end + 0.05;
        if (!w.display) return null;
        return <span key={i} style={{ opacity: on ? 1 : 0.35, color: w.keyword && on ? P.mustard : P.ink, borderBottom: active ? `5px solid ${P.mustard}` : "5px solid transparent" }}>{w.display} </span>;
      })}
    </div>
  );
};

const Backdrop: React.FC<{ ch: Character }> = ({ ch }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Img src={staticFile(`chars/bg_${ch.id}.jpg`)} style={{ width: 1080, height: 1920, objectFit: "cover", transform: `scale(${1.08 + f / 20000}) translateX(${Math.sin(f / 200) * 12}px)` }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, transparent 40%, #0009 100%)" }} />
    </AbsoluteFill>
  );
};

export const PresenterMain: React.FC<{ show: Show }> = ({ show }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const end = Math.ceil(TOTAL_SEC * FPS);
  const cur = [...show.plates].reverse().find((p) => p.t <= t + 1e-6) ?? show.plates[0];
  const speaker = cur.who ?? show.presenter;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {show.plates.map((p, i) => {
        const from = Math.round(p.t * FPS);
        const to = i + 1 < show.plates.length ? Math.round(show.plates[i + 1].t * FPS) : end;
        const ch = p.who ?? show.presenter;
        return (
          <Sequence key={i} from={from} durationInFrames={Math.max(1, to - from)} name={`plate${i}`}>
            <Backdrop ch={ch} />
            <PlateSlot p={p} />
            {p.bouncy ? <div style={{ position: "absolute", left: 300, top: 1190 }}><Bouncy size={480} mood={p.bouncy} open={p.bouncy === "laugh" ? 0 : mouthOpen(WORDS, t)} /></div> : <Presenter ch={ch} mood={p.mood} i={i} t={t} />}
            <Audio src={staticFile(i === 0 ? "whoosh.wav" : i % 3 === 0 ? "pop.wav" : "whoosh.wav")} volume={0.4} />
          </Sequence>
        );
      })}
      <Doodles t={t} />
      <CaptionStrip ch={speaker} t={t} group={cur.mood === "group"} />
      <Audio src={staticFile("voiceover.mp3")} />
    </AbsoluteFill>
  );
};

const PlateSlot: React.FC<{ p: Plate }> = ({ p }) => {
  const f = onTwos(useCurrentFrame());
  const p01 = interpolate(f, [0, 15], [0, 1], clamp);
  const dx = p.from === "left" ? -1200 : p.from === "top" ? 0 : 1200;
  const dy = p.from === "top" ? -1400 : 0;
  const e = 1 - Math.pow(1 - p01, 3) + Math.sin(p01 * Math.PI) * 0.06;
  return (
    <AbsoluteFill style={{ top: 200, alignItems: "center" }}>
      <div style={{ transform: `translate(${dx * (1 - e)}px, ${dy * (1 - e)}px) rotate(${(1 - e) * (p.from === "left" ? -14 : 12)}deg)` }}><p.C /></div>
    </AbsoluteFill>
  );
};
