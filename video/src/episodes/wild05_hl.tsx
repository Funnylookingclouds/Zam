/** ZAM Daily Facts – "Hockey's Wildest Moments #5" with the Hockey Life cast. Verified facts (NHL.com):
 *  Mosienko 3 goals in 21 s (Mar 23 1952, CHI 7–6 NYR) · Hextall first goalie to shoot & score (Dec 8 1987, PHI 5–2 BOS)
 *  · longest game, 6 OT, Bruneteau at 2:25 a.m. (Mar 24 1936, DET 1–0 MTL Maroons, semifinal). Generic players, names only in narration/labels. */
import React from "react";
import { AbsoluteFill, Audio, Easing, Sequence, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import words from "../data/wild05_words.json";
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
export const WILD05_FRAMES = F(INTRO + END + OUTRO);
const soft = { ...clamp, easing: Easing.inOut(Easing.sin) };
const WHO: Record<string, string> = { n: "narrator", f: "ref", g: "gus", w: "walt", r: "rookie" };
const talk = (who: string, t: number) => { const ws = WORDS.filter((w) => WHO[w.segment[0]] === who); return ws.some((w) => t >= w.start - 0.05 && t <= w.end + 0.05) ? mouthOpen(ws, t) : 0; };
const bump = (who: string, t: number) => { const w = WORDS.find((x) => t >= x.start && t <= x.end && WHO[x.segment[0]] === who); return w ? Math.max(0, 1 - (t - w.start) * 5) : 0; };

const Actor: React.FC<{ who: StickWho; t: number; size: number; x: number; y: number; mood: StickMood; pose?: StickPose; arms?: A4; skate?: number; lean?: number; headTurn?: number; headTilt?: number; flip?: boolean; sitting?: boolean; rot?: number; label?: string }> = (p) => {
  const b = bump(p.who, p.t);
  return (
    <div style={{ position: "absolute", left: p.x, top: p.y - b * 16, transform: `rotate(${p.rot ?? 0}deg) scale(${1 + b * 0.035}, ${1 - b * 0.035})`, transformOrigin: "50% 100%" }}>
      {p.label && <div style={{ position: "absolute", left: 0, right: 0, top: p.size * 0.1, textAlign: "center", zIndex: 3 }}><span style={{ display: "inline-block", background: "#111", color: "#fde047", fontFamily: FONT, fontWeight: 900, fontSize: Math.max(22, p.size / 14), padding: "3px 12px", borderRadius: 6 }}>{p.label}</span></div>}
      <StickPerson who={p.who} size={p.size} mood={p.mood} pose={p.pose} arms={p.arms} skate={p.skate} lean={p.lean} headTurn={p.headTurn} headTilt={p.headTilt} open={talk(p.who, p.t)} flip={p.flip} sitting={p.sitting} seed={p.who.length} />
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

// ------------------------------------------------------------------ shots
type Shot = { from: number; Comp: React.FC<{ t: number }> };
const clock21 = (t: number) => `0:${String(Math.round(interpolate(t, [6.9, 9.2], [0, 21], clamp))).padStart(2, "0")}`;
const SHOTS: Shot[] = [
  { from: 0, Comp: ({ t }) => ( // hook: Rookie vs the jumbotron "0:21"
    <><Cam t={t} keys={[[0, 1.2, 0, 200, 0], [2.8, 1.0, 0, 0, 0]]}>
      <Arena t={t} jumbo="3 GOALS · 0:21" spot={[540, 1000]} />
      <Actor who="rookie" t={t} size={560} x={260} y={700} mood="shock" arms={kf(t, [[0, ARM.idle], [0.5, ARM.up], [1.7, ARM.flail1], [2.2, ARM.up]]) as A4} headTilt={Math.sin(t * 4) * 4} />
    </Cam><Foreground t={t} /><Vignette /></>) },
  { from: 2.8, Comp: ({ t }) => <><Cam t={t} keys={[[2.8, 1.1, 0, 0, 0], [4.2, 1.0, 0, 0, 0]]}><Arena t={t} /><Close who="gus" t={t} mood="smug" pose="crossed" /></Cam><Vignette /></> },
  { from: 4.2, Comp: ({ t }) => { // Mosienko: three goals, clock 0:00 → 0:21
    const goals = [7.35, 8.15, 8.95];
    const cyc = goals.findIndex((g) => t < g); const g0 = cyc <= 0 ? 6.6 : goals[cyc - 1], g1 = cyc < 0 ? 99 : goals[cyc];
    const k = cyc < 0 ? 1 : interpolate(t, [g0 + 0.05, g1], [0, 1], soft);
    const px = cyc < 0 ? 900 : 300 + k * 600, py = 1220 - Math.sin(k * Math.PI) * 60;
    return (<><Cam t={t} keys={[[4.2, 1.15, 120, 0, 0], [6.8, 1.0, 0, 0, 0], [10.1, 1.08, -60, 0, 0]]} shake={goals.some((g) => t > g && t < g + 0.25) ? 10 : 0}>
      <Arena t={t} jumbo={t < 6.8 ? "CHI vs NYR · 1952" : clock21(t)} cheer={t > 7.3 ? 1 : 0.3} />
      <Net x={760} y={980} />
      <Actor who="rookie" t={t} size={480} x={interpolate(t, [4.2, 10.1], [40, 360])} y={760} mood={t > 7.3 ? "happy" : "talk"} arms={kf(t, [[4.2, ARM.idle], [7.2, [-78, -30, 190, 40]], [7.5, ARM.up], [8.0, [-78, -30, 190, 40]], [8.3, ARM.up], [8.8, [-78, -30, 190, 40]], [9.1, ARM.up]]) as A4} skate={t * 6} lean={8} label="MOSIENKO · CHI" />
      <Puck x={px} y={py} />
      {goals.map((g, i) => t > g && <Pow key={i} text={["GOAL!", "GOAL!!", "HAT TRICK!"][i]} x={[90, 360, 170][i]} y={[560, 680, 800][i]} size={[120, 130, 140][i]} rot={[-8, 6, -4][i]} />)}
      <GoalLight t={t} at={goals} />
    </Cam><Fact t={t} at={4.3} title="MARCH 23, 1952" /><Foreground t={t} px={-(t - 4.2) * 20} /><Vignette /></>); } },
  { from: 10.1, Comp: ({ t }) => (
    <><Cam t={t} keys={[[10.1, 1.0, 0, 0, -3], [13.2, 1.1, 0, 0, -3]]}><Arena t={t} jumbo="NHL RECORD" /><Close who="gus" t={t} mood="talk" arms={kf(t, [[10.1, ARM.idle], [10.6, ARM.point], [12.2, ARM.fist]]) as A4} /></Cam>
      <Fact t={t} at={10.5} title="21 SECONDS · STILL #1" sub="fastest hat trick in NHL history" x={90} y={1180} rot={2} /><Vignette /></>) },
  { from: 13.2, Comp: ({ t }) => ( // Rookie fails to tie his skates
    <><Cam t={t} keys={[[13.2, 1.0, 0, 0, 0], [16.4, 1.1, 0, 60, 0]]}><PenaltyBox t={t} />
      <Actor who="rookie" t={t} size={600} x={230} y={640} mood={t > 15 ? "sad" : "talk"} arms={kf(t, [[13.2, [-40, 60, 40, 60]], [13.8, [-20, 90, 60, 50]], [14.4, [-60, 50, 20, 90]], [15.0, [-40, 60, 40, 60]]]) as A4} sitting headTilt={10} />
      <svg width={1080} height={1920} style={{ position: "absolute" }}><path d={`M380 1120 q40 ${-40 + Math.sin(t * 6) * 20} 80 0 t80 0 t80 0 q30 30 -40 50 q-80 10 -40 -40`} stroke="#fff" strokeWidth={6} fill="none" /></svg>
    </Cam><Vignette /></>) },
  { from: 16.4, Comp: ({ t }) => { // Hextall: goalie shoots the length of the ice into the empty net (Pucky = the puck)
    const k = interpolate(t, [20.4, 23.3], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
    return (<><Cam t={t} keys={[[16.4, 1.05, 380, 0, 0], [20.4, 1.0, 380, 0, 0], [23.3, 1.0, -380, 0, 0], [24.1, 1.12, -420, 0, 0]]}>
      <AbsoluteFill style={{ left: -540, width: 2160 }}><div style={{ position: "absolute", inset: 0, width: 2160 }}><Arena t={t} jumbo={t > 23.3 ? "GOALIE GOAL!" : "PHI vs BOS · 1987"} cheer={t > 23.3 ? 1 : 0.3} /></div><div style={{ position: "absolute", left: 1080, top: 0, width: 1080, height: 1920 }}><Arena t={t} jumbo={t > 23.3 ? "GOALIE GOAL!" : "EMPTY NET"} cheer={t > 23.3 ? 1 : 0.3} /></div>
        <Net x={180} y={980} />
        <Actor who="walt" t={t} size={480} x={300} y={720} mood={t > 23.3 ? "happy" : "grumpy"} arms={kf(t, [[16.4, ARM.idle], [19.8, [-150, -200, 60, -160]], [20.4, [-78, -30, 200, 60]], [21, ARM.up]]) as A4} lean={t > 20.3 && t < 20.8 ? 14 : 0} label="HEXTALL · PHI" />
        <Net x={1640} y={980} />
        <div style={{ position: "absolute", left: 600 + k * 1200, top: 1060 - Math.sin(k * Math.PI) * 260, transform: `rotate(${k * 900}deg)`, zIndex: 5 }}><Mascot who="pucky" size={170} mood={k > 0.95 ? "dizzy" : "laugh"} noSticker seed="w5p" /></div>
        {t > 23.3 && <div style={{ position: "absolute", left: 1500, top: 500 }}><Pow text="EMPTY NET!" x={0} y={0} size={120} rot={-6} /></div>}
      </AbsoluteFill>
      <GoalLight t={t} at={[23.3]} />
    </Cam><Fact t={t} at={16.5} title="DEC 8, 1987" /><Vignette /></>); } },
  { from: 24.0, Comp: ({ t }) => <><Cam t={t} keys={[[24.0, 1.0, 0, 0, 0], [27.2, 1.1, 0, 0, 0]]}><Arena t={t} spot={[540, 800]} /><Close who="walt" t={t} mood="happy" arms={kf(t, [[24, ARM.idle], [25.8, [-60, -120, 30, -130]]]) as A4} headTilt={kf(t, [[25.8, [0]], [26.3, [-8]]])[0]} /></Cam>
    <Fact t={t} at={24.3} title="1st GOALIE TO SHOOT & SCORE" sub="Source: NHL.com" x={60} y={1180} rot={2} /><Vignette /></> },
  { from: 27.2, Comp: ({ t }) => <><Cam t={t} keys={[[27.2, 1.05, 0, 0, 3], [29.3, 1.12, 0, 0, 3]]}><Arena t={t} /><Close who="rookie" t={t} mood="smug" arms={ARM.idle} size={1100} /></Cam><Vignette /></> },
  { from: 29.3, Comp: ({ t }) => <><Cam t={t} keys={[[29.3, 1.0, 0, 0, 0], [29.5, 1.15, 0, 0, 0], [31.0, 1.2, 0, 0, 0]]}><Arena t={t} /><Close who="walt" t={t} mood="grumpy" pose="crossed" /></Cam><Vignette /></> },
  { from: 31.0, Comp: ({ t }) => ( // the longest game – six overtimes, yawning players
    <><Cam t={t} keys={[[31.0, 1.2, 0, -200, 0], [35.9, 1.0, 0, 0, 0]]}>
      <Arena t={t} jumbo={t < 33.6 ? "DET vs MTL · 1936" : `OT ${Math.min(6, 1 + Math.floor((t - 33.6) * 2.4))}`} spot={[540, 1100]} />
      <AbsoluteFill style={{ background: "#0b122066" }} />
      <Actor who="rookie" t={t} size={400} x={80} y={860} mood="sad" arms={[-60, -200, 70, -10]} skate={t * 1.5} lean={-4} headTilt={12} />
      <Actor who="walt" t={t} size={430} x={560} y={830} mood="sad" pose="crossed" headTilt={-14} />
      <Zs t={t} x={820} y={820} />
    </Cam><Fact t={t} at={31.1} title="MARCH 24, 1936" /><Foreground t={t} /><Vignette /></>) },
  { from: 35.8, Comp: ({ t }) => <><Cam t={t} keys={[[35.8, 1.0, 0, 0, 0], [38.9, 1.1, 0, 0, 0]]}><Arena t={t} jumbo="176:30" spot={[540, 800]} /><AbsoluteFill style={{ background: "#0b122055" }} /><Close who="ref" t={t} mood="sad" arms={[-80, -200, 80, -200]} headTilt={Math.sin(t * 2) * 6} /></Cam>
    <Fact t={t} at={36.2} title="6 OVERTIMES · 176:30" sub="longest game in NHL history" x={80} y={1180} rot={-2} /><Vignette /></> },
  { from: 38.9, Comp: ({ t }) => { // 2:25 a.m. – Bruneteau scores
    const k = interpolate(t, [40.3, 41.1], [0, 1], soft);
    return (<><Cam t={t} keys={[[38.9, 1.0, 0, 0, 0], [42.6, 1.12, -60, 0, 0]]} shake={t > 41.1 && t < 41.4 ? 8 : 0}>
      <Arena t={t} jumbo="2:25 AM" cheer={t > 41.1 ? 1 : 0} spot={[600, 1100]} /><AbsoluteFill style={{ background: "#0b122055" }} />
      <Net x={680} y={980} />
      <Actor who="rookie" t={t} size={480} x={140} y={760} mood={t > 41.1 ? "happy" : "sad"} arms={kf(t, [[38.9, [-60, -200, 70, -10]], [40.2, [-78, -30, 190, 40]], [41.1, ARM.up]]) as A4} skate={t * 3} label="BRUNETEAU · DET" />
      <Puck x={500 + k * 400} y={1220} />
      {t > 41.1 && <Pow text="FINALLY!" x={160} y={430} size={140} rot={-6} />}
      <GoalLight t={t} at={[41.1]} />
    </Cam><Vignette /></>); } },
  { from: 42.6, Comp: ({ t }) => <><Cam t={t} keys={[[42.6, 1.0, 0, 0, -4], [44.9, 1.1, 0, 0, -4]]}><Arena t={t} /><Close who="gus" t={t} mood="smug" arms={kf(t, [[42.6, ARM.idle], [43.4, ARM.shrug ?? [-130, -170, 130, -170]]]) as A4} /></Cam><Vignette /></> },
  { from: 44.9, Comp: ({ t }) => ( // Walt asleep in the net
    <><Cam t={t} keys={[[44.9, 1.0, 0, 0, 0], [END, 1.15, 0, 40, 0]]}><Arena t={t} jumbo="OT 7?" spot={[540, 1000]} /><AbsoluteFill style={{ background: "#0b122066" }} />
      <Net x={260} y={950} />
      <Actor who="walt" t={t} size={480} x={300} y={720} mood="happy" arms={[-70, -10, 70, -10]} sitting headTilt={18} />
      <Zs t={t} x={640} y={800} />
    </Cam><Vignette /></>) },
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
      <div style={{ position: "absolute", top: 760, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 50, color: "#fff" }}>Follow for #6 👀</div>
      {(["rookie", "ref", "gus", "walt"] as StickWho[]).map((w, i) => <div key={w} style={{ position: "absolute", left: 20 + i * 255, top: 960 + Math.abs(Math.sin(f / 8 + i)) * -20 }}><StickPerson who={w} size={250} mood="happy" pose={w === "walt" ? "crossed" : "wave"} seed={i} /></div>)}
      <Sequence from={4}><Audio src={staticFile("brand/outro_vo.mp3")} /></Sequence>
    </AbsoluteFill>
  );
};

export const Wild05HL: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS - INTRO;
  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: "#0b1220", overflow: "hidden" }}>
      <Sequence from={F(INTRO)}><Audio src={staticFile("ep/wild05.mp3")} /></Sequence>
      <Audio src={staticFile("music_happy.mp3")} volume={(fr) => (fr < F(INTRO + END) ? 0.28 : 0.45)} />
      {RANGES.map((s) => { const C = s.Comp; return <Sequence key={s.from} from={F(INTRO + s.from)} durationInFrames={F(INTRO + s.to) - F(INTRO + s.from)}><AbsoluteFill style={{ overflow: "hidden" }}><C t={t} /></AbsoluteFill></Sequence>; })}
      {RANGES.slice(1).map((s) => <Sequence key={`w${s.from}`} from={F(INTRO + s.from)} durationInFrames={20}><Audio src={staticFile([4.2, 16.4, 31.0].includes(s.from) ? "whoosh.wav" : "pop.wav")} volume={0.22} /></Sequence>)}
      {[7.35, 8.15, 8.95, 23.3, 41.1].map((g) => <Sequence key={`h${g}`} from={F(INTRO + g)} durationInFrames={F(1.5)}><Audio src={staticFile("sfx/horn.wav")} volume={0.22} /></Sequence>)}
      {t >= 0 && t < END && <Captions t={t} />}
      {t >= 0 && t < END && <div style={{ position: "absolute", left: 52, top: 140, padding: "4px 12px", background: "#fde047", color: "#111", fontWeight: 900, fontSize: 22, letterSpacing: 2, zIndex: 8 }}>ZAM · WILDEST MOMENTS #5</div>}
      <Sequence from={0} durationInFrames={F(INTRO) + 2}><IntroHL title="DAILY FACTS · WILDEST MOMENTS #5" /></Sequence>
      <Sequence from={F(INTRO + END)}><Outro5 /></Sequence>
    </AbsoluteFill>
  );
};
void random;
