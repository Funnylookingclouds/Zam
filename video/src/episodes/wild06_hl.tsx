/** ZAM Daily Facts – "Hockey's Wildest Moments #6" (Hockey Life cast, sarcastic Walt). Verified (NHL.com):
 *  Lemieux 5 goals 5 ways (Dec 31 1988, PIT 8–6 NJD) · Sittler 10 points (Feb 7 1976, TOR 11–4 BOS) · first octopus (Apr 15 1952, Detroit). */
import React from "react";
import { AbsoluteFill, Audio, Easing, Sequence, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import words from "../data/wild06_words.json";
import { clamp, HAND } from "../presenter/kit";
import { FONT } from "../theme";
import { Mascot, mouthOpen } from "../mascots/Gang";
import { StickPerson, type StickMood, type StickPose, type StickWho } from "../mascots/Stick";
import { Logo } from "../zam/common";
import { FPS } from "../zam/Episode";
import { Pow } from "../zam/toon";
import { ARM, Arena, Cam, Foreground, IntroHL, PenaltyBox, Vignette, kf, type A4 } from "./hockey_life_ref";
import { Net } from "./hockey_life_01";

type Wd = { word: string; display: string; start: number; end: number; segment: string };
const WORDS = words as Wd[];
const LAST = WORDS[WORDS.length - 1].end;
const INTRO = 2.0, END = LAST + 0.5, OUTRO = 3.0;
const F = (s: number) => Math.round(s * FPS);
export const WILD06_FRAMES = F(INTRO + END + OUTRO);
const soft = { ...clamp, easing: Easing.inOut(Easing.sin) };
const WHO: Record<string, string> = { n: "narrator", f: "ref", g: "gus", w: "walt", r: "rookie" };
const talk = (who: string, t: number) => { const ws = WORDS.filter((w) => WHO[w.segment[0]] === who); return ws.some((w) => t >= w.start - 0.05 && t <= w.end + 0.05) ? mouthOpen(ws, t) : 0; };
const bump = (who: string, t: number) => { const w = WORDS.find((x) => t >= x.start && t <= x.end && WHO[x.segment[0]] === who); return w ? Math.max(0, 1 - (t - w.start) * 5) : 0; };

const Actor: React.FC<{ who: StickWho; t: number; size: number; x: number; y: number; mood: StickMood; pose?: StickPose; arms?: A4; skate?: number; lean?: number; headTurn?: number; headTilt?: number; flip?: boolean; sitting?: boolean; rot?: number; label?: string; hold?: React.ReactNode }> = (p) => {
  const b = bump(p.who, p.t);
  return (
    <div style={{ position: "absolute", left: p.x, top: p.y - b * 16, transform: `rotate(${p.rot ?? 0}deg) scale(${1 + b * 0.035}, ${1 - b * 0.035})`, transformOrigin: "50% 100%" }}>
      {p.label && <div style={{ position: "absolute", left: 0, right: 0, top: p.size * 0.1, textAlign: "center", zIndex: 3 }}><span style={{ display: "inline-block", background: "#111", color: "#fde047", fontFamily: FONT, fontWeight: 900, fontSize: Math.max(22, p.size / 14), padding: "3px 12px", borderRadius: 6 }}>{p.label}</span></div>}
      <StickPerson who={p.who} size={p.size} mood={p.mood} pose={p.pose} arms={p.arms} skate={p.skate} lean={p.lean} headTurn={p.headTurn} headTilt={p.headTilt} open={talk(p.who, p.t)} flip={p.flip} sitting={p.sitting} hold={p.hold} seed={p.who.length} />
    </div>
  );
};
const Close: React.FC<{ who: StickWho; t: number; mood: StickMood; arms?: A4; cx?: number; cy?: number; size?: number; headTilt?: number; lean?: number; pose?: StickPose }> = ({ who, t, mood, arms, cx = 540, cy = 640, size = 1200, headTilt, lean, pose }) => {
  const H = size * 1.3, headY = (155 / 520) * H;
  return <Actor who={who} t={t} size={size} x={cx - size / 2} y={cy - headY} mood={mood} arms={arms} headTilt={headTilt} lean={lean} pose={pose} />;
};
/** Torn-paper fact sticker: date + source. */
const Fact: React.FC<{ t: number; at: number; title: string; sub?: string; x?: number; y?: number; rot?: number }> = ({ t, at, title, sub = "Source: NHL.com", x = 60, y = 400, rot = -3 }) => {
  const k = interpolate(t, [at, at + 0.25], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `rotate(${rot}deg) scale(${k})`, transformOrigin: "0 50%", zIndex: 8, background: "#fbf6ea", border: "5px solid #2b2622", borderRadius: 6, padding: "10px 22px", boxShadow: "0 10px 0 #0005" }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 48, color: "#2b2622", whiteSpace: "nowrap" }}>{title}</div>
      <div style={{ fontFamily: HAND, fontSize: 30, color: "#7a6f62" }}>{sub}</div>
    </div>
  );
};
const GoalLight: React.FC<{ t: number; at: number[] }> = ({ t, at }) => {
  const o = Math.max(0, ...at.map((a) => (t >= a && t < a + 0.6 ? 1 - (t - a) / 0.6 : 0)));
  return o > 0 ? <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 10%, #ef4444${Math.round(o * 160).toString(16).padStart(2, "0")}, transparent 60%)`, zIndex: 5, pointerEvents: "none" }} /> : null;
};
const Puck: React.FC<{ x: number; y: number }> = ({ x, y }) => <div style={{ position: "absolute", left: x - 30, top: y - 12, width: 60, height: 24, borderRadius: "50%", background: "#111", zIndex: 4 }} />;
const Zs: React.FC<{ t: number; x: number; y: number }> = ({ t, x, y }) => <>{[0, 1, 2].map((i) => { const l = (t * 0.5 + i / 3) % 1; return <div key={i} style={{ position: "absolute", left: x + l * 90, top: y - l * 220, fontFamily: FONT, fontWeight: 900, fontSize: 60 + l * 50, color: "#fff", WebkitTextStroke: "6px #111", paintOrder: "stroke fill", opacity: interpolate(l, [0, 0.2, 0.8, 1], [0, 1, 1, 0]), zIndex: 6 }}>z</div>; })}</>;

// ------------------------------------------------------------------ props
const Octopus: React.FC<{ t: number; size?: number; mood?: "happy" | "dizzy" }> = ({ t, size = 220, mood = "happy" }) => (
  <svg width={size} height={size} viewBox="-110 -110 220 220" style={{ overflow: "visible" }}>
    {[...Array(8)].map((_, i) => { const a = (i / 8) * Math.PI + 0.1, w = Math.sin(t * 4 + i) * 14; const x = Math.cos(a) * 90, y = 40 + Math.sin(a) * 60; return <path key={i} d={`M${x * 0.3} 20 Q${x * 0.7 + w} ${y - 10} ${x} ${y + w * 0.3}`} stroke="#c026d3" strokeWidth={18} fill="none" strokeLinecap="round" />; })}
    <ellipse cx={0} cy={-10} rx={70} ry={62} fill="#d946ef" stroke="#2b2622" strokeWidth={6} />
    {[-24, 24].map((x) => <g key={x}><circle cx={x} cy={-20} r={16} fill="#fff" stroke="#2b2622" strokeWidth={4} />{mood === "dizzy" ? <path d={`M${x - 8} -28 L${x + 8} -12 M${x + 8} -28 L${x - 8} -12`} stroke="#2b2622" strokeWidth={4} /> : <circle cx={x + 3} cy={-18} r={7} fill="#2b2622" />}</g>)}
    <path d="M-16 14 Q0 26 16 14" stroke="#2b2622" strokeWidth={5} fill="none" strokeLinecap="round" />
  </svg>
);
const Fish = <g transform="translate(-10 -40)"><ellipse cx={40} cy={0} rx={46} ry={22} fill="#60a5fa" stroke="#2b2622" strokeWidth={4} /><path d="M84 0 L112 -20 L112 20 Z" fill="#60a5fa" stroke="#2b2622" strokeWidth={4} /><circle cx={20} cy={-4} r={5} fill="#2b2622" /></g>;
const Checklist: React.FC<{ t: number; items: [string, number][] }> = ({ t, items }) => (
  <div style={{ position: "absolute", left: 40, top: 560, zIndex: 8, background: "#fbf6ea", border: "5px solid #2b2622", borderRadius: 8, padding: "12px 20px", transform: "rotate(-3deg)", boxShadow: "0 10px 0 #0005" }}>
    {items.map(([label, at]) => <div key={label} style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, color: t >= at ? "#2b2622" : "#2b262244", display: "flex", gap: 10, alignItems: "center" }}><span style={{ display: "inline-block", width: 34, color: "#16a34a", fontSize: 40, transform: `scale(${interpolate(t, [at, at + 0.15], [0, 1], clamp)})` }}>✓</span>{label}</div>)}
  </div>
);

// ------------------------------------------------------------------ shots
type Shot = { from: number; Comp: React.FC<{ t: number }> };
const GOALS5 = [11.23, 11.98, 12.63, 13.25, 14.08];
const SHOTS: Shot[] = [
  { from: 0, Comp: ({ t }) => (
    <><Cam t={t} keys={[[0, 1.2, 0, 200, 0], [3.0, 1.0, 0, 0, 0]]}><Arena t={t} jumbo="5 GOALS · 5 WAYS" spot={[540, 1000]} />
      <Actor who="rookie" t={t} size={560} x={260} y={700} mood="shock" arms={kf(t, [[0, ARM.idle], [0.5, ARM.up], [1.4, ARM.flail1], [2.0, ARM.up]]) as A4} headTilt={Math.sin(t * 4) * 4} />
    </Cam><Foreground t={t} /><Vignette /></>) },
  { from: 3.0, Comp: ({ t }) => <><Cam t={t} keys={[[3.0, 1.0, 0, 0, 0], [6.5, 1.12, 0, 0, 0]]}><Arena t={t} /><Close who="walt" t={t} mood="smug" pose="crossed" headTilt={-4} /></Cam><Vignette /></> },
  { from: 6.5, Comp: ({ t }) => { // Lemieux: five goals, five ways
    const i = GOALS5.findIndex((g) => t < g); const g0 = i <= 0 ? 10.6 : GOALS5[i - 1], g1 = i < 0 ? 99 : GOALS5[i];
    const k = i < 0 ? 1 : interpolate(t, [g0 + 0.05, g1], [0, 1], soft);
    return (<><Cam t={t} keys={[[6.5, 1.15, 120, 0, 0], [10.6, 1.0, 0, 0, 0], [15.1, 1.06, -40, 0, 0]]} shake={GOALS5.some((g) => t > g && t < g + 0.2) ? 9 : 0}>
      <Arena t={t} jumbo={t < 11.2 ? "PIT vs NJD · 1988" : `GOALS: ${GOALS5.filter((g) => t >= g).length}`} cheer={t > 11.2 ? 1 : 0.3} />
      <Net x={760} y={980} />
      <Actor who="rookie" t={t} size={480} x={interpolate(t, [6.5, 15.1], [300, 420])} y={760} mood={t > 11.2 ? "happy" : "talk"} arms={(t > 11 ? (Math.floor(t * 3) % 2 ? ARM.up : [-78, -30, 190, 40]) : ARM.idle) as A4} skate={t * 6} lean={8} label="LEMIEUX · PIT" />
      <Puck x={i < 0 ? 900 : 560 + k * 340} y={1220 - Math.sin(k * Math.PI) * 50} />
      <GoalLight t={t} at={GOALS5} />
    </Cam>
      <Fact t={t} at={6.6} title="DEC 31, 1988" />
      <Checklist t={t} items={[["Even strength", 11.23], ["Power play", 11.98], ["Shorthanded", 12.63], ["Penalty shot", 13.25], ["Empty net", 14.08]]} />
      <Vignette /></>); } },
  { from: 15.1, Comp: ({ t }) => <><Cam t={t} keys={[[15.1, 1.0, 0, 0, 3], [16.75, 1.1, 0, 0, 3]]}><Arena t={t} spot={[540, 800]} /><Close who="rookie" t={t} mood="happy" arms={ARM.up} size={1100} /></Cam><Vignette /></> },
  { from: 16.75, Comp: ({ t }) => { // Walt: "Nobody's scored off my face. Yet." → BONK
    const k = interpolate(t, [19.3, 19.62], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
    const hit = t > 19.62;
    return (<><Cam t={t} keys={[[16.75, 1.0, 0, 0, 0], [19.6, 1.1, 0, 0, 0], [19.7, 1.25, 0, 60, 6]]} shake={hit && t < 19.9 ? 14 : 0}>
      <Arena t={t} /><Close who="walt" t={t} mood={hit ? "shock" : "smug"} pose="crossed" headTilt={hit ? 14 : 0} />
      {t > 19.3 && !hit && <div style={{ position: "absolute", left: 1100 - k * 560, top: 300 + k * 240, transform: `rotate(${-k * 400}deg)` }}><Mascot who="pucky" size={220} mood="laugh" noSticker seed="w6b" /></div>}
      {hit && <div style={{ position: "absolute", left: 640, top: 760 }}><Mascot who="pucky" size={200} mood="dizzy" noSticker seed="w6c" /></div>}
      {hit && <Pow text="BONK!" x={420} y={300} size={170} rot={-10} />}
    </Cam><Vignette /></>); } },
  { from: 20.15, Comp: ({ t }) => { // Sittler: 10 points, counter
    const pts = Math.min(10, Math.max(0, Math.floor(interpolate(t, [23.4, 26.6], [0, 10.99], clamp))));
    return (<><Cam t={t} keys={[[20.15, 1.15, -100, 0, 0], [23.4, 1.0, 0, 0, 0], [27.95, 1.08, 40, 0, 0]]}>
      <Arena t={t} jumbo={t < 23.4 ? "TOR vs BOS · 1976" : `SITTLER: ${pts} PTS`} cheer={t > 23.4 ? 1 : 0.2} />
      <Net x={760} y={980} />
      <Actor who="rookie" t={t} size={480} x={interpolate(t, [20.15, 27.95], [120, 380])} y={760} mood={t > 23.4 ? "happy" : "talk"} arms={(t > 23.4 ? (Math.floor(t * 3) % 2 ? ARM.up : ARM.point) : ARM.idle) as A4} skate={t * 6} lean={6} label="SITTLER · TOR" />
      {t > 23.4 && [...Array(pts)].map((_, i) => <div key={i} style={{ position: "absolute", left: 120 + (i % 5) * 170, top: 660 + Math.floor(i / 5) * 120, width: 110, height: 90, borderRadius: 12, background: i < 6 ? "#fde047" : "#93c5fd", border: "5px solid #2b2622", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 42, color: "#2b2622", zIndex: 6 }}>{i < 6 ? "G" : "A"}</div>)}
    </Cam><Fact t={t} at={20.25} title="FEB 7, 1976" /><Fact t={t} at={24.6} title="10 POINTS · 6G + 4A" sub="still the NHL record" x={90} y={1200} rot={2} /><Vignette /></>); } },
  { from: 27.95, Comp: ({ t }) => <><Cam t={t} keys={[[27.95, 1.0, 0, 0, -3], [29.6, 1.1, 0, 0, -3]]}><Arena t={t} spot={[540, 800]} /><Close who="rookie" t={t} mood="happy" arms={ARM.point} size={1100} /></Cam><Vignette /></> },
  { from: 29.6, Comp: ({ t }) => <><Cam t={t} keys={[[29.6, 1.0, 0, 0, 0], [30.25, 1.12, 0, 0, 0], [32.8, 1.2, 0, 0, 0]]}><Arena t={t} /><Close who="walt" t={t} mood="smug" arms={kf(t, [[29.6, ARM.idle], [29.75, ARM.two]]) as A4} /></Cam>
    <Fact t={t} at={30.3} title="ROOKIE'S RECORD: 2 MIN" sub="tripping (over the blue line)" x={70} y={1200} rot={-2} /><Vignette /></> },
  { from: 32.8, Comp: ({ t }) => { // the octopus throw
    const k = interpolate(t, [36.1, 37.0], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
    return (<><Cam t={t} keys={[[32.8, 1.2, 0, 300, 0], [35.8, 1.1, 0, 200, 0], [37.0, 1.0, 0, 0, 0], [40.2, 1.06, 0, 0, 0]]} shake={t > 37 && t < 37.3 ? 12 : 0}>
      <Arena t={t} jumbo="DETROIT · 1952" cheer={t > 37 ? 1 : 0.5} />
      {t < 37 && <div style={{ position: "absolute", left: 200 + k * 260, top: 420 + k * 660 - Math.sin(k * Math.PI) * 260, transform: `rotate(${k * 540}deg)`, zIndex: 5 }}><Octopus t={t} size={200} /></div>}
      {t >= 37 && <div style={{ position: "absolute", left: 400, top: 1000, transform: `scale(${1 + Math.max(0, 0.3 - (t - 37)) }, ${1 - Math.max(0, 0.3 - (t - 37))})`, transformOrigin: "50% 100%" }}><Octopus t={t} size={240} mood="dizzy" /></div>}
      {t >= 37 && t < 38.6 && <Pow text="SPLAT!" x={360} y={760} size={150} rot={6} />}
      <Actor who="ref" t={t} size={420} x={660} y={800} mood={t > 37 ? "shock" : "talk"} arms={t > 37 ? ARM.flail1 : ARM.idle} skate={t * 2} />
    </Cam><Fact t={t} at={32.9} title="APRIL 15, 1952" /><Fact t={t} at={37.4} title="8 LEGS = 8 WINS" sub="needed for the Stanley Cup back then" x={70} y={1200} rot={2} /><Foreground t={t} /><Vignette /></>); } },
  { from: 40.2, Comp: ({ t }) => ( // Ref: "Sorry… whose octopus is this?"
    <><Cam t={t} keys={[[40.2, 1.0, 0, 0, 0], [42.2, 1.1, 0, 80, 0]]}><Arena t={t} spot={[540, 900]} />
      <Actor who="ref" t={t} size={620} x={230} y={560} mood="sad" arms={[-60, 60, 60, 60]} headTilt={18} />
      <div style={{ position: "absolute", left: 380, top: 1080 }}><Octopus t={t} size={260} /></div>
    </Cam><Vignette /></>) },
  { from: 42.2, Comp: ({ t }) => <><Cam t={t} keys={[[42.2, 1.0, 0, 0, 0], [44.5, 1.08, 0, 0, 0]]}><Arena t={t} cheer={0.6} /><Actor who="rookie" t={t} size={620} x={230} y={560} mood="happy" pose="wave" hold={Fish} skate={t * 3} /></Cam><Vignette /></> },
  { from: 44.5, Comp: ({ t }) => <><Cam t={t} keys={[[44.5, 1.0, 0, 0, 0], [46.0, 1.0, 0, 0, 0], [46.25, 1.15, 0, 0, 0], [47.05, 1.18, 0, 0, 0]]}><Arena t={t} /><Close who="walt" t={t} mood="smug" pose="crossed" headTilt={-6} /></Cam><Vignette /></> },
  { from: 47.05, Comp: ({ t }) => { // octopus slides into Walt's crease; new best friend
    const k = interpolate(t, [47.05, 48.4], [0, 1], soft);
    return (<><Cam t={t} keys={[[47.05, 1.0, 0, 0, 0], [END, 1.16, 0, 60, 0]]}><Arena t={t} jumbo="NEW TEAMMATE?" spot={[540, 1000]} />
      <Net x={180} y={940} />
      <Actor who="walt" t={t} size={480} x={200} y={700} mood="happy" arms={kf(t, [[47.05, [-78, -30, 78, -30]], [48.6, [-78, -30, 150, 20]], [49.2, [-78, -30, 150, 0]], [49.6, [-78, -30, 150, 20]]]) as A4} />
      <div style={{ position: "absolute", left: interpolate(k, [0, 1], [1100, 560]), top: 1100, transform: `rotate(${(1 - k) * -40}deg)` }}><Octopus t={t} size={220} /></div>
      {t > 48.6 && <div style={{ position: "absolute", left: 640, top: 960, fontSize: 70, zIndex: 6 }}>💜</div>}
    </Cam><Vignette /></>); } },
];
const RANGES = SHOTS.map((s, i) => ({ ...s, to: SHOTS[i + 1]?.from ?? END }));

const CHUNKS = (() => { const out: Wd[][] = []; let cur: Wd[] = []; WORDS.forEach((w, i) => { cur.push(w); const n = WORDS[i + 1]; if (!n || n.segment !== w.segment || cur.length >= 3 || /[.?!,]$/.test(w.word)) { out.push(cur); cur = []; } }); return out; })();
const Captions: React.FC<{ t: number }> = ({ t }) => {
  const i = CHUNKS.findIndex((c, k) => t >= c[0].start - 0.05 && t < (CHUNKS[k + 1]?.[0].start ?? 999) - 0.05);
  if (i < 0) return null; const c = CHUNKS[i]; if (t > c[c.length - 1].end + 0.5) return null;
  const narr = c[0].segment[0] === "n";
  return (
    <div style={{ position: "absolute", left: 60, right: 170, top: 1420, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: narr ? 76 : 92, lineHeight: 1.05, textTransform: "uppercase", transform: `scale(${interpolate(t, [c[0].start - 0.05, c[0].start + 0.07], [0.85, 1], clamp)})`, fontStyle: narr ? "italic" : "normal", zIndex: 9 }}>
      {c.map((w, k) => { const on = t >= w.start && t <= w.end + 0.05; return <span key={k} style={{ display: "inline-block", margin: "0 14px", color: on ? "#fde047" : "#fff", WebkitTextStroke: "11px #111", paintOrder: "stroke fill", transform: on ? "scale(1.1) rotate(-2deg)" : undefined }}>{w.display.replace(/^\.\.\./, "…")}</span>; })}
    </div>
  );
};
const Outro5: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: interpolate(f, [0, 12], [0, 1], clamp) }}><Arena t={f / FPS} cheer={0.5} /><AbsoluteFill style={{ background: "#0b1220bb" }} />
      <div style={{ position: "absolute", top: 330, left: 0, right: 0 }}><Logo scale={0.8} /></div>
      <div style={{ position: "absolute", top: 640, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontStyle: "italic", fontSize: 84, color: "#fde047", WebkitTextStroke: "8px #111", paintOrder: "stroke fill" }}>WILDEST MOMENTS</div>
      <div style={{ position: "absolute", top: 760, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 50, color: "#fff" }}>Follow for #7 👀</div>
      {(["rookie", "ref", "gus", "walt"] as StickWho[]).map((w, i) => <div key={w} style={{ position: "absolute", left: 20 + i * 255, top: 960 + Math.abs(Math.sin(f / 8 + i)) * -20 }}><StickPerson who={w} size={250} mood="happy" pose={w === "walt" ? "crossed" : "wave"} seed={i} /></div>)}
      <Sequence from={4}><Audio src={staticFile("brand/outro_vo.mp3")} /></Sequence>
    </AbsoluteFill>
  );
};

export const Wild06HL: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS - INTRO;
  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: "#0b1220", overflow: "hidden" }}>
      <Sequence from={F(INTRO)}><Audio src={staticFile("ep/wild06.mp3")} /></Sequence>
      <Audio src={staticFile("music_happy.mp3")} volume={(fr) => (fr < F(INTRO + END) ? 0.28 : 0.45)} />
      {RANGES.map((s) => { const C = s.Comp; return <Sequence key={s.from} from={F(INTRO + s.from)} durationInFrames={F(INTRO + s.to) - F(INTRO + s.from)}><AbsoluteFill style={{ overflow: "hidden" }}><C t={t} /></AbsoluteFill></Sequence>; })}
      {RANGES.slice(1).map((s) => <Sequence key={`w${s.from}`} from={F(INTRO + s.from)} durationInFrames={20}><Audio src={staticFile([6.5, 20.15, 32.8].includes(s.from) ? "whoosh.wav" : "pop.wav")} volume={0.22} /></Sequence>)}
      {[11.23, 11.98, 12.63, 13.25, 14.08, 23.5].map((g) => <Sequence key={`h${g}`} from={F(INTRO + g)} durationInFrames={F(1.5)}><Audio src={staticFile("sfx/horn.wav")} volume={0.22} /></Sequence>)}
      {t >= 0 && t < END && <Captions t={t} />}
      {t >= 0 && t < END && <div style={{ position: "absolute", left: 52, top: 140, padding: "4px 12px", background: "#fde047", color: "#111", fontWeight: 900, fontSize: 22, letterSpacing: 2, zIndex: 8 }}>ZAM · WILDEST MOMENTS #6</div>}
      <Sequence from={0} durationInFrames={F(INTRO) + 2}><IntroHL title="DAILY FACTS · WILDEST MOMENTS #6" /></Sequence>
      <Sequence from={F(INTRO + END)}><Outro5 /></Sequence>
    </AbsoluteFill>
  );
};
void random;
