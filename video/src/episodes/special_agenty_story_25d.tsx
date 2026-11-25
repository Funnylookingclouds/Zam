/** ZAM Special Edition (2.5D arena) – "Agenty: The Greatest Agent of All Time" – a portrait from baby to big shot.
 *  Facts: Jun 27, 1972 Bobby Hull signs with WHA Winnipeg – $1M signing bonus, hockey's first million-dollar contract (CBC);
 *  Jan 26, 1979 Wayne Gretzky signs a 21-year contract on his 18th birthday (Edmonton Journal / Wikipedia);
 *  Sep 30, 2025 Kirill Kaprizov signs 8 years / $136M with Minnesota – richest deal in NHL history (NHL.com). */
import React from "react";
import { AbsoluteFill, Audio, Easing, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import words from "../data/agst_words.json";
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
export const AGST_FRAMES = F(INTRO + END + 3.0);
const soft = { ...clamp, easing: Easing.inOut(Easing.sin) };
const back = { ...clamp, easing: Easing.out(Easing.back(1.8)) };
const WHO: Record<string, Who> = { p: "pucky", h: "helmy", z: "zam", b: "biscuit", c: "clubby", a: "agenty" };
const seg = (id: string) => { const ws = WORDS.filter((w) => w.segment === id); return { a: ws[0].start, b: ws[ws.length - 1].end }; };
const wordAt = (id: string, k: number) => WORDS.filter((w) => w.segment === id)[k].start;
const talk = (who: Who, t: number) => { const ws = WORDS.filter((w) => WHO[w.segment[0]] === who); return ws.some((w) => t >= w.start - 0.05 && t <= w.end + 0.05) ? mouthOpen(ws, t) : 0; };
const bump = (who: Who, t: number) => { const w = WORDS.find((x) => t >= x.start && t <= x.end && WHO[x.segment[0]] === who); return w ? Math.max(0, 1 - (t - w.start) * 5) : 0; };
const camAt = (t: number, t0: number, t1: number, a: DCam, b: DCam) => dlerp(a, b, interpolate(t, [t0, t1], [0, 1], soft));
const G: React.FC<{ who: Who; t: number; cam: DCam; x: number; z: number; size: number; mood: Mood; y?: number; flip?: boolean; lookAt?: number; tilt?: number; baby?: boolean; shades?: boolean; children?: React.ReactNode }> = (p) => {
  const o = talk(p.who, p.t); const b = bump(p.who, p.t);
  return <Cut x={p.x} z={p.z} y={(p.y ?? 0) - b * 22} cam={p.cam} size={p.size} toon tilt={p.tilt}><div style={{ position: "relative" }}><Mascot who={p.who} size={p.size} mood={p.mood} open={o} talking={o > 0} noSticker flip={p.flip} lookAt={p.lookAt} baby={p.baby} shades={p.shades} seed={`ag${p.who}`} />{p.children}</div></Cut>;
};
const Jumbo: React.FC<{ text: string; small?: string }> = ({ text, small }) => (
  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, color: "#fde047", textShadow: "0 0 18px #facc15", background: "repeating-linear-gradient(0deg,#0000 0 4px,#0003 4px 6px)", textAlign: "center", lineHeight: 1 }}>
    <div style={{ fontSize: text.length > 12 ? 50 : 66 }}>{text}</div>{small && <div style={{ fontSize: 34, color: "#67e8f9", marginTop: 8 }}>{small}</div>}
  </div>
);

// ------------------------------------------------------------------ props
const Flashback: React.FC<{ t: number; at: number; year: string; src: string; sepia?: boolean; z?: number; children: React.ReactNode }> = ({ t, at, year, src, sepia = true, z = 7, children }) => {
  const k = interpolate(t, [at, at + 0.35], [0, 1], back);
  return (
    <div style={{ position: "absolute", left: 100, top: 380, width: 880, height: 760, transform: `rotate(${-3 + (1 - k) * 20}deg) scale(${k})`, zIndex: z, background: "#f3e7c9", padding: 24, boxSizing: "border-box", boxShadow: "0 30px 60px #000a", border: "4px solid #2b2622" }}>
      <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", filter: sepia ? "sepia(0.6)" : undefined, border: "4px solid #2b2622", background: "#e2e8f0" }}>{children}</div>
      <div style={{ position: "absolute", right: -30, top: -40, background: "#ef4444", color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 64, padding: "4px 22px", transform: "rotate(8deg)", border: "5px solid #2b2622" }}>{year}</div>
      <div style={{ position: "absolute", left: 24, bottom: -4, fontFamily: HAND, fontSize: 32, color: "#5b4636" }}>true story · source: {src}</div>
    </div>
  );
};
const Person: React.FC<{ shirt: string; x: number; y: number; arm?: number; hair?: string }> = ({ shirt, x, y, arm = 0, hair = "#a16207" }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 140, height: 300 }}>
    <div style={{ position: "absolute", left: 30, top: 0, width: 80, height: 92, borderRadius: "48%", background: "#f1c9a5", border: "5px solid #111" }}><div style={{ position: "absolute", left: -4, top: -6, width: 80, height: 30, borderRadius: "40px 40px 6px 6px", background: hair, border: "4px solid #111" }} /><div style={{ position: "absolute", left: 18, top: 38, width: 10, height: 10, borderRadius: 5, background: "#111" }} /><div style={{ position: "absolute", left: 46, top: 38, width: 10, height: 10, borderRadius: 5, background: "#111" }} /><div style={{ position: "absolute", left: 20, top: 60, width: 34, height: 12, borderRadius: "0 0 17px 17px", background: "#111" }} /></div>
    <div style={{ position: "absolute", left: 14, top: 90, width: 112, height: 150, background: shirt, border: "5px solid #111", borderRadius: "26px 26px 8px 8px" }}><div style={{ position: "absolute", left: 0, right: 0, top: 60, height: 18, background: "#fff" }} /></div>
    <div style={{ position: "absolute", left: 104, top: 96, width: 22, height: 110, background: shirt, border: "5px solid #111", borderRadius: 10, transform: `rotate(${arm}deg)`, transformOrigin: "50% 0" }} />
  </div>
);
const Cheque: React.FC<{ w?: number }> = ({ w = 520 }) => (
  <div style={{ width: w, height: w * 0.42, background: "#dcfce7", border: "6px solid #14532d", borderRadius: 10, position: "relative", fontFamily: FONT, fontWeight: 900, color: "#14532d", boxShadow: "0 12px 0 #0005" }}>
    <div style={{ position: "absolute", left: 20, top: 12, fontSize: w * 0.05, letterSpacing: 2 }}>PAY TO THE ORDER OF: ONE HOCKEY PLAYER</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: w * 0.13, textAlign: "center", fontSize: w * 0.15 }}>$1,000,000</div>
    <div style={{ position: "absolute", right: 24, bottom: 12, fontFamily: HAND, fontSize: w * 0.07 }}>signing bonus</div>
  </div>
);
const Scene1972: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#cbd5e1 0 62%,#94a3b8 62%)" }}>
    <div style={{ position: "absolute", left: 140, top: 30, width: 560, height: 80, background: "#1e293b", border: "6px solid #111", color: "#fde047", fontFamily: FONT, fontWeight: 900, fontSize: 42, display: "flex", alignItems: "center", justifyContent: "center", whiteSpace: "nowrap" }}>JUNE 27 · WINNIPEG</div>
    <Person shirt="#1e40af" x={110} y={170} arm={-60} hair="#fde68a" />
    <div style={{ position: "absolute", left: 300, top: 220, transform: "rotate(-4deg)" }}><Cheque w={460} /></div>
    <div style={{ position: "absolute", left: 40, top: 560, fontFamily: HAND, fontSize: 48, color: "#111" }}>hockey's first million-dollar contract</div>
  </div>
);
const Scene1979: React.FC<{ t: number }> = ({ t }) => {
  const unroll = interpolate(t, [wordAt("a_gretzky", 5), wordAt("a_gretzky", 6) + 0.6], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#475569 0 34%,#f8fafc 34%)" }}>
      {[...Array(24)].map((_, i) => <div key={i} style={{ position: "absolute", left: (i % 12) * 70 + 8, top: 30 + Math.floor(i / 12) * 70, width: 46, height: 46, borderRadius: 23, background: "#94a3b8", border: "3px solid #334155" }} />)}
      <Person shirt="#ea580c" x={90} y={190} arm={-30} />
      <div style={{ position: "absolute", left: 270, top: 290, width: 160, height: 120 }}>
        <div style={{ position: "absolute", left: 0, top: 40, width: 160, height: 80, background: "#fbcfe8", border: "5px solid #111", borderRadius: 10 }} />
        <div style={{ position: "absolute", left: 30, top: 50, fontFamily: FONT, fontWeight: 900, fontSize: 44, color: "#be185d" }}>18</div>
        {[30, 75, 120].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 8, width: 10, height: 34, background: "#60a5fa", border: "3px solid #111" }}><div style={{ position: "absolute", left: -2, top: -16, width: 10, height: 14, borderRadius: "50%", background: "#facc15" }} /></div>)}
      </div>
      <div style={{ position: "absolute", left: 470, top: 160, width: 280, height: 60 + unroll * 420, background: "#fffdf5", border: "5px solid #111", overflow: "hidden" }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, textAlign: "center", marginTop: 8 }}>CONTRACT</div>
        {[...Array(21)].map((_, i) => <div key={i} style={{ fontFamily: HAND, fontSize: 18, paddingLeft: 14, lineHeight: "19px", color: "#475569" }}>year {i + 1} ......... ✓</div>)}
      </div>
      <div style={{ position: "absolute", left: 40, top: 640, fontFamily: HAND, fontSize: 48, color: "#111" }}>signed on his 18th birthday</div>
    </div>
  );
};
const Net: React.FC = () => (
  <svg width={300} height={210} viewBox="0 0 520 354"><path d="M30 350 L30 30 L490 30 L490 350" stroke="#ef4444" strokeWidth={22} fill="none" strokeLinejoin="round" />{[...Array(13)].map((_, i) => <path key={i} d={`M${60 + i * 33} 44 L${60 + i * 33} 346`} stroke="#ffffffcc" strokeWidth={3} />)}{[...Array(9)].map((_, i) => <path key={`h${i}`} d={`M40 ${66 + i * 32} L480 ${66 + i * 32}`} stroke="#ffffffcc" strokeWidth={3} />)}</svg>
);
const Crib: React.FC<{ w?: number }> = ({ w = 520 }) => (
  <div style={{ position: "relative", width: w, height: w * 0.55 }}>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 26, background: "#f9a8d4", border: "6px solid #2b2622", borderRadius: 8 }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 22, background: "#f9a8d4", border: "6px solid #2b2622", borderRadius: 8 }} />
    {[...Array(10)].map((_, i) => <div key={i} style={{ position: "absolute", left: 10 + i * (w - 40) / 9, top: 16, width: 14, height: w * 0.55 - 36, background: "#fdf2f8", border: "4px solid #2b2622" }} />)}
  </div>
);
const Receipt: React.FC<{ k: number }> = ({ k }) => (
  <div style={{ width: 240, background: "#fff", border: "5px solid #111", padding: "8px 14px", fontFamily: HAND, fontSize: 30, lineHeight: 1.1, transform: `rotate(6deg) scale(${k})`, boxShadow: "0 10px 0 #0005" }}>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 26 }}>INVOICE #1</div>milk ......... 1<br />naps ......... 3<br /><b>MAMA: 10%</b>
  </div>
);
const Calendar: React.FC<{ t: number }> = ({ t }) => (
  <>{[...Array(6)].map((_, i) => { const ph = (t * 1.6 + i / 6) % 1; return <div key={i} style={{ position: "absolute", left: 120 + i * 130 + ph * 80, top: 420 - ph * 340, width: 110, height: 120, background: "#fff", border: "5px solid #111", transform: `rotate(${ph * 140 - 30}deg)`, opacity: 1 - ph, fontFamily: FONT, fontWeight: 900, fontSize: 30, textAlign: "center" }}><div style={{ background: "#ef4444", color: "#fff", fontSize: 20 }}>YEAR</div>{1979 + i * 4}</div>; })}</>
);
const Money: React.FC<{ v: number }> = ({ v }) => (
  <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 120, color: "#22c55e", WebkitTextStroke: "8px #052e16", paintOrder: "stroke fill", textShadow: "0 0 40px #4ade80", whiteSpace: "nowrap" }}>${Math.round(v).toLocaleString("en-US")}</div>
);
const Chapter: React.FC<{ t: number; at: number; n: string; label: string }> = ({ t, at, n, label }) => {
  const k = interpolate(t, [at, at + 0.3], [0, 1], back);
  return <div style={{ position: "absolute", left: 52, top: 200, zIndex: 9, transform: `scale(${k}) rotate(-3deg)`, transformOrigin: "0 50%", background: "#8b5cf6", border: "5px solid #fff", color: "#fff", fontFamily: FONT, fontWeight: 900, padding: "6px 18px", boxShadow: "0 8px 0 #0006" }}><div style={{ fontSize: 22, letterSpacing: 3, opacity: 0.85 }}>CHAPTER {n}</div><div style={{ fontSize: 46, lineHeight: 1 }}>{label}</div></div>;
};

// ------------------------------------------------------------------ shots
const S = {
  intro: seg("z_intro"), who: seg("b_who"), me: seg("a_me"), word: seg("z_word"), comm: seg("a_comm"), mamaB: seg("b_mama"), mama: seg("a_mama"),
  hull: seg("a_hull"), mil: seg("p_million"), fish: seg("b_fish"), gretzky: seg("a_gretzky"), lunch: seg("z_lunch"), kap: seg("a_kaprizov"),
  sign: seg("p_sign"), free: seg("a_free"), client: seg("z_client"), octo: seg("a_octo"),
};
const cut = (x: { a: number }) => Math.max(0, x.a - 0.18);
const milT = wordAt("a_hull", 9), freeT = wordAt("a_free", 6), kapT = wordAt("a_kaprizov", 3);
const CHAPTERS: [number, number, string, string][] = [
  [cut(S.word), cut(S.hull), "1", "BABY"], [cut(S.hull), cut(S.gretzky), "2", "AGE 6"], [cut(S.gretzky), cut(S.kap), "3", "AGE 12"], [cut(S.kap), END, "4", "TODAY"],
];
type Shot = { from: number; Comp: React.FC<{ t: number }> };
const SHOTS: Shot[] = [
  { from: 0, Comp: ({ t }) => { const cam = camAt(t, 0, cut(S.who), dframe(0, -300, -800, 1250, 850, { rx: -4 }), dframe(0, -290, -800, 950, 830, { rx: -3 }));
    return <Diorama cam={cam} t={t} cheer={1} pulse={0.6} jumbo={<Jumbo text="THE LIFE OF AGENTY" small="A ZAM DOCUMENTARY" />}><G who="zam" t={t} cam={cam} x={-330} z={-760} size={320} mood="proud" /><G who="agenty" t={t} cam={cam} x={140} z={-860} size={400} mood="smug" shades lookAt={-6} />
      <Cut x={-620} z={-1350} y={-180} cam={cam} size={90} shadow={false} toon><Octo t={t} s={90} /></Cut></Diorama>; } },
  { from: cut(S.who), Comp: ({ t }) => { const cam = camAt(t, cut(S.who), cut(S.me), dframe(0, -280, -820, 600, 780), dframe(0, -280, -820, 520, 770));
    return <Diorama cam={cam} t={t} cheer={0.2} jumbo={<Jumbo text="SAYS WHO?" />}><G who="biscuit" t={t} cam={cam} x={0} z={-820} size={430} mood="tired" /></Diorama>; } },
  { from: cut(S.me), Comp: ({ t }) => { const cam = camAt(t, cut(S.me), cut(S.word), dframe(0, -280, -800, 700, 790), dframe(0, -280, -800, 560, 780)); const sT = wordAt("a_me", 2);
    return <Diorama cam={cam} t={t} cheer={0.8} jumbo={<Jumbo text="SAYS HIM." small="(HE'S BIASED)" />}><G who="agenty" t={t} cam={cam} x={0} z={-800} size={430} mood={t > sT ? "proud" : "smug"} shades />{t > sT && <Pow text="SIGN HERE ✍" x={170} y={500} size={110} rot={-6} color="#8b5cf6" />}</Diorama>; } },
  { from: cut(S.word), Comp: ({ t }) => { const cam = camAt(t, cut(S.word), cut(S.comm), dframe(0, -280, -800, 1000, 830), dframe(0, -280, -800, 880, 820));
    return <Diorama cam={cam} t={t} cheer={0.3} jumbo={<Jumbo text="BABY PICTURES" small="AWWW" />}><G who="zam" t={t} cam={cam} x={-320} z={-760} size={300} mood="love" /><G who="agenty" t={t} cam={cam} x={160} z={-860} y={-110} size={330} mood="bliss" baby /><Cut x={160} z={-800} y={40} cam={cam} size={360} shadow={false} toon><div style={{ transform: "scaleY(0.6)", transformOrigin: "50% 100%" }}><Crib w={360} /></div></Cut></Diorama>; } },
  { from: cut(S.comm), Comp: ({ t }) => { const cam = camAt(t, cut(S.comm), cut(S.mamaB), dframe(0, -230, -800, 520, 770), dframe(0, -230, -800, 430, 755));
    return <Diorama cam={cam} t={t} cheer={0} jumbo={<Jumbo text="FIRST WORD" small="NOT 'MAMA'" />}><G who="agenty" t={t} cam={cam} x={0} z={-800} size={420} mood="smug" baby shades /></Diorama>; } },
  { from: cut(S.mamaB), Comp: ({ t }) => { const cam = dframe(0, -300, -800, 1050, 840);
    return <Diorama cam={cam} t={t} jumbo={<Jumbo text="MAMA?" />}><G who="biscuit" t={t} cam={cam} x={-260} z={-800} size={400} mood="grumpy" /><G who="agenty" t={t} cam={cam} x={270} z={-820} size={330} mood="talk" baby flip /></Diorama>; } },
  { from: cut(S.mama), Comp: ({ t }) => { const cam = camAt(t, cut(S.mama), cut(S.hull), dframe(60, -250, -800, 640, 780), dframe(60, -250, -800, 540, 770)); const k = interpolate(t, [wordAt("a_mama", 2), wordAt("a_mama", 2) + 0.3], [0, 1], back);
    return <Diorama cam={cam} t={t} cheer={k} jumbo={<Jumbo text="10%" small="EVEN MAMA" />}><G who="agenty" t={t} cam={cam} x={-60} z={-800} size={400} mood="proud" baby /><Cut x={240} z={-760} y={-170} cam={cam} size={200} shadow={false} toon><Receipt k={k} /></Cut></Diorama>; } },
  { from: cut(S.hull), Comp: ({ t }) => { // SPLIT DEPTH #1 – the million-dollar cheque breaks out of the frame
    const cam = dframe(0, -300, -800, 1300, 860); const k = interpolate(t, [milT, milT + 0.5], [0, 1], back);
    return <SplitDepth over={k > 0 ? <div style={{ position: "absolute", left: 110, top: 360 - k * 100, transform: `rotate(${-5 - (1 - k) * 20}deg) scale(${0.5 + k * 0.5})`, transformOrigin: "50% 50%", opacity: k }}><Cheque w={560} /></div> : null}>
      <Diorama cam={cam} t={t} jumbo={<Jumbo text="MY HERO" small="1972" />}><G who="agenty" t={t} cam={cam} x={-320} z={-800} size={330} mood="starry" baby /></Diorama><AbsoluteFill style={{ background: "#0007" }} />
      <Flashback t={t} at={wordAt("a_hull", 3) - 0.2} z={4} year="1972" src="CBC / The Hockey News"><Scene1972 /></Flashback>
    </SplitDepth>; } },
  { from: cut(S.mil), Comp: ({ t }) => { const cam = camAt(t, cut(S.mil), cut(S.fish), dframe(0, -280, -800, 700, 790, { ry: 5 }), dframe(0, -280, -800, 560, 780, { ry: 5 }));
    return <Diorama cam={cam} t={t} cheer={1} jumbo={<Jumbo text="$1,000,000" small="FOR ONE GUY" />}><G who="pucky" t={t} cam={cam} x={0} z={-800} size={420} mood="shock" /></Diorama>; } },
  { from: cut(S.fish), Comp: ({ t }) => { const cam = camAt(t, cut(S.fish), cut(S.gretzky), dframe(0, -280, -820, 640, 780), dframe(0, -280, -820, 540, 770));
    return <Diorama cam={cam} t={t} cheer={0} jumbo={<Jumbo text="BISCUIT'S SALARY" small="1 FISH / WEEK" />}><G who="biscuit" t={t} cam={cam} x={0} z={-820} size={430} mood="sad"><div style={{ position: "absolute", left: 300, top: 260, transform: `rotate(${-20 + Math.sin(t * 4) * 6}deg)`, fontSize: 110 }}>🐟</div></G></Diorama>; } },
  { from: cut(S.gretzky), Comp: ({ t }) => { const cam = dframe(0, -300, -800, 1300, 860);
    return <><Diorama cam={cam} t={t} jumbo={<Jumbo text="AGE 12" small="1979" />}><G who="agenty" t={t} cam={cam} x={-320} z={-800} size={300} mood="wow" /></Diorama><AbsoluteFill style={{ background: "#0007" }} /><Flashback t={t} at={wordAt("a_gretzky", 2) - 0.2} year="1979" src="Edmonton Journal"><Scene1979 t={t} /></Flashback></>; } },
  { from: cut(S.lunch), Comp: ({ t }) => { const cam = camAt(t, cut(S.lunch), cut(S.kap), dframe(0, -260, -800, 620, 780), dframe(0, -260, -800, 500, 760));
    return <><Diorama cam={cam} t={t} cheer={0.4} jumbo={<Jumbo text="21 YEARS?!" small="ZAM: 21 MINUTES" />}><G who="zam" t={t} cam={cam} x={0} z={-800} size={430} mood="dizzy" tilt={-6} /></Diorama><Calendar t={t} /></>; } },
  { from: cut(S.kap), Comp: ({ t }) => { // SPLIT DEPTH #2 – the record number rolls up and breaks over the top bar
    const cam = camAt(t, cut(S.kap), cut(S.sign), dframe(0, -360, -800, 1250, 860, { rx: -4 }), dframe(0, -350, -800, 1050, 850, { rx: -3 })); const v = interpolate(t, [kapT, kapT + 1.6], [0, 136000000], { ...clamp, easing: Easing.out(Easing.cubic) });
    return <SplitDepth over={t > kapT ? <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", justifyContent: "center", transform: `scale(${interpolate(t, [kapT, kapT + 0.4], [0.5, 1], back)})` }}><Money v={v} /></div> : null}>
      <Diorama cam={cam} t={t} cheer={1} pulse={t > kapT ? 1 : 0} jumbo={<Jumbo text="RECORD!" small="8 YEARS · $136M" />}><G who="agenty" t={t} cam={cam} x={0} z={-800} size={440} mood={t > kapT + 1.6 ? "starry" : "proud"} shades /></Diorama>
    </SplitDepth>; } },
  { from: cut(S.sign), Comp: ({ t }) => { const cam = camAt(t, cut(S.sign), cut(S.free), dframe(0, -280, -800, 700, 790), dframe(0, -280, -800, 580, 780));
    return <Diorama cam={cam} t={t} cheer={0.8} jumbo={<Jumbo text="PUCKY WANTS A DEAL" />}><G who="pucky" t={t} cam={cam} x={0} z={-800} size={420} mood="love" /></Diorama>; } },
  { from: cut(S.free), Comp: ({ t }) => { const cam = dframe(0, -300, -800, 1100, 840); const k = interpolate(t, [freeT, freeT + 0.4], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
    return <Diorama cam={cam} t={t} cheer={k > 0 ? 1 : 0.4} jumbo={<Jumbo text={k >= 1 ? "GOAL. FOR FREE." : "NEGOTIATING…"} />}><G who="agenty" t={t} cam={cam} x={-280} z={-800} size={380} mood="smug" shades /><Cut x={340} z={-1150} y={0} cam={cam} size={300} toon><Net /></Cut><G who="pucky" t={t} cam={cam} x={230 + k * 110} z={-820 - k * 300} y={-k * 60} size={300} mood={k >= 1 ? "dizzy" : "sad"} flip tilt={k * 40} />
      {k >= 1 && t < freeT + 1.0 && <Pow text="BONK" x={500} y={520} size={130} rot={8} />}
      <Cut x={600} z={-1350} y={-200} cam={cam} size={80} shadow={false} toon><Octo t={t} s={80} /></Cut></Diorama>; } },
  { from: cut(S.client), Comp: ({ t }) => { const cam = camAt(t, cut(S.client), cut(S.octo), dframe(0, -260, -800, 560, 770), dframe(0, -260, -800, 470, 755));
    return <Diorama cam={cam} t={t} cheer={0.2} jumbo={<Jumbo text="BIGGEST CLIENT?" />}><G who="zam" t={t} cam={cam} x={0} z={-800} size={430} mood="talk" tilt={5} /></Diorama>; } },
  { from: cut(S.octo), Comp: ({ t }) => { const cam = camAt(t, cut(S.octo), END, dframe(0, -300, -800, 1100, 840), dframe(0, -300, -800, 950, 830)); const pop = interpolate(t, [S.octo.a + 0.2, S.octo.a + 0.55], [0, 1], back);
    const n = Math.floor(interpolate(t, [wordAt("a_octo", 4), S.octo.b], [0, 8], clamp));
    return <Diorama cam={cam} t={t} cheer={1} jumbo={<Jumbo text={n > 0 ? `${n} / 8 SIGNED` : "THE OCTOPUS"} small="BEST DEAL EVER" />}><G who="agenty" t={t} cam={cam} x={-290} z={-800} size={360} mood={n >= 8 ? "laugh" : "proud"} shades />
      <Cut x={200} z={-820} y={-20 + (1 - pop) * 200} cam={cam} size={260} shadow={false} toon><div style={{ position: "relative", opacity: pop }}><Octo t={t} s={260} />
        {[...Array(8)].map((_, i) => { const a = (i / 8) * Math.PI + 0.1; return i < n ? <div key={i} style={{ position: "absolute", left: 130 + Math.cos(a) * 125 - 14, top: 150 + Math.sin(a) * 80, fontSize: 34 }}>✍️</div> : null; })}</div></Cut>
      {n >= 8 && <Pow text="DEAL!" x={420} y={460} size={120} rot={-6} color="#8b5cf6" />}</Diorama>; } },
];
const RANGES = SHOTS.map((s, i) => ({ ...s, to: SHOTS[i + 1]?.from ?? END }));

const FACTS: [number, number, string, string][] = [
  [wordAt("a_hull", 3), S.hull.b + 0.3, "JUNE 27, 1972 · BOBBY HULL · $1M SIGNING BONUS", "hockey's first million-dollar contract · CBC"],
  [wordAt("a_gretzky", 2), S.gretzky.b + 0.3, "JAN 26, 1979 · GRETZKY · 21-YEAR CONTRACT", "signed on his 18th birthday · Edmonton Journal"],
  [kapT, S.kap.b + 0.3, "SEPT 30, 2025 · KAPRIZOV · 8 YEARS, $136M", "richest contract in NHL history · NHL.com"],
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

const WHOOSH = CHAPTERS.map((c) => c[0]);
export const SpecialAgentyStory25D: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS - INTRO;
  const ch = CHAPTERS.find(([a, b]) => t >= a && t < b);
  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: "#0b0716", overflow: "hidden" }}>
      <Sequence from={F(INTRO)}><Audio src={staticFile("ep/agst.mp3")} /></Sequence>
      <Sequence from={F(INTRO)}><Audio src={staticFile("music_happy.mp3")} volume={(fr) => (fr < F(END) ? 0.24 : 0.4)} /></Sequence>
      {RANGES.map((s) => { const C = s.Comp; return <Sequence key={s.from} from={F(INTRO + s.from)} durationInFrames={Math.max(1, F(INTRO + s.to) - F(INTRO + s.from))}><AbsoluteFill style={{ overflow: "hidden" }}><C t={t} /></AbsoluteFill></Sequence>; })}
      {RANGES.slice(1).map((s) => <Sequence key={`p${s.from}`} from={F(INTRO + s.from)} durationInFrames={20}><Audio src={staticFile(WHOOSH.includes(s.from) ? "whoosh.wav" : "pop.wav")} volume={0.22} /></Sequence>)}
      <Sequence from={F(INTRO + kapT)} durationInFrames={F(1.4)}><Audio src={staticFile("sfx/horn.wav")} volume={0.2} /></Sequence>
      <Sequence from={F(INTRO + freeT + 0.4)} durationInFrames={F(0.8)}><Audio src={staticFile("sfx/shutter.mp3")} volume={0.5} /></Sequence>
      {t >= 0 && t < END && <Fact t={t} />}
      {t >= 0 && t < END && <Captions t={t} />}
      {ch && <Chapter t={t} at={ch[0]} n={ch[2]} label={ch[3]} />}
      {t >= 0 && t < END && <div style={{ position: "absolute", left: 52, top: 140, padding: "4px 12px", background: "#ff2bd6", color: "#fff", fontWeight: 900, fontSize: 22, letterSpacing: 2, zIndex: 9 }}>ZAM · SPECIAL EDITION · THE LIFE OF AGENTY</div>}
      <Sequence from={0} durationInFrames={F(INTRO) + 2}><Intro2 /></Sequence>
      <Sequence from={F(INTRO + END)}><Outro2 /></Sequence>
    </AbsoluteFill>
  );
};
