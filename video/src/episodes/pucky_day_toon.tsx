/** PROTOTYPE – "A Day at Work with Pucky", cartoon-series layout: full-screen shots, close-ups, camera cuts,
 *  big expressive characters (Pucky fills most of the frame). Same script/voice as pucky_day.tsx. */
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, random, staticFile, useCurrentFrame, Easing } from "remotion";
import words from "../data/pucky_day_words.json";
import { P, HAND, clamp, onTwos, tornPath } from "../presenter/kit";
import { ComicBurst } from "../presenter/banana";
import { FONT } from "../theme";
import { Mascot, mouthOpen, type Mood, type Who } from "../mascots/Gang";
import { Caption, Confetti, IceWipe, type W } from "../zam/common";
import { FPS, INTRO, OUTRO, Intro, Outro, timing } from "../zam/Episode";

const WORDS = words as W[];
const { SEGS, S, at, LAST } = timing(WORDS);
const OUT_AT = INTRO + LAST + 0.35;
export const TOON_FRAMES = Math.ceil((OUT_AT + OUTRO) * FPS);
const F = (s: number) => Math.round(s * FPS);
const N = (s: number) => F(INTRO + s);

/** mouth opening for `who` if they are the one speaking at news time t */
const talk = (who: Who, t: number) => {
  const s = SEGS.find((x, k) => t >= x.start - 0.05 && t < (SEGS[k + 1]?.start ?? 999));
  return s && s.who === who ? mouthOpen(s.words, t) : 0;
};
const kwHop = (who: Who, t: number) => {
  const s = SEGS.find((x) => t >= x.start && t <= x.end + 0.1);
  if (!s || s.who !== who) return 0;
  const w = s.words.find((x) => t >= x.start && t <= x.end);
  return w ? Math.max(0, 1 - (t - w.start) * 6) * (w.keyword ? 60 : 18) : 0;
};

// ------------------------------------------------------------------ backgrounds (paper-cut, full screen)
const Grain: React.FC = () => <AbsoluteFill style={{ background: "repeating-linear-gradient(0deg, #ffffff06 0 2px, transparent 2px 5px)", mixBlendMode: "overlay" }} />;
const BgFreezer: React.FC = () => {
  const f = onTwos(useCurrentFrame());
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #e9f7ff 0%, #a9d8f2 55%, #5aa7d6 100%)" }}>
      {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 420 + i * 520, height: 26, background: "#d8eefa", borderTop: "6px solid #8cc3e3", borderBottom: "6px solid #8cc3e3" }} />)}
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <path d={`M0 0 H1080 V120 ${[...Array(12)].map((_, i) => `L${1080 - i * 90} ${120 + (i % 2) * 60}`).join(" ")} L0 140 Z`} fill="#ffffffcc" />
        {[...Array(9)].map((_, i) => <path key={i} d={`M${60 + i * 120} 120 l14 ${70 + (i % 3) * 40} l14 -${70 + (i % 3) * 40}`} fill="#ffffffd0" />)}
      </svg>
      {[...Array(26)].map((_, i) => <div key={i} style={{ position: "absolute", left: random(`fx${i}`) * 1060, top: (random(`fy${i}`) * 1920 + f * (1 + random(`fs${i}`) * 2)) % 1920, fontSize: 26 + random(`fz${i}`) * 30, color: "#fff", opacity: 0.85 }}>❄</div>)}
      <Grain />
    </AbsoluteFill>
  );
};
const BgRink: React.FC<{ crowd?: boolean; warm?: boolean }> = ({ crowd, warm }) => {
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
const BgLab: React.FC = () => (
  <AbsoluteFill style={{ background: "#f3ead6" }}>
    <svg width={1080} height={1920} style={{ position: "absolute" }}>{[...Array(30)].map((_, i) => <line key={i} x1={0} y1={i * 70} x2={1080} y2={i * 70} stroke="#2a9d8f22" strokeWidth={3} />)}{[...Array(16)].map((_, i) => <line key={`v${i}`} x1={i * 70} y1={0} x2={i * 70} y2={1920} stroke="#2a9d8f22" strokeWidth={3} />)}</svg>
    <Grain />
  </AbsoluteFill>
);
const BgBurst: React.FC<{ c1: string; c2: string }> = ({ c1, c2 }) => {
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

// ------------------------------------------------------------------ props & overlays
const StickerCard: React.FC<{ x: number; y: number; rot?: number; children: React.ReactNode; w?: number; h?: number; show?: number }> = ({ x, y, rot = -4, children, w = 420, h = 200, show = 0 }) => {
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
const ChapterClock: React.FC<{ time: string; label: string }> = ({ time, label }) => (
  <div style={{ position: "absolute", left: 50, top: 70, display: "flex", alignItems: "center", gap: 14, zIndex: 8 }}>
    <div style={{ padding: "8px 18px", background: P.ink, color: "#7CFC9A", fontFamily: "'DejaVu Sans Mono', monospace", fontWeight: 900, fontSize: 46, borderRadius: 12, border: `5px solid ${P.mustard}` }}>{time}</div>
    <div style={{ padding: "6px 14px", background: P.red, color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: 1 }}>{label}</div>
  </div>
);
const Snores: React.FC = () => {
  const f = onTwos(useCurrentFrame());
  return <>{[0, 1, 2].map((i) => { const k = ((f / 60 + i * 0.33) % 1); return <div key={i} style={{ position: "absolute", left: 700 + k * 160, top: 520 - k * 260, fontFamily: HAND, fontWeight: 700, fontSize: 70 + k * 60, color: "#2563eb", opacity: 1 - k }}>z</div>; })}</>;
};
const Sparkles: React.FC<{ n?: number }> = ({ n = 8 }) => {
  const f = onTwos(useCurrentFrame());
  return <>{[...Array(n)].map((_, i) => { const on = Math.floor(f / 10 + i) % 3 === 0; return <div key={i} style={{ position: "absolute", left: 80 + random(`sp${i}`) * 880, top: 380 + random(`sq${i}`) * 900, fontSize: 60, color: "#fff", WebkitTextStroke: `3px #60a5fa`, opacity: on ? 1 : 0.15, transform: `scale(${on ? 1.2 : 0.7})` }}>✦</div>; })}</>;
};
const SpeedLines: React.FC<{ dir?: 1 | -1 }> = ({ dir = 1 }) => {
  const f = onTwos(useCurrentFrame());
  return <>{[...Array(14)].map((_, i) => <div key={i} style={{ position: "absolute", left: ((random(`sl${i}`) * 1400 - f * 30 * dir) % 1400 + 1400) % 1400 - 200, top: 300 + random(`sy${i}`) * 1100, width: 260 + random(`sw${i}`) * 300, height: 10, borderRadius: 5, background: "#ffffffcc" }} />)}</>;
};
const Flash: React.FC<{ at: number; dur?: number }> = ({ at: a, dur = 8 }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [a, a + 1, a + dur], [0, 1, 0], clamp);
  return o > 0 ? <AbsoluteFill style={{ background: "#fff", opacity: o, zIndex: 9 }} /> : null;
};
const Big: React.FC<{ who: Who; t: number; size: number; x: number; y: number; mood: Mood; shades?: boolean; flip?: boolean; rot?: number; sx?: number; sy?: number; hop?: number; z?: number; filter?: string; open?: number }> = ({ who, t, size, x, y, mood, shades, flip, rot = 0, sx = 1, sy = 1, hop, z = 2, filter, open }) => (
  <div style={{ position: "absolute", left: x, top: y - (hop ?? kwHop(who, t)), transform: `rotate(${rot}deg) scale(${sx}, ${sy})`, transformOrigin: "50% 80%", zIndex: z, filter }}>
    <Mascot who={who} size={size} mood={mood} open={open ?? talk(who, t)} talking={talk(who, t) > 0} shades={shades} flip={flip} noSticker seed={`${who}big`} />
  </div>
);

// ------------------------------------------------------------------ shots (absolute news time; each gets local frame via Sequence)
type Shot = { from: number; Comp: React.FC<{ t: number; lf: number }>; chapter?: [string, string] };
const SH: Shot[] = [
  { from: 0, Comp: ({ t }) => (<><BgRink warm /><Big who="zam" t={t} size={900} x={90} y={620} mood="wow" />
      <StickerCard x={120} y={250} rot={-3} w={840} h={300}><div style={{ fontSize: 34, fontWeight: 900, color: P.red, letterSpacing: 4 }}>ZAM DOCUMENTARIES</div><div style={{ fontSize: 76, fontWeight: 900, lineHeight: 1 }}>A DAY AT WORK<br />WITH PUCKY</div></StickerCard></>) },
  { from: at("z_intro", "today") - 0.1, Comp: ({ t, lf }) => (<><BgBurst c1="#fde68a" c2="#fcd34d" /><Big who="pucky" t={t} size={1250} x={-85} y={420} mood="smug" rot={Math.sin(lf / 8) * 4} />
      <div style={{ position: "absolute", left: 640, top: 250, fontFamily: HAND, fontWeight: 700, fontSize: 80, color: P.red, transform: "rotate(8deg)" }}>← the star</div></>) },
  { from: S("p_wake").start - 0.2, chapter: ["5:00 AM", "THE FREEZER"], Comp: ({ t, lf }) => {
      const woke = t >= at("p_wake", "wake");
      const ring = t > at("p_wake", "wake") - 0.4 && t < at("p_wake", "wake") + 0.5;
      return (<><BgFreezer /><Big who="pucky" t={t} size={1300} x={-110} y={430} mood={woke ? "scared" : "sleep"} hop={woke && t < at("p_wake", "wake") + 0.3 ? 120 : 0} rot={woke ? 0 : Math.sin(lf / 30) * 3} />
        {!woke && <Snores />}
        <div style={{ position: "absolute", left: 640, top: 240, transform: `rotate(${ring ? Math.sin(lf * 1.6) * 14 : 0}deg)`, zIndex: 4 }}>
          <svg width={300} height={320} viewBox="0 0 140 150"><circle cx={70} cy={80} r={56} fill="#fff" stroke={P.ink} strokeWidth={7} /><circle cx={30} cy={26} r={18} fill={P.red} stroke={P.ink} strokeWidth={5} /><circle cx={110} cy={26} r={18} fill={P.red} stroke={P.ink} strokeWidth={5} /><path d="M70 80 V44 M70 80 L94 92" stroke={P.ink} strokeWidth={7} strokeLinecap="round" /></svg>
          {ring && <div style={{ position: "absolute", left: -120, top: -40, fontFamily: FONT, fontWeight: 900, fontStyle: "italic", fontSize: 90, color: "#fff", WebkitTextStroke: `6px ${P.red}`, paintOrder: "stroke fill" }}>RIIING!</div>}
        </div></>);
    } },
  { from: at("p_wake", "minus") - 0.15, Comp: ({ t, lf }) => (<><BgFreezer /><Big who="pucky" t={t} size={1000} x={-180} y={760} mood="wow" />
      <div style={{ position: "absolute", left: 640, top: 230, width: 330, height: 900, background: "#fff", border: `10px solid ${P.ink}`, borderRadius: 40, transform: "rotate(5deg)", zIndex: 3 }}>
        <div style={{ position: "absolute", left: 125, top: 60, width: 60, height: 560, borderRadius: 30, border: `8px solid ${P.ink}`, overflow: "hidden" }}><div style={{ position: "absolute", bottom: 0, width: "100%", height: `${interpolate(lf, [0, 30], [60, 18], clamp)}%`, background: "#3b82f6" }} /></div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 650, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 96, color: "#2563eb" }}>-10°C</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 770, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 50, color: P.muted }}>(14°F)</div>
      </div></>) },
  { from: at("p_wake", "cozy") - 0.2, Comp: ({ t, lf }) => (<><BgFreezer /><Sparkles /><Big who="pucky" t={t} size={1420} x={-170} y={330} mood="bliss" rot={Math.sin(lf / 10) * 5} sx={1 + Math.sin(lf / 5) * 0.015} />
      <div style={{ position: "absolute", left: 90, top: 260, fontFamily: HAND, fontWeight: 700, fontSize: 110, color: "#2563eb", transform: "rotate(-8deg)" }}>aaahhh…</div></>) },
  { from: S("h_bounce").start - 0.15, Comp: ({ t }) => {
      const tt = t - S("h_bounce").start;
      const yWarm = 600 - Math.abs(Math.sin(Math.max(0, tt) * 5)) * 270 * Math.exp(-Math.max(0, tt) * 0.4);
      const yFrozen = tt < 0.4 ? 330 + tt * 675 : 600;
      return (<><BgLab /><Big who="helmy" t={t} size={980} x={50} y={830} mood="wow" />
        {[{ x: 120, y: yWarm, lab: "WARM: boing!", c: P.red, frost: false }, { x: 640, y: yFrozen, lab: "FROZEN: thud.", c: "#2563eb", frost: true }].map((b) => (
          <div key={b.lab}><div style={{ position: "absolute", left: b.x, top: b.y, width: 300, height: 110, borderRadius: "50%", background: b.frost ? "#cfe7f6" : "#222", border: `8px solid ${P.ink}`, boxShadow: "0 30px 0 #111" }} />
            <div style={{ position: "absolute", left: b.x - 10, top: 250, width: 330, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 46, color: b.c }}>{b.lab}</div></div>))}
        <div style={{ position: "absolute", left: 60, right: 60, top: 740, height: 12, background: P.ink, borderRadius: 6 }} /></>);
    } },
  { from: S("p_warm").start - 0.2, chapter: ["6:30 PM", "WARM-UPS"], Comp: ({ t, lf }) => (<><BgRink /><Big who="pucky" t={t} size={1050} x={15} y={640} mood="determined" sy={1 + Math.sin(lf / 6) * 0.08} sx={1 - Math.sin(lf / 6) * 0.05} />
      <div style={{ position: "absolute", left: 120, top: 520, fontFamily: HAND, fontWeight: 700, fontSize: 90, color: P.ink, transform: "rotate(-6deg)" }}>…stretch!</div></>) },
  { from: at("p_warm", "clubby") - 0.15, Comp: ({ t, lf }) => (<><BgBurst c1="#bbf7d0" c2="#86efac" /><Big who="clubby" t={t} size={1300} x={-110} y={360} mood="grumpy" rot={interpolate(lf, [0, 40], [0, -24], clamp)} />
      <div style={{ position: "absolute", left: 650, top: 300, fontFamily: HAND, fontWeight: 700, fontSize: 90, color: P.green, transform: "rotate(10deg)" }}>wind-up…</div></>) },
  { from: at("p_warm", "slaps") + 0.05, Comp: ({ t, lf }) => {
      const hitF = 26;
      const hit = lf >= hitF;
      const fly = interpolate(lf, [hitF, hitF + 12], [0, 1], clamp);
      return (<><BgBurst c1="#fecaca" c2="#fca5a5" />{hit && <SpeedLines dir={-1} />}
        <Big who="pucky" t={t} size={1300} x={-110 + fly * 1500} y={420 - fly * 300} mood={hit ? "dizzy" : "scared"} sx={hit && lf < hitF + 4 ? 1.35 : 1} sy={hit && lf < hitF + 4 ? 0.6 : 1} rot={fly * 140} />
        {hit && lf < hitF + 22 && <div style={{ position: "absolute", left: 160, top: 300, fontFamily: FONT, fontWeight: 900, fontStyle: "italic", fontSize: 200, color: "#fff", WebkitTextStroke: `10px ${P.ink}`, paintOrder: "stroke fill", transform: "rotate(-10deg)", zIndex: 5 }}>SLAP!</div>}
        <Flash at={hitF} /></>);
    } },
  { from: at("p_warm", "its") - 0.1, Comp: ({ t, lf }) => (<><BgRink /><Big who="pucky" t={t} size={1250} x={-85} y={430} mood="dizzy" rot={Math.sin(lf / 6) * 7} />
      {[0, 1, 2].map((i) => { const a = lf / 9 + (i * Math.PI * 2) / 3; return <div key={i} style={{ position: "absolute", left: 500 + Math.cos(a) * 330, top: 560 + Math.sin(a) * 90, fontSize: 110, color: P.mustard, WebkitTextStroke: `5px ${P.ink}`, zIndex: 5 }}>★</div>; })}
      <div style={{ position: "absolute", left: 640, top: 1180, padding: "8px 20px", background: "#fff", border: `6px solid ${P.ink}`, borderRadius: 14, fontFamily: HAND, fontWeight: 700, fontSize: 60, transform: "rotate(6deg)", zIndex: 5 }}>(not fine)</div></>) },
  { from: S("c_partners").start - 0.15, Comp: ({ t, lf }) => (<><BgRink /><Big who="clubby" t={t} size={1050} x={-260} y={420} mood="grumpy" /><Big who="pucky" t={t} size={820} x={380} y={760} mood="sweat" rot={-6 + Math.sin(lf / 9) * 3} />
      <div style={{ position: "absolute", left: 610, top: 420, fontSize: 140, color: P.red }}>♥</div></>) },
  { from: S("p_game").start - 0.2, chapter: ["7:00 PM", "GAME TIME"], Comp: ({ t, lf }) => (<><BgRink crowd /><Big who="pucky" t={t} size={1300} x={-110} y={520} mood="determined" rot={Math.sin(lf / 3) * 1.2} />
      <div style={{ position: "absolute", left: 80, top: 560, fontFamily: FONT, fontWeight: 900, fontStyle: "italic", fontSize: 120, color: "#fff", WebkitTextStroke: `8px ${P.ink}`, paintOrder: "stroke fill", transform: "rotate(-6deg)", zIndex: 5 }}>GAME TIME!</div></>) },
  { from: at("p_game", "hardest") - 0.1, Comp: ({ t, lf }) => {
      const mph = interpolate(t, [at("p_game", "hardest"), at("p_game", "1088")], [0, 108.8], { ...clamp, easing: Easing.out(Easing.cubic) });
      const x = interpolate(lf, [0, 220], [-200, 160], clamp);
      return (<><BgBurst c1="#bfdbfe" c2="#93c5fd" /><SpeedLines />
        <Big who="pucky" t={t} size={1100} x={x} y={600 + Math.sin(lf / 2) * 10} mood="scared" sx={1.18} sy={0.86} rot={-8} hop={0} />
        <StickerCard x={500} y={160} rot={4} w={520} h={330}>
          <div style={{ fontSize: 120, fontWeight: 900, lineHeight: 1 }}>{mph.toFixed(1)}<span style={{ fontSize: 46 }}> mph</span></div>
          <div style={{ fontSize: 38, fontWeight: 800, color: P.muted }}>≈ {Math.round(mph * 1.609)} km/h · NHL record</div>
          <div style={{ fontFamily: HAND, fontSize: 40, color: P.red }}>Zdeno Chara · 2012 All-Star Skills</div>
        </StickerCard></>);
    } },
  { from: at("p_game", "i", 0) - 0.1, Comp: ({ t, lf }) => (<><BgRink crowd /><Big who="pucky" t={t} size={1250} x={-85} y={500} mood="dizzy" rot={Math.sin(lf / 5) * 6} />
      <div style={{ position: "absolute", left: 600, top: 980, width: 220, height: 60, background: "#fde7c9", border: `6px solid ${P.ink}`, borderRadius: 14, transform: "rotate(-24deg)", zIndex: 5 }} />
      <div style={{ position: "absolute", left: 670, top: 950, width: 60, height: 120, background: "#fde7c9", border: `6px solid ${P.ink}`, borderRadius: 14, transform: "rotate(-24deg)", zIndex: 5 }} /></>) },
  { from: S("b_mask").start - 0.15, Comp: ({ t }) => (<><BgRink /><Big who="biscuit" t={t} size={1250} x={-85} y={430} mood="grumpy" /></>) },
  { from: at("b_mask", "every") - 0.35, Comp: ({ t, lf }) => {
      const bonks = ["every", "single", "day"].map((w) => at("b_mask", w));
      const i = Math.max(0, bonks.filter((b) => t >= b - 0.3).length - 1);
      const k = interpolate(t, [bonks[i] - 0.3, bonks[i]], [0, 1], clamp);
      const hit = t >= bonks[i] && t < bonks[i] + 0.25;
      return (<><BgBurst c1="#fef3c7" c2="#fde68a" />
        <Big who="biscuit" t={t} size={1250} x={-85 + (hit ? Math.sin(lf * 3) * 20 : 0)} y={430} mood="grumpy" hop={0} />
        <Big who="pucky" t={t} size={520} x={-500 + k * 780} y={420 + (hit ? 0 : -Math.sin(k * Math.PI) * 100)} mood={hit ? "dizzy" : "laugh"} sx={hit ? 0.55 : 1} sy={hit ? 1.25 : 1} rot={k * 360} z={4} />
        {hit && <div style={{ position: "absolute", left: 300, top: 260, fontFamily: FONT, fontWeight: 900, fontStyle: "italic", fontSize: 170, color: "#fff", WebkitTextStroke: `9px ${P.ink}`, paintOrder: "stroke fill", transform: "rotate(8deg)", zIndex: 6 }}>BONK!</div>}
        <div style={{ position: "absolute", left: 60, top: 1240, display: "flex", gap: 16, zIndex: 6 }}>{["MON", "TUE", "WED"].map((d, j) => <div key={d} style={{ width: 170, height: 110, border: `6px solid ${P.ink}`, borderRadius: 14, background: j <= i && t >= bonks[j] ? "#fecaca" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 40 }}>{d}</div>)}</div></>);
    } },
  { from: S("p_swap").start - 0.2, chapter: ["7:42 PM", "SHIFT CHANGE"], Comp: ({ t, lf }) => {
      const heat = interpolate(t, [S("p_swap").start, at("p_swap", "warm") + 0.3], [0, 1], clamp);
      return (<><BgRink warm /><Big who="pucky" t={t} size={1300} x={-110} y={460} mood="sweat" sy={1 - heat * 0.12} sx={1 + heat * 0.06} filter={`saturate(${1 + heat})`} />
        {[...Array(5)].map((_, i) => <div key={i} style={{ position: "absolute", left: 100 + i * 200, top: 430 - ((lf * 4 + i * 60) % 200), fontSize: 60, color: "#ff8a5b", opacity: 0.8 }}>〰</div>)}</>);
    } },
  { from: at("p_swap", "so") - 0.1, Comp: ({ t, lf }) => {
      const sw = at("p_swap", "swaps");
      const k = interpolate(t, [sw, sw + 0.6], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
      return (<><BgRink /><Big who="helmy" t={t} size={760} x={420} y={260} mood="wow" flip />
        <div style={{ position: "absolute", left: 520, top: 900, padding: "6px 16px", background: "#fff", border: `5px solid ${P.ink}`, fontFamily: FONT, fontWeight: 900, fontSize: 36, zIndex: 5 }}>LINESMAN</div>
        <Big who="pucky" t={t} size={760} x={-120 - k * 900} y={900 - k * 200} mood="sweat" rot={-k * 30} />
        <div style={{ position: "absolute", left: 1100 - k * 800, top: 1180, width: 380, height: 150, borderRadius: "50%", background: "#cfe7f6", border: `9px solid ${P.ink}`, boxShadow: "0 36px 0 #111", zIndex: 3 }}><div style={{ position: "absolute", left: 140, top: 20, fontSize: 70, color: "#2563eb" }}>❄</div></div>
        {k > 0.9 && <div style={{ position: "absolute", left: 360, top: 1100, fontFamily: HAND, fontWeight: 700, fontSize: 64, color: "#2563eb", zIndex: 5 }}>frozen buddy ✦</div>}</>);
    } },
  { from: S("h_colour").start - 0.15, Comp: ({ t }) => {
      const k = interpolate(t, [at("h_colour", "change"), at("h_colour", "warm") + 0.2], [0, 1], clamp);
      return (<><BgLab /><Big who="pucky" t={t} size={1250} x={-85} y={420} mood={k < 0.5 ? "bliss" : "wow"} filter={`opacity(${1 - 0.45 * k})`} />
        {k < 1 && <div style={{ position: "absolute", left: 120, top: 830, width: 840, height: 620, borderRadius: "45%", background: "radial-gradient(ellipse, #a855f7 0%, #7c3aed 55%, transparent 72%)", mixBlendMode: "screen", opacity: 1 - k, zIndex: 3 }} />}
        <Big who="helmy" t={t} size={520} x={600} y={1050} mood="wow" flip z={3} />
        <StickerCard x={70} y={250} rot={-4} w={620} h={220}><div style={{ fontSize: 50, fontWeight: 900 }}>FROZEN = <span style={{ color: "#7c3aed" }}>PURPLE</span></div><div style={{ fontSize: 50, fontWeight: 900 }}>WARM = <span style={{ color: P.muted }}>CLEAR</span></div><div style={{ fontFamily: HAND, fontSize: 34, color: P.muted }}>NHL test pucks · 2019–20</div></StickerCard></>);
    } },
  { from: S("p_cool").start - 0.2, chapter: ["11:00 PM", "CLOCKING OUT"], Comp: ({ t, lf }) => (<><BgFreezer /><Big who="pucky" t={t} size={1250} x={-85} y={interpolate(lf, [0, 18], [-900, 470], { ...clamp, easing: Easing.out(Easing.back(1.4)) })} mood="bliss" rot={interpolate(lf, [0, 18], [-40, 0], clamp)} />
      {lf > 18 && lf < 34 && <div style={{ position: "absolute", left: 200, top: 1250, fontFamily: FONT, fontWeight: 900, fontStyle: "italic", fontSize: 140, color: "#fff", WebkitTextStroke: `8px #2563eb`, paintOrder: "stroke fill" }}>SPLOOSH!</div>}</>) },
  { from: at("p_cool", "thats") - 0.15, Comp: ({ t, lf }) => {
      const on = t > at("p_cool", "cool") - 0.25;
      return (<><BgBurst c1="#bae6fd" c2="#7dd3fc" /><Sparkles n={10} /><Big who="pucky" t={t} size={1400} x={-160} y={360} mood="smug" shades={on} rot={on ? -6 : Math.sin(lf / 8) * 3} />
        {!on && <div style={{ position: "absolute", left: interpolate(lf, [0, 50], [1100, 300], clamp), top: 470, width: 480, height: 90, background: "#111", borderRadius: 40, border: `6px solid ${P.ink}`, zIndex: 5 }} />}</>);
    } },
];

// ------------------------------------------------------------------ composition
export const PuckyDayToon: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS - INTRO;
  const shots = SH.map((s, i) => ({ ...s, to: SH[i + 1]?.from ?? LAST + 0.35 }));
  const cur = [...shots].reverse().find((s) => t >= s.from) ?? shots[0];
  const chapter = [...shots].reverse().find((s) => s.chapter && t >= s.from)?.chapter;
  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: "#dbeef8", overflow: "hidden" }}>
      <Audio src={staticFile("music.wav")} volume={(fr) => (fr < F(OUT_AT) ? 0.45 : interpolate(fr, [F(OUT_AT), F(OUT_AT + OUTRO)], [0.45, 0.15], clamp))} />
      <Sequence from={0} durationInFrames={F(INTRO) + 6}><Intro tagline="behind the scenes!" /></Sequence>
      <Sequence from={F(INTRO)} durationInFrames={F(OUT_AT - INTRO) + 12}><Audio src={staticFile("ep/pucky_day.mp3")} /></Sequence>
      {shots.map((s) => {
        const C = s.Comp;
        return (
          <Sequence key={s.from} from={N(s.from)} durationInFrames={N(s.to) - N(s.from)}>
            <ShotFrame><C t={t} lf={f - N(s.from)} /></ShotFrame>
          </Sequence>
        );
      })}
      {f >= F(INTRO) && t < LAST + 0.35 && chapter && <ChapterClock time={chapter[0]} label={chapter[1]} />}
      {f >= F(INTRO) && <Caption t={t} segs={SEGS} top={1420} />}
      {/* cuts: pop SFX, chapters: Zam ice-wipe */}
      {shots.slice(1).map((s) => <Sequence key={`c${s.from}`} from={N(s.from)} durationInFrames={20}><Audio src={staticFile(s.chapter ? "whoosh.wav" : "pop.wav")} volume={s.chapter ? 0.45 : 0.25} /></Sequence>)}
      {shots.filter((s) => s.chapter).map((s) => <Sequence key={`w${s.from}`} from={N(s.from) - 18} durationInFrames={36}><IceWipe dur={36} y={900} /><Audio src={staticFile("sfx/scrape.wav")} volume={0.6} /></Sequence>)}
      <Sequence from={N(at("p_wake", "wake") - 0.4)} durationInFrames={60}><Audio src={staticFile("brand/ding.wav")} volume={0.6} /></Sequence>
      <Sequence from={N(S("h_bounce").start + 0.1)} durationInFrames={40}><Audio src={staticFile("brand/boing.wav")} volume={0.5} /></Sequence>
      <Sequence from={N(at("p_warm", "slaps") + 0.05) + 26} durationInFrames={40}><Audio src={staticFile("brand/impact.wav")} volume={0.7} /></Sequence>
      <Sequence from={N(S("p_game").start - 0.2)} durationInFrames={130}><Audio src={staticFile("sfx/crowd.wav")} volume={0.4} /></Sequence>
      <Sequence from={N(at("p_game", "hardest"))} durationInFrames={70}><Audio src={staticFile("brand/riser.wav")} volume={0.4} /></Sequence>
      {["every", "single", "day"].map((w) => <Sequence key={w} from={N(at("b_mask", w))} durationInFrames={30}><Audio src={staticFile("brand/impact.wav")} volume={0.5} /></Sequence>)}
      <Sequence from={N(at("p_swap", "swaps"))} durationInFrames={30}><Audio src={staticFile("whoosh.wav")} volume={0.5} /></Sequence>
      <Sequence from={N(at("p_cool", "cool"))} durationInFrames={40}><Audio src={staticFile("brand/rimshot.wav")} volume={0.6} /></Sequence>
      <ComicBurst text="COOL!" at={N(at("p_cool", "cool"))} x={760} y={1250} color="#3b82f6" size={0.9} dur={50} />
      <Sequence from={N(at("p_cool", "cool"))} durationInFrames={100}><Confetti n={60} x={540} y={500} /></Sequence>
      <div style={{ position: "absolute", left: 52, top: 168, padding: "4px 12px", background: P.red, color: "#fff", fontWeight: 900, fontSize: 22, letterSpacing: 2, opacity: f >= F(INTRO) && t < LAST + 0.35 ? 1 : 0, zIndex: 8 }}>ZAM · BEHIND THE SCENES</div>
      {cur && null}
      <Sequence from={F(OUT_AT)}><Outro /></Sequence>
    </AbsoluteFill>
  );
};

/** Each cut pops in slightly and the camera slowly pushes in. */
const ShotFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, 6], [1.07, 1], clamp) * (1 + f * 0.0004);
  return <AbsoluteFill style={{ transform: `scale(${s})`, overflow: "hidden" }}>{children}</AbsoluteFill>;
};
