/** ZAM (2.5D arena) – "Zam Becomes a Goalie". Fact: Feb 22, 2020 – both Carolina goalies hurt in Toronto; 42-year-old
 *  emergency backup David Ayres (an ice machine driver) made 8 saves, Carolina won 6–3; first emergency backup goalie to
 *  win an NHL game. Never say the trademark – "ice machine". */
import React from "react";
import { AbsoluteFill, Audio, Easing, Sequence, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import words from "../data/zgoal_words.json";
import { HAND, clamp } from "../presenter/kit";
import { FONT } from "../theme";
import { Mascot, mouthOpen, type Mood, type Who } from "../mascots/Gang";
import { Cut, Diorama, SplitDepth, dframe, dlerp, type DCam } from "../hl3d/Diorama";
import { Octo } from "../hl3d/Camp";
import { FPS } from "../zam/Episode";
import { Pow } from "../zam/toon";
import { Intro2, Outro2 } from "./cup_pilot_25d";

type Wd = { word: string; display: string; start: number; end: number; segment: string };
const WORDS = words as Wd[];
const LAST = WORDS[WORDS.length - 1].end;
const INTRO = 2.9, END = LAST + 0.7, OUTRO = 3.0;
const F = (s: number) => Math.round(s * FPS);
export const ZGOAL_FRAMES = F(INTRO + END + OUTRO);
const soft = { ...clamp, easing: Easing.inOut(Easing.sin) };
const back = { ...clamp, easing: Easing.out(Easing.back(1.8)) };
const WHO: Record<string, Who> = { p: "pucky", h: "helmy", z: "zam", b: "biscuit", c: "clubby" };
const talk = (who: Who, t: number) => { const ws = WORDS.filter((w) => WHO[w.segment[0]] === who); return ws.some((w) => t >= w.start - 0.05 && t <= w.end + 0.05) ? mouthOpen(ws, t) : 0; };
const bump = (who: Who, t: number) => { const w = WORDS.find((x) => t >= x.start && t <= x.end && WHO[x.segment[0]] === who); return w ? Math.max(0, 1 - (t - w.start) * 5) : 0; };
const camAt = (t: number, t0: number, t1: number, a: DCam, b: DCam) => dlerp(a, b, interpolate(t, [t0, t1], [0, 1], soft));
const G: React.FC<{ who: Who; t: number; cam: DCam; x: number; z: number; size: number; mood: Mood; y?: number; flip?: boolean; lookAt?: number; tilt?: number; children?: React.ReactNode }> = (p) => {
  const o = talk(p.who, p.t); const b = bump(p.who, p.t);
  return <Cut x={p.x} z={p.z} y={(p.y ?? 0) - b * 22} cam={p.cam} size={p.size} toon tilt={p.tilt}><div style={{ position: "relative" }}><Mascot who={p.who} size={p.size} mood={p.mood} open={o} talking={o > 0} noSticker flip={p.flip} lookAt={p.lookAt} seed={`zg${p.who}`} />{p.children}</div></Cut>;
};
const Jumbo: React.FC<{ text: string; small?: string }> = ({ text, small }) => (
  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, color: "#fde047", textShadow: "0 0 18px #facc15", background: "repeating-linear-gradient(0deg,#0000 0 4px,#0003 4px 6px)", textAlign: "center", lineHeight: 1 }}>
    <div style={{ fontSize: text.length > 12 ? 50 : 66 }}>{text}</div>{small && <div style={{ fontSize: 34, color: "#67e8f9", marginTop: 8 }}>{small}</div>}
  </div>
);
const GoalNet: React.FC<{ w?: number }> = ({ w = 520 }) => (
  <svg width={w} height={w * 0.68} viewBox="0 0 520 354"><path d="M30 350 L30 30 L490 30 L490 350" stroke="#ef4444" strokeWidth={22} fill="none" strokeLinejoin="round" />{[...Array(13)].map((_, i) => <path key={i} d={`M${60 + i * 33} 44 L${60 + i * 33} 346`} stroke="#ffffffcc" strokeWidth={3} />)}{[...Array(9)].map((_, i) => <path key={`h${i}`} d={`M40 ${66 + i * 32} L480 ${66 + i * 32}`} stroke="#ffffffcc" strokeWidth={3} />)}</svg>
);
const Puck: React.FC<{ shiny?: boolean; t?: number }> = ({ shiny, t = 0 }) => (
  <div style={{ position: "relative", width: 110, height: 48 }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: shiny ? "radial-gradient(ellipse at 35% 30%, #fff 0 12%, #94a3b8 30%, #111 75%)" : "#111", border: "5px solid #000", boxShadow: shiny ? "0 0 40px #fff, 0 0 80px #67e8f9" : undefined }} />
    {shiny && [0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 55 + Math.cos(i * 1.6 + t * 4) * 80, top: 24 + Math.sin(i * 1.6 + t * 4) * 50, color: "#fde047", fontSize: 34, textShadow: "0 0 10px #fde047" }}>✦</div>)}
  </div>
);
const Flashback: React.FC<{ t: number; at: number; year: string; children: React.ReactNode }> = ({ t, at, year, children }) => {
  const k = interpolate(t, [at, at + 0.35], [0, 1], back);
  return (
    <div style={{ position: "absolute", left: 100, top: 380, width: 880, height: 760, transform: `rotate(${-3 + (1 - k) * 20}deg) scale(${k})`, zIndex: 7, background: "#f3e7c9", padding: 24, boxSizing: "border-box", boxShadow: "0 30px 60px #000a", border: "4px solid #2b2622" }}>
      <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", filter: "sepia(0.6)", border: "4px solid #2b2622", background: "#e2e8f0" }}>{children}</div>
      <div style={{ position: "absolute", right: -30, top: -40, background: "#ef4444", color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 64, padding: "4px 22px", transform: "rotate(8deg)", border: "5px solid #2b2622" }}>{year}</div>
      <div style={{ position: "absolute", left: 24, bottom: -4, fontFamily: HAND, fontSize: 32, color: "#5b4636" }}>true story · source: NHL.com / CBC</div>
    </div>
  );
};
/** Two (generic) goalies carried off on stretchers; scoreboard CAR @ TOR. */
const InjuryScene: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#334155 0 30%,#f8fafc 30%)" }}>
    <div style={{ position: "absolute", left: 230, top: 30, width: 360, height: 120, background: "#0f172a", border: "8px solid #111", color: "#fde047", fontFamily: FONT, fontWeight: 900, fontSize: 48, display: "flex", alignItems: "center", justifyContent: "center" }}>CAR @ TOR</div>
    {[0, 1].map((i) => { const x = interpolate(t, [7.0 + i * 1.4, 9.5 + i * 1.4], [-320, 900], clamp); return (
      <div key={i} style={{ position: "absolute", left: x, top: 320 + i * 170 }}>
        <div style={{ width: 300, height: 26, background: "#fff", border: "5px solid #111", borderRadius: 6 }} />
        <div style={{ position: "absolute", left: 40, top: -70, width: 70, height: 70, borderRadius: 35, background: "#fffaf0", border: "5px solid #111" }}><div style={{ position: "absolute", left: 12, top: 26, fontFamily: FONT, fontWeight: 900, fontSize: 24 }}>x x</div></div>
        <div style={{ position: "absolute", left: 110, top: -46, width: 150, height: 46, background: "#ef4444", border: "5px solid #111", borderRadius: 10 }} />
        <div style={{ position: "absolute", left: 270, top: -40, fontSize: 44 }}>🩹</div>
      </div>); })}
    <div style={{ position: "absolute", left: 40, top: 630, fontFamily: HAND, fontSize: 52, color: "#111" }}>goalie #1 out… goalie #2 out…</div>
  </div>
);

// ------------------------------------------------------------------ shots
type Shot = { from: number; Comp: React.FC<{ t: number }> };
const SHOTS: Shot[] = [
  { from: 0, Comp: ({ t }) => { const cam = camAt(t, 0, 4.0, dframe(0, -280, -800, 900, 820, { rx: -3 }), dframe(0, -270, -800, 620, 790));
    return <Diorama cam={cam} t={t} cheer={0.8} jumbo={<Jumbo text="ICE MACHINE → GOALIE?!" />}><G who="zam" t={t} cam={cam} x={0} z={-800} size={430} mood={t > 1 ? "love" : "wow"} /><Cut x={-640} z={-1350} y={-180} cam={cam} size={100} shadow={false} toon><Octo t={t} s={100} /></Cut></Diorama>; } },
  { from: 4.0, Comp: ({ t }) => { const cam = camAt(t, 4.0, 6.4, dframe(0, -280, -820, 680, 790), dframe(0, -280, -820, 560, 780));
    return <Diorama cam={cam} t={t} jumbo={<Jumbo text="PLEASE NO" />}><G who="biscuit" t={t} cam={cam} x={0} z={-820} size={430} mood="scared" /></Diorama>; } },
  { from: 6.4, Comp: ({ t }) => { const cam = dframe(0, -300, -800, 1300, 860);
    return <><Diorama cam={cam} t={t} jumbo={<Jumbo text="FEB 22, 2020" />}><G who="helmy" t={t} cam={cam} x={-320} z={-800} size={340} mood="talk" /></Diorama><AbsoluteFill style={{ background: "#0007" }} /><Flashback t={t} at={6.6} year="2020"><InjuryScene t={t} /></Flashback></>; } },
  { from: 12.0, Comp: ({ t }) => { const cam = camAt(t, 12.0, 14.8, dframe(0, -280, -800, 760, 800, { ry: 5 }), dframe(0, -280, -800, 640, 790, { ry: 5 }));
    return <Diorama cam={cam} t={t} jumbo={<Jumbo text="POPCORN GUY?" />}><G who="pucky" t={t} cam={cam} x={0} z={-800} size={420} mood="smug"><div style={{ position: "absolute", left: 300, top: 120, width: 90, height: 120, background: "repeating-linear-gradient(90deg,#ef4444 0 15px,#fff 15px 30px)", border: "5px solid #111", borderRadius: "0 0 14px 14px" }}>{[...Array(6)].map((_, i) => <div key={i} style={{ position: "absolute", left: (i % 3) * 28 + 4, top: -24 - Math.floor(i / 3) * 18, width: 28, height: 24, borderRadius: 12, background: "#fef3c7", border: "2px solid #d97706" }} />)}</div></G></Diorama>; } },
  { from: 14.8, Comp: ({ t }) => { const cam = dframe(-60, -300, -800, 1100, 840, { ry: -6 });
    return <Diorama cam={cam} t={t} jumbo={<Jumbo text="EMERGENCY" small="BACKUP · AGE 42" />}><G who="helmy" t={t} cam={cam} x={-260} z={-760} size={380} mood="talk" /><G who="zam" t={t} cam={cam} x={300} z={-900} size={340} mood={t > 17.5 ? "love" : "wow"} lookAt={-8} /></Diorama>; } },
  { from: 19.6, Comp: ({ t }) => { const cam = camAt(t, 19.6, 20.9, dframe(0, -260, -800, 620, 780), dframe(0, -260, -800, 500, 760));
    return <Diorama cam={cam} t={t} cheer={1} jumbo={<Jumbo text="ONE OF US!" />}><G who="zam" t={t} cam={cam} x={0} z={-800} size={430} mood="love" /></Diorama>; } },
  { from: 20.9, Comp: ({ t }) => { const cam = dframe(0, -300, -800, 1050, 840);
    return <Diorama cam={cam} t={t} jumbo={<Jumbo text="OLD SCHOOL" />}><G who="clubby" t={t} cam={cam} x={-260} z={-800} size={400} mood="grumpy" /><G who="zam" t={t} cam={cam} x={280} z={-800} size={380} mood={t > 22.6 ? "sad" : "talk"} flip lookAt={-10} /></Diorama>; } },
  { from: 24.3, Comp: ({ t }) => { const cam = camAt(t, 24.3, 25.3, dframe(0, -260, -800, 560, 770), dframe(0, -260, -800, 480, 760));
    return <Diorama cam={cam} t={t} jumbo={<Jumbo text="RUDE." />}><G who="zam" t={t} cam={cam} x={0} z={-800} size={430} mood="angry" /></Diorama>; } },
  { from: 25.3, Comp: ({ t }) => { const cam = camAt(t, 25.3, 29.0, dframe(0, -360, -800, 1250, 860, { rx: -4 }), dframe(0, -350, -800, 1050, 850, { rx: -3 }));
    return <Diorama cam={cam} t={t} cheer={1} jumbo={<Jumbo text="8 SAVES" small="CAROLINA 6 – 3" />}><G who="helmy" t={t} cam={cam} x={0} z={-760} size={420} mood="proud" /></Diorama>; } },
  { from: 29.0, Comp: ({ t }) => { const cam = camAt(t, 29.0, 31.1, dframe(0, -270, -820, 640, 780), dframe(0, -270, -820, 520, 770));
    return <Diorama cam={cam} t={t} jumbo={<Jumbo text="8 IN 1 NIGHT" />}><G who="biscuit" t={t} cam={cam} x={0} z={-820} size={430} mood="sad" /></Diorama>; } },
  { from: 31.1, Comp: ({ t }) => { const cam = dframe(0, -300, -800, 1050, 840);
    return <Diorama cam={cam} t={t} cheer={1} jumbo={<Jumbo text="OOF." />}><G who="pucky" t={t} cam={cam} x={-260} z={-800} size={380} mood="laugh" /><G who="biscuit" t={t} cam={cam} x={280} z={-800} size={400} mood={t > 32.0 ? "angry" : "sad"} flip /></Diorama>; } },
  { from: 32.8, Comp: ({ t }) => { const cam = camAt(t, 32.8, 37.1, dframe(0, -400, -900, 1300, 880, { rx: -6 }), dframe(0, -380, -900, 1050, 860, { rx: -4 }));
    return <Diorama cam={cam} t={t} cheer={1} jumbo={<Jumbo text="1ST EVER" small="EMERGENCY GOALIE WIN" />}><G who="helmy" t={t} cam={cam} x={-300} z={-800} size={340} mood="talk" /><G who="zam" t={t} cam={cam} x={260} z={-900} size={380} mood="proud" /></Diorama>; } },
  { from: 37.1, Comp: ({ t }) => { // Zam rolls into the net – net breaks out over the top bar
    const cam = dframe(0, -320, -900, 1100, 850); const k = interpolate(t, [37.1, 37.7], [0, 1], back);
    return <SplitDepth over={<div style={{ position: "absolute", left: 260, top: 380 - k * 40, opacity: k }}><GoalNet w={560} /></div>}><Diorama cam={cam} t={t} jumbo={<Jumbo text="ZAM IN NET?!" />}><G who="zam" t={t} cam={cam} x={0} z={-900} size={420} mood="laugh" /></Diorama></SplitDepth>; } },
  { from: 38.7, Comp: ({ t }) => { const cam = camAt(t, 38.7, 41.9, dframe(0, -280, -800, 680, 790, { ry: 5 }), dframe(0, -280, -800, 580, 780, { ry: 5 }));
    return <Diorama cam={cam} t={t} jumbo={<Jumbo text="BATH TIME?" />}><G who="pucky" t={t} cam={cam} x={0} z={-800} size={420} mood={t > 40.0 ? "grumpy" : "scared"} /></Diorama>; } },
  { from: 41.9, Comp: ({ t }) => { // Clubby shoots, Zam saves, the puck pops out polished – over the bottom bar; Biscuit deadpan
    const cam = dframe(0, -320, -900, 1400, 860, { rx: -3 }); const k = interpolate(t, [41.9, 42.4], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) }); const out = interpolate(t, [42.4, 43.3], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
    return <SplitDepth over={out > 0 ? <div style={{ position: "absolute", left: 460 + out * 120, top: 900 + out * 520, transform: `scale(${1 + out * 1.4})` }}><Puck shiny t={t} /></div> : null}>
      <Diorama cam={cam} t={t} cheer={1} jumbo={<Jumbo text="SAVE!" small="+ FREE POLISH" />}><G who="clubby" t={t} cam={cam} x={-400} z={-760} size={320} mood="determined" /><G who="zam" t={t} cam={cam} x={60} z={-1000} size={380} mood={out > 0 ? "proud" : "determined"} /><G who="biscuit" t={t} cam={cam} x={380} z={-720} size={340} mood={t > 43.5 ? "grumpy" : "wow"} flip lookAt={-10} />
        {k > 0 && k < 1 && <Cut x={-380 + k * 420} z={-800 - k * 180} y={-80} cam={cam} size={70} shadow={false} toon><Puck /></Cut>}
        <Cut x={640} z={-1360} y={-200} cam={cam} size={90} shadow={false} toon><Octo t={t} s={90} /></Cut>
      </Diorama>
      {t > 42.4 && t < 43.2 && <Pow text="SHINY!" x={520} y={430} size={140} rot={8} />}
    </SplitDepth>; } },
];
const RANGES = SHOTS.map((s, i) => ({ ...s, to: SHOTS[i + 1]?.from ?? END }));

const FACTS: [number, number, string, string][] = [
  [7.0, 11.9, "FEB 22, 2020 · BOTH CAROLINA GOALIES HURT", "vs. Toronto · source: NHL.com"],
  [25.6, 28.9, "8 SAVES · CAROLINA WINS 6–3", "42-year-old emergency backup · NHL.com / CBC"],
  [33.1, 37.0, "1ST EMERGENCY BACKUP GOALIE TO WIN AN NHL GAME", "he drove the ice machine at the team's rink"],
];
const Fact: React.FC<{ t: number }> = ({ t }) => {
  const f = FACTS.find(([a, b]) => t >= a && t <= b); if (!f) return null;
  const k = interpolate(t, [f[0], f[0] + 0.25], [0, 1], back);
  return <div style={{ position: "absolute", left: 60, top: 1215, zIndex: 9, transform: `rotate(-2deg) scale(${k})`, transformOrigin: "0 50%", background: "#fbf6ea", border: "5px solid #2b2622", borderRadius: 6, padding: "8px 20px", boxShadow: "0 10px 0 #0006", maxWidth: 860 }}><div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, color: "#2b2622" }}>{f[2]}</div><div style={{ fontFamily: HAND, fontSize: 28, color: "#7a6f62" }}>{f[3]}</div></div>;
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

export const ZamGoalie25D: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS - INTRO;
  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: "#0b0716", overflow: "hidden" }}>
      <Sequence from={F(INTRO)}><Audio src={staticFile("ep/zgoal.mp3")} /></Sequence>
      <Sequence from={F(INTRO)}><Audio src={staticFile("music_happy.mp3")} volume={(fr) => (fr < F(END) ? 0.24 : 0.4)} /></Sequence>
      {RANGES.map((s) => { const C = s.Comp; return <Sequence key={s.from} from={F(INTRO + s.from)} durationInFrames={F(INTRO + s.to) - F(INTRO + s.from)}><AbsoluteFill style={{ overflow: "hidden" }}><C t={t} /></AbsoluteFill></Sequence>; })}
      {RANGES.slice(1).map((s) => <Sequence key={`p${s.from}`} from={F(INTRO + s.from)} durationInFrames={20}><Audio src={staticFile([6.4, 25.3, 37.1].includes(s.from) ? "whoosh.wav" : "pop.wav")} volume={0.22} /></Sequence>)}
      <Sequence from={F(INTRO + 25.4)} durationInFrames={F(1.4)}><Audio src={staticFile("sfx/horn.wav")} volume={0.2} /></Sequence>
      <Sequence from={F(INTRO + 42.4)} durationInFrames={F(0.6)}><Audio src={staticFile("sfx/shutter.mp3")} volume={0.5} /></Sequence>
      {t >= 0 && t < END && <Fact t={t} />}
      {t >= 0 && t < END && <Captions t={t} />}
      {t >= 0 && t < END && <div style={{ position: "absolute", left: 52, top: 140, padding: "4px 12px", background: "#ff2bd6", color: "#fff", fontWeight: 900, fontSize: 22, letterSpacing: 2, zIndex: 9 }}>ZAM · ZAM IN NET</div>}
      <Sequence from={0} durationInFrames={F(INTRO) + 2}><Intro2 /></Sequence>
      <Sequence from={F(INTRO + END)}><Outro2 /></Sequence>
    </AbsoluteFill>
  );
};
void random;
