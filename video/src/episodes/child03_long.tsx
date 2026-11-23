/** ZAM Child Edition – "Baby Gang: Playground" LONG version (≈5 min, 16:9 1920×1080, 30 fps slow TV).
 *  Chapters: Good morning · Swings · Sandbox · Song "Up the Ladder" · Seesaw & bubbles · Playground hockey · Picnic ·
 *  Song "Bye Bye Sun". Audio: ep/child03.mp3 (scripts/mix_child03.py). */
import React from "react";
import { AbsoluteFill, Audio, Easing, Sequence, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import words from "../data/child03_words.json";
import { P, HAND, clamp } from "../presenter/kit";
import { FONT } from "../theme";
import { Mascot, type Who } from "../mascots/Gang";
import { Caption, Logo, type W } from "../zam/common";
import { timing } from "../zam/Episode";
import { SegCtx } from "../zam/toon";
import { Baby, sway } from "./child01_toon";
import { Ball, Cloud, Goal, SandCake, Sandbox, Seesaw, Slide, SunFace, SwingSet, slidePos } from "./child02_toon";

export const FPS30 = 30;
const F = (s: number) => Math.round(s * FPS30);
const WORDS = words as W[];
const { SEGS } = timing(WORDS);
const INTRO = 3, OUTRO = 5, XF = 1.2, END = 299;
export const CHILD03_FRAMES = F(INTRO + END + OUTRO);
const soft = { ...clamp, easing: Easing.inOut(Easing.sin) };
const GROUND = 640;
const GANG: Who[] = ["zam", "pucky", "biscuit", "helmy", "clubby", "agenty"];

// ------------------------------------------------------------------ songs + lyric cards
const SA = 117, SB = 263;
const LY = [
  ...[[5.4, 9.5, "La-la, la-la…"], [10.8, 13.3, "Up the ladder, down the slide,"], [13.4, 15.9, "swing up high into the sky."], [16.0, 21.2, "Pass the ball, one, two, three –"], [21.3, 24.0, "playground hockey, you and me!"], [24.1, 26.6, "Round and round the roundabout,"], [26.7, 31.9, "jump and giggle, laugh and shout."], [32.0, 34.6, "Sandy castles, bubbles too –"], [34.7, 37.3, "playground day with me and you!"], [37.4, 41, "La-la, la-la…"]].map(([a, b, s]) => ({ at: SA + Number(a), end: SA + Number(b), text: String(s), c: "#16a34a" })),
  ...[[0.1, 3.4, "Bye bye sun, the day is done,"], [3.5, 7.3, "we played and played and had such fun."], [7.4, 11.0, "Swing and slide and ball and sand,"], [11.1, 14.6, "now hold my little hand."], [14.7, 18.1, "Bye bye sun, the day is done,"], [18.2, 22.0, "we played and played and had such fun."], [22.1, 26.1, "Swing and slide and ball and sand,"], [26.2, 29.7, "now hold my little hand."], [29.8, 33.5, "Mm-mm, mm-mm… bye bye sun."]].map(([a, b, s]) => ({ at: SB + Number(a), end: SB + Number(b), text: String(s), c: "#db2777" })),
];
const singing = (t: number) => LY.some((l) => t >= l.at && t <= l.end);
const sing = (t: number, ph = 0) => (singing(t) ? 0.22 + 0.28 * Math.max(0, Math.sin(t * 8 + ph)) : 0);
const LyricCard: React.FC<{ t: number }> = ({ t }) => {
  const l = LY.find((x) => t >= x.at - 0.3 && t <= x.end);
  if (!l) return null;
  const o = interpolate(t, [l.at - 0.3, l.at + 0.2, l.end - 0.3, l.end], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 360, right: 360, top: 950, opacity: o, textAlign: "center", zIndex: 9 }}>
      <span style={{ display: "inline-block", background: "#fffdf7", borderLeft: `14px solid ${l.c}`, borderRadius: 8, padding: "14px 30px", boxShadow: "0 10px 30px #0b254533", fontFamily: FONT, fontSize: 46, fontWeight: 800, color: P.ink }}>
        <span style={{ color: l.c, marginRight: 12 }}>♪</span>{l.text}<span style={{ color: l.c, marginLeft: 12 }}>♪</span>
      </span>
    </div>
  );
};

// ------------------------------------------------------------------ wide playground set
const Fence: React.FC<{ gap?: [number, number]; gate?: number }> = ({ gap, gate = 0 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: GROUND - 100, height: 110, display: "flex", gap: 18, paddingLeft: 8 }}>
    {[...Array(32)].map((_, i) => (gap && i >= gap[0] && i <= gap[1] ? <div key={i} style={{ width: 42 }} /> : <div key={i} style={{ width: 42, height: 110, flexShrink: 0, background: ["#fbcfe8", "#bfdbfe", "#fef08a", "#bbf7d0"][i % 4], border: `4px solid ${P.ink}`, borderRadius: "21px 21px 4px 4px" }} />))}
    {gap && [0, 1].map((sd) => <div key={sd} style={{ position: "absolute", left: sd ? 8 + (gap[1] + 1) * 60 - 150 : 8 + gap[0] * 60, top: -30, width: 150, height: 150, background: "#c4b5fd", border: `5px solid ${P.ink}`, borderRadius: 12, transform: `perspective(700px) rotateY(${(sd ? -1 : 1) * gate}deg)`, transformOrigin: sd ? "100% 50%" : "0 50%" }} />)}
  </div>
);
const Birds: React.FC<{ t: number }> = ({ t }) => (
  <>{[0, 1, 2].map((i) => { const x = ((t * 30 + i * 90 + 200) % 2300) - 200; return <svg key={i} width={60} height={30} style={{ position: "absolute", left: x, top: 150 + i * 30 + Math.sin(t + i) * 10 }}><path d={`M2 ${10 + Math.sin(t * 5 + i) * 6} Q15 2 30 14 Q45 2 58 ${10 + Math.sin(t * 5 + i) * 6}`} stroke={P.ink} strokeWidth={4} fill="none" /></svg>; })}</>
);
const Yard: React.FC<{ t: number; sun?: number; sunX?: number; dusk?: number; night?: number; fence?: boolean; gap?: [number, number]; gate?: number }> = ({ t, sun = 160, sunX = 1580, dusk = 0, night = 0, fence = true, gap, gate }) => (
  <AbsoluteFill style={{ background: `linear-gradient(180deg, ${dusk > 0.5 ? "#fda4af" : "#7dd3fc"} 0%, ${dusk > 0.5 ? "#fdba74" : "#bae6fd"} 45%, ${dusk > 0.5 ? "#fef3c7" : "#e0f2fe"} 60%)` }}>
    {dusk > 0 && dusk <= 0.5 && <AbsoluteFill style={{ background: "linear-gradient(180deg,#fda4af,#fdba74 45%,#fef3c7 60%)", opacity: dusk * 2 }} />}
    <SunFace t={t} x={sunX} y={sun} set={dusk} />
    <Cloud x={((t * 10) % 2300) - 250} y={110} />
    <Cloud x={1700 - ((t * 6) % 2200)} y={260} s={0.75} />
    <Cloud x={((t * 4 + 900) % 2300) - 250} y={360} s={0.55} />
    {night < 0.5 && <Birds t={t} />}
    {[...Array(7)].map((_, i) => <div key={i} style={{ position: "absolute", left: -80 + i * 300, top: GROUND - 180 + (i % 2) * 20, width: 340, height: 220, borderRadius: "50%", background: i % 2 ? "#86efac" : "#4ade80", border: `5px solid ${P.ink}` }} />)}
    <div style={{ position: "absolute", left: 0, right: 0, top: GROUND, bottom: 0, background: "linear-gradient(180deg,#86efac,#4ade80)", borderTop: `6px solid ${P.ink}` }} />
    {[...Array(22)].map((_, i) => <div key={i} style={{ position: "absolute", left: random(`wf${i}`) * 1880, top: GROUND + 40 + random(`wy${i}`) * 400, fontSize: 32 }}>{i % 3 ? "✿" : "❀"}</div>)}
    {fence && <Fence gap={gap} gate={gate} />}
    {dusk > 0 && <AbsoluteFill style={{ background: "#fb7185", opacity: dusk * 0.15 }} />}
    {night > 0 && <AbsoluteFill style={{ background: "#1e1b4b", opacity: night * 0.55 }} />}
    {night > 0.3 && [...Array(24)].map((_, i) => <div key={`s${i}`} style={{ position: "absolute", left: random(`ns${i}`) * 1900, top: random(`nsy${i}`) * 420, color: "#fef9c3", fontSize: 18 + random(`nz${i}`) * 20, opacity: (night - 0.3) * 1.4 * (0.6 + 0.4 * Math.sin(t * 2 + i)) }}>✦</div>)}
  </AbsoluteFill>
);
/** Places a portrait-sized prop (from child02) scaled into the wide set. */
const At: React.FC<{ x: number; y: number; s?: number; z?: number; children: React.ReactNode }> = ({ x, y, s = 1, z, children }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `scale(${s})`, transformOrigin: "0 0", zIndex: z }}>{children}</div>
);
const Walker: React.FC<{ who: Who; t: number; t0: number; x0: number; x1: number; y: number; size: number; dur?: number; ph?: number }> = ({ who, t, t0, x0, x1, y, size, dur = 3.5, ph = 0 }) => {
  const k = interpolate(t, [t0, t0 + dur], [0, 1], soft);
  const walking = t > t0 && t < t0 + dur;
  return <Baby who={who} t={t} size={size} x={x0 + (x1 - x0) * k} y={y - (walking ? Math.abs(Math.sin(t * 5)) * 14 : 0)} mood={walking ? "bliss" : "laugh"} flip={x1 < x0} ph={ph} />;
};
const Butterfly: React.FC<{ t: number; cx?: number; cy?: number }> = ({ t, cx = 960, cy = 400 }) => {
  const x = cx + Math.sin(t * 0.35) * 600, y = cy + Math.sin(t * 0.7) * 120, w = 0.35 + 0.65 * Math.abs(Math.sin(t * 7));
  return (
    <div style={{ position: "absolute", left: x, top: y, zIndex: 7 }}>
      {[-1, 1].map((sd) => <div key={sd} style={{ position: "absolute", left: sd < 0 ? -44 : 4, top: -20, width: 40, height: 46, borderRadius: "50% 50% 40% 40%", background: sd < 0 ? "#f9a8d4" : "#c4b5fd", border: `4px solid ${P.ink}`, transform: `scaleX(${w})`, transformOrigin: sd < 0 ? "100% 50%" : "0 50%" }} />)}
      <div style={{ position: "absolute", left: -5, top: -26, width: 10, height: 52, borderRadius: 5, background: P.ink }} />
    </div>
  );
};
const Bubbles: React.FC<{ t: number; t0: number; x: number; y: number; popAt?: number }> = ({ t, t0, x, y, popAt }) => (
  <>
    {[...Array(14)].map((_, i) => {
      const born = t0 + i * 1.3, k = t - born;
      if (k < 0 || k > 9) return null;
      if (popAt !== undefined && i === 3 && t > popAt) return k < 9 && t < popAt + 0.4 ? <div key={i} style={{ position: "absolute", left: x + 260, top: y - 260, fontFamily: HAND, fontWeight: 700, fontSize: 70, color: "#db2777", opacity: 1 - (t - popAt) / 0.4, zIndex: 8 }}>pop!</div> : null;
      const bx = x + k * (40 + random(`bv${i}`) * 50) + Math.sin(k * 1.2 + i) * 40, by = y - k * (40 + random(`bu${i}`) * 30), r = 34 + random(`br${i}`) * 34;
      return <div key={i} style={{ position: "absolute", left: bx - r, top: by - r, width: r * 2, height: r * 2, borderRadius: r, background: `radial-gradient(circle at 35% 30%, #ffffffee 0 12%, ${["#f9a8d455", "#93c5fd55", "#fde68a55", "#86efac55"][i % 4]} 40%, #ffffff22 70%)`, border: `3px solid ${["#f472b6", "#60a5fa", "#facc15", "#4ade80"][i % 4]}88`, opacity: interpolate(k, [0, 0.4, 8, 9], [0, 1, 1, 0]), zIndex: 7 }} />;
    })}
  </>
);
const Castle: React.FC<{ x: number; y: number; stage: number }> = ({ x, y, stage }) => (
  <div style={{ position: "absolute", left: x, top: y, zIndex: 4 }}>
    {[{ l: 0, t: 120, w: 300, h: 110, s: 0.15 }, { l: 20, t: 40, w: 80, h: 90, s: 0.4 }, { l: 200, t: 40, w: 80, h: 90, s: 0.55 }, { l: 100, t: -20, w: 100, h: 150, s: 0.75 }].map((b, i) => (
      <div key={i} style={{ position: "absolute", left: b.l, top: b.t, width: b.w, height: b.h, background: i ? "#fcd34d" : "#fbbf24", border: `5px solid ${P.ink}`, borderRadius: "10px 10px 4px 4px", transform: `scaleY(${interpolate(stage, [b.s, b.s + 0.15], [0, 1], clamp)})`, transformOrigin: "50% 100%" }} />
    ))}
    {stage > 0.95 && <div style={{ position: "absolute", left: 146, top: -90, width: 6, height: 80, background: P.ink }}><div style={{ position: "absolute", left: 6, top: 0, width: 50, height: 32, background: "#f472b6", border: `3px solid ${P.ink}` }} /></div>}
    {stage > 0.9 && ["🐚", "✿", "🐚"].map((e, i) => <div key={i} style={{ position: "absolute", left: 40 + i * 100, top: 150, fontSize: 36 }}>{e}</div>)}
  </div>
);
const Roundabout: React.FC<{ t: number; x: number; y: number; riders: Who[] }> = ({ t, x, y, riders }) => {
  const a0 = t * 0.6;
  const pos = riders.map((w, i) => { const a = a0 + (i / riders.length) * Math.PI * 2; return { w, i, x: Math.cos(a) * 300, y: Math.sin(a) * 70, d: Math.sin(a) }; }).sort((p, q) => p.d - q.d);
  return (
    <div style={{ position: "absolute", left: x, top: y }}>
      <div style={{ position: "absolute", left: -360, top: -40, width: 720, height: 200, borderRadius: "50%", background: "#fca5a5", border: `6px solid ${P.ink}`, boxShadow: "0 30px 0 #ef4444" }} />
      <div style={{ position: "absolute", left: -14, top: -260, width: 28, height: 300, background: "#94a3b8", border: `4px solid ${P.ink}` }} />
      {pos.map((p) => <div key={p.w} style={{ position: "absolute", left: p.x - 110, top: p.y - 200 }}><Baby who={p.w} t={t} size={230} x={0} y={0} mood="laugh" ph={p.i} /></div>)}
    </div>
  );
};
const Picnic: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <div style={{ position: "absolute", left: x, top: y }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1300, height: 300, borderRadius: "50%", background: "repeating-conic-gradient(#fecaca 0 25%, #fff 0 50%) 0 0/80px 80px", border: `6px solid ${P.ink}` }} />
    <div style={{ position: "absolute", left: 560, top: 40, width: 180, height: 120, background: "#d97706", border: `5px solid ${P.ink}`, borderRadius: "10px 10px 30px 30px" }}><div style={{ position: "absolute", left: 30, top: -60, width: 110, height: 80, border: `10px solid #92400e`, borderBottom: "none", borderRadius: "60px 60px 0 0" }} /></div>
    {[...Array(6)].map((_, i) => <div key={i} style={{ position: "absolute", left: 420 + i * 70, top: 190, width: 54, height: 34, borderRadius: "40px 40px 6px 6px", background: "#fef9c3", borderTop: "8px solid #ef4444", border: `3px solid ${P.ink}` }} />)}
    {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: 820 + i * 90, top: 110, width: 56, height: 80, background: i ? "#86efac" : "#fdba74", border: `4px solid ${P.ink}`, borderRadius: 6 }}><div style={{ position: "absolute", left: 30, top: -30, width: 6, height: 34, background: "#f472b6" }} /></div>)}
  </div>
);
const PuckCloud: React.FC<{ x: number; y: number; o: number }> = ({ x, y, o }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: o, filter: "drop-shadow(0 0 20px #fff)" }}>
    <div style={{ position: "absolute", left: 0, top: 60, width: 420, height: 130, borderRadius: "50%/40%", background: "#fff" }} />
    <div style={{ position: "absolute", left: 0, top: 10, width: 420, height: 120, borderRadius: "50%", background: "#f8fafc", border: "4px solid #e2e8f0" }} />
    <div style={{ position: "absolute", left: 0, top: 80, width: 420, height: 22, background: "#fbcfe8aa" }} />
    {[150, 250].map((l) => <div key={l} style={{ position: "absolute", left: l, top: 40, width: 18, height: 24, borderRadius: 9, background: "#94a3b8" }} />)}
  </div>
);
const Hearts: React.FC<{ t: number; t0: number; cx?: number }> = ({ t, t0, cx = 1400 }) => (
  <>{[...Array(26)].map((_, i) => { const k = t - t0; if (k < 0 || k > 5) return null; return <div key={i} style={{ position: "absolute", left: cx + (random(`h3x${i}`) - 0.5) * 900 + sway(t, 0.4, 20, i), top: 120 + random(`h3y${i}`) * 200 + k * (90 + random(`h3v${i}`) * 60), fontSize: 40 + random(`h3s${i}`) * 30, color: ["#f9a8d4", "#fde68a", "#93c5fd", "#86efac", "#c4b5fd"][i % 5], opacity: interpolate(k, [0, 0.4, 4, 5], [0, 1, 1, 0], clamp), zIndex: 6 }}>{i % 3 ? "♥" : "✦"}</div>; })}</>
);
const Notes: React.FC<{ t: number; n?: number }> = ({ t, n = 9 }) => (
  <>{[...Array(n)].map((_, i) => { const life = (t * 0.15 + random(`wn${i}`)) % 1; return <div key={i} style={{ position: "absolute", left: 100 + random(`wnx${i}`) * 1700 + sway(t, 0.3, 30, i), top: 820 - life * 760, fontSize: 60 + random(`wns${i}`) * 40, color: ["#db2777", "#7c3aed", "#2563eb", "#059669"][i % 4], opacity: interpolate(life, [0, 0.15, 0.8, 1], [0, 0.85, 0.85, 0]), zIndex: 6 }}>{i % 2 ? "♪" : "♫"}</div>; })}</>
);

// ------------------------------------------------------------------ shots
type Shot = { from: number; title?: string; Comp: React.FC<{ t: number; lf: number; dur: number }> };
const Pan: React.FC<{ lf: number; dur: number; from?: number; to?: number; x0?: number; x1?: number; ox?: string; children: React.ReactNode }> = ({ lf, dur, from = 1, to = 1.05, x0 = 0, x1 = 0, ox = "50% 60%", children }) => {
  const k = interpolate(lf, [0, F(dur)], [0, 1], soft);
  return <AbsoluteFill style={{ transform: `scale(${from + (to - from) * k}) translateX(${x0 + (x1 - x0) * k}px)`, transformOrigin: ox, overflow: "hidden" }}>{children}</AbsoluteFill>;
};
const SHOTS: Shot[] = [
  { from: 0, title: "☀ Good morning", Comp: ({ t, lf, dur }) => ( // sunrise, gate opens, Zam rolls in
    <Pan lf={lf} dur={dur} from={1.08} to={1}>
      <Yard t={t} sun={interpolate(t, [0, 10], [420, 170], soft)} gap={[13, 17]} gate={interpolate(t, [2.5, 5], [0, 75], soft)} />
      <Baby who="zam" t={t} size={340} x={interpolate(t, [4.5, 9], [800, 790], soft)} y={interpolate(t, [4.5, 9], [420, 640], soft)} mood={t > 6.5 ? "laugh" : "bliss"} z={3} />
    </Pan>) },
  { from: 10, Comp: ({ t, lf, dur }) => { // the gang toddles in one by one: "Hi!"
    const arrivals: [Who, number, number][] = [["pucky", 11, 160], ["biscuit", 15, 470], ["helmy", 19, 1130], ["clubby", 23, 1420], ["agenty", 27, 1680]];
    return (<Pan lf={lf} dur={dur} to={1.04}><Yard t={t} />
      <Baby who="zam" t={t} size={340} x={790} y={590} mood="laugh" />
      {arrivals.map(([w, t0, x1], i) => <Walker key={w} who={w} t={t} t0={t0} x0={x1 < 960 ? -360 : 2000} x1={x1 - 20} y={600} size={320} ph={i} />)}
    </Pan>); } },
  { from: 36, title: "Swings", Comp: ({ t, lf, dur }) => ( // Pucky swings slowly, butterfly
    <Pan lf={lf} dur={dur} to={1.08} ox="45% 50%"><Yard t={t} />
      <At x={620} y={150} s={1.15}><SwingSet x={0} y={0} t={t} who="pucky" size={300} ang={Math.sin((t - 36) * 1.6) * 16} /></At>
      <Butterfly t={t} />
    </Pan>) },
  { from: 56, Comp: ({ t, lf, dur }) => { // Pucky + Biscuit on swings: "Higher… please."
    const amp = interpolate(t, [62, 66], [12, 20], soft);
    return (<Pan lf={lf} dur={dur} from={1.04} to={1}><Yard t={t} />
      <At x={300} y={230}><SwingSet x={0} y={0} t={t} who="pucky" size={280} ang={Math.sin((t - 56) * 1.5) * 15} /></At>
      <At x={1020} y={230}><SwingSet x={0} y={0} t={t} who="biscuit" size={290} ang={Math.sin((t - 56) * 1.5 + 1.4) * amp} /></At>
      <Butterfly t={t + 20} cy={300} />
    </Pan>); } },
  { from: 76, title: "Sandbox", Comp: ({ t, lf, dur }) => ( // castle grows: "Pat… pat… castle!"
    <Pan lf={lf} dur={dur} to={1.07}><Yard t={t} />
      <Sandbox x={340} y={680} w={1240} />
      <Baby who="biscuit" t={t} size={330} x={420} y={470} mood={t > 87 ? "laugh" : "bliss"} />
      <Baby who="agenty" t={t} size={300} x={1220} y={500} mood="bliss" flip ph={2} />
      <Castle x={810} y={640} stage={interpolate(t, [79, 94], [0, 1])} />
      <div style={{ position: "absolute", left: 740, top: 820 + Math.abs(Math.sin(t * 2.4)) * -30, width: 70, height: 26, borderRadius: 8, background: "#ef4444", border: `4px solid ${P.ink}`, zIndex: 5 }} />
    </Pan>) },
  { from: 96, Comp: ({ t, lf, dur }) => { // castle done, Agenty: "Big castle. Five stars!"
    return (<Pan lf={lf} dur={dur} from={1.1} to={1.02} ox="50% 70%"><Yard t={t} />
      <Sandbox x={340} y={680} w={1240} />
      <Castle x={810} y={640} stage={1} />
      <Baby who="biscuit" t={t} size={330} x={420} y={470} mood="laugh" />
      <Baby who="agenty" t={t} size={300} x={1220} y={500} mood={t > 103 ? "laugh" : "bliss"} flip ph={2} />
      {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ position: "absolute", left: 700 + i * 110, top: 330 + Math.sin(t * 1.5 + i) * 8, fontSize: 90, opacity: interpolate(t, [103.5 + i * 0.35, 104 + i * 0.35], [0, 1], clamp), transform: `scale(${interpolate(t, [103.5 + i * 0.35, 104.2 + i * 0.35], [0.4, 1], soft)})`, zIndex: 6 }}>⭐</div>)}
    </Pan>); } },
  { from: 116, title: "♪ Up the Ladder", Comp: ({ t, lf, dur }) => { // song: everyone takes turns on the slide
    const order: Who[] = ["helmy", "pucky", "zam", "clubby"];
    const cyc = Math.max(0, (t - 116) / 4.2), i = Math.floor(cyc) % order.length, k = cyc - Math.floor(cyc);
    const s = 1.05, ox = 700, oy = 60;
    const climb = Math.min(1, k / 0.45), down = Math.max(0, (k - 0.5) / 0.5);
    const [sx, sy] = slidePos(interpolate(down, [0, 1], [0, 1], soft));
    const hx = k < 0.5 ? ox + 115 * s : ox + sx * s, hy = k < 0.5 ? oy + (640 - climb * 510) * s : oy + sy * s;
    return (<Pan lf={lf} dur={dur} to={1.05}><Yard t={t} />
      <Slide x={ox} y={oy} s={s} />
      <div style={{ position: "absolute", left: hx - 120, top: hy - 240, zIndex: 4 }}><Baby who={order[i]} t={t} size={240} x={0} y={0} mood="laugh" /></div>
      {(["biscuit", "agenty"] as Who[]).map((w, j) => <div key={w} style={{ position: "absolute", left: 200 + j * 1250, top: 640 }}><Baby who={w} t={t} size={280} x={0} y={0} mood="bliss" ph={j} /></div>)}
      <Notes t={t} />
    </Pan>); } },
  { from: 133, Comp: ({ t, lf, dur }) => { // "pass the ball, one, two, three"
    const ring: [Who, number, number][] = [["clubby", 260, 600], ["zam", 820, 560], ["agenty", 1380, 600]];
    const stops = [[420, 880], [960, 860], [1520, 880], [960, 860], [420, 880]];
    const p = interpolate(t, [133, 135.5, 138, 140.5, 141.5], [0, 1, 2, 3, 3.6], soft); const i = Math.min(3, Math.floor(p)), k = p - i;
    return (<Pan lf={lf} dur={dur} to={1.04}><Yard t={t} />
      {ring.map(([w, x, y], n) => <Baby key={w} who={w} t={t} size={280} x={x} y={y} mood="bliss" ph={n} />)}
      <Ball x={stops[i][0] + (stops[i + 1][0] - stops[i][0]) * k} y={stops[i][1] - Math.sin(k * Math.PI) * 70} spin={p * 300} />
      {[["1", 134.4], ["2", 135], ["3", 135.6]].map(([n, a], j) => <div key={n} style={{ position: "absolute", left: 640 + j * 230, top: 230, width: 150, height: 150, borderRadius: 75, background: ["#fca5a5", "#93c5fd", "#fde68a"][j], border: `6px solid ${P.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 96, color: P.ink, opacity: interpolate(t, [Number(a), Number(a) + 0.3, 140, 140.6], [0, 1, 1, 0], clamp), zIndex: 6 }}>{n}</div>)}
      <Notes t={t} n={6} />
    </Pan>); } },
  { from: 141, Comp: ({ t, lf, dur }) => ( // "round and round the roundabout"
    <Pan lf={lf} dur={dur} to={1.05}><Yard t={t} />
      <Roundabout t={t} x={960} y={720} riders={["pucky", "biscuit", "helmy", "clubby"]} />
      <Notes t={t} n={6} />
    </Pan>) },
  { from: 149, Comp: ({ t, lf, dur }) => ( // "sandy castles, bubbles too" – everyone sways and sings
    <Pan lf={lf} dur={dur} from={1.05} to={1}><Yard t={t} />
      <Sandbox x={180} y={720} w={700} /><Castle x={420} y={690} stage={1} />
      <Bubbles t={t} t0={148} x={1200} y={560} />
      {GANG.map((w, i) => <div key={w} style={{ position: "absolute", left: 60 + i * 300, top: i % 2 ? 600 : 560, zIndex: 5 }}><Big6 who={w} t={t} i={i} /></div>)}
      <Notes t={t} />
    </Pan>) },
  { from: 163, title: "Seesaw & bubbles", Comp: ({ t, lf, dur }) => ( // seesaw: "Up… down…"
    <Pan lf={lf} dur={dur} to={1.06}><Yard t={t} />
      <At x={510} y={280} s={1}><Seesaw x={0} y={0} t={t} ang={Math.sin((t - 163) * 0.7) * 13} left="clubby" right="agenty" size={300} /></At>
      <Butterfly t={t} cy={260} />
    </Pan>) },
  { from: 182, Comp: ({ t, lf, dur }) => ( // Helmy blows bubbles: "Pink… blue… pop!"
    <Pan lf={lf} dur={dur} to={1.06} ox="40% 60%"><Yard t={t} />
      <Baby who="helmy" t={t} size={340} x={330} y={500} mood={t > 188 ? "laugh" : "bliss"} />
      <div style={{ position: "absolute", left: 640, top: 600, width: 12, height: 160, background: "#a78bfa", transform: "rotate(30deg)", zIndex: 4 }}><div style={{ position: "absolute", left: -24, top: -56, width: 60, height: 60, borderRadius: 30, border: "8px solid #a78bfa" }} /></div>
      <Bubbles t={t} t0={183} x={700} y={560} popAt={188.6} />
      <Baby who="zam" t={t} size={280} x={1250} y={640} mood="bliss" ph={1} />
      <Baby who="pucky" t={t} size={260} x={1560} y={680} mood="bliss" ph={2} flip />
    </Pan>) },
  { from: 202, title: "Playground hockey", Comp: ({ t, lf, dur }) => { // slow passes, Pucky scores: "Goal!" / "Again!"
    const pts = [[330, 900], [800, 880], [380, 900], [800, 880], [1190, 870], [1600, 830]];
    const p = interpolate(t, [203, 206, 209, 212, 215, 218], [0, 1, 2, 3, 4, 5], soft); const i = Math.min(4, Math.floor(p)), k = p - i;
    const done = p >= 5;
    const bx = done ? 1600 : pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, by = done ? 830 : pts[i][1] - Math.sin(k * Math.PI) * 50;
    return (<Pan lf={lf} dur={dur} to={1.04}><Yard t={t} />
      <Goal x={1500} y={640} s={1.15} shake={t > 218 && t < 218.6 ? Math.sin(t * 40) * 6 : 0} />
      <Baby who="clubby" t={t} size={270} x={180} y={630} mood="laugh" />
      <Baby who="zam" t={t} size={270} x={650} y={600} mood="bliss" ph={1} />
      <Baby who="pucky" t={t} size={290} x={1010} y={610} mood={t > 217 ? "laugh" : "bliss"} ph={2} />
      <Baby who="biscuit" t={t} size={250} x={1290} y={500} mood={t > 222 ? "laugh" : "bliss"} ph={3} z={1} />
      <Ball x={bx} y={by} r={50} spin={p * 360} />
      <Hearts t={t} t0={218.2} />
    </Pan>); } },
  { from: 232, title: "Picnic", Comp: ({ t, lf, dur }) => ( // picnic blanket: "Yum… apple."
    <Pan lf={lf} dur={dur} to={1.05}><Yard t={t} />
      <Picnic x={310} y={720} />
      {GANG.map((w, i) => <div key={w} style={{ position: "absolute", left: 170 + i * 248, top: i % 2 ? 540 : 500, transform: "scale(1.15)", transformOrigin: "50% 100%" }}><Baby who={w} t={t} size={250} x={0} y={0} mood={w === "zam" && t > 241 ? "laugh" : "bliss"} ph={i} /></div>)}
    </Pan>) },
  { from: 248, Comp: ({ t, lf, dur }) => ( // looking up at clouds: "Look… a puck cloud!"
    <Pan lf={lf} dur={dur} from={1} to={1.06} ox="50% 30%">
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#7dd3fc,#bae6fd 70%)" }}>
        <Cloud x={((t * 14) % 2300) - 250} y={160} s={1.4} />
        <Cloud x={1600 - ((t * 9) % 2200)} y={420} s={1.1} />
        <PuckCloud x={interpolate(t, [248, 262], [1300, 760])} y={210} o={interpolate(t, [249, 251.5], [0, 1], soft)} />
        <Butterfly t={t} cy={520} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 760, bottom: 0, background: "#4ade80", borderTop: `6px solid ${P.ink}` }} />
      {(["helmy", "pucky", "zam", "biscuit"] as Who[]).map((w, i) => <div key={w} style={{ position: "absolute", left: 220 + i * 400, top: 660 }}><Baby who={w} t={t} size={280} x={0} y={0} mood={w === "helmy" && t > 253 ? "laugh" : "bliss"} ph={i} rot={-6} /></div>)}
    </Pan>) },
  { from: 262, title: "♪ Bye Bye Sun", Comp: ({ t, lf, dur }) => { // sunset song on the blanket
    const dusk = interpolate(t, [262, 280], [0.2, 0.9], soft);
    return (<Pan lf={lf} dur={dur} to={1.05}><Yard t={t} dusk={dusk} sun={interpolate(t, [262, 280], [200, 470], soft)} sunX={1500} />
      <Picnic x={310} y={720} />
      {GANG.map((w, i) => <div key={w} style={{ position: "absolute", left: 170 + i * 248, top: i % 2 ? 540 : 500, transform: "scale(1.15)", transformOrigin: "50% 100%" }}><Big6 who={w} t={t} i={i} /></div>)}
      <Notes t={t} n={6} />
    </Pan>); } },
  { from: 280, Comp: ({ t, lf, dur }) => { // dusk: waving, yawning, falling asleep
    const night = interpolate(t, [280, 296], [0, 0.85], soft);
    return (<Pan lf={lf} dur={dur} from={1.02} to={1.1}><Yard t={t} dusk={1} night={night} sun={interpolate(t, [280, 292], [470, 640], soft)} sunX={1500} />
      <Picnic x={310} y={720} />
      {GANG.map((w, i) => <div key={w} style={{ position: "absolute", left: 170 + i * 248, top: i % 2 ? 540 : 500, transform: "scale(1.15)", transformOrigin: "50% 100%" }}>{t > 291 + i * 0.6 ? <Baby who={w} t={t} size={250} x={0} y={0} mood="sleep" ph={i} /> : <Big6 who={w} t={t} i={i} />}</div>)}
    </Pan>); } },
];
/** A singing baby (song shots). */
const Big6: React.FC<{ who: Who; t: number; i: number }> = ({ who, t, i }) => <Baby who={who} t={t} size={250} x={0} y={0} mood="bliss" sing singFn={sing} ph={i} />;
const RANGES = SHOTS.map((s, i) => ({ ...s, to: SHOTS[i + 1]?.from ?? END }));

const ChapterTitle: React.FC<{ t: number }> = ({ t }) => {
  const s = [...RANGES].reverse().find((x) => x.title && t >= x.from);
  if (!s || t > s.from + 4.5) return null;
  const o = interpolate(t, [s.from + 0.5, s.from + 1.3, s.from + 3.8, s.from + 4.5], [0, 1, 1, 0], clamp);
  return <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 84, color: "#fff", WebkitTextStroke: `3px ${P.ink}`, paintOrder: "stroke fill", opacity: o, zIndex: 9 }}>{s.title}</div>;
};

// ------------------------------------------------------------------ intro / outro (wide)
const IntroW: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#fde2e4,#e0f2fe)", opacity: interpolate(f, [F(INTRO) - 12, F(INTRO)], [1, 0], clamp) }}>
      {[...Array(16)].map((_, i) => <div key={i} style={{ position: "absolute", left: random(`iwb${i}`) * 1880, top: 1060 - ((f * 2 * (1 + random(`iws${i}`)) + random(`iwy${i}`) * 1080) % 1140), width: 60, height: 60, borderRadius: 30, border: "4px solid #ffffffcc", background: "#ffffff44" }} />)}
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, transform: `scale(${interpolate(f, [0, 30], [0.85, 1], soft)})`, opacity: interpolate(f, [0, 15], [0, 1], clamp) }}><Logo /></div>
      <div style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 96, color: "#16a34a", opacity: interpolate(f, [18, 36], [0, 1], clamp) }}>baby gang · playground ♡</div>
      {GANG.map((w, i) => <div key={w} style={{ position: "absolute", left: 250 + i * 240, top: 720, opacity: interpolate(f, [20 + i * 4, 34 + i * 4], [0, 1], clamp) }}><Mascot who={w} size={210} mood="bliss" baby noSticker seed={`iw${w}`} /></div>)}
      <Audio src={staticFile("sfx/musicbox_intro.wav")} volume={0.55} />
    </AbsoluteFill>
  );
};
const OutroW: React.FC = () => {
  const f = useCurrentFrame();
  const talk = f > 6 && f < 64;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#312e81,#1e1b4b)", opacity: interpolate(f, [0, 15], [0, 1], clamp) }}>
      {[...Array(40)].map((_, i) => <div key={i} style={{ position: "absolute", left: random(`ows${i}`) * 1900, top: random(`owy${i}`) * 700, color: "#fef9c3", fontSize: 18 + random(`owz${i}`) * 26, opacity: 0.5 + 0.5 * Math.sin(f / 10 + i) }}>✦</div>)}
      <div style={{ position: "absolute", left: 1560, top: 90, width: 170, height: 170, borderRadius: 85, boxShadow: "-34px 16px 0 0 #fef9c3" }} />
      <div style={{ position: "absolute", top: 90, left: 0, right: 0 }}><Logo scale={0.7} /></div>
      <div style={{ position: "absolute", top: 400, left: 0, right: 0, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 92, color: "#fbcfe8" }}>bye bye… see you soon ♡</div>
      <div style={{ position: "absolute", top: 520, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 42, color: "#c7d2fe" }}>follow @ZamHockey for more baby gang</div>
      {GANG.map((w, i) => <div key={w} style={{ position: "absolute", left: 250 + i * 240, top: 690 + (i % 2) * 40 + Math.sin(f / 15 + i) * 5 }}><Mascot who={w} size={210} mood={w === "zam" ? "bliss" : "sleep"} baby noSticker seed={`ow${w}`} open={w === "zam" && talk ? 0.3 + 0.3 * Math.max(0, Math.sin(f / 2)) : 0} talking={w === "zam" && talk} /></div>)}
      <Sequence from={6}><Audio src={staticFile("brand/outro_baby.mp3")} volume={0.95} /></Sequence>
      <Audio src={staticFile("sfx/musicbox_outro.wav")} volume={0.45} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ composition
export const Child03Long: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS30 - INTRO;
  const N = (s: number) => F(INTRO + s);
  const live = f >= F(INTRO) && t < END;
  return (
    <SegCtx.Provider value={SEGS}>
      <AbsoluteFill style={{ fontFamily: FONT, background: "#e0f2fe", overflow: "hidden" }}>
        <Sequence from={F(INTRO)} durationInFrames={F(END) + 10}><Audio src={staticFile("ep/child03.mp3")} /></Sequence>
        {RANGES.map((s, i) => {
          const C = s.Comp; const start = N(s.from) - (i ? F(XF) : 0); const dur = N(s.to) - start + F(XF);
          return (
            <Sequence key={s.from} from={start} durationInFrames={dur}>
              <Fade first={i === 0}><C t={t} lf={f - N(s.from)} dur={s.to - s.from} /></Fade>
            </Sequence>
          );
        })}
        {RANGES.slice(1).filter((s) => s.title).map((s) => <Sequence key={`c${s.from}`} from={N(s.from) - F(XF / 2)} durationInFrames={F(1.8)}><Audio src={staticFile("sfx/chime.wav")} volume={0.12} /></Sequence>)}
        {live && <div style={{ position: "absolute", left: 40, top: 36, padding: "4px 12px", background: "#16a34a", color: "#fff", fontWeight: 900, fontSize: 22, letterSpacing: 2, zIndex: 8 }}>ZAM · BABY GANG</div>}
        {live && <ChapterTitle t={t} />}
        {live && <div style={{ position: "absolute", left: 470, top: 0, width: 1210, height: 1080, zIndex: 9 }}><Caption t={t} segs={SEGS} top={940} /></div>}
        {live && <LyricCard t={t} />}
        <Sequence from={0} durationInFrames={F(INTRO) + 2}><IntroW /></Sequence>
        <Sequence from={F(INTRO + END)}><OutroW /></Sequence>
      </AbsoluteFill>
    </SegCtx.Provider>
  );
};
const Fade: React.FC<{ first: boolean; children: React.ReactNode }> = ({ first, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: first ? 1 : interpolate(f, [0, F(XF)], [0, 1], soft) }}>{children}</AbsoluteFill>;
};
