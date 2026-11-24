/** ZAM Special (2.5D, Gang 2.0) – "A Day at Work with Pucky – Behind the Scenes". Mock-doc with a chapter clock:
 *  6:00 FREEZER → 9:00 GLAM → 12:00 PRACTICE → 19:00 GAME → 23:00 BEDTIME. Facts: game pucks are kept frozen so they
 *  don't bounce; since 2019 NHL pucks have a coating that is purple when frozen; Chara's 108.8 mph shot (2012). */
import React from "react";
import { AbsoluteFill, Audio, Easing, Sequence, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import words from "../data/pbts_words.json";
import { HAND, clamp } from "../presenter/kit";
import { FONT } from "../theme";
import { mouthOpen } from "../mascots/Gang";
import type { StickMood, StickPose } from "../mascots/Stick";
import { GangPerson, type GangWho } from "../mascots/Hybrid";
import { Bill, LockerRoom3D, Rink3D, frame, lerpCam, type Camera } from "../hl3d/Set3D";
import { Logo } from "../zam/common";
import { FPS } from "../zam/Episode";
import { Pow } from "../zam/toon";
import { IntroHL } from "./hockey_life_ref";
import { Net } from "./hockey_life_01";

type Wd = { word: string; display: string; start: number; end: number; segment: string };
const WORDS = words as Wd[];
const LAST = WORDS[WORDS.length - 1].end;
const INTRO = 2.0, END = LAST + 0.6, OUTRO = 3.0;
const F = (s: number) => Math.round(s * FPS);
export const PBTS_FRAMES = F(INTRO + END + OUTRO);
const soft = { ...clamp, easing: Easing.inOut(Easing.sin) };
const WHO: Record<string, GangWho> = { p: "pucky", h: "helmy", a: "agenty", c: "clubby", z: "zam", b: "biscuit" };
const talk = (who: string, t: number) => { const ws = WORDS.filter((w) => WHO[w.segment[0]] === who); return ws.some((w) => t >= w.start - 0.05 && t <= w.end + 0.05) ? mouthOpen(ws, t) : 0; };
const bump = (who: string, t: number) => { const w = WORDS.find((x) => t >= x.start && t <= x.end && WHO[x.segment[0]] === who); return w ? Math.max(0, 1 - (t - w.start) * 5) : 0; };
const camAt = (t: number, t0: number, t1: number, a: Camera, b: Camera) => lerpCam(a, b, interpolate(t, [t0, t1], [0, 1], soft));

const G: React.FC<{ who: GangWho; t: number; cam: Camera; x: number; z: number; size: number; mood: StickMood; pose?: StickPose; y?: number; rot?: number; sitting?: boolean; arms?: [number, number, number, number]; filter?: string; light?: string; skate?: number; flip?: boolean }> = (p) => {
  const b = bump(p.who, p.t);
  return (
    <Bill x={p.x} z={p.z} y={(p.y ?? 0) - b * 14} cam={p.cam} w={p.size} h={p.size * 1.3} light={p.light}>
      <div style={{ transform: `rotate(${p.rot ?? 0}deg) scale(${1 + b * 0.03}, ${1 - b * 0.03})`, transformOrigin: "50% 100%", filter: p.filter }}>
        <GangPerson who={p.who} size={p.size} mood={p.mood} pose={p.pose} sitting={p.sitting} arms={p.arms} skate={p.skate} flip={p.flip} open={talk(p.who, p.t)} seed={p.who.length} />
      </div>
    </Bill>
  );
};
/** Freezer = locker room set + cold grade, frost, shelves of frozen pucks and a -10°C sign. */
const Freezer: React.FC<{ cam: Camera; t: number; children?: React.ReactNode }> = ({ cam, t, children }) => (
  <AbsoluteFill>
    <LockerRoom3D cam={cam} lamp={0.4}>
      <Bill x={0} z={-1240} y={-260} cam={cam} w={2000} h={700} shadow={false}>
        <div style={{ width: 2000, height: 700, background: "#cbd5e1", border: "10px solid #64748b", position: "relative" }}>
          {[0, 1, 2].map((r) => <div key={r} style={{ position: "absolute", left: 0, right: 0, top: 200 + r * 200, height: 14, background: "#94a3b8" }}>{[...Array(18)].map((_, i) => <div key={i} style={{ position: "absolute", left: 30 + i * 108, top: -60, width: 90, height: 56, borderRadius: "50%", background: "#111", borderTop: "10px solid #e0f2fe" }} />)}</div>)}
          <div style={{ position: "absolute", left: 760, top: 30, width: 480, height: 110, background: "#0f172a", border: "6px solid #38bdf8", color: "#7dd3fc", fontFamily: FONT, fontWeight: 900, fontSize: 64, textAlign: "center", lineHeight: "98px", textShadow: "0 0 18px #38bdf8" }}>FREEZER · −10°C</div>
        </div>
      </Bill>
      {children}
    </LockerRoom3D>
    <AbsoluteFill style={{ background: "#93c5fd", mixBlendMode: "multiply", opacity: 0.55, pointerEvents: "none" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 50%, #e0f2fecc 100%)", pointerEvents: "none" }} />
    {[...Array(26)].map((_, i) => <div key={i} style={{ position: "absolute", left: random(`sn${i}`) * 1080, top: ((t * (40 + random(`sv${i}`) * 60) + random(`sy${i}`) * 1900) % 1920), width: 10, height: 10, borderRadius: 5, background: "#fff", opacity: 0.8, pointerEvents: "none" }} />)}
  </AbsoluteFill>
);
const Vanity: React.FC = () => (
  <div style={{ width: 760, height: 560, background: "#1f2937", border: "14px solid #f8fafc", borderRadius: 18, position: "relative", boxShadow: "0 0 60px #fde68a55" }}>
    <div style={{ position: "absolute", inset: 30, background: "linear-gradient(135deg,#94a3b8,#e2e8f0 40%,#94a3b8)", opacity: 0.7 }} />
    {[...Array(14)].map((_, i) => { const side = i < 7; const k = i % 7; return <div key={i} style={{ position: "absolute", left: side ? -10 + (k < 4 ? 0 : 0) : 740, top: 30 + k * 76, width: 34, height: 34, borderRadius: 17, background: "#fef3c7", boxShadow: "0 0 26px #fde68a", transform: "translateX(-12px)" }} />; })}
    <div style={{ position: "absolute", left: 230, top: -60, background: "#7c3aed", color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 40, padding: "6px 20px", borderRadius: 8 }}>PUCKY ★ STAR</div>
  </div>
);
const Birds: React.FC<{ t: number }> = ({ t }) => (
  <svg width={360} height={140} viewBox="-180 -70 360 140">{[0, 1, 2].map((i) => { const a = t * 4 + (i * Math.PI * 2) / 3; const x = Math.cos(a) * 140, y = Math.sin(a) * 36; return <path key={i} d={`M${x - 22} ${y} Q${x - 10} ${y - 16} ${x} ${y} Q${x + 10} ${y - 16} ${x + 22} ${y}`} stroke="#111" strokeWidth={6} fill="none" />; })}</svg>
);
const Chapter: React.FC<{ t: number }> = ({ t }) => {
  const C: [number, string, string][] = [[3.9, "6:00", "FREEZER"], [14.5, "9:00", "GLAM"], [23.0, "12:00", "PRACTICE"], [30.9, "19:00", "GAME"], [39.3, "23:00", "BEDTIME"]];
  const c = [...C].reverse().find(([a]) => t >= a);
  if (!c) return null;
  const pop = interpolate(t, [c[0], c[0] + 0.25], [1.4, 1], clamp);
  return <div style={{ position: "absolute", left: 52, top: 190, zIndex: 9, transform: `scale(${pop})`, transformOrigin: "0 0", display: "flex", gap: 10, alignItems: "center" }}><div style={{ background: "#111", color: "#fde047", fontFamily: "'Courier New', monospace", fontWeight: 900, fontSize: 52, padding: "4px 16px", borderRadius: 10, border: "4px solid #fde047" }}>{c[1]}</div><div style={{ background: "#fbf6ea", color: "#2b2622", fontFamily: FONT, fontWeight: 900, fontSize: 40, padding: "6px 16px", borderRadius: 8, border: "4px solid #2b2622", transform: "rotate(-2deg)" }}>{c[2]}</div></div>;
};
const Fact: React.FC<{ t: number; at: number; until: number; title: string; sub: string }> = ({ t, at, until, title, sub }) => {
  if (t < at || t > until) return null;
  const k = interpolate(t, [at, at + 0.25], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  return <div style={{ position: "absolute", left: 60, top: 1180, zIndex: 9, transform: `rotate(-2deg) scale(${k})`, transformOrigin: "0 50%", background: "#fbf6ea", border: "5px solid #2b2622", borderRadius: 6, padding: "10px 22px", boxShadow: "0 10px 0 #0005", maxWidth: 820 }}><div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: "#2b2622" }}>{title}</div><div style={{ fontFamily: HAND, fontSize: 30, color: "#7a6f62" }}>{sub}</div></div>;
};

// ------------------------------------------------------------------ shots
type Shot = { from: number; Comp: React.FC<{ t: number }> };
const SHOTS: Shot[] = [
  { from: 0, Comp: ({ t }) => { const cam = camAt(t, 0, 3.8, frame(0, -560, -700, 760, 760), frame(0, -560, -700, 640, 740));
    return <Rink3D cam={{ ...cam, focus: -700 }} t={t} cheer={0.3}><G who="pucky" t={t} cam={cam} x={0} z={-700} size={560} mood="smug" pose="point" /></Rink3D>; } },
  { from: 3.9, Comp: ({ t }) => { const cam = camAt(t, 3.9, 8.8, frame(0, -440, -800, 1200, 860, { rx: -4 }), frame(0, -460, -800, 900, 840)); const wake = t > 4.6;
    return <Freezer cam={cam} t={t}><G who="pucky" t={t} cam={cam} x={0} z={-800} size={560} mood={wake ? "grumpy" : "sad"} pose={wake ? "idle" : "crossed"} sitting={!wake} filter="brightness(1.05) saturate(0.8)" /></Freezer>; } },
  { from: 8.8, Comp: ({ t }) => { const cam = camAt(t, 8.8, 12.6, frame(300, -500, -760, 760, 760, { ry: 8 }), frame(300, -500, -760, 680, 760, { ry: 8 }));
    return <Freezer cam={cam} t={t}><G who="helmy" t={t} cam={cam} x={300} z={-760} size={560} mood="talk" pose="point" /></Freezer>; } },
  { from: 12.6, Comp: ({ t }) => { const cam = camAt(t, 12.6, 14.5, frame(0, -440, -760, 620, 740), frame(0, -440, -760, 520, 720));
    return <Freezer cam={cam} t={t}><G who="pucky" t={t} cam={cam} x={0} z={-760} size={560} mood="smug" arms={[-120, -60, 120, -60]} /></Freezer>; } },
  { from: 14.5, Comp: ({ t }) => { const cam = camAt(t, 14.5, 17.8, frame(150, -520, -900, 1250, 820, { ry: -8 }), frame(150, -540, -900, 1050, 820, { ry: -8 }));
    return <LockerRoom3D cam={cam} lamp={1.3}><Bill x={0} z={-1240} y={-300} cam={cam} w={760} h={560} shadow={false}><Vanity /></Bill>
      <G who="pucky" t={t} cam={cam} x={-120} z={-900} size={540} mood="happy" sitting light="#fde68a" />
      <G who="agenty" t={t} cam={cam} x={360} z={-860} size={560} mood="smug" arms={[-78, -30, -40 + Math.sin(t * 10) * 40, -220]} /></LockerRoom3D>; } },
  { from: 17.8, Comp: ({ t }) => { const cam = frame(-250, -500, -800, 760, 760, { ry: -8 });
    return <LockerRoom3D cam={cam} lamp={1.3}><Bill x={0} z={-1240} y={-300} cam={cam} w={760} h={560} shadow={false}><Vanity /></Bill><G who="helmy" t={t} cam={cam} x={-250} z={-800} size={560} mood="talk" pose="point" /></LockerRoom3D>; } },
  { from: 21.3, Comp: ({ t }) => { const cam = camAt(t, 21.3, 23.0, frame(-120, -430, -900, 620, 740), frame(-120, -430, -900, 540, 720)); const purple = interpolate(t, [20.4, 21.4], [0, 1], clamp);
    return <LockerRoom3D cam={cam} lamp={1.3}><Bill x={0} z={-1240} y={-300} cam={cam} w={760} h={560} shadow={false}><Vanity /></Bill>
      <G who="pucky" t={t} cam={cam} x={-120} z={-900} size={540} mood="smug" sitting filter={`sepia(${purple}) hue-rotate(${purple * 220}deg) saturate(${1 + purple * 2})`} light="#a855f7" /></LockerRoom3D>; } },
  { from: 23.0, Comp: ({ t }) => { // Clubby slapshot – Pucky launched
    const cam = camAt(t, 23.0, 25.9, frame(-200, -520, -900, 1300, 820, { ry: 10 }), frame(-200, -520, -900, 1100, 820, { ry: 12 }));
    const k = interpolate(t, [25.3, 25.9], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
    return <><Rink3D cam={cam} t={t} cheer={0.4}><G who="clubby" t={t} cam={cam} x={-420} z={-900} size={580} mood="grumpy" arms={t < 25.2 ? [-150, -230, 60, -240] : [-78, -30, 200, 60]} />
      <G who="pucky" t={t} cam={cam} x={60 + k * 1600} z={-900 - k * 400} y={-k * 500} rot={k * 720} size={420} mood="shock" pose="up" /></Rink3D>
      {t > 25.3 && <Pow text="WHACK!" x={260} y={420} size={150} rot={-8} />}</>; } },
  { from: 25.9, Comp: ({ t }) => { // Pucky dizzy with birds: "108.8 mph… I still hear birds."
    const cam = camAt(t, 25.9, 30.9, frame(0, -440, -800, 700, 740, { rx: 4 }), frame(0, -440, -800, 560, 720, { rx: 4 }));
    return <><Rink3D cam={cam} t={t} cheer={0.3}><G who="pucky" t={t} cam={cam} x={0} z={-800} size={560} mood="shock" rot={Math.sin(t * 6) * 6} arms={[-140, -120, 140, -120]} />
      <Bill x={0} z={-760} y={-610} cam={cam} w={360} h={140} shadow={false}><Birds t={t} /></Bill></Rink3D>
      <Fact t={t} at={26.7} until={30.8} title="108.8 MPH" sub="hardest shot ever recorded · Zdeno Chara, 2012 All-Star Skills" /></>; } },
  { from: 30.9, Comp: ({ t }) => { // goal: Pucky in the net, Zam cheers
    const cam = camAt(t, 30.9, 32.9, frame(100, -480, -1350, 1500, 820), frame(100, -480, -1350, 1250, 820)); const goal = t > 31.1;
    return <><Rink3D cam={cam} t={t} cheer={goal ? 1 : 0.3}><Bill x={-200} z={-1560} cam={cam} w={620} h={400} shadow={false}><Net x={30} y={20} /></Bill>
      <G who="pucky" t={t} cam={cam} x={-200} z={-1500} size={340} mood="sad" sitting />
      <G who="zam" t={t} cam={cam} x={420} z={-1100} size={560} mood="happy" pose="up" /></Rink3D>
      {goal && <AbsoluteFill style={{ background: "radial-gradient(circle at 30% 30%, #ef444466, transparent 60%)", pointerEvents: "none" }} />}
      {goal && t < 32.6 && <Pow text="GOAL!" x={120} y={420} size={160} rot={-6} />}</>; } },
  { from: 32.9, Comp: ({ t }) => { const cam = camAt(t, 32.9, 35.9, frame(0, -440, -800, 620, 740), frame(0, -440, -800, 520, 720));
    return <Rink3D cam={cam} t={t} cheer={0.6}><G who="pucky" t={t} cam={cam} x={0} z={-800} size={560} mood="grumpy" pose="crossed" /></Rink3D>; } },
  { from: 35.9, Comp: ({ t }) => { // Biscuit save: "Nothing personal." / "It's ALWAYS personal."
    const cam = camAt(t, 35.9, 39.3, frame(0, -520, -1350, 1300, 820), frame(0, -520, -1350, 1150, 820));
    const k = interpolate(t, [35.95, 36.6], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
    return <><Rink3D cam={cam} t={t} cheer={0.8}><Bill x={0} z={-1580} cam={cam} w={620} h={400} shadow={false}><Net x={30} y={20} /></Bill>
      <G who="biscuit" t={t} cam={cam} x={0} z={-1460} size={600} mood="smug" pose={t < 36.6 ? "up" : "crossed"} />
      <G who="pucky" t={t} cam={cam} x={-80 - k * 520} z={-1300 + k * 300} y={-Math.sin(k * Math.PI) * 300} rot={-k * 540} size={360} mood={t > 37.4 ? "grumpy" : "shock"} /></Rink3D>
      {t > 35.95 && t < 36.8 && <Pow text="DENIED!" x={500} y={420} size={140} rot={8} />}</>; } },
  { from: 39.3, Comp: ({ t }) => { // bedtime: Zam tucks Pucky into the freezer
    const cam = camAt(t, 39.3, END, frame(-100, -440, -800, 1150, 840), frame(-100, -440, -800, 820, 800));
    const door = interpolate(t, [42.5, 43.2], [0, 1], soft);
    return <><Freezer cam={cam} t={t}><G who="pucky" t={t} cam={cam} x={-240} z={-820} size={520} mood={t > 42 ? "smug" : "happy"} sitting />
      <G who="zam" t={t} cam={cam} x={260} z={-760} size={540} mood="happy" pose="wave" /></Freezer>
      {door > 0 && <div style={{ position: "absolute", left: 0, top: 0, width: 1080 * door, height: 1920, background: "linear-gradient(90deg,#94a3b8,#cbd5e1)", borderRight: "18px solid #475569", zIndex: 6, overflow: "hidden" }}><div style={{ position: "absolute", right: 120, top: 560, width: 520, background: "#fbf6ea", border: "6px solid #2b2622", borderRadius: 8, padding: "16px 20px", transform: "rotate(-4deg)", fontFamily: FONT, fontWeight: 900, fontSize: 52, color: "#2b2622", textAlign: "center" }}>DO NOT DISTURB<div style={{ fontFamily: HAND, fontSize: 40, color: "#b4483b" }}>Pucky is chilling ❄</div></div></div>}</>; } },
];
const RANGES = SHOTS.map((s, i) => ({ ...s, to: SHOTS[i + 1]?.from ?? END }));

const CHUNKS = (() => { const out: Wd[][] = []; let cur: Wd[] = []; WORDS.forEach((w, i) => { cur.push(w); const n = WORDS[i + 1]; if (!n || n.segment !== w.segment || cur.length >= 3 || /[.?!,]$/.test(w.word)) { out.push(cur); cur = []; } }); return out; })();
const Captions: React.FC<{ t: number }> = ({ t }) => {
  const i = CHUNKS.findIndex((c, k) => t >= c[0].start - 0.05 && t < (CHUNKS[k + 1]?.[0].start ?? 999) - 0.05);
  if (i < 0) return null; const c = CHUNKS[i]; if (t > c[c.length - 1].end + 0.5) return null;
  return (
    <div style={{ position: "absolute", left: 60, right: 170, top: 1420, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 94, lineHeight: 1.05, textTransform: "uppercase", transform: `scale(${interpolate(t, [c[0].start - 0.05, c[0].start + 0.07], [0.85, 1], clamp)})`, zIndex: 9 }}>
      {c.map((w, k) => { const on = t >= w.start && t <= w.end + 0.05; return <span key={k} style={{ display: "inline-block", margin: "0 14px", color: on ? "#fde047" : "#fff", WebkitTextStroke: "11px #111", paintOrder: "stroke fill", textShadow: "0 8px 18px #0008", transform: on ? "scale(1.1) rotate(-2deg)" : undefined }}>{w.display}</span>; })}
    </div>
  );
};
const OutroB: React.FC = () => {
  const f = useCurrentFrame();
  const cam = frame(0, -520, -850, 1700, 860, { ry: Math.sin(f / 60) * 4 });
  const gang: GangWho[] = ["clubby", "helmy", "pucky", "biscuit", "zam", "agenty"];
  return (
    <AbsoluteFill style={{ opacity: interpolate(f, [0, 12], [0, 1], clamp) }}>
      <LockerRoom3D cam={cam}>{gang.map((w, i) => <Bill key={w} x={-830 + i * 330} z={-900 - (i % 2) * 100} cam={cam} w={340} h={442}><GangPerson who={w} size={340} mood="happy" pose="wave" seed={i} /></Bill>)}</LockerRoom3D>
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#0b1220dd,#0b122000 40%,#0b122000 70%,#0b1220dd)" }} />
      <div style={{ position: "absolute", top: 160, left: 0, right: 0 }}><Logo scale={0.75} /></div>
      <div style={{ position: "absolute", top: 450, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontStyle: "italic", fontSize: 84, color: "#fde047", WebkitTextStroke: "8px #111", paintOrder: "stroke fill" }}>BEHIND THE SCENES</div>
      <div style={{ position: "absolute", top: 1450, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 56, color: "#fff", WebkitTextStroke: "6px #111", paintOrder: "stroke fill" }}>Follow for more 👀</div>
      <Sequence from={4}><Audio src={staticFile("brand/outro_vo.mp3")} /></Sequence>
    </AbsoluteFill>
  );
};

export const PuckyBTS25D: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS - INTRO;
  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: "#0b1220", overflow: "hidden" }}>
      <Sequence from={F(INTRO)}><Audio src={staticFile("ep/pbts.mp3")} /></Sequence>
      <Audio src={staticFile("music_happy.mp3")} volume={(fr) => (fr < F(INTRO + END) ? 0.26 : 0.42)} />
      {RANGES.map((s) => { const C = s.Comp; return <Sequence key={s.from} from={F(INTRO + s.from)} durationInFrames={F(INTRO + s.to) - F(INTRO + s.from)}><AbsoluteFill style={{ overflow: "hidden" }}><C t={t} /></AbsoluteFill></Sequence>; })}
      {RANGES.slice(1).map((s) => <Sequence key={`p${s.from}`} from={F(INTRO + s.from)} durationInFrames={20}><Audio src={staticFile([3.9, 14.5, 23.0, 30.9, 39.3].includes(s.from) ? "whoosh.wav" : "pop.wav")} volume={0.2} /></Sequence>)}
      {[31.1].map((g) => <Sequence key={g} from={F(INTRO + g)} durationInFrames={F(1.5)}><Audio src={staticFile("sfx/horn.wav")} volume={0.28} /></Sequence>)}
      <Sequence from={F(INTRO + 25.3)} durationInFrames={F(1)}><Audio src={staticFile("sfx/shutter.mp3")} volume={0.0} /></Sequence>
      {t >= 0 && t < END && <Chapter t={t} />}
      <Fact t={t} at={9.0} until={12.5} title="GAME PUCKS ARE KEPT FROZEN" sub="so they don't bounce · home team keeps them in a freezer" />
      <Fact t={t} at={18.0} until={21.2} title="SINCE 2019: PURPLE WHEN FROZEN" sub="NHL pucks got a colour-changing coating" />
      {t >= 0 && t < END && <Captions t={t} />}
      {t >= 0 && t < END && <div style={{ position: "absolute", left: 52, top: 140, padding: "4px 12px", background: "#fde047", color: "#111", fontWeight: 900, fontSize: 22, letterSpacing: 2, zIndex: 8 }}>ZAM · SPECIAL EDITION</div>}
      <Sequence from={0} durationInFrames={F(INTRO) + 2}><IntroHL title="SPECIAL · A DAY AT WORK WITH PUCKY" /></Sequence>
      <Sequence from={F(INTRO + END)}><OutroB /></Sequence>
    </AbsoluteFill>
  );
};
