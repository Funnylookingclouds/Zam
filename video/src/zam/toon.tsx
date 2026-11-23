/** Special Edition (cartoon) kit: full-screen backgrounds, big expressive characters, sticker fact cards, chapter clock,
 *  camera cuts (pop + push-in), and a composition shell `makeToon`. Reference episode: episodes/biscuit_day_toon.tsx. */
import React, { createContext, useContext } from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { P, clamp, onTwos, tornPath } from "../presenter/kit";
import { FONT } from "../theme";
import { Mascot, mouthOpen, type Mood, type Who } from "../mascots/Gang";
import { Caption, IceWipe, type Seg, type W } from "./common";
import { FPS, INTRO, OUTRO, Intro, Outro, timing } from "./Episode";

export const SegCtx = createContext<Seg[]>([]);
const talkOf = (segs: Seg[], who: Who, t: number) => {
  const s = segs.find((x, k) => t >= x.start - 0.05 && t < (segs[k + 1]?.start ?? 999));
  return s && s.who === who ? mouthOpen(s.words, t) : 0;
};
const hopOf = (segs: Seg[], who: Who, t: number) => {
  const s = segs.find((x) => t >= x.start && t <= x.end + 0.1);
  if (!s || s.who !== who) return 0;
  const w = s.words.find((x) => t >= x.start && t <= x.end);
  return w ? Math.max(0, 1 - (t - w.start) * 6) * (w.keyword ? 60 : 18) : 0;
};

// ------------------------------------------------------------------ backgrounds
export const Grain: React.FC = () => <AbsoluteFill style={{ background: "repeating-linear-gradient(0deg, #ffffff06 0 2px, transparent 2px 5px)", mixBlendMode: "overlay" }} />;
export const BgRink: React.FC<{ crowd?: boolean; warm?: boolean }> = ({ crowd, warm }) => {
  const f = onTwos(useCurrentFrame());
  return (
    <AbsoluteFill style={{ background: warm ? "linear-gradient(180deg,#ffd9a8 0%,#ffeed8 45%,#f4fbff 46%,#dbeef8 100%)" : "linear-gradient(180deg,#2b3a67 0%,#3d5a99 40%,#f4fbff 41%,#d4eaf7 100%)" }}>
      {crowd && [...Array(90)].map((_, i) => <div key={i} style={{ position: "absolute", left: (i % 18) * 62 + ((i / 18) | 0) * 13 - 10, top: 160 + ((i / 18) | 0) * 110 + Math.abs(Math.sin(f / 7 + i)) * -10, width: 46, height: 60, borderRadius: "23px 23px 8px 8px", background: ["#e76f51", "#2a9d8f", "#e9c46a", "#f4a261", "#8ab17d"][i % 5], border: `3px solid ${P.ink}` }} />)}
      {!warm && [...Array(6)].map((_, i) => <div key={`l${i}`} style={{ position: "absolute", left: 60 + i * 180, top: 40, width: 40, height: 40, borderRadius: 20, background: "#fffbe6", boxShadow: "0 0 60px 30px #fffbe655" }} />)}
      <div style={{ position: "absolute", left: 0, right: 0, top: warm ? 860 : 770, height: 60, background: "#fff", borderTop: `6px solid ${P.ink}`, borderBottom: `14px solid #e9c46a` }} />
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        {[...Array(16)].map((_, i) => <path key={i} d={`M${random(`k${i}`) * 1080} ${1000 + random(`ky${i}`) * 900} q120 ${random(`kq${i}`) * 40 - 20} 260 0`} stroke="#fff" strokeWidth={4} fill="none" />)}
        <rect x={0} y={1180} width={1080} height={22} fill="#d94b3b" opacity={0.35} />
      </svg>
      <Grain />
    </AbsoluteFill>
  );
};
export const BgLab: React.FC = () => (
  <AbsoluteFill style={{ background: "#f3ead6" }}>
    <svg width={1080} height={1920} style={{ position: "absolute" }}>{[...Array(30)].map((_, i) => <line key={i} x1={0} y1={i * 70} x2={1080} y2={i * 70} stroke="#2a9d8f22" strokeWidth={3} />)}{[...Array(16)].map((_, i) => <line key={`v${i}`} x1={i * 70} y1={0} x2={i * 70} y2={1920} stroke="#2a9d8f22" strokeWidth={3} />)}</svg>
    <Grain />
  </AbsoluteFill>
);
export const BgBurst: React.FC<{ c1: string; c2: string }> = ({ c1, c2 }) => {
  const f = onTwos(useCurrentFrame());
  return (
    <AbsoluteFill style={{ background: c1 }}>
      <svg width={1080} height={1920} viewBox="-540 -960 1080 1920" style={{ position: "absolute" }}>
        {[...Array(16)].map((_, i) => { const a = (i / 16) * Math.PI * 2 + f / 200; const b = a + Math.PI / 16; return <path key={i} d={`M0 0 L${Math.cos(a) * 2000} ${Math.sin(a) * 2000} L${Math.cos(b) * 2000} ${Math.sin(b) * 2000} Z`} fill={c2} />; })}
      </svg>
      <Grain />
    </AbsoluteFill>
  );
};
export const BgLocker: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg,#c9b48a 0%,#b89f70 60%,#8b6b3e 61%,#7a5c33 100%)" }}>
    {[...Array(5)].map((_, i) => (
      <div key={i} style={{ position: "absolute", left: 20 + i * 214, top: 120, width: 190, height: 980, background: "#5b7fa6", border: `8px solid ${P.ink}`, borderRadius: 12 }}>
        {[0, 1, 2, 3].map((k) => <div key={k} style={{ position: "absolute", left: 40, right: 40, top: 40 + k * 16, height: 8, background: "#3c5a7d", borderRadius: 4 }} />)}
        <div style={{ position: "absolute", right: 24, top: 480, width: 18, height: 70, background: "#ddd", border: `4px solid ${P.ink}`, borderRadius: 6 }} />
      </div>
    ))}
    <div style={{ position: "absolute", left: 0, right: 0, top: 1130, height: 70, background: "#a0743c", border: `6px solid ${P.ink}` }} />
    <Grain />
  </AbsoluteFill>
);
export const Rain: React.FC = () => {
  const f = onTwos(useCurrentFrame());
  return <AbsoluteFill style={{ zIndex: 5, pointerEvents: "none" }}>{[...Array(60)].map((_, i) => <div key={i} style={{ position: "absolute", left: random(`r${i}`) * 1100 - 20, top: ((random(`ry${i}`) * 1920 + f * 40) % 2000) - 80, width: 6, height: 70, borderRadius: 3, background: "#93c5fdcc", transform: "rotate(12deg)" }} />)}</AbsoluteFill>;
};

// ------------------------------------------------------------------ props & overlays
export const StickerCard: React.FC<{ x: number; y: number; rot?: number; children: React.ReactNode; w?: number; h?: number; show?: number }> = ({ x, y, rot = -4, children, w = 420, h = 200, show = 0 }) => {
  const f = useCurrentFrame() - show;
  if (f < 0) return null;
  const s = interpolate(f, [0, 6, 10], [0.2, 1.12, 1], clamp);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, transform: `rotate(${rot}deg) scale(${s})`, filter: "drop-shadow(0 12px 16px #0006)", zIndex: 6 }}>
      <svg width={w} height={h} style={{ position: "absolute" }}><path d={tornPath(w, h, `sc${x}${y}`, 16, 7)} fill={P.paper2} /></svg>
      <div style={{ position: "absolute", inset: 18, fontFamily: FONT, color: P.ink, display: "flex", flexDirection: "column", justifyContent: "center" }}>{children}</div>
    </div>
  );
};
export const ChapterClock: React.FC<{ time: string; label: string }> = ({ time, label }) => (
  <div style={{ position: "absolute", left: 50, top: 70, display: "flex", alignItems: "center", gap: 14, zIndex: 8 }}>
    <div style={{ padding: "8px 18px", background: P.ink, color: "#7CFC9A", fontFamily: "'DejaVu Sans Mono', monospace", fontWeight: 900, fontSize: 46, borderRadius: 12, border: `5px solid ${P.mustard}` }}>{time}</div>
    <div style={{ padding: "6px 14px", background: P.red, color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: 1 }}>{label}</div>
  </div>
);
export const Sparkles: React.FC<{ n?: number; color?: string }> = ({ n = 8, color = "#60a5fa" }) => {
  const f = onTwos(useCurrentFrame());
  return <>{[...Array(n)].map((_, i) => { const on = Math.floor(f / 10 + i) % 3 === 0; return <div key={i} style={{ position: "absolute", left: 80 + random(`sp${i}`) * 880, top: 380 + random(`sq${i}`) * 900, fontSize: 60, color: "#fff", WebkitTextStroke: `3px ${color}`, opacity: on ? 1 : 0.15, transform: `scale(${on ? 1.2 : 0.7})`, zIndex: 4 }}>✦</div>; })}</>;
};
export const SpeedLines: React.FC<{ dir?: 1 | -1 }> = ({ dir = 1 }) => {
  const f = onTwos(useCurrentFrame());
  return <>{[...Array(14)].map((_, i) => <div key={i} style={{ position: "absolute", left: ((random(`sl${i}`) * 1400 - f * 30 * dir) % 1400 + 1400) % 1400 - 200, top: 300 + random(`sy${i}`) * 1100, width: 260 + random(`sw${i}`) * 300, height: 10, borderRadius: 5, background: "#ffffffcc", zIndex: 1 }} />)}</>;
};
export const Flash: React.FC<{ at: number; dur?: number; color?: string }> = ({ at: a, dur = 8, color = "#fff" }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [a, a + 1, a + dur], [0, 1, 0], clamp);
  return o > 0 ? <AbsoluteFill style={{ background: color, opacity: o, zIndex: 9 }} /> : null;
};
export const Pow: React.FC<{ text: string; x: number; y: number; size?: number; rot?: number; color?: string; z?: number }> = ({ text, x, y, size = 170, rot = -8, color = P.ink, z = 6 }) => (
  <div style={{ position: "absolute", left: x, top: y, fontFamily: FONT, fontWeight: 900, fontStyle: "italic", fontSize: size, color: "#fff", WebkitTextStroke: `${Math.round(size / 18)}px ${color}`, paintOrder: "stroke fill", transform: `rotate(${rot}deg)`, zIndex: z, whiteSpace: "nowrap" }}>{text}</div>
);
/** A big, borderless character; lip-syncs automatically when it is the speaker. */
export const Big: React.FC<{ who: Who; t: number; size: number; x: number; y: number; mood: Mood; shades?: boolean; flip?: boolean; rot?: number; sx?: number; sy?: number; hop?: number; z?: number; filter?: string; open?: number; baby?: boolean }> = ({ who, t, size, x, y, mood, shades, flip, rot = 0, sx = 1, sy = 1, hop, z = 2, filter, open, baby }) => {
  const segs = useContext(SegCtx);
  const o = open ?? talkOf(segs, who, t);
  return (
    <div style={{ position: "absolute", left: x, top: y - (hop ?? hopOf(segs, who, t) * (baby ? 0.3 : 1)), transform: `rotate(${rot}deg) scale(${sx}, ${sy})`, transformOrigin: "50% 80%", zIndex: z, filter }}>
      <Mascot who={who} size={size} mood={mood} open={o} talking={o > 0} shades={shades} flip={flip} noSticker baby={baby} seed={`${who}big`} />
    </div>
  );
};
const ShotFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, 6], [1.07, 1], clamp) * (1 + f * 0.0004);
  return <AbsoluteFill style={{ transform: `scale(${s})`, overflow: "hidden" }}>{children}</AbsoluteFill>;
};

// ------------------------------------------------------------------ shell
export type ToonShot = { from: number; Comp: React.FC<{ t: number; lf: number }>; chapter?: [string, string] };
export const makeToon = (cfg: { words: W[]; vo: string; shots: ToonShot[]; tag: string; tagline?: string; Extras?: React.FC<{ N: (s: number) => number }> }) => {
  const { SEGS, LAST } = timing(cfg.words);
  const OUT_AT = INTRO + LAST + 0.35;
  const FRAMES = Math.ceil((OUT_AT + OUTRO) * FPS);
  const F = (s: number) => Math.round(s * FPS);
  const N = (s: number) => F(INTRO + s);
  const shots = cfg.shots.map((s, i) => ({ ...s, to: cfg.shots[i + 1]?.from ?? LAST + 0.35 }));
  const Comp: React.FC = () => {
    const f = useCurrentFrame();
    const t = f / FPS - INTRO;
    const chapter = [...shots].reverse().find((s) => s.chapter && t >= s.from)?.chapter;
    const live = f >= F(INTRO) && t < LAST + 0.35;
    return (
      <SegCtx.Provider value={SEGS}>
        <AbsoluteFill style={{ fontFamily: FONT, background: "#dbeef8", overflow: "hidden" }}>
          <Audio src={staticFile("music.wav")} volume={(fr) => (fr < F(OUT_AT) ? 0.45 : interpolate(fr, [F(OUT_AT), F(OUT_AT + OUTRO)], [0.45, 0.15], clamp))} />
          <Sequence from={0} durationInFrames={F(INTRO) + 6}><Intro tagline={cfg.tagline ?? "special edition!"} /></Sequence>
          <Sequence from={F(INTRO)} durationInFrames={F(OUT_AT - INTRO) + 12}><Audio src={staticFile(cfg.vo)} /></Sequence>
          {shots.map((s) => { const C = s.Comp; return <Sequence key={s.from} from={N(s.from)} durationInFrames={N(s.to) - N(s.from)}><ShotFrame><C t={t} lf={f - N(s.from)} /></ShotFrame></Sequence>; })}
          {live && chapter && <ChapterClock time={chapter[0]} label={chapter[1]} />}
          {live && <div style={{ position: "absolute", left: 52, top: 168, padding: "4px 12px", background: P.red, color: "#fff", fontWeight: 900, fontSize: 22, letterSpacing: 2, zIndex: 8 }}>{cfg.tag}</div>}
          {f >= F(INTRO) && <Caption t={t} segs={SEGS} top={1420} />}
          {shots.slice(1).map((s) => <Sequence key={`c${s.from}`} from={N(s.from)} durationInFrames={20}><Audio src={staticFile(s.chapter ? "whoosh.wav" : "pop.wav")} volume={s.chapter ? 0.45 : 0.25} /></Sequence>)}
          {shots.filter((s) => s.chapter).map((s) => <Sequence key={`w${s.from}`} from={N(s.from) - 18} durationInFrames={36}><IceWipe dur={36} y={900} /><Audio src={staticFile("sfx/scrape.wav")} volume={0.6} /></Sequence>)}
          {cfg.Extras && <cfg.Extras N={N} />}
          <Sequence from={F(OUT_AT)}><Outro /></Sequence>
        </AbsoluteFill>
      </SegCtx.Provider>
    );
  };
  return { Comp, FRAMES };
};
