/** ZAM (2.5D arena) – "Biscuit's Mask Origin Story". Fact: Nov 1, 1959 at Madison Square Garden – Andy Bathgate's shot cut
 *  Montreal goalie Jacques Plante's face (7 stitches). No backup goalie, so Plante returned only with his practice mask; coach
 *  Toe Blake reluctantly agreed. Montreal won 3–1 and Plante went 10-0-1 that November. Mar 8, 1960 at Detroit Blake had him
 *  play without it: lost 3–0, mask back the next night. Sources: NHL.com, ESPN Classic, Time, CBC. */
import React from "react";
import { AbsoluteFill, Audio, Easing, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import words from "../data/bmask_words.json";
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
export const BMASK_FRAMES = F(INTRO + END + 3.0);
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
  return <Cut x={p.x} z={p.z} y={(p.y ?? 0) - b * 22} cam={p.cam} size={p.size} toon tilt={p.tilt}><div style={{ position: "relative" }}><Mascot who={p.who} size={p.size} mood={p.mood} open={o} talking={o > 0} noSticker flip={p.flip} lookAt={p.lookAt} seed={`bm${p.who}`} />{p.children}</div></Cut>;
};
const Jumbo: React.FC<{ text: string; small?: string }> = ({ text, small }) => (
  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, color: "#fde047", textShadow: "0 0 18px #facc15", background: "repeating-linear-gradient(0deg,#0000 0 4px,#0003 4px 6px)", textAlign: "center", lineHeight: 1 }}>
    <div style={{ fontSize: text.length > 12 ? 50 : 66 }}>{text}</div>{small && <div style={{ fontSize: 34, color: "#67e8f9", marginTop: 8 }}>{small}</div>}
  </div>
);

// ------------------------------------------------------------------ props
/** Generic late-50s fibreglass-style goalie mask (pale, eye holes, breathing holes). */
const OldMask: React.FC<{ w?: number; glow?: boolean }> = ({ w = 160, glow }) => (
  <svg width={w} height={w * 1.3} viewBox="0 0 160 208" style={{ filter: glow ? "drop-shadow(0 0 18px #fde047)" : undefined }}>
    <path d="M80 6 C134 6 152 50 150 100 C148 160 116 202 80 202 C44 202 12 160 10 100 C8 50 26 6 80 6 Z" fill="#f5efe0" stroke="#2b2622" strokeWidth={7} />
    <ellipse cx={52} cy={84} rx={20} ry={13} fill="#2b2622" /><ellipse cx={108} cy={84} rx={20} ry={13} fill="#2b2622" />
    <path d="M80 98 L70 132 L90 132 Z" fill="#d6ccb4" stroke="#2b2622" strokeWidth={4} />
    {[...Array(9)].map((_, i) => <circle key={i} cx={50 + (i % 3) * 30} cy={152 + Math.floor(i / 3) * 14} r={4.5} fill="#2b2622" />)}
    {[[40, 40], [120, 40], [30, 120], [130, 120]].map(([x, y], i) => <circle key={`s${i}`} cx={x} cy={y} r={3.5} fill="#2b2622" />)}
  </svg>
);
/** Generic paper goalie (plain red sweater, no crest) – face bare or masked; optional bandage. */
const PaperGoalie: React.FC<{ masked?: boolean; hurt?: boolean; s?: number }> = ({ masked, hurt, s = 1 }) => (
  <div style={{ position: "relative", width: 240 * s, height: 360 * s, transform: `scale(${s})`, transformOrigin: "0 0" }}>
    <div style={{ position: "absolute", left: 30, top: 130, width: 180, height: 150, background: "#b91c1c", border: "6px solid #111", borderRadius: "30px 30px 10px 10px" }}><div style={{ position: "absolute", left: 0, right: 0, top: 60, height: 22, background: "#1e3a8a" }} /></div>
    <div style={{ position: "absolute", left: 40, top: 270, width: 70, height: 90, background: "#f5efe0", border: "6px solid #111", borderRadius: 10 }} /><div style={{ position: "absolute", left: 130, top: 270, width: 70, height: 90, background: "#f5efe0", border: "6px solid #111", borderRadius: 10 }} />
    <div style={{ position: "absolute", left: 70, top: 20, width: 100, height: 120, borderRadius: "48%", background: "#f1c9a5", border: "6px solid #111" }}>
      {!masked && <><div style={{ position: "absolute", left: 22, top: 44, width: 12, height: 12, borderRadius: 6, background: "#111" }} /><div style={{ position: "absolute", left: 58, top: 44, width: 12, height: 12, borderRadius: 6, background: "#111" }} /><div style={{ position: "absolute", left: 28, top: 82, width: 36, height: 8, borderRadius: 4, background: "#111" }} /></>}
      {hurt && !masked && <div style={{ position: "absolute", left: 10, top: 18, width: 60, height: 18, background: "#fff", border: "3px solid #111", transform: "rotate(-20deg)", fontSize: 12, lineHeight: "14px", textAlign: "center" }}>xxxxxxx</div>}
    </div>
    {masked && <div style={{ position: "absolute", left: 68, top: 12 }}><OldMask w={104} /></div>}
  </div>
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
const RinkOld: React.FC<{ board: string; children?: React.ReactNode }> = ({ board, children }) => (
  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#475569 0 34%,#f8fafc 34%)" }}>
    {[...Array(26)].map((_, i) => <div key={i} style={{ position: "absolute", left: (i % 13) * 66 + 10, top: 40 + Math.floor(i / 13) * 70, width: 46, height: 46, borderRadius: 23, background: "#94a3b8", border: "3px solid #334155" }} />)}
    <div style={{ position: "absolute", left: 170, top: 168, width: 480, height: 84, background: "#0f172a", border: "7px solid #111", color: "#fde047", fontFamily: FONT, fontWeight: 900, fontSize: 36, whiteSpace: "nowrap", display: "flex", alignItems: "center", justifyContent: "center" }}>{board}</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 254, height: 14, background: "#b91c1c" }} />
    {children}
  </div>
);
/** 1959: bare-faced goalie in net, puck rising at his face. */
const Scene1959: React.FC<{ t: number }> = ({ t }) => {
  const hit = seg("h_shot").a + 1.2; const k = interpolate(t, [hit - 1.0, hit], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  return <RinkOld board="MTL @ NYR · NOV 1"><div style={{ position: "absolute", left: 300, top: 300 }}><PaperGoalie hurt={t > hit} /></div>
    {k < 1 && <div style={{ position: "absolute", left: 760 - k * 360, top: 640 - k * 300, width: 60, height: 26, borderRadius: "50%", background: "#111" }} />}
    <div style={{ position: "absolute", left: 40, top: 650, fontFamily: HAND, fontSize: 50, color: "#111" }}>{t < hit ? "no mask. no helmet. no problem?" : "…problem."}</div>
  </RinkOld>;
};
const Scene1960: React.FC = () => (
  <RinkOld board="MTL @ DET · MAR 8"><div style={{ position: "absolute", left: 300, top: 300 }}><PaperGoalie /></div>
    <div style={{ position: "absolute", left: 620, top: 340, transform: "rotate(14deg)", opacity: 0.9 }}><OldMask w={110} /><div style={{ fontFamily: HAND, fontSize: 40, color: "#b91c1c", textAlign: "center" }}>benched</div></div>
    <div style={{ position: "absolute", left: 40, top: 650, fontFamily: HAND, fontSize: 50, color: "#111" }}>coach: "just one game without it"</div>
  </RinkOld>
);
const Bench: React.FC = () => (
  <div style={{ position: "relative", width: 520, height: 230 }}>
    <div style={{ position: "absolute", left: 0, top: 100, width: 520, height: 34, background: "#92400e", border: "6px solid #2b2622", borderRadius: 6 }} />
    {[30, 460].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 130, width: 26, height: 100, background: "#78350f", border: "5px solid #2b2622" }} />)}
    <div style={{ position: "absolute", left: 150, top: 0, background: "#fef3c7", border: "5px solid #2b2622", padding: "4px 16px", fontFamily: HAND, fontWeight: 700, fontSize: 40, transform: "rotate(-4deg)" }}>BACKUP GOALIE: —</div>
    <div style={{ position: "absolute", left: 380, top: 66, fontSize: 40 }}>🕸️</div>
  </div>
);
const Tally: React.FC<{ n: number }> = ({ n }) => (
  <div style={{ display: "flex", flexWrap: "wrap", width: 560, gap: 10 }}>
    {[...Array(11)].map((_, i) => <div key={i} style={{ width: 90, height: 90, borderRadius: 12, background: i < n ? (i === 10 ? "#fde047" : "#22c55e") : "#1f2937", border: "5px solid #111", color: "#111", fontFamily: FONT, fontWeight: 900, fontSize: 36, display: "flex", alignItems: "center", justifyContent: "center", transform: i === n - 1 ? "scale(1.15)" : undefined }}>{i < n ? (i === 10 ? "T" : "W") : ""}</div>)}
  </div>
);

// ------------------------------------------------------------------ shots
const S = {
  hook: seg("p_hook"), cheap: seg("b_cheap"), date: seg("h_date"), shot: seg("h_shot"), me: seg("p_me"), spa: seg("b_spa"), backup: seg("h_backup"),
  zme: seg("z_me"), face: seg("c_face"), shows: seg("b_shows"), blake: seg("h_blake"), lucky: seg("p_lucky"), off: seg("h_off"), and: seg("z_and"),
  lost: seg("h_lost"), win: seg("p_win"), lose: seg("b_lose"),
};
const cut = (x: { a: number }) => Math.max(0, x.a - 0.18);
const hitT = S.shot.a + 1.2;
type Shot = { from: number; Comp: React.FC<{ t: number }> };
const SHOTS: Shot[] = [
  { from: 0, Comp: ({ t }) => { const cam = camAt(t, 0, cut(S.cheap), dframe(0, -280, -800, 900, 820, { rx: -3 }), dframe(0, -270, -800, 600, 790));
    return <Diorama cam={cam} t={t} cheer={0.8} jumbo={<Jumbo text="NO MASKS?!" />}><G who="pucky" t={t} cam={cam} x={0} z={-800} size={430} mood={t > 1.2 ? "shock" : "wow"} /><Cut x={-640} z={-1350} y={-180} cam={cam} size={100} shadow={false} toon><Octo t={t} s={100} /></Cut></Diorama>; } },
  { from: cut(S.cheap), Comp: ({ t }) => { const cam = camAt(t, cut(S.cheap), cut(S.date), dframe(0, -280, -820, 680, 790), dframe(0, -280, -820, 560, 780));
    return <Diorama cam={cam} t={t} jumbo={<Jumbo text="FACES: $0.99" small="1950s PRICES" />}><G who="biscuit" t={t} cam={cam} x={0} z={-820} size={430} mood="smug" /></Diorama>; } },
  { from: cut(S.date), Comp: ({ t }) => { const cam = dframe(0, -300, -800, 1300, 860);
    return <><Diorama cam={cam} t={t} jumbo={<Jumbo text="NOV 1, 1959" />}><G who="helmy" t={t} cam={cam} x={-320} z={-800} size={340} mood="talk" /></Diorama><AbsoluteFill style={{ background: "#0007" }} /><Flashback t={t} at={cut(S.date) + 0.2} year="1959" src="NHL.com / CBC"><Scene1959 t={t} /></Flashback></>; } },
  { from: cut(S.shot), Comp: ({ t }) => { // SPLIT DEPTH #1 – the puck rockets out of the frame at the viewer
    const cam = camAt(t, cut(S.shot), cut(S.me), dframe(0, -300, -800, 1100, 850), dframe(0, -300, -800, 900, 830)); const k = interpolate(t, [hitT - 0.7, hitT], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
    return <SplitDepth over={k > 0 && k < 1 ? <div style={{ position: "absolute", left: 470 - k * 120, top: 760 + k * 620, width: 110 + k * 380, height: 48 + k * 170, borderRadius: "50%", background: "radial-gradient(ellipse at 35% 30%,#555,#000 70%)", border: "6px solid #000" }} /> : null}>
      <Diorama cam={cam} t={t} cheer={1} jumbo={<Jumbo text="INCOMING!" />}><G who="helmy" t={t} cam={cam} x={-320} z={-760} size={340} mood={t > hitT ? "shock" : "scared"} /><G who="biscuit" t={t} cam={cam} x={300} z={-800} size={360} mood={t > hitT ? "sweat" : "wow"} flip lookAt={-8} /></Diorama>
      {t > hitT && t < hitT + 0.9 && <Pow text="BONK!" x={330} y={520} size={170} rot={-8} />}
    </SplitDepth>; } },
  { from: cut(S.me), Comp: ({ t }) => { const cam = camAt(t, cut(S.me), cut(S.spa), dframe(0, -280, -800, 700, 790, { ry: 5 }), dframe(0, -280, -800, 560, 780, { ry: 5 }));
    return <Diorama cam={cam} t={t} jumbo={<Jumbo text="IT WASN'T YOU" small="YOU WEREN'T BORN" />}><G who="pucky" t={t} cam={cam} x={0} z={-800} size={420} mood="starry" /></Diorama>; } },
  { from: cut(S.spa), Comp: ({ t }) => { const cam = camAt(t, cut(S.spa), cut(S.backup), dframe(0, -280, -820, 640, 780), dframe(0, -280, -820, 540, 770));
    return <Diorama cam={cam} t={t} jumbo={<Jumbo text="7 STITCHES" small="+ FREE CUCUMBERS" />}><G who="biscuit" t={t} cam={cam} x={0} z={-820} size={430} mood="bliss">
      {t > wordAt("b_spa", 2) && [0, 1].map((i) => <div key={i} style={{ position: "absolute", left: 120 + i * 120, top: 130, width: 80, height: 80, borderRadius: 40, background: "radial-gradient(#d9f99d 0 45%,#65a30d 46% 60%,#365314 61%)", border: "4px solid #1a2e05" }} />)}
      <div style={{ position: "absolute", left: 40, top: -30, fontSize: 60 }}>🧖</div></G></Diorama>; } },
  { from: cut(S.backup), Comp: ({ t }) => { const cam = dframe(-60, -300, -800, 1150, 850, { ry: -6 }); const k = interpolate(t, [S.backup.a, S.backup.a + 0.4], [0, 1], back);
    return <Diorama cam={cam} t={t} jumbo={<Jumbo text="MASK OR NOTHING" />}><G who="helmy" t={t} cam={cam} x={-300} z={-760} size={360} mood={t > wordAt("h_backup", 4) ? "determined" : "talk"} /><Cut x={40} z={-900} y={-20} cam={cam} size={220} toon><div style={{ transform: `scale(${k})` }}><Bench /></div></Cut><Cut x={90} z={-980} y={-300} cam={cam} size={150} shadow={false} toon><div style={{ transform: `scale(${k}) rotate(${Math.sin(t * 6) * 6}deg)` }}><OldMask w={150} glow /></div></Cut></Diorama>; } },
  { from: cut(S.zme), Comp: ({ t }) => { const cam = camAt(t, cut(S.zme), cut(S.face), dframe(0, -260, -800, 620, 780), dframe(0, -260, -800, 500, 760));
    return <Diorama cam={cam} t={t} cheer={1} jumbo={<Jumbo text="NOT AGAIN" small="(SEE: ZAM IN NET)" />}><G who="zam" t={t} cam={cam} x={0} z={-800} size={430} mood="proud" /></Diorama>; } },
  { from: cut(S.face), Comp: ({ t }) => { const cam = camAt(t, cut(S.face), S.shows.a - 0.1, dframe(0, -300, -800, 1050, 840), dframe(0, -300, -800, 950, 830));
    const roast = t > S.shows.a - 0.3;
    return <Diorama cam={cam} t={t} cheer={roast ? 1 : 0.4} jumbo={<Jumbo text={roast ? "OOF." : "OLD SCHOOL"} />}><G who="clubby" t={t} cam={cam} x={-260} z={-800} size={400} mood={roast ? "angry" : "grumpy"} /><G who="biscuit" t={t} cam={cam} x={280} z={-800} size={400} mood={roast ? "smug" : "tired"} flip lookAt={-10} />
      {roast && <Cut x={600} z={-1350} y={-200} cam={cam} size={90} shadow={false} toon><Octo t={t} s={90} /></Cut>}</Diorama>; } },
  { from: S.shows.a - 0.1, Comp: ({ t }) => { const cam = camAt(t, S.shows.a - 0.1, cut(S.blake), dframe(160, -280, -800, 560, 780), dframe(160, -280, -800, 470, 770));
    return <Diorama cam={cam} t={t} cheer={1} jumbo={<Jumbo text="OOF." />}><G who="clubby" t={t} cam={cam} x={-260} z={-800} size={400} mood="angry" /><G who="biscuit" t={t} cam={cam} x={280} z={-800} size={400} mood="smug" flip lookAt={-10} />{t > S.shows.b && <Pow text="ROASTED" x={140} y={560} size={110} rot={-6} color="#ef4444" />}</Diorama>; } },
  { from: cut(S.blake), Comp: ({ t }) => { const cam = camAt(t, cut(S.blake), cut(S.lucky), dframe(0, -360, -800, 1250, 860, { rx: -4 }), dframe(0, -350, -800, 1080, 850, { rx: -3 }));
    const n = Math.floor(interpolate(t, [wordAt("h_blake", 6), S.blake.b], [0, 11], clamp));
    return <Diorama cam={cam} t={t} cheer={n > 0 ? 1 : 0.3} jumbo={<Jumbo text={n > 0 ? `${n} UNBEATEN` : "COACH: NO."} small={n > 0 ? "NOV 1959" : "TOE BLAKE"} />}><G who="helmy" t={t} cam={cam} x={-330} z={-760} size={330} mood={n > 0 ? "proud" : "grumpy"} />
      {n > 0 && <Cut x={90} z={-860} y={-60} cam={cam} size={250} shadow={false} toon><Tally n={n} /></Cut>}</Diorama>; } },
  { from: cut(S.lucky), Comp: ({ t }) => { const cam = camAt(t, cut(S.lucky), cut(S.off), dframe(0, -280, -800, 700, 790), dframe(0, -280, -800, 560, 780));
    return <Diorama cam={cam} t={t} jumbo={<Jumbo text="LUCKY MASK" small="✦ ✦ ✦" />}><G who="pucky" t={t} cam={cam} x={-120} z={-800} size={400} mood="love" /><Cut x={150} z={-760} y={-300 + Math.sin(t * 3) * 20} cam={cam} size={130} shadow={false} toon><OldMask w={150} glow /></Cut></Diorama>; } },
  { from: cut(S.off), Comp: ({ t }) => { const cam = dframe(0, -300, -800, 1300, 860);
    return <><Diorama cam={cam} t={t} jumbo={<Jumbo text="MAR 8, 1960" />}><G who="helmy" t={t} cam={cam} x={-320} z={-800} size={340} mood="talk" /></Diorama><AbsoluteFill style={{ background: "#0007" }} /><Flashback t={t} at={cut(S.off) + 0.2} year="1960" src="NHL.com"><Scene1960 /></Flashback></>; } },
  { from: cut(S.and), Comp: ({ t }) => { const cam = camAt(t, cut(S.and), cut(S.lost), dframe(0, -260, -800, 560, 770), dframe(0, -260, -800, 440, 750));
    return <Diorama cam={cam} t={t} cheer={0} jumbo={<Jumbo text="…AND?" />}><G who="zam" t={t} cam={cam} x={0} z={-800} size={430} mood="wow" tilt={-6} /></Diorama>; } },
  { from: cut(S.lost), Comp: ({ t }) => { // SPLIT DEPTH #2 – scoreboard 0–3, then the mask flies back out over the top bar
    const cam = dframe(0, -320, -900, 1150, 850); const back2 = wordAt("h_lost", 2); const k = interpolate(t, [back2, back2 + 0.6], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
    return <SplitDepth over={k > 0 ? <div style={{ position: "absolute", left: 420, top: 820 - k * 560, transform: `rotate(${(1 - k) * 360}deg) scale(${0.6 + k * 0.6})` }}><OldMask w={230} glow /></div> : null}>
      <Diorama cam={cam} t={t} cheer={k > 0 ? 1 : 0} jumbo={<Jumbo text={k > 0 ? "MASK IS BACK" : "DET 3 – MTL 0"} small={k > 0 ? "NEXT NIGHT" : "NO MASK"} />}><G who="helmy" t={t} cam={cam} x={-320} z={-780} size={340} mood={k > 0 ? "proud" : "sad"} /><G who="zam" t={t} cam={cam} x={300} z={-860} size={340} mood={k > 0 ? "laugh" : "sad"} flip lookAt={-8} /></Diorama>
      {k > 0 && t < back2 + 1.0 && <Pow text="FWOOSH!" x={560} y={240} size={110} rot={8} />}
    </SplitDepth>; } },
  { from: cut(S.win), Comp: ({ t }) => { const cam = dframe(0, -300, -800, 1050, 840);
    return <Diorama cam={cam} t={t} jumbo={<Jumbo text="MAGIC MASK?" />}><G who="pucky" t={t} cam={cam} x={-260} z={-800} size={380} mood="smug" /><G who="biscuit" t={t} cam={cam} x={280} z={-800} size={400} mood="tired" flip lookAt={-10} /></Diorama>; } },
  { from: cut(S.lose), Comp: ({ t }) => { const cam = camAt(t, cut(S.lose), END, dframe(0, -270, -820, 640, 780), dframe(0, -270, -820, 500, 765));
    const sad = t > wordAt("b_lose", 6);
    return <Diorama cam={cam} t={t} cheer={sad ? 0.8 : 0.2} jumbo={<Jumbo text={sad ? "BISCUIT: 0 WINS" : "…"} small={sad ? "MASK: STILL WORKING" : undefined} />}><G who="biscuit" t={t} cam={cam} x={0} z={-820} size={430} mood={sad ? "sad" : "grumpy"} /><Cut x={560} z={-1300} y={-170} cam={cam} size={90} shadow={false} toon><Octo t={t} s={90} /></Cut></Diorama>; } },
];
const RANGES = SHOTS.map((s, i) => ({ ...s, to: SHOTS[i + 1]?.from ?? END }));

const FACTS: [number, number, string, string][] = [
  [S.date.a + 0.4, S.shot.b, "NOV 1, 1959 · PLANTE HIT IN THE FACE", "shot by Andy Bathgate · Madison Square Garden · NHL.com"],
  [S.spa.a + 0.2, S.spa.b + 0.3, "7 STITCHES · ~20 MIN DELAY", "sources: ESPN / Time"],
  [S.backup.a + 0.3, S.backup.b + 0.3, "NO BACKUP GOALIE · RETURNED IN HIS PRACTICE MASK", "Montreal won 3–1 · NHL.com"],
  [S.blake.a + 1.5, S.blake.b + 0.3, "PLANTE WENT 10-0-1 THAT NOVEMBER", "masked · source: ESPN"],
  [S.lost.a + 0.2, S.lost.b + 0.3, "MAR 8, 1960 · NO MASK · LOST 3–0 AT DETROIT", "mask back the next night · NHL.com"],
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

const WHOOSH = [cut(S.date), cut(S.shot), cut(S.off), cut(S.lost)];
export const BiscuitMask25D: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS - INTRO;
  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: "#0b0716", overflow: "hidden" }}>
      <Sequence from={F(INTRO)}><Audio src={staticFile("ep/bmask.mp3")} /></Sequence>
      <Sequence from={F(INTRO)}><Audio src={staticFile("music_happy.mp3")} volume={(fr) => (fr < F(END) ? 0.24 : 0.4)} /></Sequence>
      {RANGES.map((s) => { const C = s.Comp; return <Sequence key={s.from} from={F(INTRO + s.from)} durationInFrames={Math.max(1, F(INTRO + s.to) - F(INTRO + s.from))}><AbsoluteFill style={{ overflow: "hidden" }}><C t={t} /></AbsoluteFill></Sequence>; })}
      {RANGES.slice(1).map((s) => <Sequence key={`p${s.from}`} from={F(INTRO + s.from)} durationInFrames={20}><Audio src={staticFile(WHOOSH.includes(s.from) ? "whoosh.wav" : "pop.wav")} volume={0.22} /></Sequence>)}
      <Sequence from={F(INTRO + hitT)} durationInFrames={F(0.8)}><Audio src={staticFile("sfx/shutter.mp3")} volume={0.5} /></Sequence>
      <Sequence from={F(INTRO + S.blake.b - 0.3)} durationInFrames={F(1.4)}><Audio src={staticFile("sfx/horn.wav")} volume={0.2} /></Sequence>
      {t >= 0 && t < END && <Fact t={t} />}
      {t >= 0 && t < END && <Captions t={t} />}
      {t >= 0 && t < END && <div style={{ position: "absolute", left: 52, top: 140, padding: "4px 12px", background: "#ff2bd6", color: "#fff", fontWeight: 900, fontSize: 22, letterSpacing: 2, zIndex: 9 }}>ZAM · BISCUIT'S MASK</div>}
      <Sequence from={0} durationInFrames={F(INTRO) + 2}><Intro2 /></Sequence>
      <Sequence from={F(INTRO + END)}><Outro2 /></Sequence>
    </AbsoluteFill>
  );
};
