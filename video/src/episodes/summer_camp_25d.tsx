/** ZAM Special (2.5D house style) – "ZAM Summer Camp" remake. Fact: Dylan Larkin's 13.172 s All-Star Fastest Skater
 *  lap (2016) beat Mike Gartner's 13.386 s (1996). Octopus hidden in a tent, as a lake float, and frozen in the ice. */
import React from "react";
import { AbsoluteFill, Audio, Easing, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import words from "../data/camp2_words.json";
import { HAND, clamp } from "../presenter/kit";
import { FONT } from "../theme";
import { Mascot, mouthOpen, type Mood, type Who } from "../mascots/Gang";
import { Cut, SplitDepth, dframe, dlerp, type DCam } from "../hl3d/Diorama";
import { CampDiorama, Octo } from "../hl3d/Camp";
import { FPS } from "../zam/Episode";
import { Pow } from "../zam/toon";
import { Intro2, Outro2 } from "./cup_pilot_25d";

type Wd = { word: string; display: string; start: number; end: number; segment: string };
const WORDS = words as Wd[];
const LAST = WORDS[WORDS.length - 1].end;
const INTRO = 2.9, END = LAST + 0.7, OUTRO = 3.0;
const F = (s: number) => Math.round(s * FPS);
export const CAMP25_FRAMES = F(INTRO + END + OUTRO);
const soft = { ...clamp, easing: Easing.inOut(Easing.sin) };
const back = { ...clamp, easing: Easing.out(Easing.back(1.8)) };
const WHO: Record<string, Who> = { p: "pucky", h: "helmy", z: "zam", b: "biscuit", c: "clubby", a: "agenty" };
const talk = (who: Who, t: number) => { const ws = WORDS.filter((w) => WHO[w.segment[0]] === who); return ws.some((w) => t >= w.start - 0.05 && t <= w.end + 0.05) ? mouthOpen(ws, t) : 0; };
const bump = (who: Who, t: number) => { const w = WORDS.find((x) => t >= x.start && t <= x.end && WHO[x.segment[0]] === who); return w ? Math.max(0, 1 - (t - w.start) * 5) : 0; };
const camAt = (t: number, t0: number, t1: number, a: DCam, b: DCam) => dlerp(a, b, interpolate(t, [t0, t1], [0, 1], soft));

const G: React.FC<{ who: Who; t: number; cam: DCam; x: number; z: number; size: number; mood: Mood; y?: number; flip?: boolean; lookAt?: number; tilt?: number; children?: React.ReactNode }> = (p) => {
  const o = talk(p.who, p.t); const b = bump(p.who, p.t);
  return (
    <Cut x={p.x} z={p.z} y={(p.y ?? 0) - b * 22} cam={p.cam} size={p.size} toon tilt={p.tilt}>
      <div style={{ position: "relative" }}><Mascot who={p.who} size={p.size} mood={p.mood} open={o} talking={o > 0} noSticker flip={p.flip} lookAt={p.lookAt} seed={`sc${p.who}`} />{p.children}</div>
    </Cut>
  );
};
const Barbell: React.FC<{ w?: number; heavy?: boolean }> = ({ w = 300, heavy }) => (
  <svg width={w} height={w * 0.4} viewBox="0 0 300 120"><rect x={20} y={54} width={260} height={12} rx={6} fill="#94a3b8" stroke="#2b2622" strokeWidth={4} />{[0, 1].map((s) => <g key={s}>{[0, 1, ...(heavy ? [2, 3] : [])].map((k) => <rect key={k} x={s ? 236 - k * 18 : 46 + k * 18} y={heavy ? 10 : 24} width={16} height={heavy ? 100 : 72} rx={4} fill={["#111", "#dc2626", "#2563eb", "#facc15"][k]} stroke="#2b2622" strokeWidth={3} />)}</g>)}{heavy && <text x={150} y={40} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={22} fill="#111">9000 KG</text>}</svg>
);
const Feather: React.FC = () => <svg width={80} height={160} viewBox="0 0 80 160"><path d="M40 150 Q30 80 60 10 Q80 60 50 120 Z" fill="#fff" stroke="#2b2622" strokeWidth={4} /><path d="M40 150 L58 20" stroke="#2b2622" strokeWidth={3} /></svg>;
const Stopwatch: React.FC<{ t: number }> = ({ t }) => <svg width={120} height={140} viewBox="0 0 120 140"><rect x={50} y={0} width={20} height={16} fill="#94a3b8" stroke="#2b2622" strokeWidth={3} /><circle cx={60} cy={78} r={56} fill="#f8fafc" stroke="#2b2622" strokeWidth={6} /><path d={`M60 78 L${60 + Math.sin(t * 6) * 40} ${78 - Math.cos(t * 6) * 40}`} stroke="#dc2626" strokeWidth={5} strokeLinecap="round" /></svg>;
const Flashback: React.FC<{ t: number; at: number; year: string; children: React.ReactNode }> = ({ t, at, year, children }) => {
  const k = interpolate(t, [at, at + 0.35], [0, 1], back);
  return (
    <div style={{ position: "absolute", left: 110, top: 380, width: 860, height: 700, transform: `rotate(${-3 + (1 - k) * 20}deg) scale(${k})`, zIndex: 7, background: "#f3e7c9", padding: 24, boxSizing: "border-box", boxShadow: "0 30px 60px #000a", border: "4px solid #2b2622" }}>
      <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", filter: "sepia(0.7)", border: "4px solid #2b2622", background: "#e0f2fe" }}>{children}</div>
      <div style={{ position: "absolute", right: -30, top: -40, background: "#ef4444", color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 64, padding: "4px 22px", transform: "rotate(8deg)", border: "5px solid #2b2622" }}>{year}</div>
      <div style={{ position: "absolute", left: 24, bottom: -4, fontFamily: HAND, fontSize: 32, color: "#5b4636" }}>true story · source: NHL.com</div>
    </div>
  );
};
/** All-Star fastest-lap flashback: a generic skater whizzing around a rink, timer running. */
const LapScene: React.FC<{ t: number; t0: number; time: string; label: string }> = ({ t, t0, time, label }) => {
  const a = (t - t0) * 2.4;
  return (
    <div style={{ position: "absolute", inset: 0, background: "#f0f9ff" }}>
      <div style={{ position: "absolute", left: 60, top: 120, width: 700, height: 380, borderRadius: 190, border: "10px solid #1e3a8a" }} />
      <div style={{ position: "absolute", left: 405, top: 120, width: 6, height: 380, background: "#ef4444" }} />
      <div style={{ position: "absolute", left: 380 + Math.cos(a) * 300, top: 280 + Math.sin(a) * 160, width: 50, height: 50, borderRadius: 25, background: "#1f2937", border: "5px solid #111" }} />
      {[1, 2, 3].map((k) => <div key={k} style={{ position: "absolute", left: 395 + Math.cos(a - k * 0.18) * 300, top: 295 + Math.sin(a - k * 0.18) * 160, width: 20, height: 20, borderRadius: 10, background: "#1f2937", opacity: 0.5 - k * 0.12 }} />)}
      <div style={{ position: "absolute", left: 0, right: 0, top: 540, textAlign: "center", fontFamily: "'Courier New', monospace", fontWeight: 900, fontSize: 90, color: "#111" }}>{time}</div>
      <div style={{ position: "absolute", left: 30, top: 30, fontFamily: HAND, fontSize: 46, color: "#1e3a8a" }}>{label}</div>
    </div>
  );
};

// ------------------------------------------------------------------ shots (news time)
type Shot = { from: number; Comp: React.FC<{ t: number }> };
const W = (t: number) => t; // readability
const SHOTS: Shot[] = [
  { from: 0, Comp: ({ t }) => { const cam = camAt(t, 0, 2.2, dframe(0, -900, -700, 2600, 1100, { rx: -16 }), dframe(0, -330, -600, 1300, 860, { rx: -4 })); const k = interpolate(t, [0, 1.6], [0, 1], back);
    return <CampDiorama cam={cam} t={W(t)}><G who="zam" t={t} cam={cam} x={-900 + k * 900} z={-600} size={400} mood="laugh" /><G who="biscuit" t={t} cam={cam} x={560} z={-850} size={330} mood="sweat" /></CampDiorama>; } },
  { from: 2.2, Comp: ({ t }) => { const cam = camAt(t, 2.2, 4.9, dframe(0, -280, -800, 740, 790), dframe(0, -280, -800, 600, 780));
    return <CampDiorama cam={cam} t={t}><G who="biscuit" t={t} cam={cam} x={0} z={-800} size={430} mood={t > 3.4 ? "angry" : "sweat"} /></CampDiorama>; } },
  { from: 4.9, Comp: ({ t }) => { // race: Pucky zooms off and breaks out over the top bar
    const cam = dframe(0, -320, -500, 1300, 850, { ry: 6 }); const k = interpolate(t, [6.9, 7.8], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
    return <SplitDepth over={k > 0 ? <div style={{ position: "absolute", left: 300 + k * 700, top: 900 - k * 760, transform: `rotate(${k * 30}deg) scale(${1 + k})` }}><Mascot who="pucky" size={300} mood="laugh" noSticker seed="scz" />{[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: -120 - i * 30, top: 120 + i * 40, width: 160, height: 12, borderRadius: 6, background: "#fff" }} />)}</div> : null}>
      <CampDiorama cam={cam} t={t}>{k === 0 && <G who="pucky" t={t} cam={cam} x={-160} z={-500} size={360} mood="smug" />}<G who="biscuit" t={t} cam={cam} x={260} z={-560} size={380} mood={k > 0 ? "tired" : "grumpy"} /></CampDiorama>
    </SplitDepth>; } },
  { from: 8.0, Comp: ({ t }) => { const cam = camAt(t, 8.0, 10.2, dframe(260, -280, -560, 700, 790), dframe(260, -280, -560, 560, 780));
    return <CampDiorama cam={cam} t={t}><G who="biscuit" t={t} cam={cam} x={260} z={-560} size={420} mood="tired" /></CampDiorama>; } },
  { from: 10.2, Comp: ({ t }) => { const cam = dframe(0, -330, -800, 1250, 860);
    return <><CampDiorama cam={cam} t={t} board={<div style={{ padding: 14, fontSize: 52, lineHeight: 1.05 }}>FASTEST LAP<br /><b>13.172 s</b><br /><span style={{ fontSize: 34 }}>Larkin · 2016</span></div>}><G who="helmy" t={t} cam={cam} x={-300} z={-800} size={340} mood="talk" /></CampDiorama><AbsoluteFill style={{ background: "#0007" }} /><Flashback t={t} at={10.4} year="2016"><LapScene t={t} t0={10.4} time={t > 14.6 ? "13.172 s" : `${Math.min(13.172, (t - 10.4) * 3.1).toFixed(3)} s`} label="All-Star Fastest Skater" /></Flashback></>; } },
  { from: 18.3, Comp: ({ t }) => { const cam = camAt(t, 18.3, 23.2, dframe(0, -300, -800, 760, 800, { ry: 6 }), dframe(0, -300, -800, 620, 790, { ry: 6 }));
    return <><CampDiorama cam={cam} t={t}><G who="clubby" t={t} cam={cam} x={0} z={-800} size={430} mood={t > 20 ? "proud" : "angry"} /></CampDiorama>
      {t > 20.2 && <div style={{ position: "absolute", left: 600, top: 340, transform: `rotate(6deg) scale(${interpolate(t, [20.2, 20.5], [0.4, 1], back)})`, background: "#f3e7c9", border: "5px solid #2b2622", padding: "10px 20px", fontFamily: FONT, fontWeight: 900, fontSize: 40, color: "#2b2622", zIndex: 6, filter: "sepia(0.4)" }}>1996 · Gartner<br /><span style={{ fontSize: 56 }}>13.386 s</span></div>}</>; } },
  { from: 23.2, Comp: ({ t }) => { const cam = camAt(t, 23.2, 25.0, dframe(0, -280, -800, 640, 780), dframe(0, -280, -800, 540, 770));
    return <CampDiorama cam={cam} t={t} board={<div style={{ padding: 14, fontSize: 48, lineHeight: 1.1 }}>13.172 &lt; 13.386<br /><span style={{ color: "#fde047" }}>(faster!)</span></div>}><G who="helmy" t={t} cam={cam} x={0} z={-800} size={430} mood="smug" /></CampDiorama>; } },
  { from: 25.0, Comp: ({ t }) => { const cam = camAt(t, 25.0, 26.5, dframe(0, -300, -800, 620, 780, { rx: 6 }), dframe(0, -300, -800, 500, 760, { rx: 6 }));
    return <CampDiorama cam={cam} t={t}><G who="clubby" t={t} cam={cam} x={0} z={-800} size={430} mood="determined" /></CampDiorama>; } },
  { from: 26.5, Comp: ({ t }) => { // Agenty times Biscuit's crawl
    const cam = dframe(100, -320, -600, 1150, 850, { ry: -6 }); const x = interpolate(t, [26.5, 30.6], [200, 330]);
    return <CampDiorama cam={cam} t={t} board={<div style={{ padding: 14, fontSize: 46, lineHeight: 1.1 }}>BISCUIT:<br />ETA 2030</div>}><G who="agenty" t={t} cam={cam} x={-260} z={-600} size={360} mood="smug"><div style={{ position: "absolute", left: 220, top: 30 }}><Stopwatch t={t} /></div></G><G who="biscuit" t={t} cam={cam} x={x} z={-700} size={360} mood="tired" tilt={Math.sin(t * 3) * 3} /></CampDiorama>; } },
  { from: 30.6, Comp: ({ t }) => { // gym: Clubby lifts… CRACK
    const cam = camAt(t, 30.6, 34.0, dframe(-100, -320, -500, 900, 830, { ry: 10 }), dframe(-100, -320, -500, 760, 820, { ry: 10 })); const crack = t > 31.6;
    return <><CampDiorama cam={cam} t={t}><G who="clubby" t={t} cam={cam} x={-100} z={-500} size={420} mood={crack ? "sad" : "determined"} tilt={crack ? 32 : Math.sin(t * 20) * 2}><div style={{ position: "absolute", left: 60, top: crack ? 180 : -40, transform: `rotate(${crack ? 40 : 0}deg)` }}><Barbell w={300} /></div></G></CampDiorama>
      {crack && t < 32.6 && <Pow text="CRACK!" x={430} y={420} size={150} rot={-8} />}</>; } },
  { from: 34.0, Comp: ({ t }) => { const cam = camAt(t, 34.0, 35.4, dframe(0, -300, -600, 720, 790), dframe(0, -300, -600, 620, 780));
    return <CampDiorama cam={cam} t={t}><G who="pucky" t={t} cam={cam} x={0} z={-600} size={410} mood="proud"><div style={{ position: "absolute", left: 300, top: -40, transform: `rotate(${Math.sin(t * 3) * 10}deg)` }}><Feather /></div></G></CampDiorama>; } },
  { from: 35.4, Comp: ({ t }) => { // Biscuit lifts the 9000 kg barbell – breaks out over the top bar
    const cam = dframe(0, -300, -600, 900, 820); const up = interpolate(t, [35.4, 35.8], [0, 1], back);
    return <SplitDepth over={<div style={{ position: "absolute", left: 230, top: 760 - up * 400 }}><Barbell w={620} heavy /></div>}><CampDiorama cam={cam} t={t}><G who="biscuit" t={t} cam={cam} x={0} z={-600} size={430} mood="proud" /></CampDiorama></SplitDepth>; } },
  { from: 37.0, Comp: ({ t }) => { const cam = camAt(t, 37.0, 38.2, dframe(0, -300, -600, 660, 780), dframe(0, -300, -600, 540, 770));
    return <CampDiorama cam={cam} t={t}><G who="agenty" t={t} cam={cam} x={0} z={-600} size={420} mood="love" /></CampDiorama>; } },
  { from: 38.2, Comp: ({ t }) => { // to the lake
    const cam = camAt(t, 38.2, 40.9, dframe(0, -420, -800, 1500, 880, { rx: -8 }), dframe(-60, -380, -1000, 1300, 860, { rx: -6 })); const k = interpolate(t, [38.4, 40.8], [0, 1], soft);
    return <CampDiorama cam={cam} t={t}>{(["pucky", "biscuit", "clubby", "helmy"] as Who[]).map((w, i) => <G key={w} who={w} t={t} cam={cam} x={-500 + i * 300} z={-300 - k * 600 - (i % 2) * 80} size={280} mood={w === "biscuit" ? "sweat" : "laugh"} />)}</CampDiorama>; } },
  { from: 40.9, Comp: ({ t }) => { const cam = camAt(t, 40.9, 43.4, dframe(-150, -260, -900, 640, 780), dframe(-150, -260, -900, 520, 770)); const fr = t > 41.6 ? 1 : 0;
    return <CampDiorama cam={cam} t={t} frozen={fr}><G who="zam" t={t} cam={cam} x={-150} z={-900} size={420} mood={t > 41.6 ? "shock" : "laugh"} /></CampDiorama>; } },
  { from: 43.4, Comp: ({ t }) => { // Pucky dives… BONK on the frozen lake – bounces out over the bottom bar
    const cam = dframe(0, -360, -1200, 1250, 850, { rx: -6 }); const k = interpolate(t, [43.4, 43.75], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) }); const b2 = interpolate(t, [43.75, 44.5], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
    return <SplitDepth over={b2 > 0 ? <div style={{ position: "absolute", left: 420 + b2 * 200, top: 1100 + b2 * 300 - Math.sin(b2 * Math.PI) * 500, transform: `rotate(${b2 * 540}deg)` }}><Mascot who="pucky" size={260} mood="dizzy" noSticker seed="bonk" /></div> : null}>
      <CampDiorama cam={cam} t={t} frozen={1}>{b2 === 0 && <G who="pucky" t={t} cam={cam} x={0} z={-1200} y={-500 + k * 500} size={300} mood="laugh" />}</CampDiorama>
      {t > 43.75 && t < 44.6 && <Pow text="BONK!" x={340} y={520} size={170} rot={-6} />}
    </SplitDepth>; } },
  { from: 45.0, Comp: ({ t }) => { // Biscuit lounging on the ice
    const cam = camAt(t, 45.0, END, dframe(0, -260, -1200, 900, 820), dframe(0, -250, -1200, 700, 800));
    return <CampDiorama cam={cam} t={t} frozen={1} octo={false}><G who="biscuit" t={t} cam={cam} x={-60} z={-1200} size={430} mood="bliss" tilt={-12} /><Cut x={260} z={-1180} cam={cam} size={90} shadow={false} toon><div style={{ filter: "hue-rotate(0deg) brightness(1.1)", opacity: 0.85 }}><Octo t={0} s={90} /></div></Cut></CampDiorama>; } },
];
const RANGES = SHOTS.map((s, i) => ({ ...s, to: SHOTS[i + 1]?.from ?? END }));

const FACT: [number, number, string, string] = [11.0, 18.2, "13.172 s · FASTEST ALL-STAR LAP", "Dylan Larkin, 2016 – beat Mike Gartner's 13.386 s (1996)"];
const Fact: React.FC<{ t: number }> = ({ t }) => {
  if (t < FACT[0] || t > FACT[1]) return null;
  const k = interpolate(t, [FACT[0], FACT[0] + 0.25], [0, 1], back);
  return <div style={{ position: "absolute", left: 60, top: 1215, zIndex: 9, transform: `rotate(-2deg) scale(${k})`, transformOrigin: "0 50%", background: "#fbf6ea", border: "5px solid #2b2622", borderRadius: 6, padding: "8px 20px", boxShadow: "0 10px 0 #0006", maxWidth: 860 }}><div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 36, color: "#2b2622" }}>{FACT[2]}</div><div style={{ fontFamily: HAND, fontSize: 28, color: "#7a6f62" }}>{FACT[3]} · NHL.com</div></div>;
};
const CHUNKS = (() => { const out: Wd[][] = []; let cur: Wd[] = []; WORDS.forEach((w, i) => { cur.push(w); const n = WORDS[i + 1]; if (!n || n.segment !== w.segment || cur.length >= 3 || /[.?!,:]$/.test(w.word)) { out.push(cur); cur = []; } }); return out; })();
const Captions: React.FC<{ t: number }> = ({ t }) => {
  const i = CHUNKS.findIndex((c, k) => t >= c[0].start - 0.05 && t < (CHUNKS[k + 1]?.[0].start ?? 999) - 0.05);
  if (i < 0) return null; const c = CHUNKS[i]; if (t > c[c.length - 1].end + 0.5) return null;
  return (
    <div style={{ position: "absolute", left: 60, right: 170, top: 1440, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 96, lineHeight: 1.05, textTransform: "uppercase", transform: `scale(${interpolate(t, [c[0].start - 0.05, c[0].start + 0.07], [0.85, 1], clamp)})`, zIndex: 9 }}>
      {c.map((w, k) => { const on = t >= w.start && t <= w.end + 0.05; return <span key={k} style={{ display: "inline-block", margin: "0 14px", color: on ? "#fde047" : "#fff", WebkitTextStroke: "11px #111", paintOrder: "stroke fill", textShadow: "0 0 30px #ff2bd6aa", transform: on ? "scale(1.12) rotate(-2deg)" : undefined }}>{w.display.replace(/^\.\.\./, "…")}</span>; })}
    </div>
  );
};

export const SummerCamp25D: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS - INTRO;
  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: "#1e0b2e", overflow: "hidden" }}>
      <Sequence from={F(INTRO)}><Audio src={staticFile("ep/camp2.mp3")} /></Sequence>
      <Sequence from={F(INTRO)}><Audio src={staticFile("music_happy.mp3")} volume={(fr) => (fr < F(END) ? 0.24 : 0.4)} /></Sequence>
      {RANGES.map((s) => { const C = s.Comp; return <Sequence key={s.from} from={F(INTRO + s.from)} durationInFrames={F(INTRO + s.to) - F(INTRO + s.from)}><AbsoluteFill style={{ overflow: "hidden" }}><C t={t} /></AbsoluteFill></Sequence>; })}
      {RANGES.slice(1).map((s) => <Sequence key={`p${s.from}`} from={F(INTRO + s.from)} durationInFrames={20}><Audio src={staticFile([10.2, 30.6, 38.2].includes(s.from) ? "whoosh.wav" : "pop.wav")} volume={0.22} /></Sequence>)}
      {[31.6, 43.75].map((a) => <Sequence key={a} from={F(INTRO + a)} durationInFrames={F(0.6)}><Audio src={staticFile("sfx/shutter.mp3")} volume={0.6} /></Sequence>)}
      {t >= 0 && t < END && <Fact t={t} />}
      {t >= 0 && t < END && <Captions t={t} />}
      {t >= 0 && t < END && <div style={{ position: "absolute", left: 52, top: 140, padding: "4px 12px", background: "#ff2bd6", color: "#fff", fontWeight: 900, fontSize: 22, letterSpacing: 2, zIndex: 9 }}>ZAM · SUMMER CAMP</div>}
      <Sequence from={0} durationInFrames={F(INTRO) + 2}><Intro2 /></Sequence>
      <Sequence from={F(INTRO + END)}><Outro2 /></Sequence>
    </AbsoluteFill>
  );
};
