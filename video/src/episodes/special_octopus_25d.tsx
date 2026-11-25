/** ZAM Special Edition (2.5D arena) – "The Octopus Origin Story". Facts: Apr 15, 1952 at Detroit's Olympia, the Cusimano
 *  brothers (fish shop) threw an octopus on the ice; legend: 8 arms = the 8 playoff wins needed for the Cup; Detroit went 8–0
 *  and won the Cup (SI). Al Sobotka, Red Wings ice machine driver, twirled them over his head. Apr 2008 NHL banned on-ice
 *  twirling ($10,000 fine); May 7, 2008 allowed again at the ice machine gate. Never say the trademark – "ice machine". */
import React from "react";
import { AbsoluteFill, Audio, Easing, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import words from "../data/octo_words.json";
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
const INTRO = 2.9, END = LAST + 0.7;
const F = (s: number) => Math.round(s * FPS);
export const OCTO_FRAMES = F(INTRO + END + 3.0);
const soft = { ...clamp, easing: Easing.inOut(Easing.sin) };
const back = { ...clamp, easing: Easing.out(Easing.back(1.8)) };
const WHO: Record<string, Who> = { p: "pucky", h: "helmy", z: "zam", b: "biscuit", c: "clubby" };
const seg = (id: string) => { const ws = WORDS.filter((w) => w.segment === id); return { a: ws[0].start, b: ws[ws.length - 1].end }; };
const wordAt = (id: string, k: number) => WORDS.filter((w) => w.segment === id)[k].start;
const talk = (who: Who, t: number) => { const ws = WORDS.filter((w) => WHO[w.segment[0]] === who); return ws.some((w) => t >= w.start - 0.05 && t <= w.end + 0.05) ? mouthOpen(ws, t) : 0; };
const bump = (who: Who, t: number) => { const w = WORDS.find((x) => t >= x.start && t <= x.end && WHO[x.segment[0]] === who); return w ? Math.max(0, 1 - (t - w.start) * 5) : 0; };
const camAt = (t: number, t0: number, t1: number, a: DCam, b: DCam) => dlerp(a, b, interpolate(t, [t0, t1], [0, 1], soft));
const G: React.FC<{ who: Who; t: number; cam: DCam; x: number; z: number; size: number; mood: Mood; y?: number; flip?: boolean; lookAt?: number; tilt?: number; children?: React.ReactNode }> = (p) => {
  const o = talk(p.who, p.t); const b = bump(p.who, p.t);
  return <Cut x={p.x} z={p.z} y={(p.y ?? 0) - b * 22} cam={p.cam} size={p.size} toon tilt={p.tilt}><div style={{ position: "relative" }}><Mascot who={p.who} size={p.size} mood={p.mood} open={o} talking={o > 0} noSticker flip={p.flip} lookAt={p.lookAt} seed={`oc${p.who}`} />{p.children}</div></Cut>;
};
const Jumbo: React.FC<{ text: string; small?: string }> = ({ text, small }) => (
  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, color: "#fde047", textShadow: "0 0 18px #facc15", background: "repeating-linear-gradient(0deg,#0000 0 4px,#0003 4px 6px)", textAlign: "center", lineHeight: 1 }}>
    <div style={{ fontSize: text.length > 12 ? 50 : 66 }}>{text}</div>{small && <div style={{ fontSize: 34, color: "#67e8f9", marginTop: 8 }}>{small}</div>}
  </div>
);

// ------------------------------------------------------------------ props
/** Big octopus whose arms light up one by one (lit = number of lit arms, 0–8). */
const CountOcto: React.FC<{ s: number; t: number; lit: number }> = ({ s, t, lit }) => (
  <svg width={s} height={s} viewBox="-130 -110 260 260">
    {[...Array(8)].map((_, i) => { const a = (i / 7) * Math.PI; const w = Math.sin(t * 5 + i) * 12; const on = i < lit; const ex = Math.cos(a) * 115, ey = 50 + Math.sin(a) * 75;
      return <g key={i}><path d={`M${Math.cos(a) * 30} 20 Q${Math.cos(a) * 75 + w} ${30 + Math.sin(a) * 60} ${ex} ${ey + w * 0.3}`} stroke={on ? "#fde047" : "#c026d3"} strokeWidth={20} fill="none" strokeLinecap="round" />
        {on && <text x={ex} y={ey + 12 + w * 0.3} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill="#111" stroke="#fff" strokeWidth={5} paintOrder="stroke">{i + 1}</text>}</g>; })}
    <ellipse cx={0} cy={-10} rx={74} ry={66} fill="#d946ef" stroke="#2b2622" strokeWidth={6} />
    {[-25, 25].map((x) => <g key={x}><circle cx={x} cy={-22} r={17} fill="#fff" stroke="#2b2622" strokeWidth={4} /><circle cx={x + 3} cy={-20} r={7} fill="#2b2622" /></g>)}
    <path d="M-16 14 Q0 28 16 14" stroke="#2b2622" strokeWidth={5} fill="none" />
  </svg>
);
const Sign: React.FC<{ text: string; w?: number; rot?: number; color?: string }> = ({ text, w = 220, rot = -4, color = "#fef3c7" }) => (
  <div style={{ width: w, background: color, border: "5px solid #2b2622", padding: "4px 10px", fontFamily: FONT, fontWeight: 900, fontSize: 36, textAlign: "center", transform: `rotate(${rot}deg)`, color: "#2b2622", lineHeight: 1.05 }}>{text}</div>
);
const Flashback: React.FC<{ t: number; at: number; year: string; src: string; children: React.ReactNode }> = ({ t, at, year, src, children }) => {
  const k = interpolate(t, [at, at + 0.35], [0, 1], back);
  return (
    <div style={{ position: "absolute", left: 100, top: 380, width: 880, height: 760, transform: `rotate(${-3 + (1 - k) * 20}deg) scale(${k})`, zIndex: 7, background: "#f3e7c9", padding: 24, boxSizing: "border-box", boxShadow: "0 30px 60px #000a", border: "4px solid #2b2622" }}>
      <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", filter: "sepia(0.6)", border: "4px solid #2b2622", background: "#e2e8f0" }}>{children}</div>
      <div style={{ position: "absolute", right: -30, top: -40, background: "#ef4444", color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 64, padding: "4px 22px", transform: "rotate(8deg)", border: "5px solid #2b2622" }}>{year}</div>
      <div style={{ position: "absolute", left: 24, bottom: -4, fontFamily: HAND, fontSize: 32, color: "#5b4636" }}>true story · source: {src}</div>
    </div>
  );
};
const Person: React.FC<{ shirt: string; apron?: boolean; x: number; y: number; arm?: number }> = ({ shirt, apron, x, y, arm = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 140, height: 300 }}>
    <div style={{ position: "absolute", left: 30, top: 0, width: 80, height: 92, borderRadius: "48%", background: "#f1c9a5", border: "5px solid #111" }}><div style={{ position: "absolute", left: 18, top: 34, width: 10, height: 10, borderRadius: 5, background: "#111" }} /><div style={{ position: "absolute", left: 46, top: 34, width: 10, height: 10, borderRadius: 5, background: "#111" }} /><div style={{ position: "absolute", left: 20, top: 60, width: 34, height: 12, borderRadius: "0 0 17px 17px", background: "#111" }} /></div>
    <div style={{ position: "absolute", left: 14, top: 90, width: 112, height: 150, background: shirt, border: "5px solid #111", borderRadius: "26px 26px 8px 8px" }}>{apron && <div style={{ position: "absolute", left: 18, top: 30, width: 66, height: 110, background: "#fff", border: "4px solid #111" }} />}</div>
    <div style={{ position: "absolute", left: 104, top: 96, width: 22, height: 110, background: shirt, border: "5px solid #111", borderRadius: 10, transform: `rotate(${arm}deg)`, transformOrigin: "50% 0" }} />
  </div>
);
const Fish: React.FC<{ w?: number; c?: string }> = ({ w = 120, c = "#94a3b8" }) => (
  <svg width={w} height={w * 0.5} viewBox="0 0 120 60"><path d="M10 30 Q40 2 80 30 Q40 58 10 30 Z" fill={c} stroke="#111" strokeWidth={4} /><path d="M80 30 L112 10 L106 30 L112 50 Z" fill={c} stroke="#111" strokeWidth={4} /><circle cx={28} cy={26} r={4} fill="#111" /></svg>
);
/** 1952: fish market, two brothers, an octopus on the counter. */
const Scene1952: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#cbd5e1 0 60%,#94a3b8 60%)" }}>
    <div style={{ position: "absolute", left: 120, top: 30, width: 590, height: 90, background: "#1e3a8a", border: "6px solid #111", color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 44, whiteSpace: "nowrap", display: "flex", alignItems: "center", justifyContent: "center", letterSpacing: 2 }}>FISH MARKET · DETROIT</div>
    {[...Array(7)].map((_, i) => <div key={i} style={{ position: "absolute", left: 20 + i * 115, top: 140 + (i % 2) * 18, width: 70, height: 4, background: "#111" }} />)}
    <Person shirt="#475569" apron x={110} y={190} />
    <Person shirt="#64748b" apron x={560} y={190} arm={-40} />
    <div style={{ position: "absolute", left: 40, top: 430, width: 750, height: 110, background: "#e2e8f0", border: "6px solid #111", borderRadius: 8 }}>
      {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 20 + i * 140, top: 26 }}><Fish w={120} /></div>)}
      <div style={{ position: "absolute", left: 460, top: -110, transform: `rotate(${Math.sin(t * 3) * 6}deg)` }}><Octo t={t} s={190} /></div>
    </div>
    <div style={{ position: "absolute", left: 40, top: 570, fontFamily: HAND, fontSize: 48, color: "#111" }}>"what if we… brought him to the game?"</div>
  </div>
);
/** Generic boxy ice machine (no brand) with a paper driver twirling an octopus. */
const SceneSwing: React.FC<{ t: number }> = ({ t }) => {
  const a = t * 9;
  return (
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#475569 0 36%,#f8fafc 36%)" }}>
      {[...Array(24)].map((_, i) => <div key={i} style={{ position: "absolute", left: (i % 12) * 70 + 8, top: 40 + Math.floor(i / 12) * 72, width: 48, height: 48, borderRadius: 24, background: "#94a3b8", border: "3px solid #334155" }} />)}
      <div style={{ position: "absolute", left: 160, top: 360, width: 480, height: 200, background: "#cbd5e1", border: "7px solid #111", borderRadius: 26 }}><div style={{ position: "absolute", left: 30, top: 40, width: 140, height: 80, background: "#e0f2fe", border: "5px solid #111", borderRadius: 10 }} /></div>
      {[230, 520].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 520, width: 80, height: 80, borderRadius: 40, background: "#111", border: "6px solid #475569" }} />)}
      <Person shirt="#991b1b" x={340} y={150} arm={-170 + Math.sin(a) * 10} />
      <div style={{ position: "absolute", left: 445 + Math.cos(a) * 110 - 60, top: 120 + Math.sin(a) * 40 - 60 }}><Octo t={t} s={120} /></div>
      {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 445 + Math.cos(a - 0.5 - i * 0.4) * 110 - 10, top: 120 + Math.sin(a - 0.5 - i * 0.4) * 40, width: 20, height: 20, borderRadius: 10, background: "#d946ef", opacity: 0.5 - i * 0.15 }} />)}
      <div style={{ position: "absolute", left: 40, top: 640, fontFamily: HAND, fontSize: 50, color: "#111" }}>the ice crew guy. the legend.</div>
    </div>
  );
};
const Tally: React.FC<{ n: number }> = ({ n }) => (
  <div style={{ display: "flex", flexWrap: "wrap", width: 420, gap: 10 }}>
    {[...Array(8)].map((_, i) => <div key={i} style={{ width: 90, height: 90, borderRadius: 12, background: i < n ? "#22c55e" : "#1f2937", border: "5px solid #111", color: "#111", fontFamily: FONT, fontWeight: 900, fontSize: 40, display: "flex", alignItems: "center", justifyContent: "center", transform: i === n - 1 ? "scale(1.15)" : undefined }}>{i < n ? "W" : ""}</div>)}
  </div>
);
const Stamp: React.FC<{ k: number }> = ({ k }) => (
  <div style={{ transform: `rotate(-12deg) scale(${2.4 - k * 1.4})`, opacity: k, border: "10px solid #dc2626", color: "#dc2626", fontFamily: FONT, fontWeight: 900, fontSize: 84, padding: "6px 24px", lineHeight: 1, textAlign: "center", background: "#fff8" }}>$10,000<div style={{ fontSize: 46 }}>FINE</div></div>
);
const Gate: React.FC<{ open: number }> = ({ open }) => (
  <div style={{ position: "relative", width: 420, height: 300 }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 420, height: 60, background: "#f8fafc", border: "6px solid #111", fontFamily: FONT, fontWeight: 900, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>ICE MACHINE GATE</div>
    <div style={{ position: "absolute", left: 0, top: 60, width: 30, height: 240, background: "#e2e8f0", border: "6px solid #111" }} /><div style={{ position: "absolute", right: 0, top: 60, width: 30, height: 240, background: "#e2e8f0", border: "6px solid #111" }} />
    {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: i ? 210 : 30, top: 66, width: 180, height: 230, background: "repeating-linear-gradient(90deg,#fff 0 20px,#dbeafe 20px 24px)", border: "6px solid #111", transformOrigin: i ? "100% 50%" : "0 50%", transform: `perspective(600px) rotateY(${(i ? 1 : -1) * open * 75}deg)` }} />)}
  </div>
);

// ------------------------------------------------------------------ shots
const S = {
  why: seg("p_why"), rent: seg("b_rent"), shop: seg("h_shop"), uhoh: seg("p_uhoh"), thr: seg("h_throw"), rom: seg("b_rom"), arms: seg("h_arms"),
  work: seg("z_work"), eight: seg("h_eight"), fish: seg("p_fish"), eat: seg("b_eat"), swing: seg("h_swing"), hero: seg("z_hero"), ban: seg("h_ban"),
  no: seg("z_no"), gate: seg("h_gate"), lucky: seg("p_lucky"), wins: seg("b_wins"),
};
const cut = (x: { a: number }) => Math.max(0, x.a - 0.18);
const splatT = wordAt("h_throw", 8);
type Shot = { from: number; Comp: React.FC<{ t: number }> };
const SHOTS: Shot[] = [
  { from: 0, Comp: ({ t }) => { const cam = camAt(t, 0, cut(S.rent), dframe(0, -280, -800, 900, 820, { rx: -3 }), dframe(0, -270, -800, 620, 790)); const pop = interpolate(t, [wordAt("p_why", 5), wordAt("p_why", 5) + 0.35], [0, 1], back);
    return <Diorama cam={cam} t={t} cheer={0.6} jumbo={<Jumbo text="WHY THE 🐙?" />}><G who="pucky" t={t} cam={cam} x={-60} z={-800} size={420} mood={pop > 0.5 ? "shock" : "talk"} lookAt={pop > 0.5 ? 10 : 0} />
      <Cut x={230} z={-860} y={-140 + (1 - pop) * 200} cam={cam} size={170} shadow={false} toon><div style={{ opacity: pop }}><Octo t={t} s={170} /></div></Cut></Diorama>; } },
  { from: cut(S.rent), Comp: ({ t }) => { const cam = camAt(t, cut(S.rent), cut(S.shop), dframe(0, -280, -820, 900, 800), dframe(0, -280, -820, 780, 790));
    return <Diorama cam={cam} t={t} jumbo={<Jumbo text="RENT: $0" small="OCTOPUS: LATE AGAIN" />}><G who="biscuit" t={t} cam={cam} x={-120} z={-820} size={420} mood="smug" /><Cut x={230} z={-860} y={-20} cam={cam} size={150} shadow={false} toon><div style={{ position: "relative" }}><Octo t={t} s={150} /><div style={{ position: "absolute", left: 90, top: 70, width: 90, height: 60, background: "#fff", border: "4px solid #111", fontFamily: HAND, fontSize: 24, textAlign: "center", lineHeight: "56px", transform: "rotate(10deg)" }}>RENT?</div></div></Cut></Diorama>; } },
  { from: cut(S.shop), Comp: ({ t }) => { const cam = dframe(0, -300, -800, 1300, 860);
    return <><Diorama cam={cam} t={t} jumbo={<Jumbo text="APRIL 1952" />}><G who="helmy" t={t} cam={cam} x={-320} z={-800} size={340} mood="talk" /></Diorama><AbsoluteFill style={{ background: "#0007" }} /><Flashback t={t} at={cut(S.shop) + 0.2} year="1952" src="SI / Wikipedia"><Scene1952 t={t} /></Flashback></>; } },
  { from: cut(S.uhoh), Comp: ({ t }) => { const cam = camAt(t, cut(S.uhoh), cut(S.thr), dframe(0, -260, -800, 600, 780), dframe(0, -260, -800, 480, 760));
    return <Diorama cam={cam} t={t} cheer={0} jumbo={<Jumbo text="UH OH" />}><G who="pucky" t={t} cam={cam} x={0} z={-800} size={430} mood="scared" tilt={-5} /></Diorama>; } },
  { from: cut(S.thr), Comp: ({ t }) => { // SPLIT DEPTH #1 – octopus flies out of the frame at the viewer
    const cam = camAt(t, cut(S.thr), cut(S.rom), dframe(0, -320, -900, 1200, 850, { rx: -3 }), dframe(0, -320, -900, 1000, 840, { rx: -3 })); const k = interpolate(t, [splatT - 0.9, splatT], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
    return <SplitDepth over={k > 0 && k < 1 ? <div style={{ position: "absolute", left: 380 - k * 200, top: 700 + k * 620, transform: `scale(${0.7 + k * 2.6}) rotate(${k * 500}deg)`, transformOrigin: "50% 50%" }}><Octo t={t} s={180} /></div> : null}>
      <Diorama cam={cam} t={t} cheer={1} jumbo={<Jumbo text="INCOMING 🐙" />}><G who="helmy" t={t} cam={cam} x={-320} z={-760} size={340} mood={t > splatT ? "shock" : "talk"} /><G who="zam" t={t} cam={cam} x={300} z={-860} size={340} mood={t > splatT ? "wow" : "talk"} flip lookAt={-8} />
        {t > splatT && <Cut x={0} z={-700} y={0} cam={cam} size={200} shadow={false} toon><div style={{ transform: "scaleY(0.45)" }}><Octo t={t} s={200} /></div></Cut>}</Diorama>
      {t > splatT && t < splatT + 0.9 && <Pow text="SPLAT!" x={300} y={540} size={170} rot={-8} color="#c026d3" />}
    </SplitDepth>; } },
  { from: cut(S.rom), Comp: ({ t }) => { const cam = camAt(t, cut(S.rom), cut(S.arms), dframe(0, -280, -820, 620, 780), dframe(0, -280, -820, 520, 770));
    return <Diorama cam={cam} t={t} cheer={0.2} jumbo={<Jumbo text="♥ ROMANTIC ♥" small="(NOT)" />}><G who="biscuit" t={t} cam={cam} x={0} z={-820} size={430} mood="tired" /></Diorama>; } },
  { from: cut(S.arms), Comp: ({ t }) => { const cam = camAt(t, cut(S.arms), cut(S.work), dframe(0, -320, -800, 1150, 850), dframe(40, -320, -800, 1000, 840));
    const lit = Math.floor(interpolate(t, [wordAt("h_arms", 2), wordAt("h_arms", 8)], [0, 8], clamp));
    return <Diorama cam={cam} t={t} cheer={lit / 8} jumbo={<Jumbo text={`${lit} / 8`} small="ARMS = WINS" />}><G who="helmy" t={t} cam={cam} x={-330} z={-760} size={320} mood={lit >= 8 ? "proud" : "talk"} lookAt={8} /><Cut x={140} z={-860} y={-40} cam={cam} size={400} shadow={false} toon><CountOcto s={400} t={t} lit={lit} /></Cut></Diorama>; } },
  { from: cut(S.work), Comp: ({ t }) => { const cam = camAt(t, cut(S.work), cut(S.eight), dframe(0, -260, -800, 560, 770), dframe(0, -260, -800, 460, 755));
    return <Diorama cam={cam} t={t} cheer={0} jumbo={<Jumbo text="DID IT??" />}><G who="zam" t={t} cam={cam} x={0} z={-800} size={430} mood="wow" tilt={6} /></Diorama>; } },
  { from: cut(S.eight), Comp: ({ t }) => { const cam = camAt(t, cut(S.eight), cut(S.fish), dframe(0, -360, -800, 1250, 860, { rx: -4 }), dframe(0, -350, -800, 1080, 850, { rx: -3 }));
    const n = Math.floor(interpolate(t, [S.eight.a, wordAt("h_eight", 4)], [0, 8], clamp));
    return <Diorama cam={cam} t={t} cheer={1} jumbo={<Jumbo text="8 – 0" small="1952 PLAYOFFS" />}><G who="helmy" t={t} cam={cam} x={-330} z={-760} size={320} mood="proud" /><Cut x={110} z={-860} y={-60} cam={cam} size={250} shadow={false} toon><Tally n={n} /></Cut>
      <Cut x={560} z={-1350} y={-200} cam={cam} size={80} shadow={false} toon><Octo t={t} s={80} /></Cut></Diorama>; } },
  { from: cut(S.fish), Comp: ({ t }) => { const cam = camAt(t, cut(S.fish), cut(S.eat), dframe(0, -280, -800, 720, 790, { ry: 5 }), dframe(0, -280, -800, 580, 780, { ry: 5 }));
    return <Diorama cam={cam} t={t} cheer={0.8} jumbo={<Jumbo text="FISH FOR ALL" />}><G who="pucky" t={t} cam={cam} x={-40} z={-800} size={410} mood="determined"><div style={{ position: "absolute", left: 300, top: 60, transform: `rotate(${-30 + Math.sin(t * 8) * 12}deg)` }}><Fish w={170} c="#fbbf24" /></div></G></Diorama>; } },
  { from: cut(S.eat), Comp: ({ t }) => { const cam = camAt(t, cut(S.eat), cut(S.swing), dframe(0, -280, -820, 640, 780), dframe(0, -280, -820, 540, 770)); const nom = wordAt("b_eat", 6);
    return <Diorama cam={cam} t={t} jumbo={<Jumbo text={t > nom ? "NOM." : "WALRUS FACTS"} />}><G who="biscuit" t={t} cam={cam} x={0} z={-820} size={430} mood={t > nom ? "bliss" : "smug"}>
      <div style={{ position: "absolute", left: 150, top: 300, width: 130, height: 90, background: "#fff", border: "4px solid #111", borderRadius: "0 0 40px 40px" }} /><div style={{ position: "absolute", left: 340, top: 140, fontSize: 90, transform: "rotate(20deg)" }}>🍴</div></G>
      {t > nom && <Pow text="NOM" x={160} y={520} size={130} rot={-6} />}</Diorama>; } },
  { from: cut(S.swing), Comp: ({ t }) => { const cam = dframe(0, -300, -800, 1300, 860);
    return <><Diorama cam={cam} t={t} jumbo={<Jumbo text="ICE CREW LEGEND" />}><G who="helmy" t={t} cam={cam} x={-320} z={-800} size={340} mood="talk" /></Diorama><AbsoluteFill style={{ background: "#0007" }} /><Flashback t={t} at={cut(S.swing) + 0.2} year="LATER" src="NPR / Wikipedia"><SceneSwing t={t} /></Flashback></>; } },
  { from: cut(S.hero), Comp: ({ t }) => { const cam = camAt(t, cut(S.hero), cut(S.ban), dframe(0, -260, -800, 640, 780), dframe(0, -260, -800, 500, 760));
    return <Diorama cam={cam} t={t} cheer={1} jumbo={<Jumbo text="ONE OF US!" small="(AGAIN)" />}><G who="zam" t={t} cam={cam} x={0} z={-800} size={430} mood="love" /></Diorama>; } },
  { from: cut(S.ban), Comp: ({ t }) => { const cam = dframe(0, -300, -800, 1100, 840); const st = wordAt("h_ban", 4); const k = interpolate(t, [st, st + 0.25], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
    return <Diorama cam={cam} t={t} cheer={0} jumbo={<Jumbo text="BANNED" small="APRIL 2008" />}><G who="helmy" t={t} cam={cam} x={-280} z={-800} size={360} mood={k > 0 ? "sad" : "talk"} /><G who="zam" t={t} cam={cam} x={290} z={-820} size={360} mood={k > 0 ? "shock" : "wow"} flip lookAt={-8} />
      {k > 0 && <Cut x={20} z={-700} y={-330} cam={cam} size={300} shadow={false} toon><Stamp k={k} /></Cut>}</Diorama>; } },
  { from: cut(S.no), Comp: ({ t }) => { const cam = camAt(t, cut(S.no), cut(S.gate), dframe(0, -260, -800, 520, 770), dframe(0, -260, -800, 430, 750));
    return <Diorama cam={cam} t={t} cheer={0} jumbo={<Jumbo text="NOOOO" />}><G who="zam" t={t} cam={cam} x={0} z={-800} size={430} mood="sad" tilt={-4} /></Diorama>; } },
  { from: cut(S.gate), Comp: ({ t }) => { // SPLIT DEPTH #2 – gate swings open, a twirled octopus flies over the top bar
    const cam = dframe(0, -320, -900, 1150, 850); const op = interpolate(t, [wordAt("h_gate", 2), wordAt("h_gate", 2) + 0.5], [0, 1], back); const fl = interpolate(t, [wordAt("h_gate", 4), wordAt("h_gate", 4) + 0.8], [0, 1], clamp);
    return <SplitDepth over={fl > 0 && fl < 1 ? <div style={{ position: "absolute", left: 360 + fl * 200, top: 700 - fl * 600, transform: `rotate(${fl * 720}deg) scale(${1 + fl})` }}><Octo t={t} s={170} /></div> : null}>
      <Diorama cam={cam} t={t} cheer={op} jumbo={<Jumbo text={op > 0.5 ? "ALLOWED!" : "WAIT…"} small={op > 0.5 ? "AT THE GATE ONLY" : undefined} />}><Cut x={-40} z={-1000} y={0} cam={cam} size={380} shadow={false} toon><Gate open={op} /></Cut><G who="zam" t={t} cam={cam} x={250} z={-820} size={330} mood={op > 0.5 ? "proud" : "sad"} flip lookAt={-8} /><G who="helmy" t={t} cam={cam} x={-330} z={-760} size={300} mood={op > 0.5 ? "laugh" : "talk"} /></Diorama>
      {fl > 0.1 && fl < 0.9 && <Pow text="WHEEE!" x={400} y={250} size={110} rot={8} />}
    </SplitDepth>; } },
  { from: cut(S.lucky), Comp: ({ t }) => { const cam = dframe(0, -300, -800, 1050, 840);
    return <Diorama cam={cam} t={t} cheer={1} jumbo={<Jumbo text="LUCKY 🐙" />}><G who="pucky" t={t} cam={cam} x={-260} z={-800} size={380} mood="starry" /><G who="biscuit" t={t} cam={cam} x={280} z={-800} size={400} mood="tired" flip lookAt={-10} /></Diorama>; } },
  { from: cut(S.wins), Comp: ({ t }) => { const cam = camAt(t, cut(S.wins), END, dframe(0, -270, -820, 700, 785), dframe(0, -270, -820, 560, 770)); const pop = interpolate(t, [wordAt("b_wins", 5), wordAt("b_wins", 5) + 0.35], [0, 1], back);
    return <Diorama cam={cam} t={t} cheer={pop} jumbo={<Jumbo text={pop > 0.5 ? "OCTOPUS: 8 W" : "…"} small={pop > 0.5 ? "BISCUIT: 0 W" : undefined} />}><G who="biscuit" t={t} cam={cam} x={-80} z={-820} size={420} mood={pop > 0.5 ? "sad" : "grumpy"} />
      <Cut x={170} z={-880} y={-120 + (1 - pop) * 220} cam={cam} size={160} shadow={false} toon><div style={{ position: "relative", opacity: pop }}><Octo t={t} s={160} /><div style={{ position: "absolute", left: -30, top: -90 }}><Sign text="8 W" w={150} rot={8} color="#bbf7d0" /></div></div></Cut></Diorama>; } },
];
const RANGES = SHOTS.map((s, i) => ({ ...s, to: SHOTS[i + 1]?.from ?? END }));

const FACTS: [number, number, string, string][] = [
  [S.shop.a + 0.4, S.shop.b + 0.3, "APRIL 15, 1952 · DETROIT", "two brothers, a fish shop & an octopus · SI / Wikipedia"],
  [S.arms.a + 0.2, S.arms.b + 0.3, "LEGEND: 8 ARMS = 8 PLAYOFF WINS", "back then, 8 wins took the Stanley Cup"],
  [S.eight.a + 0.2, S.eight.b + 0.3, "1952: DETROIT WENT 8–0 · STANLEY CUP", "source: Sports Illustrated"],
  [S.swing.a + 0.3, S.swing.b + 0.3, "AL SOBOTKA · RED WINGS ICE MACHINE DRIVER", "famous octopus twirler · NPR / Wikipedia"],
  [S.ban.a + 0.3, S.ban.b + 0.3, "APRIL 2008 · NHL BANS ON-ICE TWIRLING", "$10,000 fine · Sports Illustrated"],
  [S.gate.a + 0.3, S.gate.b + 0.3, "MAY 2008 · ALLOWED AGAIN – AT THE GATE ONLY", "source: Wikipedia / SI"],
];
const Fact: React.FC<{ t: number }> = ({ t }) => {
  const f = FACTS.find(([a, b]) => t >= a && t <= b); if (!f) return null;
  const k = interpolate(t, [f[0], f[0] + 0.25], [0, 1], back);
  return <div style={{ position: "absolute", left: 60, top: 1215, zIndex: 9, transform: `rotate(-2deg) scale(${k})`, transformOrigin: "0 50%", background: "#fbf6ea", border: "5px solid #2b2622", borderRadius: 6, padding: "8px 20px", boxShadow: "0 10px 0 #0006", maxWidth: 850 }}><div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, color: "#2b2622" }}>{f[2]}</div><div style={{ fontFamily: HAND, fontSize: 28, color: "#7a6f62" }}>{f[3]}</div></div>;
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

const WHOOSH = [cut(S.shop), cut(S.thr), cut(S.swing), cut(S.gate)];
export const SpecialOctopus25D: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS - INTRO;
  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: "#0b0716", overflow: "hidden" }}>
      <Sequence from={F(INTRO)}><Audio src={staticFile("ep/octo.mp3")} /></Sequence>
      <Sequence from={F(INTRO)}><Audio src={staticFile("music_happy.mp3")} volume={(fr) => (fr < F(END) ? 0.24 : 0.4)} /></Sequence>
      {RANGES.map((s) => { const C = s.Comp; return <Sequence key={s.from} from={F(INTRO + s.from)} durationInFrames={Math.max(1, F(INTRO + s.to) - F(INTRO + s.from))}><AbsoluteFill style={{ overflow: "hidden" }}><C t={t} /></AbsoluteFill></Sequence>; })}
      {RANGES.slice(1).map((s) => <Sequence key={`p${s.from}`} from={F(INTRO + s.from)} durationInFrames={20}><Audio src={staticFile(WHOOSH.includes(s.from) ? "whoosh.wav" : "pop.wav")} volume={0.22} /></Sequence>)}
      <Sequence from={F(INTRO + splatT)} durationInFrames={F(0.8)}><Audio src={staticFile("sfx/shutter.mp3")} volume={0.5} /></Sequence>
      <Sequence from={F(INTRO + S.eight.b - 0.3)} durationInFrames={F(1.4)}><Audio src={staticFile("sfx/horn.wav")} volume={0.2} /></Sequence>
      {t >= 0 && t < END && <Fact t={t} />}
      {t >= 0 && t < END && <Captions t={t} />}
      {t >= 0 && t < END && <div style={{ position: "absolute", left: 52, top: 140, padding: "4px 12px", background: "#ff2bd6", color: "#fff", fontWeight: 900, fontSize: 22, letterSpacing: 2, zIndex: 9 }}>ZAM · SPECIAL EDITION · THE OCTOPUS</div>}
      <Sequence from={0} durationInFrames={F(INTRO) + 2}><Intro2 /></Sequence>
      <Sequence from={F(INTRO + END)}><Outro2 /></Sequence>
    </AbsoluteFill>
  );
};
