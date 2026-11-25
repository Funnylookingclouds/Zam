/** ZAM pilot (2.5D neon diorama arena, original gang, Expressions 2.0) – "Pucky Gets the Stanley Cup".
 *  Facts: 1924 Canadiens players left the Cup by the roadside (snowbank); 1991 Mario Lemieux tested if the Cup floats
 *  in his pool (it sank); Hall of Fame engraving errors incl. "BQSTQN BRUINS" (1971-72). New intro jingle. */
import React from "react";
import { AbsoluteFill, Audio, Easing, Sequence, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import words from "../data/cup_words.json";
import { HAND, clamp } from "../presenter/kit";
import { FONT } from "../theme";
import { Mascot, mouthOpen, type Mood, type Who } from "../mascots/Gang";
import { Cut, Diorama, SplitDepth, dframe, dlerp, type DCam } from "../hl3d/Diorama";
import { Logo } from "../zam/common";
import { FPS } from "../zam/Episode";
import { Pow } from "../zam/toon";

type Wd = { word: string; display: string; start: number; end: number; segment: string };
const WORDS = words as Wd[];
const LAST = WORDS[WORDS.length - 1].end;
const INTRO = 2.9, END = LAST + 0.7, OUTRO = 3.0;
const F = (s: number) => Math.round(s * FPS);
export const CUP_FRAMES = F(INTRO + END + OUTRO);
const soft = { ...clamp, easing: Easing.inOut(Easing.sin) };
const back = { ...clamp, easing: Easing.out(Easing.back(1.8)) };
const WHO: Record<string, Who> = { p: "pucky", h: "helmy", z: "zam", b: "biscuit", c: "clubby" };
const talk = (who: Who, t: number) => { const ws = WORDS.filter((w) => WHO[w.segment[0]] === who); return ws.some((w) => t >= w.start - 0.05 && t <= w.end + 0.05) ? mouthOpen(ws, t) : 0; };
const bump = (who: Who, t: number) => { const w = WORDS.find((x) => t >= x.start && t <= x.end && WHO[x.segment[0]] === who); return w ? Math.max(0, 1 - (t - w.start) * 5) : 0; };
const camAt = (t: number, t0: number, t1: number, a: DCam, b: DCam) => dlerp(a, b, interpolate(t, [t0, t1], [0, 1], soft));

/** A gang member in the diorama: lip-sync, word hop, expressions. */
const G: React.FC<{ who: Who; t: number; cam: DCam; x: number; z: number; size: number; mood: Mood; y?: number; flip?: boolean; lookAt?: number; tilt?: number; children?: React.ReactNode }> = (p) => {
  const o = talk(p.who, p.t); const b = bump(p.who, p.t);
  return (
    <Cut x={p.x} z={p.z} y={(p.y ?? 0) - b * 22} cam={p.cam} size={p.size} toon tilt={p.tilt}>
      <div style={{ position: "relative" }}>
        <Mascot who={p.who} size={p.size} mood={p.mood} open={o} talking={o > 0} noSticker flip={p.flip} lookAt={p.lookAt} seed={`cp${p.who}`} />
        {p.children}
      </div>
    </Cut>
  );
};
export const StanleyCup: React.FC<{ size?: number; plate?: boolean }> = ({ size = 200, plate }) => (
  <svg width={size} height={size * 1.7} viewBox="-100 -170 200 340">
    <defs><linearGradient id="sv" x1="0" x2="1"><stop offset="0" stopColor="#9ca3af" /><stop offset="0.35" stopColor="#f8fafc" /><stop offset="0.6" stopColor="#cbd5e1" /><stop offset="1" stopColor="#6b7280" /></linearGradient></defs>
    {[0, 1, 2, 3].map((i) => <rect key={i} x={-90 + i * 4} y={110 - i * 34} width={180 - i * 8} height={34} fill="url(#sv)" stroke="#2b2622" strokeWidth={4} />)}
    {[0, 1, 2, 3].map((i) => <path key={`l${i}`} d={`M${-80 + i * 4} ${122 - i * 34} H${80 - i * 4}`} stroke="#94a3b8" strokeWidth={2} strokeDasharray="6 5" />)}
    <path d="M-52 -26 L52 -26 L40 8 L-40 8 Z" fill="url(#sv)" stroke="#2b2622" strokeWidth={4} />
    <rect x={-14} y={-60} width={28} height={36} fill="url(#sv)" stroke="#2b2622" strokeWidth={4} />
    <path d="M-70 -150 Q-70 -70 0 -62 Q70 -70 70 -150 Z" fill="url(#sv)" stroke="#2b2622" strokeWidth={5} />
    <ellipse cx={0} cy={-150} rx={70} ry={14} fill="#e2e8f0" stroke="#2b2622" strokeWidth={5} />
    <path d="M-48 -140 Q-46 -96 -20 -78" stroke="#fff" strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.8} />
    {plate && <rect x={-60} y={46} width={120} height={22} fill="#fde68a" stroke="#2b2622" strokeWidth={3} />}
  </svg>
);
const Octo: React.FC<{ s?: number; t: number }> = ({ s = 90, t }) => (
  <svg width={s} height={s} viewBox="-110 -110 220 220">{[...Array(8)].map((_, i) => { const a = (i / 8) * Math.PI + 0.1; const w = Math.sin(t * 6 + i) * 14; return <path key={i} d={`M${Math.cos(a) * 27} 20 Q${Math.cos(a) * 63 + w} ${30 + Math.sin(a) * 50} ${Math.cos(a) * 90} ${40 + Math.sin(a) * 60 + w * 0.3}`} stroke="#c026d3" strokeWidth={18} fill="none" strokeLinecap="round" />; })}<ellipse cx={0} cy={-10} rx={70} ry={62} fill="#d946ef" stroke="#2b2622" strokeWidth={6} />{[-24, 24].map((x) => <g key={x}><circle cx={x} cy={-20} r={16} fill="#fff" stroke="#2b2622" strokeWidth={4} /><circle cx={x + 3} cy={-18} r={7} fill="#2b2622" /></g>)}<path d="M-16 14 Q0 26 16 14" stroke="#2b2622" strokeWidth={5} fill="none" /></svg>
);
/** Sepia flashback "photo" card that slaps onto the screen. */
const Flashback: React.FC<{ t: number; at: number; year: string; children: React.ReactNode }> = ({ t, at, year, children }) => {
  const k = interpolate(t, [at, at + 0.35], [0, 1], back);
  return (
    <div style={{ position: "absolute", left: 90, top: 360, width: 900, height: 820, transform: `rotate(${-3 + (1 - k) * 20}deg) scale(${k})`, zIndex: 7, background: "#f3e7c9", padding: 26, boxSizing: "border-box", boxShadow: "0 30px 60px #000a", border: "4px solid #2b2622" }}>
      <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", filter: "sepia(0.75) contrast(1.05)", border: "4px solid #2b2622", background: "#cbd5e1" }}>{children}</div>
      <div style={{ position: "absolute", right: -30, top: -40, background: "#ef4444", color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 70, padding: "4px 22px", transform: "rotate(8deg)", border: "5px solid #2b2622" }}>{year}</div>
      <div style={{ position: "absolute", left: 26, bottom: -6, fontFamily: HAND, fontSize: 34, color: "#5b4636" }}>true story · source: NHL.com / Hockey Hall of Fame</div>
    </div>
  );
};
const RoadScene: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#94a3b8,#e2e8f0 60%,#f8fafc 61%)" }}>
    {[...Array(30)].map((_, i) => <div key={i} style={{ position: "absolute", left: random(`sn${i}`) * 840, top: ((t * 60 + random(`sy${i}`) * 760) % 760), width: 8, height: 8, borderRadius: 4, background: "#fff" }} />)}
    <svg width={840} height={760} style={{ position: "absolute" }}>
      <path d="M0 520 Q300 480 840 540 L840 760 L0 760 Z" fill="#f8fafc" />
      <g transform={`translate(${380 + interpolate(t, [8.5, 10.5], [0, 600], clamp)} 360)`}>
        <rect x={0} y={60} width={300} height={90} rx={16} fill="#1f2937" stroke="#111" strokeWidth={6} />
        <path d="M50 60 L90 10 L220 10 L250 60 Z" fill="#374151" stroke="#111" strokeWidth={6} />
        <circle cx={70} cy={160} r={34} fill="#111" /><ellipse cx={240} cy={170} rx={36} ry={24} fill="#111" />
        <text x={150} y={-20} textAnchor="middle" fontFamily="Caveat" fontSize={40} fill="#111">pssshhh…</text>
      </g>
    </svg>
    <div style={{ position: "absolute", left: 120, top: 380 }}><StanleyCup size={130} /></div>
    <div style={{ position: "absolute", left: 60, top: 600, fontFamily: HAND, fontSize: 48, color: "#111", transform: "rotate(-4deg)" }}>…forgot something? 🏆</div>
  </div>
);
const PoolScene: React.FC<{ t: number }> = ({ t }) => {
  const sink = interpolate(t, [19.2, 21.4], [0, 1], soft);
  return (
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#bae6fd 0 30%,#38bdf8 30%,#0369a1 100%)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 210, height: 26, background: "repeating-linear-gradient(90deg,#fff 0 40px,#e0f2fe 40px 80px)" }} />
      <div style={{ position: "absolute", left: 330, top: 120 + sink * 430, transform: `rotate(${sink * 25}deg)` }}><StanleyCup size={170} /></div>
      {[...Array(10)].map((_, i) => { const k = (t * 0.8 + i / 10) % 1; return <div key={i} style={{ position: "absolute", left: 380 + Math.sin(i * 2 + t * 3) * 60, top: 640 - k * 420, width: 18 + (i % 3) * 8, height: 18 + (i % 3) * 8, borderRadius: 20, border: "3px solid #fff", opacity: sink > 0.1 ? 1 - k : 0 }} />; })}
      <div style={{ position: "absolute", left: 40, top: 30, fontFamily: HAND, fontSize: 54, color: "#0c4a6e" }}>does it float? 🤔</div>
      {sink > 0.9 && <div style={{ position: "absolute", left: 480, top: 560, fontFamily: FONT, fontWeight: 900, fontSize: 64, color: "#fff", WebkitTextStroke: "6px #0c4a6e", paintOrder: "stroke fill", transform: "rotate(-8deg)" }}>NOPE.</div>}
    </div>
  );
};
const Plate: React.FC<{ t: number }> = ({ t }) => {
  const letters = "BQSTQN".split("");
  const w = WORDS.find((x) => x.word === "BQSTQN")!;
  const per = (w.end - w.start) / 6;
  return (
    <div style={{ position: "absolute", left: 60, top: 520, width: 960, height: 420, zIndex: 7, background: "linear-gradient(135deg,#cbd5e1,#f8fafc 40%,#94a3b8)", border: "10px solid #2b2622", borderRadius: 14, boxShadow: "0 30px 60px #000a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `scale(${interpolate(t, [30.8, 31.1], [0.6, 1], back)})` }}>
      <div style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 40, color: "#475569", letterSpacing: 4 }}>1971 – 72</div>
      <div style={{ display: "flex", gap: 4, marginTop: 10 }}>
        {letters.map((L, i) => { const on = t >= w.start + i * per; const q = L === "Q"; return <div key={i} style={{ fontFamily: "Georgia, serif", fontWeight: 900, fontSize: 100, color: on && q ? "#dc2626" : "#334155", transform: on ? `scale(${q ? 1.18 : 1.05}) rotate(${q ? -6 : 0}deg)` : "scale(1)", textShadow: on && q ? "0 0 20px #f87171" : "1px 1px 0 #fff" }}>{L}</div>; })}
        <div style={{ fontFamily: "Georgia, serif", fontWeight: 900, fontSize: 100, color: "#334155", marginLeft: 20 }}>BRUINS</div>
      </div>
      <div style={{ fontFamily: HAND, fontSize: 36, color: "#7a6f62", marginTop: 6 }}>really engraved like this · Hockey Hall of Fame</div>
    </div>
  );
};
const Flippers: React.FC = () => (
  <svg width={360} height={420} viewBox="-160 -170 320 360" style={{ position: "absolute", left: 0, top: 0 }}>
    <g><rect x={-80} y={-36} width={160} height={50} rx={22} fill="#22d3ee" fillOpacity={0.5} stroke="#2b2622" strokeWidth={6} /><path d="M80 -10 L120 -40 L118 -90" stroke="#f97316" strokeWidth={10} fill="none" strokeLinecap="round" /><circle cx={118} cy={-96} r={10} fill="#f97316" /></g>
    {[-1, 1].map((s) => <path key={s} d={`M${s * 50} 80 L${s * 90} 170 L${s * 20} 170 Z`} fill="#22c55e" stroke="#2b2622" strokeWidth={6} strokeLinejoin="round" />)}
  </svg>
);

// ------------------------------------------------------------------ shots
type Shot = { from: number; Comp: React.FC<{ t: number }> };
const SHOTS: Shot[] = [
  { from: 0, Comp: ({ t }) => { // hook: Pucky lifts the Cup – it breaks out over the frame
    const cam = camAt(t, 0, 3.9, dframe(0, -300, -800, 1300, 860, { rx: -4, ry: 6 }), dframe(0, -320, -800, 950, 840, { rx: -2, ry: -3 }));
    const lift = interpolate(t, [0.1, 0.8], [0, 1], back);
    return <SplitDepth over={<div style={{ position: "absolute", left: 400, top: 560 - lift * 330, transform: `rotate(${Math.sin(t * 4) * 6}deg)` }}><StanleyCup size={260} /></div>}>
      <Diorama cam={cam} t={t} cheer={1} jumbo={<Jumbo text="CUP DAY!" />}><G who="pucky" t={t} cam={cam} x={0} z={-800} size={400} mood={t < 2 ? "proud" : "laugh"} /><G who="helmy" t={t} cam={cam} x={520} z={-1050} size={300} mood="sweat" /></Diorama>
    </SplitDepth>; } },
  { from: 3.9, Comp: ({ t }) => { const cam = camAt(t, 3.9, 6.5, dframe(0, -260, -800, 760, 800), dframe(0, -260, -800, 640, 790));
    return <Diorama cam={cam} t={t} jumbo={<Jumbo text="HISTORY…" />}><G who="helmy" t={t} cam={cam} x={0} z={-800} size={420} mood="smug" /></Diorama>; } },
  { from: 6.5, Comp: ({ t }) => { const cam = dframe(0, -300, -800, 1300, 860);
    return <><Diorama cam={cam} t={t} jumbo={<Jumbo text="1924" />}><G who="helmy" t={t} cam={cam} x={-320} z={-800} size={340} mood="talk" /></Diorama><AbsoluteFill style={{ background: "#0008" }} /><Flashback t={t} at={6.7} year="1924"><RoadScene t={t} /></Flashback></>; } },
  { from: 11.7, Comp: ({ t }) => { const cam = camAt(t, 11.7, 13.9, dframe(0, -300, -800, 800, 800, { ry: 5 }), dframe(0, -300, -800, 700, 800, { ry: 5 }));
    return <Diorama cam={cam} t={t} jumbo={<Jumbo text="NO CAR" />}><G who="pucky" t={t} cam={cam} x={0} z={-800} size={420} mood="smug"><div style={{ position: "absolute", left: 120, top: 40, transform: "scale(0.55)", transformOrigin: "0 0" }}><StanleyCup size={200} /></div></G></Diorama>; } },
  { from: 13.9, Comp: ({ t }) => { const cam = dframe(100, -300, -800, 1100, 840); const k = interpolate(t, [13.9, 14.5], [0, 1], back);
    return <Diorama cam={cam} t={t} jumbo={<Jumbo text="BEEP BEEP" />}><G who="pucky" t={t} cam={cam} x={-300} z={-800} size={360} mood="wow" lookAt={10} /><G who="zam" t={t} cam={cam} x={1100 - k * 720} z={-760} size={400} mood="laugh" /></Diorama>; } },
  { from: 15.5, Comp: ({ t }) => { const cam = camAt(t, 15.5, 16.9, dframe(0, -260, -800, 620, 760), dframe(0, -260, -800, 460, 740));
    return <Diorama cam={cam} t={t} jumbo={<Jumbo text="UH OH" />}><G who="pucky" t={t} cam={cam} x={0} z={-800} size={420} mood="shock" /></Diorama>; } },
  { from: 16.9, Comp: ({ t }) => { const cam = dframe(0, -300, -800, 1300, 860);
    return <><Diorama cam={cam} t={t} jumbo={<Jumbo text="1991" />}><G who="helmy" t={t} cam={cam} x={-320} z={-800} size={340} mood="talk" /></Diorama><AbsoluteFill style={{ background: "#0008" }} /><Flashback t={t} at={17.1} year="1991"><PoolScene t={t} /></Flashback></>; } },
  { from: 22.2, Comp: ({ t }) => { const cam = camAt(t, 22.2, 23.9, dframe(0, -280, -820, 720, 790, { ry: -5 }), dframe(0, -280, -820, 640, 790, { ry: -5 }));
    return <Diorama cam={cam} t={t} jumbo={<Jumbo text="SPOILER" />}><G who="biscuit" t={t} cam={cam} x={0} z={-820} size={430} mood="smug" /></Diorama>; } },
  { from: 23.9, Comp: ({ t }) => { const cam = camAt(t, 23.9, 25.6, dframe(0, -300, -800, 760, 800), dframe(0, -300, -800, 660, 800)); const pop = interpolate(t, [23.9, 24.2], [0.3, 1], back);
    return <Diorama cam={cam} t={t} jumbo={<Jumbo text="DIVE!" />}><G who="pucky" t={t} cam={cam} x={0} z={-800} size={400} mood="laugh"><div style={{ position: "absolute", left: 20, top: 20, transform: `scale(${pop})`, transformOrigin: "50% 50%" }}><Flippers /></div></G></Diorama>; } },
  { from: 25.6, Comp: ({ t }) => { const cam = camAt(t, 25.6, 28.0, dframe(0, -280, -820, 680, 790, { ry: -5 }), dframe(0, -280, -820, 560, 780, { ry: -5 }));
    return <Diorama cam={cam} t={t} jumbo={<Jumbo text="SINKS." />}><G who="biscuit" t={t} cam={cam} x={0} z={-820} size={430} mood={t > 26.7 ? "smug" : "grumpy"} /></Diorama>; } },
  { from: 28.0, Comp: ({ t }) => { // Clubby engraving with hammer + sparks
    const cam = camAt(t, 28.0, 30.7, dframe(-100, -300, -800, 1000, 830, { ry: 8 }), dframe(-100, -300, -800, 860, 820, { ry: 8 }));
    const hit = Math.floor(t * 4) % 2 === 0;
    return <><Diorama cam={cam} t={t} jumbo={<Jumbo text="TAP TAP" />}><G who="clubby" t={t} cam={cam} x={-180} z={-800} size={400} mood="determined" tilt={hit ? -4 : 2} />
      <Cut x={200} z={-780} cam={cam} size={200} toon><StanleyCup size={200} plate /></Cut></Diorama>
      {hit && [...Array(10)].map((_, i) => <div key={i} style={{ position: "absolute", left: 600 + Math.cos(i) * (30 + random(`sp${i}${Math.floor(t * 4)}`) * 120), top: 1020 + Math.sin(i * 1.7) * (20 + random(`sq${i}${Math.floor(t * 4)}`) * 90), width: 10, height: 10, borderRadius: 5, background: "#fde047", boxShadow: "0 0 14px #facc15", zIndex: 6 }} />)}</>; } },
  { from: 30.7, Comp: ({ t }) => { const cam = dframe(0, -300, -800, 1300, 860);
    return <><Diorama cam={cam} t={t} jumbo={<Jumbo text="TYPO?" />}><G who="helmy" t={t} cam={cam} x={-320} z={-800} size={340} mood="smug" /><G who="clubby" t={t} cam={cam} x={320} z={-820} size={340} mood="sweat" /></Diorama><AbsoluteFill style={{ background: "#0007" }} /><Plate t={t} /></>; } },
  { from: 35.8, Comp: ({ t }) => { const cam = camAt(t, 35.8, 38.2, dframe(0, -300, -800, 700, 800, { ry: 4 }), dframe(0, -300, -800, 600, 790, { ry: 4 }));
    return <Diorama cam={cam} t={t} jumbo={<Jumbo text="Q = O" />}><G who="clubby" t={t} cam={cam} x={0} z={-800} size={420} mood="proud" /></Diorama>; } },
  { from: 38.2, Comp: ({ t }) => { const cam = camAt(t, 38.2, 41.3, dframe(0, -300, -800, 900, 820), dframe(0, -300, -800, 760, 800));
    return <Diorama cam={cam} t={t} jumbo={<Jumbo text="WHERE?!" />}><G who="pucky" t={t} cam={cam} x={0} z={-800} size={420} mood={t > 39.5 ? "scared" : "talk"} lookAt={Math.sin(t * 5) * 12} /></Diorama>; } },
  { from: 41.3, Comp: ({ t }) => { // Zam drives off with the Cup (octopus waving) – breaks out over the bottom bar
    const cam = dframe(0, -320, -900, 1500, 860, { rx: -4 });
    const k = interpolate(t, [41.3, 43.6], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
    return <SplitDepth over={<div style={{ position: "absolute", left: -360 + k * 1500, top: 1150 + k * 160, transform: `scale(${1 + k * 0.4})` }}><div style={{ position: "relative" }}><Mascot who="zam" size={360} mood="laugh" noSticker seed="zend" /><div style={{ position: "absolute", left: 120, top: -170 }}><StanleyCup size={130} /></div><div style={{ position: "absolute", left: 150, top: -230 }}><Octo t={t} s={80} /></div></div></div>}>
      <Diorama cam={cam} t={t} cheer={1} jumbo={<Jumbo text="1924 vibes" />}><G who="pucky" t={t} cam={cam} x={240} z={-950} size={320} mood="shock" lookAt={12} /><G who="biscuit" t={t} cam={cam} x={-420} z={-700} size={380} mood="smug" /></Diorama>
    </SplitDepth>; } },
];
const RANGES = SHOTS.map((s, i) => ({ ...s, to: SHOTS[i + 1]?.from ?? END }));
function Jumbo({ text }: { text: string }) { return <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 70, color: "#fde047", textShadow: "0 0 18px #facc15", background: "repeating-linear-gradient(0deg,#0000 0 4px,#0003 4px 6px)" }}>{text}</div>; }

const FACTS: [number, number, string, string][] = [
  [7.2, 11.6, "1924 · CUP LEFT BY THE ROADSIDE", "Canadiens players · found where they left it, in the snow"],
  [17.6, 22.1, "1991 · DOES IT FLOAT?", "Mario Lemieux tested it in his pool – it sank"],
];
const Fact: React.FC<{ t: number }> = ({ t }) => {
  const f = FACTS.find(([a, b]) => t >= a && t <= b); if (!f) return null;
  const k = interpolate(t, [f[0], f[0] + 0.25], [0, 1], back);
  return <div style={{ position: "absolute", left: 60, top: 1215, zIndex: 9, transform: `rotate(-2deg) scale(${k})`, transformOrigin: "0 50%", background: "#fbf6ea", border: "5px solid #2b2622", borderRadius: 6, padding: "8px 20px", boxShadow: "0 10px 0 #0006", maxWidth: 840 }}><div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 36, color: "#2b2622" }}>{f[2]}</div><div style={{ fontFamily: HAND, fontSize: 28, color: "#7a6f62" }}>{f[3]}</div></div>;
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
/** New 2.5D intro with the jingle: camera whips into the arena, gang pops on the beat, logo + "ZAM!" on the final hit. */
const Intro2: React.FC = () => {
  const f = useCurrentFrame(); const t = f / FPS;
  const cam = dlerp(dframe(0, -900, -1600, 2600, 1100, { rx: -14, ry: -25 }), dframe(0, -320, -800, 1300, 860, { rx: -3 }), interpolate(t, [0, 1.4], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) }));
  const hit = t > 1.48;
  const gang: Who[] = ["clubby", "helmy", "pucky", "biscuit", "zam"];
  return (
    <AbsoluteFill style={{ transform: hit && t < 1.75 ? `translate(${Math.sin(t * 90) * 10}px, ${Math.cos(t * 80) * 8}px)` : undefined }}>
      <Diorama cam={cam} t={t} cheer={hit ? 1 : 0.5} pulse={hit ? 0.6 : 0} jumbo={<Jumbo text="ZAM!" />}>
        {gang.map((w, i) => { const pop = interpolate(t, [0.5 + i * 0.16, 0.75 + i * 0.16], [0, 1], back); return <Cut key={w} x={-760 + i * 380} z={-850 - (i % 2) * 120} cam={cam} size={300 * pop + 1} toon><Mascot who={w} size={300 * pop + 1} mood={hit ? "laugh" : "wow"} open={hit ? 0.8 : 0} talking={hit} noSticker seed={`in${w}`} /></Cut>; })}
      </Diorama>
      <div style={{ position: "absolute", top: 300, left: 0, right: 0, transform: `scale(${interpolate(t, [1.45, 1.65], [2.4, 1], back)})`, opacity: interpolate(t, [1.4, 1.5], [0, 1], clamp) }}><Logo scale={1.1} /></div>
      {hit && <AbsoluteFill style={{ background: "#fff", opacity: interpolate(t, [1.48, 1.7], [0.7, 0], clamp) }} />}
      <Audio src={staticFile("brand/jingle_zam.mp3")} />
    </AbsoluteFill>
  );
};
const Outro2: React.FC = () => {
  const f = useCurrentFrame(); const t = f / FPS;
  const cam = dframe(0, -320, -800, 1500, 860, { rx: -3, ry: Math.sin(t) * 3 });
  const gang: Who[] = ["clubby", "helmy", "pucky", "biscuit", "zam"];
  return (
    <AbsoluteFill style={{ opacity: interpolate(f, [0, 12], [0, 1], clamp) }}>
      <Diorama cam={cam} t={t} cheer={1} jumbo={<Jumbo text="FOLLOW!" />}>{gang.map((w, i) => <Cut key={w} x={-760 + i * 380} z={-850 - (i % 2) * 120} cam={cam} size={300} toon><Mascot who={w} size={300} mood={i % 2 ? "love" : "laugh"} noSticker seed={`out${w}`} /></Cut>)}</Diorama>
      <div style={{ position: "absolute", top: 260, left: 0, right: 0 }}><Logo scale={0.9} /></div>
      <div style={{ position: "absolute", top: 1450, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 60, color: "#fff", WebkitTextStroke: "7px #111", paintOrder: "stroke fill" }}>Follow for more 👀<br /><span style={{ fontSize: 44, color: "#fde047" }}>Did you find the octopus? 🐙</span></div>
      <Sequence from={4}><Audio src={staticFile("brand/outro_vo.mp3")} /></Sequence>
    </AbsoluteFill>
  );
};

export const CupPilot25D: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS - INTRO;
  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: "#0b0716", overflow: "hidden" }}>
      <Sequence from={F(INTRO)}><Audio src={staticFile("ep/cup.mp3")} /></Sequence>
      <Sequence from={F(INTRO)}><Audio src={staticFile("music_happy.mp3")} volume={(fr) => (fr < F(END) ? 0.24 : 0.4)} /></Sequence>
      {RANGES.map((s) => { const C = s.Comp; return <Sequence key={s.from} from={F(INTRO + s.from)} durationInFrames={F(INTRO + s.to) - F(INTRO + s.from)}><AbsoluteFill style={{ overflow: "hidden" }}><C t={t} /></AbsoluteFill></Sequence>; })}
      {RANGES.slice(1).map((s) => <Sequence key={`p${s.from}`} from={F(INTRO + s.from)} durationInFrames={20}><Audio src={staticFile([6.5, 16.9, 30.7, 41.3].includes(s.from) ? "whoosh.wav" : "pop.wav")} volume={0.22} /></Sequence>)}
      <Sequence from={F(INTRO + 14.0)} durationInFrames={F(1)}><Audio src={staticFile("sfx/horn.wav")} volume={0.18} /></Sequence>
      {t >= 0 && t < END && <Fact t={t} />}
      {t >= 0 && t < END && <Captions t={t} />}
      {t >= 0 && t < END && <div style={{ position: "absolute", left: 52, top: 140, padding: "4px 12px", background: "#ff2bd6", color: "#fff", fontWeight: 900, fontSize: 22, letterSpacing: 2, zIndex: 9 }}>ZAM · STANLEY CUP DAY</div>}
      {t >= 0 && t < 2.5 && <Pow text="ONE DAY!" x={560} y={250} size={120} rot={8} />}
      <Sequence from={0} durationInFrames={F(INTRO) + 2}><Intro2 /></Sequence>
      <Sequence from={F(INTRO + END)}><Outro2 /></Sequence>
    </AbsoluteFill>
  );
};
