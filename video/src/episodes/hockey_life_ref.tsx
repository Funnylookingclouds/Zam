/** ZAM Hockey Life Special – "The Ref Who Couldn't Stop Apologising". Faster dialogue, characters that move
 *  (skating, leaning, gesture blends with overshoot), cinematic camera (crane, whip pans, dutch angles, slow-mo,
 *  snap zooms, foreground blur, spotlights). 2 s branded intro. */
import React from "react";
import { AbsoluteFill, Audio, Easing, Sequence, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import words from "../data/hlref_words.json";
import { clamp } from "../presenter/kit";
import { FONT } from "../theme";
import { Mascot, mouthOpen } from "../mascots/Gang";
import { StickPerson, type StickMood, type StickPose, type StickWho } from "../mascots/Stick";
import { FightCloud, IceWipe, Logo } from "../zam/common";
import { FPS } from "../zam/Episode";
import { Pow } from "../zam/toon";

type Wd = { word: string; display: string; start: number; end: number; segment: string };
const WORDS = words as Wd[];
const LAST = WORDS[WORDS.length - 1].end;
const INTRO = 2.0, END = LAST + 0.5, OUTRO = 3.0;
const F = (s: number) => Math.round(s * FPS);
export const HLREF_FRAMES = F(INTRO + END + OUTRO);
const soft = { ...clamp, easing: Easing.inOut(Easing.sin) };
const back = { ...clamp, easing: Easing.out(Easing.back(1.7)) };
const WHO: Record<string, string> = { n: "narrator", f: "ref", g: "gus", w: "walt", r: "rookie", p: "pucky" };
const talk = (who: string, t: number) => { const ws = WORDS.filter((w) => WHO[w.segment[0]] === who); return ws.some((w) => t >= w.start - 0.05 && t <= w.end + 0.05) ? mouthOpen(ws, t) : 0; };
const bump = (who: string, t: number) => { const w = WORDS.find((x) => t >= x.start && t <= x.end && WHO[x.segment[0]] === who); return w ? Math.max(0, 1 - (t - w.start) * 5) : 0; };

/** Keyframed numeric arrays with overshoot between keys. */
const kf = (t: number, keys: [number, number[]][], ease = back): number[] => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [a, va] = keys[i], [b, vb] = keys[i + 1];
    if (t < b) { const k = interpolate(t, [a, b], [0, 1], ease); return va.map((v, j) => v + (vb[j] - v) * k); }
  }
  return keys[keys.length - 1][1];
};
type A4 = [number, number, number, number];
const ARM: Record<string, A4> = { idle: [-78, -30, 78, -30], flail1: [-150, -230, 130, -60], flail2: [-120, -60, 150, -240], up: [-120, -260, 120, -260], two: [-78, -30, 110, -280], whistle: [-78, -30, 22, -200], fist: [-60, -120, 150, -200], point: [-78, -30, 175, -150], rest: [-70, -10, 70, -10], wave: [-78, -30, 120, -250] };

const Actor: React.FC<{ who: StickWho; t: number; size: number; x: number; y: number; mood: StickMood; pose?: StickPose; arms?: A4; skate?: number; lean?: number; headTurn?: number; headTilt?: number; flip?: boolean; sitting?: boolean; hold?: React.ReactNode; rot?: number }> = (p) => {
  const b = bump(p.who, p.t);
  return (
    <div style={{ position: "absolute", left: p.x, top: p.y - b * 16, transform: `rotate(${p.rot ?? 0}deg) scale(${1 + b * 0.035}, ${1 - b * 0.035})`, transformOrigin: "50% 100%" }}>
      <StickPerson who={p.who} size={p.size} mood={p.mood} pose={p.pose} arms={p.arms} skate={p.skate} lean={p.lean} headTurn={p.headTurn} headTilt={p.headTilt} open={talk(p.who, p.t)} flip={p.flip} sitting={p.sitting} hold={p.hold} seed={p.who.length} />
    </div>
  );
};
/** Camera: keyframes [t, scale, x, y, rot] around the frame centre. */
const Cam: React.FC<{ t: number; keys: [number, number, number, number, number][]; shake?: number; children: React.ReactNode }> = ({ t, keys, shake = 0, children }) => {
  const [s, x, y, r] = kf(t, keys.map(([a, ...v]) => [a, v] as [number, number[]]), soft);
  const sx = shake ? Math.sin(t * 53) * shake : 0, sy = shake ? Math.cos(t * 47) * shake : 0;
  return <AbsoluteFill style={{ transform: `translate(${x + sx}px, ${y + sy}px) rotate(${r}deg) scale(${s})`, transformOrigin: "540px 960px" }}>{children}</AbsoluteFill>;
};
const Whistle = <g transform="translate(-10 -10)"><rect x={0} y={-8} width={34} height={20} rx={8} fill="#cbd5e1" stroke="#2b2622" strokeWidth={4} /><circle cx={30} cy={2} r={10} fill="#cbd5e1" stroke="#2b2622" strokeWidth={4} /></g>;

// ------------------------------------------------------------------ arena set (painted, with depth layers)
const Crowd: React.FC<{ t: number; top: number; rows?: number; dark?: number; cheer?: number }> = ({ t, top, rows = 4, dark = 0.6, cheer = 0 }) => (
  <>{[...Array(rows * 16)].map((_, i) => {
    const r = Math.floor(i / 16), c = i % 16, ph = random(`cr${i}`) * 6;
    const hop = Math.max(0, Math.sin(t * (3 + cheer * 6) + ph)) * (4 + cheer * 22);
    return <div key={i} style={{ position: "absolute", left: c * 70 + (r % 2) * 35 - 30, top: top + r * 70 - hop, width: 50, height: 74, borderRadius: "25px 25px 8px 8px", background: ["#475569", "#64748b", "#334155", "#7c3aed", "#b91c1c"][Math.floor(random(`cc${i}`) * 5)], opacity: dark }}>{cheer > 0.5 && i % 3 === 0 && <div style={{ position: "absolute", left: 16, top: -30, width: 14, height: 32, borderRadius: 7, background: "inherit" }} />}</div>;
  })}</>
);
const Jumbo: React.FC<{ text: string; x?: number; y?: number }> = ({ text, x = 240, y = 190 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 600, height: 170, background: "#0f172a", border: "10px solid #1e293b", borderRadius: 12, boxShadow: "0 0 50px #38bdf855", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 60, whiteSpace: "nowrap", color: "#fde047", textShadow: "0 0 18px #facc15" }}>{text}</div>
);
const Arena: React.FC<{ t: number; jumbo?: string; cheer?: number; spot?: [number, number] }> = ({ t, jumbo = "HOME 1 – 1 AWAY", cheer = 0, spot }) => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg,#0b1220 0%,#1e293b 38%,#e2e8f0 38.2%,#eaf6ff 52%,#d4eaf8 100%)" }}>
    <Crowd t={t} top={300} rows={6} cheer={cheer} />
    <Jumbo text={jumbo} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 640, height: 90, background: "linear-gradient(180deg,#ffffff66,#ffffff22)", borderTop: "5px solid #cbd5e1" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 725, height: 85, background: "#fff", borderTop: "8px solid #2b2622", borderBottom: "14px solid #f59e0b", display: "flex", gap: 60, alignItems: "center", paddingLeft: 40, fontFamily: FONT, fontWeight: 900, fontSize: 40, color: "#1e3a8a" }}><span>ZAM ICE</span><span style={{ color: "#b91c1c" }}>PUCKY'S</span><span>HOCKEY LIFE</span><span style={{ color: "#b91c1c" }}>ZAM ICE</span></div>
    <div style={{ position: "absolute", left: -200, right: -200, top: 1080, height: 16, background: "#ef4444aa" }} />
    <div style={{ position: "absolute", left: 340, top: 1240, width: 400, height: 160, borderRadius: "50%", border: "8px solid #3b82f699" }} />
    <AbsoluteFill style={{ background: "repeating-linear-gradient(100deg,#ffffff00 0 60px,#ffffff10 60px 64px)" }} />
    {spot && <AbsoluteFill style={{ background: `radial-gradient(ellipse 300px 520px at ${spot[0]}px ${spot[1]}px, #fff7d655 0%, #fff7d622 50%, #0b122099 100%)` }} />}
    {spot && <svg width={1080} height={1920} style={{ position: "absolute", opacity: 0.22 }}><path d={`M${spot[0] - 40} -100 L${spot[0] + 40} -100 L${spot[0] + 260} ${spot[1] + 300} L${spot[0] - 260} ${spot[1] + 300} Z`} fill="#fff7d6" /></svg>}
  </AbsoluteFill>
);
/** Blurred foreground layer (glass edge + crowd heads) for depth. */
const Foreground: React.FC<{ t: number; heads?: boolean; glass?: boolean; px?: number }> = ({ t, heads = true, glass = false, px = 0 }) => (
  <AbsoluteFill style={{ pointerEvents: "none", zIndex: 6, transform: `translateX(${px}px)` }}>
    {heads && [...Array(6)].map((_, i) => <div key={i} style={{ position: "absolute", left: -60 + i * 220, top: 1700 - Math.max(0, Math.sin(t * 3 + i)) * 20, width: 240, height: 300, borderRadius: "120px 120px 30px 30px", background: "#0b1220", filter: "blur(10px)", opacity: 0.85 }} />)}
    {glass && <div style={{ position: "absolute", left: 960, top: 0, width: 40, height: 1920, background: "linear-gradient(90deg,#94a3b855,#e2e8f0aa,#94a3b855)", filter: "blur(4px)" }} />}
  </AbsoluteFill>
);
const Vignette: React.FC = () => <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 55%, #000a 100%)", zIndex: 7, pointerEvents: "none" }} />;
const PenaltyBox: React.FC<{ t: number; warm?: boolean }> = ({ warm }) => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg,#0b1220 0%,#1e293b 40%,#475569 40.2%,#334155 100%)" }}>
    <div style={{ position: "absolute", left: 120, top: 240, width: 840, height: 120, background: "#111", border: "8px solid #b91c1c", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 80, color: "#f87171", textShadow: "0 0 20px #ef4444", letterSpacing: 8 }}>PENALTY</div>
    <div style={{ position: "absolute", left: 60, top: 420, width: 960, height: 760, background: "linear-gradient(135deg,#ffffff22,#ffffff08 40%,#ffffff22)", border: "10px solid #94a3b8", borderRadius: 10 }} />
    <div style={{ position: "absolute", left: 60, top: 1050, width: 960, height: 50, background: "#78350f", border: "6px solid #2b2622" }} />
    {warm && <AbsoluteFill style={{ background: "radial-gradient(ellipse 380px 520px at 540px 860px, #fde68a55, #00000066 90%)" }} />}
  </AbsoluteFill>
);

// ------------------------------------------------------------------ shots (t = news time; video = t + INTRO)
type Shot = { from: number; Comp: React.FC<{ t: number }> };
const Close: React.FC<{ who: StickWho; t: number; mood: StickMood; arms?: A4; cx?: number; cy?: number; size?: number; hold?: React.ReactNode; headTilt?: number; lean?: number }> = ({ who, t, mood, arms, cx = 540, cy = 640, size = 1200, hold, headTilt, lean }) => {
  const H = size * 1.3, headY = (155 / 520) * H;
  return <Actor who={who} t={t} size={size} x={cx - size / 2} y={cy - headY} mood={mood} arms={arms} hold={hold} headTilt={headTilt} lean={lean} />;
};
const SHOTS: Shot[] = [
  { from: 0, Comp: ({ t }) => ( // crane down onto the trembling Ref in a spotlight
    <><Cam t={t} keys={[[0, 1.35, 0, 520, 0], [2.6, 1.0, 0, 0, 0]]}>
      <Arena t={t} spot={[540, 1200]} />
      <Actor who="ref" t={t} size={420} x={330 + Math.sin(t * 40) * 3} y={900} mood="sad" arms={ARM.idle} headTurn={Math.sin(t * 2) * 12} />
    </Cam><Foreground t={t} /><Vignette /></>) },
  { from: 2.9, Comp: ({ t }) => { // slow-mo trip: Walt hooks the Rookie, freeze on PENALTY!
    const k = interpolate(t, [2.9, 4.2], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
    return (<><Cam t={t} keys={[[2.9, 1.05, 0, 0, -4], [5.4, 1.18, -40, 40, -7]]}>
      <Arena t={t} cheer={t > 3.3 ? 1 : 0} jumbo="HOOK?!" />
      <Actor who="walt" t={t} size={480} x={120} y={830} mood="smug" arms={kf(t, [[2.9, ARM.idle], [3.2, [-78, -30, 190, 40]]]) as A4} lean={12} skate={2} />
      <Actor who="rookie" t={t} size={400} x={360 + k * 40} y={820 - Math.sin(k * Math.PI) * 300} rot={k * 130} mood="shock" arms={ARM.up} skate={k * 4} />
      {t > 3.25 && <Pow text="PENALTY!" x={140} y={330} size={160} rot={-6} />}
      {[...Array(10)].map((_, i) => <div key={i} style={{ position: "absolute", left: 620 + random(`ic${i}`) * 300, top: 1130 - k * 120 * random(`iv${i}`), width: 18, height: 18, borderRadius: 9, background: "#fff", opacity: 1 - k }} />)}
    </Cam><Foreground t={t} px={-40} /><Vignette /></>); } },
  { from: 5.4, Comp: ({ t }) => ( // low angle on the Ref, tiny whistle peep
    <><Cam t={t} keys={[[5.4, 1.1, 0, 80, 3], [8.55, 1.0, 0, 0, 0]]}>
      <Arena t={t} spot={[540, 900]} jumbo="PENALTY?" />
      <Close who="ref" t={t} mood={t < 6.4 ? "shock" : "sad"} arms={kf(t, [[5.4, ARM.whistle], [6.2, ARM.whistle], [6.6, [-90, -120, 60, -140]]]) as A4} hold={t < 6.3 ? Whistle : undefined} cy={760} size={1150} headTilt={Math.sin(t * 3) * 4} />
    </Cam><Vignette /></>) },
  { from: 8.55, Comp: ({ t }) => { // whip pan to Walt leaning into camera
    const whip = interpolate(t, [8.55, 8.75], [-700, 0], soft);
    return (<><Cam t={t} keys={[[8.55, 1.0, 0, 0, 0], [10, 1.08, 0, 0, 2]]}>
      <AbsoluteFill style={{ transform: `translateX(${whip}px)`, filter: t < 8.72 ? "blur(8px)" : undefined }}><Arena t={t} />
        <Close who="walt" t={t} mood="smug" arms={ARM.idle} lean={interpolate(t, [8.6, 9.3], [0, -10], back)} cx={540} cy={700} size={1250} />
      </AbsoluteFill>
    </Cam><Vignette /></>); } },
  { from: 9.95, Comp: ({ t }) => { // Ref skates backwards in panic – tracking shot
    const x = interpolate(t, [9.95, 13.9], [620, 180], soft);
    const arms = kf(t, [[9.95, ARM.flail1], [10.4, ARM.flail2], [10.9, ARM.flail1], [11.4, ARM.up], [12.0, ARM.two], [13.9, ARM.two]]) as A4;
    return (<><Cam t={t} keys={[[9.95, 1.1, -220, 0, 0], [13.9, 1.1, 160, 0, 0]]}>
      <AbsoluteFill style={{ transform: `translateX(${(t - 9.95) * 30}px)` }}><Arena t={t} /></AbsoluteFill>
      <Actor who="ref" t={t} size={580} x={x - 40} y={720} mood={t > 12 ? "talk" : "shock"} arms={arms} skate={t * 7} lean={-10} flip />
      {[...Array(8)].map((_, i) => <div key={i} style={{ position: "absolute", left: x + 300 + i * 30, top: 1430 + (i % 3) * 10, width: 14, height: 14, borderRadius: 7, background: "#fff", opacity: 0.8 - i * 0.1 }} />)}
    </Cam><Foreground t={t} px={-(t - 9.95) * 60} /><Vignette /></>); } },
  { from: 13.9, Comp: ({ t }) => { // Coach Gus slams into the glass – dutch angle
    const x = interpolate(t, [13.9, 14.25], [900, 300], { ...clamp, easing: Easing.in(Easing.quad) });
    const hit = t > 14.25 && t < 14.7;
    return (<><Cam t={t} keys={[[13.9, 1.0, 0, 0, -8], [17.7, 1.12, 0, -40, -10]]} shake={hit ? 18 : 0}>
      <Arena t={t} cheer={0.6} />
      <Actor who="gus" t={t} size={560} x={x} y={700} mood="grumpy" arms={kf(t, [[13.9, ARM.flail1], [14.3, [-150, -150, 150, -150]], [15.2, ARM.fist], [16.4, ARM.up], [17.0, ARM.fist]]) as A4} lean={t < 14.25 ? -14 : 4} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, background: "linear-gradient(115deg,#ffffff00 30%,#ffffff33 45%,#ffffff00 55%)", border: "14px solid #cbd5e199" }} />
      {hit && <Pow text="THUD!" x={560} y={420} size={130} rot={10} />}
    </Cam><Vignette /></>); } },
  { from: 17.7, Comp: ({ t }) => <><Cam t={t} keys={[[17.7, 1.0, 0, 0, 3], [19.1, 1.1, 0, 0, 3]]}><Arena t={t} spot={[540, 800]} /><Close who="ref" t={t} mood="sad" arms={[-100, -100, 100, -100]} headTilt={8} /></Cam><Vignette /></> },
  { from: 19.1, Comp: ({ t }) => <><Cam t={t} keys={[[19.1, 1.05, 0, 0, -6], [20.7, 1.25, 0, 60, -9]]} shake={8}><Arena t={t} cheer={1} /><Close who="gus" t={t} mood="grumpy" arms={kf(t, [[19.1, ARM.fist], [19.6, ARM.up], [20.1, ARM.fist]]) as A4} lean={-6} /></Cam><Vignette /></> },
  { from: 20.7, Comp: ({ t }) => <><Cam t={t} keys={[[20.7, 1.25, 0, 0, 0], [21.8, 1.4, 0, 0, 0]]}><Arena t={t} spot={[540, 800]} /><Close who="ref" t={t} mood="shock" arms={[-40, -150, 40, -150]} size={1000} cy={700} /></Cam><Vignette /></> },
  { from: 21.8, Comp: ({ t }) => ( // "That's it. Two minutes for YOU!" – snap zoom on the point
    <><Cam t={t} keys={[[21.8, 1.0, 0, 0, 0], [22.85, 1.0, 0, 0, 0], [23.05, 1.35, -160, 80, 0]]}>
      <Arena t={t} jumbo="REF: 2 MIN?!" />
      <Actor who="gus" t={t} size={560} x={360} y={700} mood="grumpy" arms={kf(t, [[21.8, ARM.idle], [22.8, [-78, -30, 60, -180]], [23.0, ARM.point]]) as A4} flip lean={kf(t, [[22.8, [0]], [23.0, [-8]]])[0]} />
    </Cam><Vignette /></>) },
  { from: 23.6, Comp: ({ t }) => { // Ref glides happily into the penalty box
    const x = interpolate(t, [23.6, 24.9], [-400, 330], soft);
    const sit = t > 24.9;
    return (<><Cam t={t} keys={[[23.6, 1.15, 120, 0, 0], [25.2, 1.0, 0, 0, 0], [27.0, 1.08, 0, 0, 0]]}>
      <PenaltyBox t={t} warm={sit} />
      <Actor who="ref" t={t} size={sit ? 600 : 580} x={x - 60} y={sit ? 640 : 560} mood="happy" arms={sit ? ARM.rest : ARM.wave} skate={sit ? undefined : t * 5} sitting={sit} lean={sit ? 0 : 8} />
    </Cam><Vignette /></>); } },
  { from: 27.0, Comp: ({ t }) => ( // Pucky: "Psst. Who's reffing the game?"
    <><Cam t={t} keys={[[27.0, 1.05, 0, 0, 0], [28.9, 1.15, -80, 0, 0]]}>
      <PenaltyBox t={t} warm />
      <Actor who="ref" t={t} size={600} x={160} y={640} mood={t > 28.2 ? "shock" : "happy"} arms={ARM.rest} sitting headTurn={t > 27.3 ? 24 : 0} />
      <div style={{ position: "absolute", left: 650, top: 930 }}><Mascot who="pucky" size={280} mood="smug" noSticker seed="refp" open={talk("pucky", t)} talking={talk("pucky", t) > 0} /></div>
    </Cam><Vignette /></>) },
  { from: 28.9, Comp: ({ t }) => ( // chaos: Walt & Rookie scrap, Zam drives through, popcorn rain
    <><Cam t={t} keys={[[28.9, 1.0, 0, 0, 7], [31.85, 1.1, 0, 0, 10]]} shake={6}>
      <Arena t={t} cheer={1} jumbo="NO REF?!" />
      <div style={{ position: "absolute", left: 200, top: 860 }}><FightCloud s={520} /></div>
      <div style={{ position: "absolute", left: interpolate(t, [29.6, 31.4], [-500, 1300]), top: 1080 }}><Mascot who="zam" size={460} mood="wow" noSticker seed="refz" /></div>
      {[...Array(40)].map((_, i) => <div key={i} style={{ position: "absolute", left: random(`pc${i}`) * 1080, top: ((t - 28.9) * (300 + random(`pv${i}`) * 300) + random(`py${i}`) * 900) % 1900 - 100, width: 24, height: 20, borderRadius: 10, background: "#fef3c7", border: "2px solid #d97706" }} />)}
    </Cam><Foreground t={t} /><Vignette /></>) },
  { from: 31.85, Comp: ({ t }) => <><Cam t={t} keys={[[31.85, 1.0, 0, 0, 0], [33.6, 1.12, 0, 0, 0]]}><PenaltyBox t={t} warm /><Close who="ref" t={t} mood="sad" arms={ARM.rest} cy={700} size={1100} headTilt={-6} /></Cam><Vignette /></> },
  { from: 33.6, Comp: ({ t }) => ( // pull back: the Ref alone in the box, chaos behind
    <><Cam t={t} keys={[[33.6, 1.5, 0, -150, 0], [END, 1.0, 0, 0, 0]]}>
      <Arena t={t} cheer={1} jumbo="REF: 2 MIN" />
      <div style={{ position: "absolute", left: 230, top: 760, width: 620, height: 520, background: "#ffffff22", border: "8px solid #94a3b8", borderRadius: 8 }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 280px 340px at 540px 1040px, #fde68a44, transparent 70%)" }} />
      <Actor who="ref" t={t} size={330} x={375} y={900} mood="happy" arms={ARM.rest} sitting />
      <div style={{ position: "absolute", left: 40, top: 1140, transform: "scale(0.6)" }}><FightCloud s={400} /></div>
    </Cam><Foreground t={t} /><Vignette /></>) },
];
const RANGES = SHOTS.map((s, i) => ({ ...s, to: SHOTS[i + 1]?.from ?? END }));

// ------------------------------------------------------------------ captions + intro/outro
const CHUNKS = (() => { const out: Wd[][] = []; let cur: Wd[] = []; WORDS.forEach((w, i) => { cur.push(w); const n = WORDS[i + 1]; if (!n || n.segment !== w.segment || cur.length >= 3 || /[.?!,]$/.test(w.word)) { out.push(cur); cur = []; } }); return out; })();
const Captions: React.FC<{ t: number }> = ({ t }) => {
  const i = CHUNKS.findIndex((c, k) => t >= c[0].start - 0.05 && t < (CHUNKS[k + 1]?.[0].start ?? 999) - 0.05);
  if (i < 0) return null; const c = CHUNKS[i]; if (t > c[c.length - 1].end + 0.5) return null;
  const narr = c[0].segment[0] === "n";
  return (
    <div style={{ position: "absolute", left: 60, right: 170, top: 1380, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: narr ? 76 : 94, lineHeight: 1.05, textTransform: "uppercase", transform: `scale(${interpolate(t, [c[0].start - 0.05, c[0].start + 0.07], [0.85, 1], clamp)})`, fontStyle: narr ? "italic" : "normal", zIndex: 9 }}>
      {c.map((w, k) => { const on = t >= w.start && t <= w.end + 0.05; return <span key={k} style={{ display: "inline-block", margin: "0 14px", color: on ? "#fde047" : "#fff", WebkitTextStroke: "11px #111", paintOrder: "stroke fill", transform: on ? "scale(1.1) rotate(-2deg)" : undefined }}>{w.display.replace(/^\.\.\./, "…")}</span>; })}
    </div>
  );
};
const IntroHL: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#0b1220" }}>
      <Arena t={f / FPS} spot={[540, 900]} />
      <AbsoluteFill style={{ background: "#0b1220aa" }} />
      <div style={{ position: "absolute", top: 560, left: 0, right: 0, opacity: interpolate(f, [14, 22], [0, 1], clamp) }}><Logo scale={0.8} delay={14} /></div>
      <div style={{ position: "absolute", top: 830, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontStyle: "italic", fontSize: 110, color: "#fde047", WebkitTextStroke: "9px #111", paintOrder: "stroke fill", transform: `scale(${interpolate(f, [24, 34], [2, 1], back)})`, opacity: interpolate(f, [24, 28], [0, 1], clamp) }}>HOCKEY LIFE</div>
      <div style={{ position: "absolute", top: 1000, left: 0, right: 0, textAlign: "center", opacity: interpolate(f, [52, 60], [0, 1], clamp) }}><span style={{ display: "inline-block", background: "#fde047", color: "#111", fontFamily: FONT, fontWeight: 900, fontSize: 44, padding: "8px 22px", transform: `rotate(-2deg) translateX(${interpolate(f, [52, 62], [600, 0], back)}px)` }}>SPECIAL · THE REF WHO COULDN'T STOP APOLOGISING</span></div>
      <Sequence from={0} durationInFrames={40}><IceWipe dur={40} y={1000} /><Audio src={staticFile("sfx/scrape.wav")} volume={0.5} /></Sequence>
      <Sequence from={24}><Audio src={staticFile("pop.wav")} volume={0.6} /></Sequence>
    </AbsoluteFill>
  );
};
const OutroRef: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: interpolate(f, [0, 12], [0, 1], clamp) }}><Arena t={f / FPS} cheer={0.5} /><AbsoluteFill style={{ background: "#0b1220bb" }} />
      <div style={{ position: "absolute", top: 330, left: 0, right: 0 }}><Logo scale={0.8} /></div>
      <div style={{ position: "absolute", top: 640, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontStyle: "italic", fontSize: 96, color: "#fde047", WebkitTextStroke: "8px #111", paintOrder: "stroke fill" }}>HOCKEY LIFE</div>
      <div style={{ position: "absolute", top: 770, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 50, color: "#fff" }}>Follow for more 👀</div>
      {(["rookie", "ref", "gus", "walt"] as StickWho[]).map((w, i) => <div key={w} style={{ position: "absolute", left: 20 + i * 255, top: 960 + Math.abs(Math.sin(f / 8 + i)) * -20 }}><StickPerson who={w} size={250} mood={w === "ref" ? "sad" : "happy"} pose={w === "walt" ? "crossed" : "wave"} seed={i} /></div>)}
      <Sequence from={4}><Audio src={staticFile("brand/outro_vo.mp3")} /></Sequence>
    </AbsoluteFill>
  );
};

export const HockeyLifeRef: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS - INTRO;
  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: "#0b1220", overflow: "hidden" }}>
      <Sequence from={F(INTRO)}><Audio src={staticFile("ep/hlref.mp3")} /></Sequence>
      <Audio src={staticFile("music.wav")} volume={(fr) => (fr < F(INTRO + END) ? 0.16 : 0.3)} />
      <Sequence from={F(INTRO + 5.45)} durationInFrames={50}><Audio src={staticFile("sfx/peep.mp3")} volume={0.8} /></Sequence>
      {RANGES.map((s) => { const C = s.Comp; return <Sequence key={s.from} from={F(INTRO + s.from)} durationInFrames={F(INTRO + s.to) - F(INTRO + s.from)}><AbsoluteFill style={{ overflow: "hidden" }}><C t={t} /></AbsoluteFill></Sequence>; })}
      {RANGES.slice(1).map((s) => <Sequence key={`w${s.from}`} from={F(INTRO + s.from)} durationInFrames={20}><Audio src={staticFile([8.55, 13.9, 23.6, 28.9].includes(s.from) ? "whoosh.wav" : "pop.wav")} volume={0.22} /></Sequence>)}
      <Sequence from={F(INTRO + 14.25)} durationInFrames={40}><Audio src={staticFile("sfx/horn.wav")} volume={0.0} /></Sequence>
      {t >= 0 && t < END && <Captions t={t} />}
      {t >= 0 && t < END && <div style={{ position: "absolute", left: 52, top: 140, padding: "4px 12px", background: "#fde047", color: "#111", fontWeight: 900, fontSize: 22, letterSpacing: 2, zIndex: 8 }}>ZAM · HOCKEY LIFE · SPECIAL</div>}
      <Sequence from={0} durationInFrames={F(INTRO) + 2}><IntroHL /></Sequence>
      <Sequence from={F(INTRO + END)}><OutroRef /></Sequence>
    </AbsoluteFill>
  );
};
