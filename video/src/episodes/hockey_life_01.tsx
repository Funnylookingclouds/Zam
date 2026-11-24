/** ZAM 2.0 "Hockey Life" pilot #1 – "The Goalie Who Refused to Retire" (prototype, option C).
 *  Full-screen painted scenes, two leads (Rookie + Big Walt), Pucky cameo, narrator punchline, centred word-by-word
 *  captions. No intro (hook starts at frame 0); short branded outro. */
import React from "react";
import { AbsoluteFill, Audio, Easing, Sequence, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import words from "../data/hl01_words.json";
import { clamp } from "../presenter/kit";
import { FONT } from "../theme";
import { Mascot, mouthOpen } from "../mascots/Gang";
import { StickPerson, type StickMood, type StickPose, type StickWho } from "../mascots/Stick";
import { LockerRoom } from "../mascots/HockeyLifeCard";
import { IceWipe, Logo } from "../zam/common";
import { FPS } from "../zam/Episode";
import { Pow } from "../zam/toon";

type Wd = { word: string; display: string; start: number; end: number; segment: string; keyword?: boolean };
const WORDS = words as Wd[];
const LAST = WORDS[WORDS.length - 1].end;
const END = LAST + 0.5, OUTRO = 3.0;
const F = (s: number) => Math.round(s * FPS);
export const HL01_FRAMES = F(END + OUTRO);
const soft = { ...clamp, easing: Easing.inOut(Easing.sin) };
const WHO: Record<string, StickWho | "pucky" | "narrator"> = { n: "narrator", r: "rookie", w: "walt", p: "pucky" };
const speakerAt = (t: number) => { const w = WORDS.find((x) => t >= x.start - 0.05 && t <= x.end + 0.05); return w ? WHO[w.segment[0]] : null; };
const talk = (who: string, t: number) => (speakerAt(t) === who ? mouthOpen(WORDS.filter((w) => WHO[w.segment[0]] === who), t) : 0);
const bump = (who: string, t: number) => { const w = WORDS.find((x) => t >= x.start && t <= x.end && WHO[x.segment[0]] === who); return w ? Math.max(0, 1 - (t - w.start) * 5) : 0; };

/** Stick actor with lip-sync + squash on each word. */
const Actor: React.FC<{ who: StickWho; t: number; size: number; x: number; y: number; mood: StickMood; pose?: StickPose; flip?: boolean; sitting?: boolean; shades?: boolean; hold?: React.ReactNode; rot?: number }> = ({ who, t, size, x, y, mood, pose, flip, sitting, shades, hold, rot = 0 }) => {
  const b = bump(who, t);
  return (
    <div style={{ position: "absolute", left: x, top: y - b * 18, transform: `rotate(${rot}deg) scale(${1 + b * 0.03}, ${1 - b * 0.03})`, transformOrigin: "50% 100%" }}>
      <StickPerson who={who} size={size} mood={mood} pose={pose} open={talk(who, t)} flip={flip} sitting={sitting} shades={shades} hold={hold} seed={who === "walt" ? 1 : 2} />
    </div>
  );
};
/** Close-up: head centred at (cx, cy) filling the frame. */
const Close: React.FC<{ who: StickWho; t: number; mood: StickMood; cx?: number; cy?: number; size?: number; pose?: StickPose; zoom?: number; shades?: boolean }> = ({ who, t, mood, cx = 540, cy = 640, size = 1250, pose = "idle", zoom = 1, shades }) => {
  const H = size * 1.3, headY = (155 / 520) * H;
  return <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: `scale(${zoom})`, transformOrigin: `${cx}px ${cy}px` }}><Actor who={who} t={t} size={size} x={cx - size / 2} y={cy - headY} mood={mood} pose={pose} shades={shades} /></div>;
};

// ------------------------------------------------------------------ props (SVG, drawn at the right hand)
const Cake = <g transform="translate(-60 -110)"><rect x={0} y={60} width={130} height={60} rx={10} fill="#f9a8d4" stroke="#2b2622" strokeWidth={5} /><rect x={10} y={20} width={110} height={44} rx={10} fill="#fff" stroke="#2b2622" strokeWidth={5} /><rect x={60} y={-10} width={8} height={30} fill="#60a5fa" /><path d="M64 -24 Q72 -14 64 -8 Q56 -14 64 -24 Z" fill="#f59e0b" /><rect x={-10} y={118} width={150} height={10} rx={5} fill="#cbd5e1" stroke="#2b2622" strokeWidth={3} /></g>;
const Pillow = <g transform="translate(-70 -60)"><rect x={0} y={0} width={150} height={90} rx={34} fill="#e0e7ff" stroke="#2b2622" strokeWidth={5} /><path d="M40 45 L60 45 M90 45 L110 45" stroke="#94a3b8" strokeWidth={5} /><text x={75} y={30} textAnchor="middle" fontFamily="Caveat" fontSize={30} fill="#6366f1">zzz</text></g>;
const Globe = <g><circle cx={0} cy={-60} r={62} fill="#7dd3fc" stroke="#2b2622" strokeWidth={5} /><path d="M-40 -90 Q-10 -110 10 -80 Q-10 -60 -30 -70 Z M10 -40 Q40 -60 45 -20 Q20 -10 10 -40 Z" fill="#4ade80" stroke="#2b2622" strokeWidth={3} /><rect x={-6} y={0} width={12} height={30} fill="#b45309" /></g>;
const Juice = <g transform="translate(-20 -60)"><rect x={0} y={0} width={40} height={60} rx={6} fill="#fdba74" stroke="#2b2622" strokeWidth={4} /><rect x={22} y={-24} width={6} height={28} fill="#f472b6" /></g>;

// ------------------------------------------------------------------ rink set
const Rink: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg,#334155 0%,#475569 30%,#cbd5e1 30.2%,#e2e8f0 42%,#eaf6ff 42.2%,#d6ecfa 100%)" }}>
    {[...Array(60)].map((_, i) => <div key={i} style={{ position: "absolute", left: (i % 15) * 74 + (Math.floor(i / 15) % 2) * 37, top: 60 + Math.floor(i / 15) * 90, width: 40, height: 50, borderRadius: "20px 20px 6px 6px", background: ["#64748b", "#94a3b8", "#475569"][i % 3], opacity: 0.6 }} />)}
    <div style={{ position: "absolute", left: 0, right: 0, top: 560, height: 250, background: "linear-gradient(180deg,#ffffff55,#ffffff22)", borderTop: "6px solid #94a3b8" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 800, height: 90, background: "#fff", borderTop: "8px solid #2b2622", borderBottom: "14px solid #f59e0b" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 1240, height: 16, background: "#ef4444", opacity: 0.6 }} />
    <div style={{ position: "absolute", left: 140, top: 1150, width: 800, height: 260, borderRadius: "400px 400px 0 0", background: "#93c5fd55", border: "6px solid #ef444499", borderBottom: "none" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 30%, #ffffff33, #00000022 85%)" }} />
  </AbsoluteFill>
);
export const Net: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 560, height: 360 }}>
    <svg width={560} height={360} style={{ position: "absolute" }}>
      <path d="M40 350 L40 40 L520 40 L520 350" stroke="#ef4444" strokeWidth={22} fill="none" strokeLinejoin="round" />
      <path d="M70 60 L120 10 L440 10 L490 60" stroke="#ef4444" strokeWidth={10} fill="none" />
      {[...Array(14)].map((_, i) => <path key={i} d={`M${70 + i * 32} 50 L${70 + i * 32} 345`} stroke="#ffffffcc" strokeWidth={3} />)}
      {[...Array(9)].map((_, i) => <path key={`h${i}`} d={`M50 ${70 + i * 32} L510 ${70 + i * 32}`} stroke="#ffffffcc" strokeWidth={3} />)}
    </svg>
  </div>
);
const BeachChair: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <svg width={520} height={360} style={{ position: "absolute", left: x, top: y }}>
    <path d="M40 340 L180 120 M300 340 L170 130" stroke="#92400e" strokeWidth={14} strokeLinecap="round" />
    <path d="M60 230 L420 230 L470 60" stroke="#92400e" strokeWidth={14} fill="none" strokeLinecap="round" />
    <path d="M80 220 L410 220 L455 70 L400 60 L360 200 L90 200 Z" fill="url(#stripe)" stroke="#2b2622" strokeWidth={5} />
    <defs><pattern id="stripe" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="20" height="40" fill="#f97316" /><rect x="20" width="20" height="40" fill="#fff" /></pattern></defs>
  </svg>
);

// ------------------------------------------------------------------ shots (t = seconds from start)
type Shot = { from: number; Comp: React.FC<{ t: number; lf: number }> };
const push = (lf: number, a = 1, b = 1.06, dur = 4) => interpolate(lf, [0, F(dur)], [a, b], soft);
const SHOTS: Shot[] = [
  { from: 0, Comp: ({ t, lf }) => ( // hook: Walt on the bench, arms crossed
    <AbsoluteFill style={{ transform: `scale(${push(lf, 1, 1.1, 6)})` }}><LockerRoom />
      <Actor who="walt" t={t} size={600} x={240} y={600} mood="grumpy" pose="crossed" sitting />
      <div style={{ position: "absolute", left: 880, top: 1090 }}><Mascot who="pucky" size={150} mood="talk" noSticker seed="h1" /></div>
    </AbsoluteFill>) },
  { from: 5.75, Comp: ({ t, lf }) => <AbsoluteFill><LockerRoom /><Close who="walt" t={t} mood="grumpy" pose="crossed" zoom={push(lf, 1.05, 1.0, 0.4)} /></AbsoluteFill> },
  { from: 7.1, Comp: ({ t, lf }) => ( // Rookie bursts in with cake
    <AbsoluteFill><LockerRoom />
      <Actor who="walt" t={t} size={520} x={520} y={660} mood="grumpy" pose="crossed" sitting />
      <Actor who="rookie" t={t} size={480} x={interpolate(lf, [0, F(0.5)], [-400, 20], soft)} y={600} mood="happy" pose="point" hold={Cake} />
    </AbsoluteFill>) },
  { from: 10.3, Comp: ({ t }) => <AbsoluteFill><LockerRoom /><Close who="walt" t={t} mood="grumpy" pose="point" cx={560} /></AbsoluteFill> },
  { from: 12.5, Comp: ({ t }) => ( // pillow
    <AbsoluteFill><LockerRoom /><Close who="rookie" t={t} mood="happy" pose="point" cx={480} size={1100} /><svg style={{ position: "absolute", left: 640, top: 900 }} width={400} height={300} viewBox="-200 -150 400 300"><g transform="scale(1.6)">{Pillow}</g></svg></AbsoluteFill>) },
  { from: 14.55, Comp: ({ t }) => <AbsoluteFill><LockerRoom /><Close who="walt" t={t} mood="smug" cx={560} /></AbsoluteFill> },
  { from: 16.6, Comp: ({ t }) => ( // globe
    <AbsoluteFill><LockerRoom /><Close who="rookie" t={t} mood="happy" pose="point" cx={480} size={1100} /><svg style={{ position: "absolute", left: 650, top: 820 }} width={400} height={400} viewBox="-200 -250 400 400"><g transform="scale(1.9)">{Globe}</g></svg></AbsoluteFill>) },
  { from: 18.75, Comp: ({ t, lf }) => <AbsoluteFill><LockerRoom /><Close who="walt" t={t} mood="smug" cx={560} zoom={push(lf, 1, 1.12, 2)} /><div style={{ position: "absolute", left: 120, top: 330, fontFamily: FONT, fontWeight: 900, fontSize: 150, color: "#fff", WebkitTextStroke: "8px #2b2622", paintOrder: "stroke fill", opacity: t > 19.3 ? 1 : 0 }}>?</div></AbsoluteFill> },
  { from: 21.15, Comp: ({ t }) => ( // Rookie nervous
    <AbsoluteFill><LockerRoom />
      <Actor who="walt" t={t} size={520} x={520} y={660} mood="grumpy" pose="crossed" sitting />
      <Actor who="rookie" t={t} size={470} x={40} y={610} mood="sad" pose="shrug" />
    </AbsoluteFill>) },
  { from: 23.85, Comp: ({ t, lf }) => ( // "Who's the new goalie?" → dramatic zoom during the pause
    <AbsoluteFill><LockerRoom /><Close who="walt" t={t} mood={t > 25 ? "shock" : "grumpy"} cx={560} zoom={interpolate(lf, [F(1.2), F(3.2)], [1, 1.35], soft)} />
      {t > 25.2 && [...Array(10)].map((_, i) => <div key={i} style={{ position: "absolute", left: 540, top: 700, width: 1400, height: 6, background: "#2b262233", transform: `rotate(${i * 36}deg)`, transformOrigin: "0 0" }} />)}
    </AbsoluteFill>) },
  { from: 26.95, Comp: ({ t }) => <AbsoluteFill><LockerRoom /><Close who="rookie" t={t} mood="sad" pose="shrug" cx={540} size={1050} /></AbsoluteFill> },
  { from: 29.3, Comp: ({ t, lf }) => ( // Walt stands: "Fine, kid. The net is yours."
    <AbsoluteFill style={{ transform: `scale(${push(lf, 1, 1.05, 2)})` }}><LockerRoom />
      <Actor who="rookie" t={t} size={440} x={60} y={660} mood="shock" />
      <Actor who="walt" t={t} size={560} x={interpolate(lf, [0, F(0.6)], [540, 470], soft)} y={interpolate(lf, [0, F(0.6)], [700, 560], soft)} mood="smug" pose="point" />
    </AbsoluteFill>) },
  { from: 31.55, Comp: ({ t, lf }) => { // rink: Rookie alone in net, Pucky incoming
    const k = interpolate(t, [33.4, 35.6], [0, 1], soft);
    const shake = Math.sin(t * 40) * 4;
    return (<AbsoluteFill><Rink /><Net x={260} y={880} />
      <Actor who="rookie" t={t} size={440} x={320 + shake} y={720} mood="shock" pose="up" />
      <div style={{ position: "absolute", left: interpolate(k, [0, 1], [1100, 640]), top: interpolate(k, [0, 1], [760, 900]) - Math.sin(k * Math.PI) * 120, transform: `rotate(${-k * 540}deg)` }}><Mascot who="pucky" size={k > 0 ? 180 + k * 120 : 220} mood="laugh" noSticker seed="hlp" open={talk("pucky", t)} talking={talk("pucky", t) > 0} /></div>
      {t > 35.1 && <Pow text="SAVE?!" x={540} y={420} size={150} rot={8} />}
      {lf < 2 && null}
    </AbsoluteFill>); } },
  { from: 37.85, Comp: ({ t, lf }) => ( // reveal: Walt in a beach chair right behind the net
    <AbsoluteFill style={{ transform: `scale(${interpolate(lf, [0, F(5.5)], [1, 1.14], soft)})`, transformOrigin: "60% 55%" }}><Rink />
      <BeachChair x={430} y={800} />
      <Actor who="walt" t={t} size={520} x={470} y={610} mood="smug" pose="wave" sitting shades hold={Juice} />
      <Net x={-120} y={900} />
      <Actor who="rookie" t={t} size={380} x={-30} y={860} mood="shock" />
      <div style={{ position: "absolute", left: 140, top: 1180 }}><Mascot who="pucky" size={150} mood="dizzy" noSticker seed="hlpd" /></div>
    </AbsoluteFill>) },
];
const RANGES = SHOTS.map((s, i) => ({ ...s, to: SHOTS[i + 1]?.from ?? END }));

// ------------------------------------------------------------------ captions: big, centred, word-by-word
const CHUNKS = (() => {
  const out: Wd[][] = [];
  let cur: Wd[] = [];
  WORDS.forEach((w, i) => {
    cur.push(w);
    const next = WORDS[i + 1];
    if (!next || next.segment !== w.segment || cur.length >= 3 || /[.?!,]$/.test(w.word)) { out.push(cur); cur = []; }
  });
  return out;
})();
const Captions: React.FC<{ t: number }> = ({ t }) => {
  const i = CHUNKS.findIndex((c, k) => t >= c[0].start - 0.05 && t < (CHUNKS[k + 1]?.[0].start ?? 999) - 0.05);
  if (i < 0) return null;
  const c = CHUNKS[i]; if (t > c[c.length - 1].end + 0.6) return null;
  const pop = interpolate(t, [c[0].start - 0.05, c[0].start + 0.08], [0.85, 1], clamp);
  const narr = c[0].segment[0] === "n";
  return (
    <div style={{ position: "absolute", left: 60, right: 170, top: 1360, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: narr ? 78 : 96, lineHeight: 1.05, textTransform: "uppercase", transform: `scale(${pop})`, zIndex: 9, fontStyle: narr ? "italic" : "normal" }}>
      {c.map((w, k) => { const on = t >= w.start && t <= w.end + 0.05; return <span key={k} style={{ display: "inline-block", margin: "0 14px", color: on ? "#fde047" : "#fff", WebkitTextStroke: "11px #111", paintOrder: "stroke fill", transform: on ? "scale(1.1) rotate(-2deg)" : undefined }}>{w.display.replace(/^\.\.\./, "…")}</span>; })}
    </div>
  );
};

const OutroHL: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: interpolate(f, [0, 12], [0, 1], clamp) }}><LockerRoom light={0.6} />
      <AbsoluteFill style={{ background: "#0008" }} />
      <div style={{ position: "absolute", top: 380, left: 0, right: 0 }}><Logo scale={0.85} /></div>
      <div style={{ position: "absolute", top: 700, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontStyle: "italic", fontSize: 96, color: "#fde047", WebkitTextStroke: "8px #111", paintOrder: "stroke fill" }}>HOCKEY LIFE</div>
      <div style={{ position: "absolute", top: 830, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 50, color: "#fff" }}>Follow for episode 2 👀</div>
      <div style={{ position: "absolute", left: 60, top: 1000 }}><StickPerson who="rookie" size={300} mood="happy" pose="wave" seed={3} /></div>
      <div style={{ position: "absolute", left: 640, top: 1050 }}><StickPerson who="walt" size={340} mood="smug" pose="crossed" sitting shades seed={4} /></div>
      <div style={{ position: "absolute", left: 420, top: 1260 }}><Mascot who="pucky" size={190} mood="laugh" noSticker seed="ohl" /></div>
      <Sequence from={4}><Audio src={staticFile("brand/outro_vo.mp3")} /></Sequence>
    </AbsoluteFill>
  );
};

export const HockeyLife01: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: "#111", overflow: "hidden" }}>
      <Audio src={staticFile("ep/hl01.mp3")} />
      <Audio src={staticFile("music.wav")} volume={(fr) => (fr < F(END) ? 0.18 : 0.3)} />
      {RANGES.map((s) => { const C = s.Comp; return <Sequence key={s.from} from={F(s.from)} durationInFrames={F(s.to) - F(s.from)}><C t={t} lf={f - F(s.from)} /></Sequence>; })}
      {RANGES.slice(1).map((s) => <Sequence key={`p${s.from}`} from={F(s.from)} durationInFrames={20}><Audio src={staticFile(s.from === 31.55 || s.from === 37.85 ? "whoosh.wav" : "pop.wav")} volume={0.25} /></Sequence>)}
      <Sequence from={F(31.55) - 20} durationInFrames={40}><IceWipe dur={40} y={900} /><Audio src={staticFile("sfx/scrape.wav")} volume={0.5} /></Sequence>
      <Sequence from={F(35.1)} durationInFrames={60}><Audio src={staticFile("sfx/horn.wav")} volume={0.3} /></Sequence>
      <Sequence from={F(37.9)} durationInFrames={F(3)}><Audio src={staticFile("sfx/crowd.wav")} volume={0.25} /></Sequence>
      {t < 3.2 && <div style={{ position: "absolute", left: 0, right: 0, top: 230, textAlign: "center", opacity: interpolate(t, [0, 0.2, 2.8, 3.2], [0, 1, 1, 0]), zIndex: 9 }}><span style={{ display: "inline-block", background: "#111", color: "#fde047", fontFamily: FONT, fontWeight: 900, fontSize: 50, padding: "10px 24px", transform: "rotate(-2deg)" }}>THE GOALIE WHO REFUSED TO RETIRE</span></div>}
      {t < END && <Captions t={t} />}
      {t < END && <div style={{ position: "absolute", left: 52, top: 140, padding: "4px 12px", background: "#111", color: "#fde047", fontWeight: 900, fontSize: 22, letterSpacing: 2, zIndex: 8 }}>ZAM · HOCKEY LIFE #1</div>}
      <Sequence from={F(END)}><OutroHL /></Sequence>
    </AbsoluteFill>
  );
};
void random;
