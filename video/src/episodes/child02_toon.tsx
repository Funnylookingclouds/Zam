/** ZAM Child Edition #2 – "Baby Gang: Playground". The baby gang at the kindergarten playground: swings, sandbox,
 *  slide, seesaw, the "Up the Ladder" song (ElevenLabs music), a soft-ball hockey goal and a sunset goodbye.
 *  Reuses the slow baby kit from child01 (Baby, Pan, Notes, soft intro/outro, crossfades). */
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import words from "../data/child02_words.json";
import { P, clamp } from "../presenter/kit";
import { FONT } from "../theme";
import { type Who } from "../mascots/Gang";
import { Caption, type W } from "../zam/common";
import { FPS, timing } from "../zam/Episode";
import { SegCtx } from "../zam/toon";
import { Baby, BabyIntro, BabyOutro, INTRO, Notes, OUTRO, Pan, XF, XFade, soft, sway } from "./child01_toon";

const WORDS = words as W[];
const { SEGS, LAST } = timing(WORDS);
const F = (s: number) => Math.round(s * FPS);
const OUT_AT = INTRO + LAST + 0.5;
export const CHILD02_FRAMES = Math.ceil((OUT_AT + OUTRO) * FPS);

// ------------------------------------------------------------------ song (starts at news-time 18.4)
const SONG = 18.4;
const LYRICS = [
  { at: 0.05, end: 3.4, text: "La-la, la-la, la…" },
  { at: 5.4, end: 7.9, text: "Up the ladder, down the slide," },
  { at: 8.0, end: 10.6, text: "swing up high into the sky." },
  { at: 10.7, end: 13.25, text: "Pass the ball, one, two, three –" },
  { at: 13.3, end: 15.95, text: "playground hockey, you and me!" },
  { at: 16.05, end: 19.4, text: "La-la, la-la, la…" },
].map((l) => ({ ...l, at: l.at + SONG, end: l.end + SONG }));
const singing = (t: number) => LYRICS.some((l) => t >= l.at && t <= l.end);
const singOpen = (t: number, ph = 0) => (singing(t) ? 0.25 + 0.3 * Math.max(0, Math.sin(t * 9 + ph)) : 0);
const LyricCard: React.FC<{ t: number }> = ({ t }) => {
  const l = LYRICS.find((x) => t >= x.at - 0.2 && t <= x.end);
  if (!l) return null;
  const o = interpolate(t, [l.at - 0.2, l.at + 0.2, l.end - 0.3, l.end], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 60, right: 170, top: 1420, opacity: o, background: "#fffdf7", borderLeft: "14px solid #86efac", borderRadius: 8, padding: "18px 26px", boxShadow: "0 10px 30px #0b254533", fontFamily: FONT, fontSize: 44, fontWeight: 800, color: P.ink, lineHeight: 1.25, zIndex: 7 }}>
      <span style={{ color: "#16a34a", marginRight: 10 }}>♪</span>{l.text}<span style={{ color: "#16a34a", marginLeft: 10 }}>♪</span>
    </div>
  );
};

// ------------------------------------------------------------------ playground set
export const SunFace: React.FC<{ t: number; x?: number; y?: number; set?: number }> = ({ t, x = 790, y = 250, set = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y + set * 520, width: 200, height: 200 }}>
    <svg width={200} height={200} viewBox="-100 -100 200 200" style={{ position: "absolute", transform: `rotate(${t * 6}deg)` }}>{[...Array(12)].map((_, i) => <path key={i} d="M0 -98 L10 -72 L-10 -72 Z" fill={set > 0.3 ? "#fb923c" : "#fcd34d"} transform={`rotate(${i * 30})`} />)}</svg>
    <div style={{ position: "absolute", left: 32, top: 32, width: 136, height: 136, borderRadius: 68, background: set > 0.3 ? "#fdba74" : "#fde68a", border: `5px solid ${P.ink}` }}>
      {[40, 84].map((l) => <div key={l} style={{ position: "absolute", left: l, top: 52, width: 14, height: 8, borderRadius: "0 0 10px 10px", border: `4px solid ${P.ink}`, borderTop: "none" }} />)}
      <div style={{ position: "absolute", left: 46, top: 80, width: 44, height: 18, borderRadius: "0 0 30px 30px", border: `4px solid ${P.ink}`, borderTop: "none" }} />
      {[24, 96].map((l) => <div key={l} style={{ position: "absolute", left: l, top: 74, width: 18, height: 12, borderRadius: 9, background: "#f9a8d4" }} />)}
    </div>
  </div>
);
export const Cloud: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `scale(${s})` }}>
    <div style={{ position: "absolute", left: 0, top: 30, width: 200, height: 70, borderRadius: 40, background: "#fff" }} />
    <div style={{ position: "absolute", left: 40, top: 0, width: 90, height: 90, borderRadius: 45, background: "#fff" }} />
    <div style={{ position: "absolute", left: 100, top: 14, width: 70, height: 70, borderRadius: 35, background: "#fff" }} />
  </div>
);
const Yard: React.FC<{ t: number; sunset?: number; fence?: boolean }> = ({ t, sunset = 0, fence = true }) => (
  <AbsoluteFill style={{ background: sunset > 0 ? `linear-gradient(180deg, #fda4af ${0}%, #fdba74 45%, #fef3c7 62%)` : "linear-gradient(180deg,#7dd3fc 0%,#bae6fd 45%,#e0f2fe 62%)" }}>
    <SunFace t={t} set={sunset} />
    <Cloud x={60 + ((t * 8) % 300)} y={330} />
    <Cloud x={480 - ((t * 5) % 200)} y={520} s={0.7} />
    {/* bushes + trees */}
    {[...Array(4)].map((_, i) => <div key={i} style={{ position: "absolute", left: -60 + i * 300, top: 830 + (i % 2) * 20, width: 340, height: 220, borderRadius: "50%", background: i % 2 ? "#86efac" : "#4ade80", border: `5px solid ${P.ink}` }} />)}
    <div style={{ position: "absolute", left: 0, right: 0, top: 1000, bottom: 0, background: "linear-gradient(180deg,#86efac,#4ade80)", borderTop: `6px solid ${P.ink}` }} />
    {[...Array(14)].map((_, i) => <div key={i} style={{ position: "absolute", left: random(`fl${i}`) * 1040, top: 1040 + random(`fy${i}`) * 820, fontSize: 34, opacity: 0.9 }}>{i % 3 ? "✿" : "❀"}</div>)}
    {fence && <div style={{ position: "absolute", left: 0, right: 0, top: 920, height: 110, display: "flex", gap: 18, paddingLeft: 10 }}>
      {[...Array(18)].map((_, i) => <div key={i} style={{ width: 42, height: 110, background: ["#fbcfe8", "#bfdbfe", "#fef08a", "#bbf7d0"][i % 4], border: `4px solid ${P.ink}`, borderRadius: "21px 21px 4px 4px" }} />)}
    </div>}
    {sunset > 0 && <AbsoluteFill style={{ background: "#fb7185", opacity: sunset * 0.18 }} />}
  </AbsoluteFill>
);
export const SwingSet: React.FC<{ x: number; y: number; t: number; who?: Who; ang?: number; size?: number; sing?: boolean }> = ({ x, y, t, who, ang, size = 330, sing }) => {
  const a = ang ?? Math.sin(t * 1.4) * 22;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 600, height: 700 }}>
      <svg width={600} height={700} style={{ position: "absolute" }}>
        <path d="M60 690 L150 20 L450 20 L540 690" stroke="#ef4444" strokeWidth={24} fill="none" strokeLinejoin="round" />
        <path d="M150 20 L450 20" stroke={P.ink} strokeWidth={6} />
      </svg>
      <div style={{ position: "absolute", left: 300, top: 24, width: 0, height: 0, transform: `rotate(${a}deg)`, transformOrigin: "0 0" }}>
        <div style={{ position: "absolute", left: -110, top: 0, width: 6, height: 470, background: "#64748b" }} />
        <div style={{ position: "absolute", left: 104, top: 0, width: 6, height: 470, background: "#64748b" }} />
        <div style={{ position: "absolute", left: -130, top: 466, width: 260, height: 26, background: "#fde047", border: `5px solid ${P.ink}`, borderRadius: 10 }} />
        {who && <div style={{ position: "absolute", left: -size / 2, top: 486 - size * 1.0, transform: `rotate(${-a * 0.4}deg)` }}><Baby who={who} t={t} size={size} x={0} y={0} mood={sing ? "bliss" : "laugh"} sing={sing} singFn={singOpen} /></div>}
      </div>
    </div>
  );
};
export const Slide: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <svg width={620 * s} height={720 * s} viewBox="0 0 620 720" style={{ position: "absolute", left: x, top: y }}>
    <path d="M60 710 L60 140 M170 710 L170 140" stroke="#3b82f6" strokeWidth={20} />
    {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M60 ${640 - i * 110} L170 ${640 - i * 110}`} stroke="#3b82f6" strokeWidth={14} />)}
    <rect x={40} y={110} width={160} height={40} rx={10} fill="#f9a8d4" stroke={P.ink} strokeWidth={6} />
    <path d="M190 130 Q330 160 420 470 Q470 650 610 690 L610 720 Q450 690 390 500 Q310 200 190 170 Z" fill="#fde047" stroke={P.ink} strokeWidth={6} />
  </svg>
);
export const slidePos = (k: number) => { // k 0..1 along the slide surface (unscaled coords)
  const x = interpolate(k, [0, 0.4, 0.8, 1], [190, 360, 460, 600]);
  const y = interpolate(k, [0, 0.4, 0.8, 1], [130, 300, 600, 690]);
  return [x, y];
};
export const Sandbox: React.FC<{ x: number; y: number; w?: number }> = ({ x, y, w = 760 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: w * 0.42 }}>
    <div style={{ position: "absolute", inset: 0, background: "#fde68a", border: `22px solid #c2410c`, borderRadius: 18, boxShadow: `0 0 0 5px ${P.ink}` }} />
    {[...Array(10)].map((_, i) => <div key={i} style={{ position: "absolute", left: 40 + random(`sb${i}`) * (w - 120), top: 40 + random(`sby${i}`) * (w * 0.42 - 100), width: 18, height: 10, borderRadius: 9, background: "#f59e0b", opacity: 0.6 }} />)}
  </div>
);
export const SandCake: React.FC<{ x: number; y: number; pop: number }> = ({ x, y, pop }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `scale(${pop})`, transformOrigin: "50% 100%", zIndex: 4 }}>
    <div style={{ position: "absolute", left: 0, top: 50, width: 200, height: 110, background: "#fbbf24", border: `5px solid ${P.ink}`, borderRadius: "20px 20px 10px 10px" }} />
    <div style={{ position: "absolute", left: 30, top: 0, width: 140, height: 60, background: "#fcd34d", border: `5px solid ${P.ink}`, borderRadius: "20px 20px 6px 6px" }} />
    {[60, 100, 140].map((l, i) => <div key={l} style={{ position: "absolute", left: l - 10, top: -30, fontSize: 30 }}>{i === 1 ? "🐚" : "✿"}</div>)}
  </div>
);
export const Seesaw: React.FC<{ x: number; y: number; t: number; ang: number; left: Who; right: Who; size?: number; sing?: boolean }> = ({ x, y, t, ang, left, right, size = 300, sing }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 900, height: 400 }}>
    <svg width={900} height={400} style={{ position: "absolute" }}><path d="M390 380 L450 230 L510 380 Z" fill="#a78bfa" stroke={P.ink} strokeWidth={6} /></svg>
    <div style={{ position: "absolute", left: 450, top: 225, width: 0, height: 0, transform: `rotate(${ang}deg)` }}>
      <div style={{ position: "absolute", left: -380, top: -16, width: 760, height: 32, background: "#f472b6", border: `5px solid ${P.ink}`, borderRadius: 14 }} />
      <div style={{ position: "absolute", left: -370, top: -size * (left === "clubby" ? 0.7 : 1.0), transform: `rotate(${-ang}deg)`, transformOrigin: "50% 100%" }}><Baby who={left} t={t} size={size} x={0} y={0} mood="laugh" sing={sing} singFn={singOpen} /></div>
      <div style={{ position: "absolute", left: 370 - size, top: -size * 0.86, transform: `rotate(${-ang}deg)`, transformOrigin: "50% 100%" }}><Baby who={right} t={t} size={size} x={0} y={0} mood="laugh" flip sing={sing} singFn={singOpen} ph={2} /></div>
    </div>
  </div>
);
export const Goal: React.FC<{ x: number; y: number; s?: number; shake?: number }> = ({ x, y, s = 1, shake = 0 }) => (
  <div style={{ position: "absolute", left: x + shake, top: y, width: 260 * s, height: 180 * s, border: `${10 * s}px solid #ef4444`, borderBottom: "none", borderRadius: `${12 * s}px ${12 * s}px 0 0`, background: "repeating-linear-gradient(45deg,#fff0 0 16px,#ffffffaa 16px 20px),repeating-linear-gradient(-45deg,#fff0 0 16px,#ffffffaa 16px 20px)" }} />
);
export const Ball: React.FC<{ x: number; y: number; r?: number; spin?: number }> = ({ x, y, r = 60, spin = 0 }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: r, background: "conic-gradient(#f9a8d4 0 25%,#93c5fd 0 50%,#fde68a 0 75%,#86efac 0)", border: `5px solid ${P.ink}`, transform: `rotate(${spin}deg)`, zIndex: 5 }} />
);
const Hearts: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => (
  <>
    {[...Array(22)].map((_, i) => {
      const k = t - t0; if (k < 0) return null;
      const x = 540 + (random(`hx${i}`) - 0.5) * 1000, y = 300 + random(`hy${i}`) * 200 + k * (120 + random(`hv${i}`) * 80);
      return <div key={i} style={{ position: "absolute", left: x + sway(t, 0.4, 20, i), top: y, fontSize: 40 + random(`hs${i}`) * 30, color: ["#f9a8d4", "#fde68a", "#93c5fd", "#86efac", "#c4b5fd"][i % 5], opacity: interpolate(k, [0, 0.3, 3, 4], [0, 1, 1, 0], clamp), zIndex: 6 }}>{i % 3 ? "♥" : "✦"}</div>;
    })}
  </>
);

// ------------------------------------------------------------------ shots (news time)
type Shot = { from: number; Comp: React.FC<{ t: number; lf: number; dur: number }> };
const SHOTS: Shot[] = [
  { from: 0, Comp: ({ t, lf, dur }) => { // gate opens, Zam rolls out: "Outside… yay!"
    const g = interpolate(t, [0.1, 1.3], [0, 75], soft);
    return (<Pan lf={lf} dur={dur} to={1.07}><Yard t={t} fence={false} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 920, height: 110, display: "flex", gap: 18, paddingLeft: 10 }}>{[...Array(18)].map((_, i) => i >= 7 && i <= 10 ? <div key={i} style={{ width: 42 }} /> : <div key={i} style={{ width: 42, height: 110, background: ["#fbcfe8", "#bfdbfe", "#fef08a", "#bbf7d0"][i % 4], border: `4px solid ${P.ink}`, borderRadius: "21px 21px 4px 4px" }} />)}</div>
      {[0, 1].map((sd) => <div key={sd} style={{ position: "absolute", left: sd ? 600 : 410, top: 880, width: 120, height: 150, background: "#c4b5fd", border: `5px solid ${P.ink}`, borderRadius: 10, transform: `perspective(600px) rotateY(${(sd ? -1 : 1) * g}deg)`, transformOrigin: sd ? "100% 50%" : "0 50%", zIndex: 3 }} />)}
      <Baby who="zam" t={t} size={560} x={interpolate(lf, [F(0.4), F(2.0)], [260, 250], soft)} y={interpolate(lf, [0, F(1.6)], [880, 820], soft)} mood={t > 1.1 ? "laugh" : "bliss"} z={4} />
    </Pan>); } },
  { from: 2.7, Comp: ({ t, lf, dur }) => ( // Pucky on the swing
    <Pan lf={lf} dur={dur} to={1.06}><Yard t={t} />
      <SwingSet x={240} y={420} t={t} who="pucky" size={340} />
    </Pan>) },
  { from: 6.8, Comp: ({ t, lf, dur }) => ( // Biscuit's sand cake
    <Pan lf={lf} dur={dur} from={1.05} to={1}><Yard t={t} />
      <Sandbox x={160} y={1060} />
      <Baby who="biscuit" t={t} size={560} x={110} y={640} mood={t > 8.3 ? "laugh" : "bliss"} />
      <SandCake x={680} y={1030} pop={interpolate(t, [7.6, 8.2], [0.3, 1], soft)} />
      <div style={{ position: "absolute", left: 810, top: 1180, width: 40, height: 120, background: "#ef4444", border: `4px solid ${P.ink}`, borderRadius: 8, transform: "rotate(30deg)", zIndex: 3 }} />
    </Pan>) },
  { from: 10.3, Comp: ({ t, lf, dur }) => { // Helmy up the ladder, down the slide
    const climb = interpolate(t, [10.3, 11.6], [0, 1], soft);
    const k = interpolate(t, [11.7, 13.0], [0, 1], soft);
    const [sx, sy] = slidePos(k);
    const s = 1.3, ox = 120, oy = 470;
    const hx = climb < 1 ? ox + 115 * s : ox + sx * s, hy = climb < 1 ? oy + (640 - climb * 510) * s : oy + sy * s;
    return (<Pan lf={lf} dur={dur} to={1.05}><Yard t={t} />
      <Slide x={ox} y={oy} s={s} />
      <div style={{ position: "absolute", left: hx - 150, top: hy - 300, transform: `rotate(${climb < 1 ? 0 : interpolate(k, [0, 0.4, 0.8, 1], [0, 25, 35, 0])}deg)`, zIndex: 4 }}><Baby who="helmy" t={t} size={300} x={0} y={0} mood={t > 11.6 ? "laugh" : "bliss"} /></div>
    </Pan>); } },
  { from: 13.5, Comp: ({ t, lf, dur }) => ( // seesaw: Clubby "Up!" / Agenty "Down! …Again!"
    <Pan lf={lf} dur={dur} to={1.05}><Yard t={t} />
      <Seesaw x={90} y={820} t={t} ang={Math.sin((t - 13.5) * 0.9 - 0.6) * 14} left="clubby" right="agenty" size={330} />
    </Pan>) },
  { from: 18.2, Comp: ({ t, lf, dur }) => { // song wide shot: everyone playing
    return (<Pan lf={lf} dur={dur} from={1.12} to={1} x0={-60} x1={40}><Yard t={t} />
      <SwingSet x={-10} y={520} t={t} who="pucky" size={230} sing />
      <Slide x={520} y={560} s={0.8} />
      <div style={{ position: "absolute", left: 545, top: 470 }}><Baby who="helmy" t={t} size={230} x={0} y={0} sing singFn={singOpen} ph={1} /></div>
      <Sandbox x={420} y={1150} w={560} />
      <Baby who="biscuit" t={t} size={250} x={480} y={1000} sing singFn={singOpen} ph={2} z={3} />
      <Baby who="zam" t={t} size={260} x={720} y={1030} sing singFn={singOpen} ph={3} z={3} />
      <Baby who="clubby" t={t} size={220} x={40} y={1080} sing singFn={singOpen} ph={4} z={3} />
      <Baby who="agenty" t={t} size={230} x={240} y={1100} sing singFn={singOpen} ph={5} z={3} />
      <Notes t={t} top={1150} />
    </Pan>); } },
  { from: 28.9, Comp: ({ t, lf, dur }) => { // "pass the ball, one, two, three" – soft-ball hockey on the grass
    const players: [Who, number, number][] = [["clubby", 40, 1010], ["zam", 380, 940], ["agenty", 700, 1000]];
    const stops = [[200, 1260], [520, 1220], [850, 1260], [520, 1220], [200, 1260]];
    const p = interpolate(t, [29.0, 31.6, 34.2, 36.8, 38.2], [0, 1, 2, 3, 4], soft);
    const i = Math.min(3, Math.floor(p)), k = p - i;
    const bx = stops[i][0] + (stops[i + 1][0] - stops[i][0]) * k, by = stops[i][1] + (stops[i + 1][1] - stops[i][1]) * k - Math.sin(k * Math.PI) * 60;
    return (<Pan lf={lf} dur={dur} to={1.05}><Yard t={t} />
      {players.map(([w, x, y], n) => <Baby key={w} who={w} t={t} size={300} x={x} y={y} sing singFn={singOpen} ph={n} mood="bliss" />)}
      <Ball x={bx} y={by} spin={p * 360} />
      <Notes t={t} n={5} top={900} />
      {[["1", 30.48], ["2", 30.92], ["3", 31.1]].map(([n, a], j) => <div key={n} style={{ position: "absolute", left: 250 + j * 230, top: 560, width: 140, height: 140, borderRadius: 70, background: ["#fca5a5", "#93c5fd", "#fde68a"][j], border: `6px solid ${P.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 90, color: P.ink, opacity: interpolate(t, [Number(a), Number(a) + 0.3, 33.5, 34], [0, 1, 1, 0], clamp), zIndex: 6 }}>{n}</div>)}
    </Pan>); } },
  { from: 38.2, Comp: ({ t, lf, dur }) => { // Clubby passes, Pucky nudges the ball in: "Goal!"
    const k1 = interpolate(t, [38.6, 39.8], [0, 1], soft), k2 = interpolate(t, [40.0, 40.7], [0, 1], soft);
    const bx = k2 > 0 ? 560 + k2 * 260 : 220 + k1 * 340, by = k2 > 0 ? 1210 - k2 * 40 : 1240 - k1 * 30;
    const shake = t > 40.7 && t < 41.3 ? Math.sin(t * 40) * 6 : 0;
    return (<Pan lf={lf} dur={dur} to={1.06}><Yard t={t} />
      <Goal x={760} y={1020} s={1.1} shake={shake} />
      <Baby who="clubby" t={t} size={300} x={0} y={940} mood="laugh" />
      <Baby who="pucky" t={t} size={330} x={400} y={900} mood={t > 40.6 ? "laugh" : "bliss"} />
      <Ball x={bx} y={by} r={52} spin={(k1 + k2) * 540} />
      <Hearts t={t} t0={40.75} />
    </Pan>); } },
  { from: 42.6, Comp: ({ t, lf, dur }) => ( // Biscuit happy for once: "Again!"
    <Pan lf={lf} dur={dur} from={1.02} to={1.08}><Yard t={t} />
      <Baby who="biscuit" t={t} size={620} x={230} y={700} mood="laugh" />
      <Hearts t={t} t0={42.6} />
    </Pan>) },
  { from: 44.9, Comp: ({ t, lf, dur }) => { // sunset goodbye: "Bye bye, playground."
    const set = interpolate(t, [44.9, 47], [0.2, 0.7], soft);
    const gang: Who[] = ["clubby", "biscuit", "zam", "pucky", "helmy", "agenty"];
    return (<Pan lf={lf} dur={dur} from={1.04} to={1}><Yard t={t} sunset={set} />
      {gang.map((w, i) => <Baby key={w} who={w} t={t} size={w === "zam" ? 300 : 230} x={20 + i * 170 - (w === "zam" ? 30 : 0)} y={w === "zam" ? 960 : 1060 + (i % 2) * 40} mood={w === "zam" ? "bliss" : "laugh"} ph={i} z={w === "zam" ? 4 : 3} />)}
    </Pan>); } },
];
const RANGES = SHOTS.map((s, i) => ({ ...s, to: SHOTS[i + 1]?.from ?? LAST + 0.5 }));

export const Child02: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS - INTRO;
  const N = (s: number) => F(INTRO + s);
  const live = f >= F(INTRO) && t < LAST + 0.5;
  return (
    <SegCtx.Provider value={SEGS}>
      <AbsoluteFill style={{ fontFamily: FONT, background: "#e0f2fe", overflow: "hidden" }}>
        <Sequence from={F(INTRO)} durationInFrames={F(OUT_AT - INTRO) + 20}><Audio src={staticFile("ep/child02.mp3")} /></Sequence>
        {RANGES.map((s, i) => {
          const C = s.Comp; const start = N(s.from) - (i ? F(XF) : 0); const dur = N(s.to) - start + F(XF);
          return <Sequence key={s.from} from={start} durationInFrames={dur}><XFade first={i === 0} dur={dur}><C t={t} lf={f - N(s.from)} dur={s.to - s.from} /></XFade></Sequence>;
        })}
        {RANGES.slice(1).map((s) => <Sequence key={`c${s.from}`} from={N(s.from) - F(XF / 2)} durationInFrames={F(1.8)}><Audio src={staticFile("sfx/chime.wav")} volume={s.from > 18 && s.from < 38 ? 0.05 : 0.14} /></Sequence>)}
        {live && <div style={{ position: "absolute", left: 52, top: 168, padding: "4px 12px", background: "#16a34a", color: "#fff", fontWeight: 900, fontSize: 22, letterSpacing: 2, zIndex: 8 }}>ZAM · BABY GANG #2</div>}
        {live && <Caption t={t} segs={SEGS} top={1420} />}
        {live && <LyricCard t={t} />}
        <Sequence from={0} durationInFrames={F(INTRO) + 2}><BabyIntro /></Sequence>
        <Sequence from={F(OUT_AT)}><BabyOutro /></Sequence>
      </AbsoluteFill>
    </SegCtx.Provider>
  );
};
