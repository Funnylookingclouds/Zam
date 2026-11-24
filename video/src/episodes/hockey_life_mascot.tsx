/** Hockey Life Special (2.5D crossover) – "Mascot Night": the Hockey Life gang meets their mascot twins (Gang 2.0),
 *  who share their voices: Rookie/Zam, Walt/Biscuit, Gus/Clubby, Ref/Helmy, Pucky/Pucky. */
import React from "react";
import { AbsoluteFill, Audio, Easing, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import words from "../data/mascot_words.json";
import { clamp } from "../presenter/kit";
import { FONT } from "../theme";
import { mouthOpen } from "../mascots/Gang";
import { StickPerson, type StickMood, type StickPose, type StickWho } from "../mascots/Stick";
import { GangPerson, type GangWho } from "../mascots/Hybrid";
import { Bill, LockerRoom3D, frame, lerpCam, type Camera } from "../hl3d/Set3D";
import { Logo } from "../zam/common";
import { FPS } from "../zam/Episode";
import { Pow } from "../zam/toon";
import { IntroHL } from "./hockey_life_ref";

type Wd = { word: string; display: string; start: number; end: number; segment: string };
const WORDS = words as Wd[];
const LAST = WORDS[WORDS.length - 1].end;
const INTRO = 2.0, END = LAST + 0.6, OUTRO = 3.0;
const F = (s: number) => Math.round(s * FPS);
export const MASCOT_FRAMES = F(INTRO + END + OUTRO);
const soft = { ...clamp, easing: Easing.inOut(Easing.sin) };
const WHO: Record<string, string> = { n: "narrator", r: "rookie", z: "zam", w: "walt", b: "biscuit", g: "gus", c: "clubby", f: "ref", h: "helmy", p: "pucky", q: "pucky2" };
const talk = (who: string, t: number) => { const ws = WORDS.filter((w) => WHO[w.segment[0]] === who); return ws.some((w) => t >= w.start - 0.05 && t <= w.end + 0.05) ? mouthOpen(ws, t) : 0; };
const bump = (who: string, t: number) => { const w = WORDS.find((x) => t >= x.start && t <= x.end && WHO[x.segment[0]] === who); return w ? Math.max(0, 1 - (t - w.start) * 5) : 0; };
const camAt = (t: number, t0: number, t1: number, a: Camera, b: Camera) => lerpCam(a, b, interpolate(t, [t0, t1], [0, 1], soft));

type PP = { t: number; cam: Camera; x: number; z: number; size: number; mood: StickMood; pose?: StickPose; sitting?: boolean; skate?: number; lean?: number; y?: number; arms?: [number, number, number, number]; flip?: boolean; talkAs?: string };
const H: React.FC<PP & { who: StickWho }> = (p) => { const b = bump(p.talkAs ?? p.who, p.t); return (
  <Bill x={p.x} z={p.z} y={(p.y ?? 0) - b * 14} cam={p.cam} w={p.size} h={p.size * 1.3}><div style={{ transform: `scale(${1 + b * 0.03}, ${1 - b * 0.03})`, transformOrigin: "50% 100%" }}>
    <StickPerson who={p.who} size={p.size} mood={p.mood} pose={p.pose} sitting={p.sitting} skate={p.skate} lean={p.lean} arms={p.arms} flip={p.flip} open={talk(p.talkAs ?? p.who, p.t)} bean seed={p.who.length} />
  </div></Bill>); };
const M: React.FC<PP & { who: GangWho }> = (p) => { const b = bump(p.talkAs ?? p.who, p.t); return (
  <Bill x={p.x} z={p.z} y={(p.y ?? 0) - b * 14} cam={p.cam} w={p.size} h={p.size * 1.3}><div style={{ transform: `scale(${1 + b * 0.03}, ${1 - b * 0.03})`, transformOrigin: "50% 100%" }}>
    <GangPerson who={p.who} size={p.size} mood={p.mood} pose={p.pose} sitting={p.sitting} skate={p.skate} lean={p.lean} arms={p.arms} flip={p.flip} open={talk(p.talkAs ?? p.who, p.t)} seed={p.who.length + 3} />
  </div></Bill>); };
const Door: React.FC<{ open: number }> = ({ open }) => (
  <div style={{ width: 300, height: 620, background: "#fde68a", boxShadow: `0 0 ${80 * open}px #fde68a`, position: "relative" }}>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,#7c4a1e,#9a6324)", border: "8px solid #3f2a14", transform: `perspective(800px) rotateY(${-open * 80}deg)`, transformOrigin: "0 50%" }}>
      <div style={{ position: "absolute", right: 30, top: 300, width: 24, height: 24, borderRadius: 12, background: "#fcd34d" }} />
      <div style={{ position: "absolute", left: 40, top: 60, width: 200, height: 70, background: "#f8f1e3", border: "4px solid #3f2a14", fontFamily: FONT, fontWeight: 900, fontSize: 30, textAlign: "center", lineHeight: "62px", color: "#3f2a14" }}>MASCOTS</div>
    </div>
  </div>
);
const SorryCount: React.FC<{ t: number }> = ({ t }) => {
  const n = t >= 24.14 ? 5 : t >= 21.2 ? 4 : 0;
  if (!n) return null;
  return <div style={{ position: "absolute", left: 70, top: 380, zIndex: 9, background: "#fbf6ea", border: "5px solid #2b2622", borderRadius: 8, padding: "10px 22px", transform: "rotate(-3deg)", fontFamily: FONT, fontWeight: 900, fontSize: 46, color: "#2b2622", boxShadow: "0 10px 0 #0005" }}>SORRY COUNT: <span style={{ color: "#dc2626" }}>{n}</span></div>;
};

// world spots
const S = { rook: { x: -330, z: -620 }, door: { x: 930, z: -1270 }, walt: { x: -360, z: -880 }, bisc: { x: 60, z: -900 }, gus: { x: -260, z: -700 }, club: { x: 260, z: -700 }, ref: { x: -260, z: -680 }, helm: { x: 260, z: -680 } };
type Shot = { from: number; Comp: React.FC<{ t: number }> };
const SHOTS: Shot[] = [
  { from: 0, Comp: ({ t }) => { const cam = camAt(t, 0, 4.3, frame(300, -900, -900, 2400, 1000, { rx: -10 }), frame(500, -560, -1000, 1500, 860, { ry: 8 }));
    return <LockerRoom3D cam={cam}><Bill x={S.door.x} z={S.door.z} cam={cam} w={300} h={620} shadow={false}><Door open={interpolate(t, [3.0, 3.8], [0, 1], soft)} /></Bill><H who="rookie" t={t} cam={cam} x={S.rook.x} z={S.rook.z} size={580} mood="talk" /></LockerRoom3D>; } },
  { from: 4.4, Comp: ({ t }) => { const cam = frame(0, -520, -700, 1450, 860, { ry: 4 }); const k = interpolate(t, [4.4, 5.4], [0, 1], soft);
    return <LockerRoom3D cam={cam}><Bill x={S.door.x} z={S.door.z} cam={cam} w={300} h={620} shadow={false}><Door open={1} /></Bill>
      <H who="rookie" t={t} cam={cam} x={S.rook.x} z={S.rook.z} size={580} mood="shock" />
      <M who="zam" t={t} cam={cam} x={900 - k * 640} z={-1150 + k * 520} size={600} mood="happy" pose="wave" /></LockerRoom3D>; } },
  { from: 6.2, Comp: ({ t }) => { const cam = camAt(t, 6.2, 8.5, frame(S.rook.x, -590, S.rook.z, 640, 720), frame(S.rook.x, -590, S.rook.z, 560, 720));
    return <LockerRoom3D cam={cam}><H who="rookie" t={t} cam={cam} x={S.rook.x} z={S.rook.z} size={580} mood="shock" pose="point" /></LockerRoom3D>; } },
  { from: 8.5, Comp: ({ t }) => { const cam = camAt(t, 8.5, 10.2, frame(260, -400, -630, 640, 760), frame(260, -400, -630, 560, 760));
    return <LockerRoom3D cam={cam}><M who="zam" t={t} cam={cam} x={260} z={-630} size={560} mood="shock" pose="point" /></LockerRoom3D>; } },
  { from: 10.2, Comp: ({ t }) => { const cam = camAt(t, 10.2, 13.8, frame(-150, -560, -900, 1350, 820, { ry: -6 }), frame(-150, -580, -900, 1050, 800, { ry: -6 })); const k = interpolate(t, [10.2, 10.9], [0, 1], soft);
    return <LockerRoom3D cam={cam}><M who="biscuit" t={t} cam={cam} x={S.bisc.x} z={S.bisc.z} size={600} mood="grumpy" pose="crossed" sitting />
      <H who="walt" t={t} cam={cam} x={-900 + k * 540} z={S.walt.z} size={620} mood="grumpy" pose={k < 1 ? "idle" : "point"} skate={k < 1 ? t * 5 : undefined} /></LockerRoom3D>; } },
  { from: 13.75, Comp: ({ t }) => { const cam = camAt(t, 13.75, 15.1, frame(S.walt.x, -640, S.walt.z, 680, 730), frame(S.walt.x, -640, S.walt.z, 600, 730));
    return <LockerRoom3D cam={cam}><H who="walt" t={t} cam={cam} x={S.walt.x} z={S.walt.z} size={620} mood={t > 14.2 ? "happy" : "smug"} pose="crossed" /></LockerRoom3D>; } },
  { from: 15.1, Comp: ({ t }) => { const cam = frame(S.gus.x, -600, S.gus.z, 640, 730, { ry: -10 });
    return <LockerRoom3D cam={cam}><H who="gus" t={t} cam={cam} x={S.gus.x} z={S.gus.z} size={600} mood="talk" pose="point" /></LockerRoom3D>; } },
  { from: 16.25, Comp: ({ t }) => { const cam = frame(S.club.x, -560, S.club.z, 640, 730, { ry: 10 });
    return <LockerRoom3D cam={cam}><M who="clubby" t={t} cam={cam} x={S.club.x} z={S.club.z} size={600} mood="talk" pose="point" /></LockerRoom3D>; } },
  { from: 17.45, Comp: ({ t }) => { const cam = camAt(t, 17.45, 18.9, frame(0, -560, -700, 1250, 820), frame(0, -580, -700, 1100, 820)); const hf = interpolate(t, [17.6, 17.95], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
    return <><LockerRoom3D cam={cam}><H who="gus" t={t} cam={cam} x={S.gus.x + hf * 60} z={S.gus.z} size={600} mood="happy" arms={[-78, -30, 130, -260 + (1 - hf) * 200]} talkAs="clubby" />
      <M who="clubby" t={t} cam={cam} x={S.club.x - hf * 60} z={S.club.z} size={600} mood="happy" arms={[-130, -260 + (1 - hf) * 200, 78, -30]} /></LockerRoom3D>
      {t > 17.95 && <Pow text="HIGH FIVE!" x={250} y={420} size={130} rot={-6} />}</>; } },
  { from: 18.9, Comp: ({ t }) => { const cam = camAt(t, 18.9, 19.9, frame(-60, -560, -680, 1150, 820, { ry: 6 }), frame(-60, -560, -680, 1050, 820, { ry: 6 }));
    return <LockerRoom3D cam={cam}><H who="ref" t={t} cam={cam} x={S.ref.x} z={S.ref.z} size={580} mood="sad" pose="shrug" /><M who="helmy" t={t} cam={cam} x={S.helm.x} z={S.helm.z} size={580} mood="talk" /></LockerRoom3D>; } },
  { from: 19.9, Comp: ({ t }) => { const cam = camAt(t, 19.9, 22.5, frame(S.helm.x, -560, S.helm.z, 660, 740), frame(S.helm.x, -560, S.helm.z, 600, 740));
    return <><LockerRoom3D cam={cam}><M who="helmy" t={t} cam={cam} x={S.helm.x} z={S.helm.z} size={580} mood="smug" pose="point" /></LockerRoom3D><SorryCount t={t} /></>; } },
  { from: 22.5, Comp: ({ t }) => { const cam = frame(S.ref.x, -560, S.ref.z, 600, 730);
    return <LockerRoom3D cam={cam}><H who="ref" t={t} cam={cam} x={S.ref.x} z={S.ref.z} size={580} mood="sad" pose="shrug" /></LockerRoom3D>; } },
  { from: 23.95, Comp: ({ t }) => { const cam = camAt(t, 23.95, 25.1, frame(S.helm.x, -560, S.helm.z, 600, 740), frame(S.helm.x, -560, S.helm.z, 480, 720));
    return <><LockerRoom3D cam={cam}><M who="helmy" t={t} cam={cam} x={S.helm.x} z={S.helm.z} size={580} mood="smug" arms={[-78, -30, 150, -230]} /></LockerRoom3D><SorryCount t={t} /></>; } },
  { from: 25.1, Comp: ({ t }) => { const cam = camAt(t, 25.1, 29.3, frame(0, -520, -720, 1250, 820), frame(80, -540, -720, 1100, 820)); const drop = interpolate(t, [27.0, 27.5], [-1400, 0], { ...clamp, easing: Easing.in(Easing.quad) });
    return <><LockerRoom3D cam={cam}><M who="pucky" t={t} cam={cam} x={-180} z={-720} size={560} mood={t > 27.5 ? "shock" : "smug"} pose={t > 27.5 ? "up" : "crossed"} />
      {t > 26.9 && <M who="pucky" t={t} cam={cam} x={260} z={-760} y={drop} size={560} mood="smug" pose="point" talkAs="pucky2" />}</LockerRoom3D>
      {t > 27.5 && t < 28.2 && <Pow text="THUD!" x={560} y={1050} size={120} rot={8} />}</>; } },
  { from: 29.3, Comp: ({ t }) => { const cam = camAt(t, 29.3, 31.5, frame(0, -560, -850, 1900, 860, { ry: -14 }), frame(0, -560, -850, 1700, 860, { ry: 12 }));
    return <LockerRoom3D cam={cam}>
      <H who="rookie" t={t} cam={cam} x={-900} z={-700} size={460} mood="happy" pose="wave" /><M who="zam" t={t} cam={cam} x={-560} z={-640} size={440} mood="happy" pose="wave" />
      <H who="gus" t={t} cam={cam} x={-230} z={-1050} size={460} mood="happy" /><M who="clubby" t={t} cam={cam} x={90} z={-1050} size={460} mood="happy" />
      <H who="ref" t={t} cam={cam} x={480} z={-700} size={440} mood="sad" pose="shrug" /><M who="helmy" t={t} cam={cam} x={820} z={-700} size={440} mood="smug" />
    </LockerRoom3D>; } },
  { from: 31.5, Comp: ({ t }) => { const cam = camAt(t, 31.5, END, frame(-150, -620, -900, 1150, 800), frame(-150, -620, -900, 880, 780));
    return <LockerRoom3D cam={cam}><H who="walt" t={t} cam={cam} x={-380} z={-900} size={620} mood="smug" pose="crossed" sitting /><M who="biscuit" t={t} cam={cam} x={90} z={-900} size={600} mood="grumpy" pose="crossed" sitting /></LockerRoom3D>; } },
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
const OutroM: React.FC = () => {
  const f = useCurrentFrame();
  const cam = frame(0, -540, -850, 1800, 860, { ry: Math.sin(f / 60) * 4 });
  const pairs: [StickWho, GangWho][] = [["rookie", "zam"], ["walt", "biscuit"], ["gus", "clubby"], ["ref", "helmy"]];
  return (
    <AbsoluteFill style={{ opacity: interpolate(f, [0, 12], [0, 1], clamp) }}>
      <LockerRoom3D cam={cam}>{pairs.map(([a, b], i) => <React.Fragment key={a}><Bill x={-840 + i * 470} z={-900} cam={cam} w={330} h={429}><StickPerson who={a} size={330} mood="happy" pose="wave" bean seed={i} /></Bill><Bill x={-640 + i * 470} z={-860} cam={cam} w={320} h={416}><GangPerson who={b} size={320} mood="happy" pose="wave" seed={i + 5} /></Bill></React.Fragment>)}</LockerRoom3D>
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#0b1220dd,#0b122000 40%,#0b122000 70%,#0b1220dd)" }} />
      <div style={{ position: "absolute", top: 150, left: 0, right: 0 }}><Logo scale={0.75} /></div>
      <div style={{ position: "absolute", top: 440, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontStyle: "italic", fontSize: 92, color: "#fde047", WebkitTextStroke: "8px #111", paintOrder: "stroke fill" }}>HOCKEY LIFE</div>
      <div style={{ position: "absolute", top: 1450, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 56, color: "#fff", WebkitTextStroke: "6px #111", paintOrder: "stroke fill" }}>Follow for more 👀</div>
      <Sequence from={4}><Audio src={staticFile("brand/outro_vo.mp3")} /></Sequence>
    </AbsoluteFill>
  );
};

export const HockeyLifeMascot: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS - INTRO;
  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: "#0b1220", overflow: "hidden" }}>
      <Sequence from={F(INTRO)}><Audio src={staticFile("ep/mascot.mp3")} /></Sequence>
      <Audio src={staticFile("music_happy.mp3")} volume={(fr) => (fr < F(INTRO + END) ? 0.26 : 0.42)} />
      {RANGES.map((s) => { const C = s.Comp; return <Sequence key={s.from} from={F(INTRO + s.from)} durationInFrames={F(INTRO + s.to) - F(INTRO + s.from)}><AbsoluteFill style={{ overflow: "hidden" }}><C t={t} /></AbsoluteFill></Sequence>; })}
      {RANGES.slice(1).map((s) => <Sequence key={`p${s.from}`} from={F(INTRO + s.from)} durationInFrames={20}><Audio src={staticFile([10.2, 29.3].includes(s.from) ? "whoosh.wav" : "pop.wav")} volume={0.18} /></Sequence>)}
      <Sequence from={F(INTRO + 3.0)} durationInFrames={F(1)}><Audio src={staticFile("whoosh.wav")} volume={0.3} /></Sequence>
      <Sequence from={F(INTRO + 27.5)} durationInFrames={F(1)}><Audio src={staticFile("sfx/horn.wav")} volume={0.0} /></Sequence>
      {t >= 0 && t < END && <Captions t={t} />}
      {t >= 0 && t < END && <div style={{ position: "absolute", left: 52, top: 140, padding: "4px 12px", background: "#fde047", color: "#111", fontWeight: 900, fontSize: 22, letterSpacing: 2, zIndex: 8 }}>ZAM · HOCKEY LIFE · SPECIAL</div>}
      <Sequence from={0} durationInFrames={F(INTRO) + 2}><IntroHL title="SPECIAL · MASCOT NIGHT" /></Sequence>
      <Sequence from={F(INTRO + END)}><OutroM /></Sequence>
    </AbsoluteFill>
  );
};
