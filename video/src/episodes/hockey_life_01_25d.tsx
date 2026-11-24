/** Hockey Life #1 remade in 2.5D: "The Goalie Who Refused to Retire" – same approved VO (ep/hl01.mp3), now in a
 *  CSS-3D locker room + 3D rink, with a moving camera (dolly-ins, over-the-shoulder, arcs, reveal), bean-style cast,
 *  contact shadows, practical light and depth of field. */
import React from "react";
import { AbsoluteFill, Audio, Easing, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import words from "../data/hl01_words.json";
import { clamp } from "../presenter/kit";
import { FONT } from "../theme";
import { Mascot, mouthOpen } from "../mascots/Gang";
import { StickPerson, type StickMood, type StickPose, type StickWho } from "../mascots/Stick";
import { Bill, LockerRoom3D, Rink3D, frame, lerpCam, type Camera } from "../hl3d/Set3D";
import { BackHead } from "../hl3d/Proto25D";
import { Logo } from "../zam/common";
import { FPS } from "../zam/Episode";
import { Pow } from "../zam/toon";
import { IntroHL } from "./hockey_life_ref";
import { BeachChair, Cake, Globe, Juice, Net, Pillow } from "./hockey_life_01";

type Wd = { word: string; display: string; start: number; end: number; segment: string };
const WORDS = words as Wd[];
const LAST = WORDS[WORDS.length - 1].end;
const INTRO = 2.0, END = LAST + 0.5, OUTRO = 3.0;
const F = (s: number) => Math.round(s * FPS);
export const HL01_25D_FRAMES = F(INTRO + END + OUTRO);
const soft = { ...clamp, easing: Easing.inOut(Easing.sin) };
const WHO: Record<string, string> = { n: "narrator", r: "rookie", w: "walt", p: "pucky" };
const talk = (who: string, t: number) => { const ws = WORDS.filter((w) => WHO[w.segment[0]] === who); return ws.some((w) => t >= w.start - 0.05 && t <= w.end + 0.05) ? mouthOpen(ws, t) : 0; };
const bump = (who: string, t: number) => { const w = WORDS.find((x) => t >= x.start && t <= x.end && WHO[x.segment[0]] === who); return w ? Math.max(0, 1 - (t - w.start) * 5) : 0; };

// world positions
const WALT = { x: -300, z: -900, size: 700, headY: -640 };
const ROOK = { x: 290, z: -520, size: 650, headY: -593 };

const Person: React.FC<{ who: StickWho; t: number; cam: Camera; x: number; z: number; size: number; mood: StickMood; pose?: StickPose; sitting?: boolean; hold?: React.ReactNode; flip?: boolean; shades?: boolean; skate?: number; lean?: number; headTilt?: number }> = (p) => {
  const b = bump(p.who, p.t);
  return (
    <Bill x={p.x} z={p.z} cam={p.cam} w={p.size} h={p.size * 1.3} y={-b * 14}>
      <div style={{ transform: `scale(${1 + b * 0.03}, ${1 - b * 0.03})`, transformOrigin: "50% 100%" }}>
        <StickPerson who={p.who} size={p.size} mood={p.mood} pose={p.pose} sitting={p.sitting} hold={p.hold} flip={p.flip} shades={p.shades} skate={p.skate} lean={p.lean} headTilt={p.headTilt} open={talk(p.who, p.t)} bean seed={p.who.length} />
      </div>
    </Bill>
  );
};
const camAt = (t: number, t0: number, t1: number, a: Camera, b: Camera) => lerpCam(a, b, interpolate(t, [t0, t1], [0, 1], soft));

// ------------------------------------------------------------------ shots
type Shot = { from: number; Comp: React.FC<{ t: number }> };
const Locker: React.FC<{ cam: Camera; t: number; walt?: Partial<React.ComponentProps<typeof Person>>; rook?: Partial<React.ComponentProps<typeof Person>> | null; fg?: React.ReactNode; pucky?: boolean }> = ({ cam, t, walt, rook, fg, pucky = true }) => (
  <LockerRoom3D cam={cam}>
    {pucky && <Bill x={-820} z={-1010} y={-200} cam={cam} w={190} h={210} shadow={false}><Mascot who="pucky" size={190} mood="talk" noSticker seed="p25e" /></Bill>}
    <Person who="walt" t={t} cam={cam} x={WALT.x} z={WALT.z} size={WALT.size} mood="grumpy" pose="crossed" sitting {...walt} />
    {rook !== null && <Person who="rookie" t={t} cam={cam} x={ROOK.x} z={ROOK.z} size={ROOK.size} mood="talk" {...rook} />}
    {fg}
  </LockerRoom3D>
);
const SHOTS: Shot[] = [
  { from: 0, Comp: ({ t }) => <Locker t={t} rook={null} cam={camAt(t, 0, 5.7, frame(0, -430, -800, 2400, 900, { rx: -4 }), frame(WALT.x, -560, WALT.z, 1300, 820))} /> },
  { from: 5.75, Comp: ({ t }) => <Locker t={t} rook={null} cam={camAt(t, 5.75, 7.1, frame(WALT.x, WALT.headY, WALT.z, 700, 720), frame(WALT.x, WALT.headY, WALT.z, 620, 720))} /> },
  { from: 7.1, Comp: ({ t }) => <Locker t={t} cam={frame(0, -500, -720, 1750, 860, { ry: 5 })} rook={{ x: interpolate(t, [7.1, 7.9], [1100, ROOK.x], soft), mood: "happy", pose: "point", hold: Cake, skate: t < 7.9 ? t * 8 : undefined }} /> },
  { from: 10.3, Comp: ({ t }) => { const cam = camAt(t, 10.3, 12.5, frame(WALT.x, -600, WALT.z, 1150, 760, { ry: -8 }), frame(WALT.x, -620, WALT.z, 1000, 760, { ry: -8 })); return <Locker t={t} cam={cam} walt={{ pose: "point" }} rook={null} fg={<Bill x={60} z={-330} cam={cam} w={520} h={650} shadow={false} blurPx={8}><BackHead who="rookie" size={520} /></Bill>} />; } },
  { from: 12.5, Comp: ({ t }) => { const cam = frame(ROOK.x, -560, ROOK.z, 950, 780, { ry: 8 }); return <Locker t={t} cam={cam} rook={{ mood: "happy", pose: "point", hold: Pillow }} fg={<Bill x={-80} z={-170} cam={cam} w={560} h={700} shadow={false} blurPx={8}><BackHead who="walt" size={560} /></Bill>} />; } },
  { from: 14.55, Comp: ({ t }) => <Locker t={t} rook={null} cam={camAt(t, 14.55, 16.6, frame(WALT.x, WALT.headY, WALT.z, 760, 730), frame(WALT.x, WALT.headY, WALT.z, 680, 730))} walt={{ mood: "smug" }} /> },
  { from: 16.6, Comp: ({ t }) => { const cam = frame(ROOK.x, -560, ROOK.z, 950, 780, { ry: 8 }); return <Locker t={t} cam={cam} rook={{ mood: "happy", pose: "point", hold: Globe }} fg={<Bill x={-80} z={-170} cam={cam} w={560} h={700} shadow={false} blurPx={8}><BackHead who="walt" size={560} /></Bill>} />; } },
  { from: 18.75, Comp: ({ t }) => <Locker t={t} rook={null} cam={camAt(t, 18.75, 21.1, frame(WALT.x, WALT.headY, WALT.z, 950, 760), frame(WALT.x, WALT.headY, WALT.z, 600, 720))} walt={{ mood: "smug", headTilt: 8 }} /> },
  { from: 21.15, Comp: ({ t }) => <Locker t={t} cam={camAt(t, 21.15, 23.8, frame(0, -480, -720, 1700, 880, { ry: -16 }), frame(0, -480, -720, 1500, 880, { ry: -20 }))} rook={{ mood: "sad", pose: "shrug" }} /> },
  { from: 23.85, Comp: ({ t }) => <Locker t={t} rook={null} cam={camAt(t, 25.0, 26.9, frame(WALT.x, WALT.headY, WALT.z, 820, 740), frame(WALT.x, WALT.headY, WALT.z, 430, 700))} walt={{ mood: t > 25 ? "shock" : "grumpy" }} /> },
  { from: 26.95, Comp: ({ t }) => <Locker t={t} cam={camAt(t, 26.95, 29.3, frame(ROOK.x, ROOK.headY, ROOK.z, 620, 700, { rx: 5 }), frame(ROOK.x, ROOK.headY, ROOK.z, 560, 700, { rx: 5 }))} rook={{ mood: "sad", pose: "shrug" }} /> },
  { from: 29.3, Comp: ({ t }) => { const up = interpolate(t, [29.3, 29.9], [0, 1], soft); return <Locker t={t} cam={camAt(t, 29.3, 31.5, frame(0, -560, -700, 1500, 840, { ry: -12 }), frame(0, -600, -700, 1300, 840, { ry: 10 }))} walt={{ sitting: up < 0.5, mood: "smug", pose: up > 0.5 ? "point" : "crossed", x: WALT.x + up * 120 }} rook={{ mood: "shock" }} />; } },
  { from: 31.55, Comp: ({ t }) => { // the rink: Rookie alone in the net, Pucky incoming from behind the camera
    const k = interpolate(t, [33.4, 35.6], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
    const cam = camAt(t, 31.55, 35.6, frame(0, -480, -1500, 1700, 820), frame(0, -500, -1500, 1150, 800));
    return (<><Rink3D cam={cam} t={t} cheer={t > 35 ? 1 : 0.3}>
      <Bill x={0} z={-1560} cam={cam} w={620} h={400} shadow={false}><Net x={30} y={20} /></Bill>
      <Person who="rookie" t={t} cam={cam} x={0} z={-1500} size={560} mood="shock" pose="up" lean={Math.sin(t * 40) * 1.5} />
      {k > 0 && k < 1 && <Bill x={260 - k * 240} z={-300 - k * 1150} y={-260 + k * 60} cam={cam} w={140} h={150} shadow={false}><div style={{ transform: `rotate(${k * 720}deg)` }}><Mascot who="pucky" size={140} mood="laugh" noSticker seed="pk3" open={talk("pucky", t)} talking={talk("pucky", t) > 0} /></div></Bill>}
    </Rink3D>{t > 35.1 && <Pow text="SAVE?!" x={540} y={360} size={150} rot={8} />}</>);
  } },
  { from: 37.85, Comp: ({ t }) => { // reveal: pull back + arc to find Walt in a beach chair right behind the net
    const cam = camAt(t, 37.85, 41.0, frame(0, -520, -1500, 900, 800), frame(260, -520, -1580, 1450, 840, { ry: -6 }));
    return (<Rink3D cam={cam} t={t} cheer={1}>
      <Bill x={0} z={-1560} cam={cam} w={620} h={400} shadow={false}><Net x={30} y={20} /></Bill>
      <Person who="rookie" t={t} cam={cam} x={-40} z={-1500} size={520} mood="shock" />
      <Bill x={-120} z={-1490} cam={cam} w={140} h={150} shadow={false}><Mascot who="pucky" size={140} mood="dizzy" noSticker seed="pk4" /></Bill>
      <Bill x={500} z={-1720} cam={cam} w={520} h={360}><BeachChair x={0} y={0} /></Bill>
      <Person who="walt" t={t} cam={cam} x={520} z={-1700} size={560} mood="smug" pose="wave" sitting shades hold={Juice} />
    </Rink3D>);
  } },
];
const RANGES = SHOTS.map((s, i) => ({ ...s, to: SHOTS[i + 1]?.from ?? END }));

const CHUNKS = (() => { const out: Wd[][] = []; let cur: Wd[] = []; WORDS.forEach((w, i) => { cur.push(w); const n = WORDS[i + 1]; if (!n || n.segment !== w.segment || cur.length >= 3 || /[.?!,]$/.test(w.word)) { out.push(cur); cur = []; } }); return out; })();
const Captions: React.FC<{ t: number }> = ({ t }) => {
  const i = CHUNKS.findIndex((c, k) => t >= c[0].start - 0.05 && t < (CHUNKS[k + 1]?.[0].start ?? 999) - 0.05);
  if (i < 0) return null; const c = CHUNKS[i]; if (t > c[c.length - 1].end + 0.5) return null;
  const narr = c[0].segment[0] === "n";
  return (
    <div style={{ position: "absolute", left: 60, right: 170, top: 1400, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: narr ? 78 : 94, lineHeight: 1.05, textTransform: "uppercase", transform: `scale(${interpolate(t, [c[0].start - 0.05, c[0].start + 0.07], [0.85, 1], clamp)})`, fontStyle: narr ? "italic" : "normal", zIndex: 9 }}>
      {c.map((w, k) => { const on = t >= w.start && t <= w.end + 0.05; return <span key={k} style={{ display: "inline-block", margin: "0 14px", color: on ? "#fde047" : "#fff", WebkitTextStroke: "11px #111", paintOrder: "stroke fill", textShadow: "0 8px 18px #0008", transform: on ? "scale(1.1) rotate(-2deg)" : undefined }}>{w.display.replace(/^\.\.\./, "…")}</span>; })}
    </div>
  );
};
const Outro25: React.FC = () => {
  const f = useCurrentFrame();
  const cam = frame(0, -480, -800, 1900, 860, { ry: Math.sin(f / 60) * 4 });
  return (
    <AbsoluteFill style={{ opacity: interpolate(f, [0, 12], [0, 1], clamp) }}>
      <LockerRoom3D cam={cam}>
        {(["rookie", "ref", "gus", "walt"] as StickWho[]).map((w, i) => <Bill key={w} x={-570 + i * 380} z={-900 - (i % 2) * 120} cam={cam} w={460} h={598}><StickPerson who={w} size={460} mood="happy" pose={w === "walt" ? "crossed" : "wave"} bean seed={i} /></Bill>)}
      </LockerRoom3D>
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#0b1220cc,#0b122000 45%)" }} />
      <div style={{ position: "absolute", top: 160, left: 0, right: 0 }}><Logo scale={0.75} /></div>
      <div style={{ position: "absolute", top: 450, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontStyle: "italic", fontSize: 92, color: "#fde047", WebkitTextStroke: "8px #111", paintOrder: "stroke fill" }}>HOCKEY LIFE</div>
      <div style={{ position: "absolute", top: 1450, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 56, color: "#fff", WebkitTextStroke: "6px #111", paintOrder: "stroke fill" }}>Follow for more 👀</div>
      <Sequence from={4}><Audio src={staticFile("brand/outro_vo.mp3")} /></Sequence>
    </AbsoluteFill>
  );
};

export const HockeyLife01_25D: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS - INTRO;
  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: "#0b1220", overflow: "hidden" }}>
      <Sequence from={F(INTRO)}><Audio src={staticFile("ep/hl01.mp3")} /></Sequence>
      <Audio src={staticFile("music_happy.mp3")} volume={(fr) => (fr < F(INTRO + END) ? 0.26 : 0.42)} />
      {RANGES.map((s) => { const C = s.Comp; return <Sequence key={s.from} from={F(INTRO + s.from)} durationInFrames={F(INTRO + s.to) - F(INTRO + s.from)}><AbsoluteFill style={{ overflow: "hidden" }}><C t={t} /></AbsoluteFill></Sequence>; })}
      {RANGES.slice(1).map((s) => <Sequence key={`p${s.from}`} from={F(INTRO + s.from)} durationInFrames={20}><Audio src={staticFile(s.from === 31.55 || s.from === 37.85 ? "whoosh.wav" : "pop.wav")} volume={0.2} /></Sequence>)}
      <Sequence from={F(INTRO + 35.1)} durationInFrames={60}><Audio src={staticFile("sfx/horn.wav")} volume={0.25} /></Sequence>
      <Sequence from={F(INTRO + 37.9)} durationInFrames={F(3)}><Audio src={staticFile("sfx/crowd.wav")} volume={0.25} /></Sequence>
      {t >= 0 && t < 3.2 && <div style={{ position: "absolute", left: 0, right: 0, top: 230, textAlign: "center", opacity: interpolate(t, [0, 0.2, 2.8, 3.2], [0, 1, 1, 0]), zIndex: 9 }}><span style={{ display: "inline-block", background: "#111", color: "#fde047", fontFamily: FONT, fontWeight: 900, fontSize: 50, padding: "10px 24px", transform: "rotate(-2deg)" }}>THE GOALIE WHO REFUSED TO RETIRE</span></div>}
      {t >= 0 && t < END && <Captions t={t} />}
      {t >= 0 && t < END && <div style={{ position: "absolute", left: 52, top: 140, padding: "4px 12px", background: "#fde047", color: "#111", fontWeight: 900, fontSize: 22, letterSpacing: 2, zIndex: 8 }}>ZAM · HOCKEY LIFE #1</div>}
      <Sequence from={0} durationInFrames={F(INTRO) + 2}><IntroHL title="HOCKEY LIFE #1 · THE GOALIE WHO REFUSED TO RETIRE" /></Sequence>
      <Sequence from={F(INTRO + END)}><Outro25 /></Sequence>
    </AbsoluteFill>
  );
};
