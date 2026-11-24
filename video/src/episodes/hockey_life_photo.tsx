/** Hockey Life Special (2.5D) – "Team Photo Day": one photo, a ten-second self-timer, sarcastic Walt, Pucky photobomb,
 *  Gus slipping into frame, and the framed result in the locker room. */
import React from "react";
import { AbsoluteFill, Audio, Easing, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import words from "../data/photo_words.json";
import { clamp } from "../presenter/kit";
import { FONT } from "../theme";
import { Mascot, mouthOpen } from "../mascots/Gang";
import { StickPerson, type StickMood, type StickPose, type StickWho } from "../mascots/Stick";
import { Bill, LockerRoom3D, Rink3D, frame, lerpCam, type Camera } from "../hl3d/Set3D";
import { Logo } from "../zam/common";
import { FPS } from "../zam/Episode";
import { IntroHL } from "./hockey_life_ref";

type Wd = { word: string; display: string; start: number; end: number; segment: string };
const WORDS = words as Wd[];
const LAST = WORDS[WORDS.length - 1].end;
const INTRO = 2.0, END = LAST + 0.6, OUTRO = 3.0;
const F = (s: number) => Math.round(s * FPS);
export const PHOTO_FRAMES = F(INTRO + END + OUTRO);
const soft = { ...clamp, easing: Easing.inOut(Easing.sin) };
const WHO: Record<string, string> = { n: "narrator", r: "rookie", w: "walt", g: "gus", f: "ref", p: "pucky" };
const talk = (who: string, t: number) => { const ws = WORDS.filter((w) => WHO[w.segment[0]] === who); return ws.some((w) => t >= w.start - 0.05 && t <= w.end + 0.05) ? mouthOpen(ws, t) : 0; };
const bump = (who: string, t: number) => { const w = WORDS.find((x) => t >= x.start && t <= x.end && WHO[x.segment[0]] === who); return w ? Math.max(0, 1 - (t - w.start) * 5) : 0; };
const camAt = (t: number, t0: number, t1: number, a: Camera, b: Camera) => lerpCam(a, b, interpolate(t, [t0, t1], [0, 1], soft));

const FLASH = 22.85;
const TICKS: [number, number][] = [[5.9, 10], [7.0, 9], [8.2, 8], [9.6, 7], [10.8, 6], [12.7, 5], [14.2, 4], [16.0, 3], [17.8, 2], [20.15, 1]];
const timerAt = (t: number) => { let v = -1; for (const [a, n] of TICKS) if (t >= a) v = n; return t >= FLASH ? 0 : v; };

const Person: React.FC<{ who: StickWho; t: number; cam: Camera; x: number; z: number; size: number; mood: StickMood; pose?: StickPose; open?: number; skate?: number; lean?: number; headTilt?: number; rot?: number; y?: number }> = (p) => {
  const b = bump(p.who, p.t);
  return (
    <Bill x={p.x} z={p.z} y={(p.y ?? 0) - b * 14} cam={p.cam} w={p.size} h={p.size * 1.3}>
      <div style={{ transform: `rotate(${p.rot ?? 0}deg) scale(${1 + b * 0.03}, ${1 - b * 0.03})`, transformOrigin: "50% 100%" }}>
        <StickPerson who={p.who} size={p.size} mood={p.mood} pose={p.pose} skate={p.skate} lean={p.lean} headTilt={p.headTilt} open={p.open ?? talk(p.who, p.t)} bean seed={p.who.length} />
      </div>
    </Bill>
  );
};
const TripodCam: React.FC<{ t: number }> = ({ t }) => (
  <svg width={260} height={520} viewBox="0 0 260 520">
    <path d="M130 200 L40 515 M130 200 L220 515 M130 200 L130 515" stroke="#1f2937" strokeWidth={12} strokeLinecap="round" />
    <rect x={40} y={90} width={180} height={120} rx={16} fill="#111827" stroke="#000" strokeWidth={6} />
    <rect x={150} y={70} width={50} height={26} rx={6} fill="#374151" />
    <circle cx={110} cy={150} r={44} fill="#334155" stroke="#94a3b8" strokeWidth={8} /><circle cx={110} cy={150} r={20} fill="#0ea5e9" opacity={0.7} />
    <circle cx={198} cy={112} r={9} fill={t > 5.9 && t < FLASH && Math.floor(t * 2) % 2 ? "#ef4444" : "#7f1d1d"} />
  </svg>
);
/** The framed result: frozen chaos. */
const ThePhoto: React.FC = () => (
  <div style={{ width: 900, height: 620, background: "#4a2e17", padding: 26, boxSizing: "border-box", boxShadow: "0 30px 60px #0008", borderRadius: 6 }}>
    <div style={{ position: "relative", width: "100%", height: "100%", background: "linear-gradient(180deg,#334155 0%,#475569 40%,#e0f2fe 41%,#f8fafc 100%)", overflow: "hidden", border: "8px solid #f8f1e3" }}>
      <div style={{ position: "absolute", left: 20, top: 120 }}><StickPerson who="rookie" size={240} mood="happy" open={0.8} pose="up" bean seed={7} /></div>
      <div style={{ position: "absolute", left: 250, top: 100 }}><StickPerson who="walt" size={260} mood="grumpy" pose="crossed" bean seed={8} /></div>
      <div style={{ position: "absolute", left: 500, top: 150, transform: "rotate(25deg)" }}><StickPerson who="ref" size={230} mood="sad" pose="shrug" bean seed={9} /></div>
      <div style={{ position: "absolute", left: 200, top: 330, transform: "rotate(-85deg)" }}><StickPerson who="gus" size={240} mood="shock" pose="up" open={0.7} bean seed={10} /></div>
      <div style={{ position: "absolute", left: 560, top: -40 }}><Mascot who="pucky" size={330} mood="laugh" noSticker seed="photop" /></div>
      <div style={{ position: "absolute", right: 14, bottom: 8, fontFamily: "Caveat", fontSize: 34, color: "#1f2937" }}>TEAM PHOTO · NEVER AGAIN</div>
    </div>
  </div>
);

// ------------------------------------------------------------------ shots (news time)
const POS = { rook: { x: -380, z: -1300 }, walt: { x: 0, z: -1350 }, ref: { x: 400, z: -1300 }, gus: { x: 330, z: -520 }, tripod: { x: 60, z: -480 } };
type Shot = { from: number; Comp: React.FC<{ t: number }> };
const Ice: React.FC<{ t: number; cam: Camera; gus?: Partial<React.ComponentProps<typeof Person>> | null; refIn?: number; rookMood?: StickMood; rookOpen?: number; waltMood?: StickMood; extra?: React.ReactNode; tripod?: boolean }> = ({ t, cam, gus, refIn = 0, rookMood = "happy", rookOpen, waltMood = "grumpy", extra, tripod = true }) => (
  <Rink3D cam={cam} t={t} cheer={0.2}>
    <Person who="rookie" t={t} cam={cam} x={POS.rook.x} z={POS.rook.z} size={560} mood={rookMood} pose="up" open={rookOpen} />
    <Person who="walt" t={t} cam={cam} x={POS.walt.x} z={POS.walt.z} size={620} mood={waltMood} pose="crossed" />
    {refIn > 0 && <Person who="ref" t={t} cam={cam} x={POS.ref.x + (1 - refIn) * 900} z={POS.ref.z} size={540} mood="sad" pose="shrug" skate={refIn < 1 ? t * 5 : undefined} lean={refIn < 1 ? 8 : 0} />}
    {gus !== null && <Person who="gus" t={t} cam={cam} x={POS.gus.x} z={POS.gus.z} size={560} mood="talk" pose="point" {...gus} />}
    {tripod && <Bill x={POS.tripod.x} z={POS.tripod.z} cam={cam} w={260} h={520}><TripodCam t={t} /></Bill>}
    {extra}
  </Rink3D>
);
const SHOTS: Shot[] = [
  { from: 0, Comp: ({ t }) => <Ice t={t} cam={camAt(t, 0, 4.1, frame(0, -900, -1100, 2600, 1000, { rx: -12 }), frame(0, -520, -1200, 1900, 860, { rx: -3 }))} /> },
  { from: 4.2, Comp: ({ t }) => <Ice t={t} cam={camAt(t, 4.2, 6.9, frame(POS.gus.x - 120, -560, POS.gus.z, 900, 760, { ry: 10 }), frame(POS.gus.x - 120, -580, POS.gus.z, 800, 760, { ry: 12 }))} gus={{ pose: t < 5.6 ? "point" : "wave", mood: "happy" }} /> },
  { from: 6.95, Comp: ({ t }) => <Ice t={t} gus={null} rookOpen={0.85} cam={camAt(t, 6.95, 8.1, frame(POS.rook.x, -580, POS.rook.z, 560, 720), frame(POS.rook.x, -580, POS.rook.z, 500, 720))} /> },
  { from: 8.1, Comp: ({ t }) => <Ice t={t} gus={null} waltMood="smug" cam={camAt(t, 8.1, 10.7, frame(POS.walt.x, -640, POS.walt.z, 700, 730), frame(POS.walt.x, -640, POS.walt.z, 620, 730))} /> },
  { from: 10.7, Comp: ({ t }) => <Ice t={t} cam={frame(POS.gus.x - 60, -560, POS.gus.z, 760, 760, { ry: -14 })} gus={{ pose: "point", mood: "grumpy" }} /> },
  { from: 12.7, Comp: ({ t }) => <Ice t={t} gus={null} waltMood="grumpy" cam={camAt(t, 12.7, 14.2, frame(POS.walt.x, -640, POS.walt.z, 640, 720), frame(POS.walt.x, -640, POS.walt.z, 540, 720))} /> },
  { from: 14.2, Comp: ({ t }) => <Ice t={t} gus={null} refIn={interpolate(t, [14.2, 15.4], [0, 1], soft)} cam={camAt(t, 14.2, 17.7, frame(200, -540, -1320, 1300, 820, { ry: -8 }), frame(220, -540, -1320, 1150, 820, { ry: -10 }))} /> },
  { from: 17.75, Comp: ({ t }) => <Ice t={t} gus={null} refIn={1} waltMood="smug" cam={frame(POS.walt.x, -640, POS.walt.z, 650, 730, { ry: 6 })} /> },
  { from: 20.1, Comp: ({ t }) => { // Pucky photobombs the lens
    const cam = frame(0, -520, -1250, 1700, 860);
    const k = interpolate(t, [20.1, 20.45], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.8)) });
    return <Ice t={t} cam={cam} refIn={1} gus={null} rookMood="shock" waltMood="shock" extra={<Bill x={-60} z={-180} y={-80 + (1 - k) * 600} cam={cam} w={700} h={760} shadow={false}><Mascot who="pucky" size={700} mood="laugh" noSticker seed="pbomb" open={talk("pucky", t)} talking={talk("pucky", t) > 0} /></Bill>} />;
  } },
  { from: 21.45, Comp: ({ t }) => { // Gus sprints back and slips into frame (slow-mo)
    const k = interpolate(t, [21.45, FLASH], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
    const cam = frame(0, -520, -1250, 1750, 860);
    return <Ice t={t} cam={cam} refIn={1} rookMood="happy" rookOpen={0.85} waltMood="grumpy" tripod={false} gus={{ x: POS.gus.x - k * 480, z: POS.gus.z - k * 660, rot: -k * 82, y: -k * 120, mood: "shock", pose: "up", skate: t * 3 }} />;
  } },
  { from: 23.15, Comp: ({ t }) => { // the framed photo in the locker room
    const cam = camAt(t, 23.15, 28.3, frame(0, -700, -1250, 1500, 820), frame(0, -720, -1250, 820, 800));
    return <LockerRoom3D cam={cam} lamp={1.2}><Bill x={0} z={-1250} y={-380} cam={cam} w={900} h={620} shadow={false}><ThePhoto /></Bill></LockerRoom3D>;
  } },
  { from: 28.4, Comp: ({ t }) => { // Walt in front of the photo: "Frame it. The day I almost smiled."
    const cam = camAt(t, 28.4, END, frame(-80, -640, -880, 760, 740), frame(-80, -640, -880, 680, 740));
    return <LockerRoom3D cam={cam}><Bill x={160} z={-1250} y={-380} cam={cam} w={900} h={620} shadow={false}><ThePhoto /></Bill>
      <Person who="walt" t={t} cam={cam} x={-80} z={-880} size={620} mood={t > 30.6 ? "happy" : "smug"} pose="crossed" headTilt={t > 30.6 ? -6 : 0} />
    </LockerRoom3D>;
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
const TimerHUD: React.FC<{ t: number }> = ({ t }) => {
  const v = timerAt(t);
  if (v < 1) return null;
  const tick = TICKS.find(([, n]) => n === v)![0];
  const pop = interpolate(t, [tick, tick + 0.15], [1.35, 1], clamp);
  return (
    <div style={{ position: "absolute", right: 190, top: 220, zIndex: 9, transform: `scale(${pop})`, transformOrigin: "100% 0", background: "#111", border: "6px solid #ef4444", borderRadius: 18, padding: "6px 22px", fontFamily: "'Courier New', monospace", fontWeight: 900, fontSize: 96, color: v <= 3 ? "#ef4444" : "#fde047", textShadow: "0 0 18px currentColor" }}>⏱ {v}</div>
  );
};
const OutroP: React.FC = () => {
  const f = useCurrentFrame();
  const cam = frame(0, -620, -1250, 1300, 820, { ry: Math.sin(f / 60) * 3 });
  return (
    <AbsoluteFill style={{ opacity: interpolate(f, [0, 12], [0, 1], clamp) }}>
      <LockerRoom3D cam={cam}><Bill x={0} z={-1250} y={-380} cam={cam} w={900} h={620} shadow={false}><ThePhoto /></Bill></LockerRoom3D>
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#0b1220dd,#0b122000 40%,#0b122000 70%,#0b1220dd)" }} />
      <div style={{ position: "absolute", top: 150, left: 0, right: 0 }}><Logo scale={0.75} /></div>
      <div style={{ position: "absolute", top: 440, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontStyle: "italic", fontSize: 92, color: "#fde047", WebkitTextStroke: "8px #111", paintOrder: "stroke fill" }}>HOCKEY LIFE</div>
      <div style={{ position: "absolute", top: 1450, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 56, color: "#fff", WebkitTextStroke: "6px #111", paintOrder: "stroke fill" }}>Follow for more 👀</div>
      <Sequence from={4}><Audio src={staticFile("brand/outro_vo.mp3")} /></Sequence>
    </AbsoluteFill>
  );
};

export const HockeyLifePhoto: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS - INTRO;
  const flash = interpolate(t, [FLASH, FLASH + 0.05, FLASH + 0.45], [0, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: "#0b1220", overflow: "hidden" }}>
      <Sequence from={F(INTRO)}><Audio src={staticFile("ep/photo.mp3")} /></Sequence>
      <Audio src={staticFile("music_happy.mp3")} volume={(fr) => (fr < F(INTRO + FLASH) ? 0.26 : fr < F(INTRO + FLASH + 1.5) ? 0.08 : fr < F(INTRO + END) ? 0.26 : 0.42)} />
      {TICKS.map(([a]) => <Sequence key={a} from={F(INTRO + a)} durationInFrames={F(0.5)}><Audio src={staticFile("sfx/beep.mp3")} volume={0.35} /></Sequence>)}
      <Sequence from={F(INTRO + FLASH)} durationInFrames={F(1)}><Audio src={staticFile("sfx/shutter.mp3")} volume={0.8} /></Sequence>
      {RANGES.map((s) => { const C = s.Comp; return <Sequence key={s.from} from={F(INTRO + s.from)} durationInFrames={F(INTRO + s.to) - F(INTRO + s.from)}><AbsoluteFill style={{ overflow: "hidden" }}><C t={t} /></AbsoluteFill></Sequence>; })}
      {RANGES.slice(1).map((s) => <Sequence key={`p${s.from}`} from={F(INTRO + s.from)} durationInFrames={20}><Audio src={staticFile(s.from === 23.15 ? "whoosh.wav" : "pop.wav")} volume={0.18} /></Sequence>)}
      {t >= 0 && t < END && <TimerHUD t={t} />}
      {flash > 0 && <AbsoluteFill style={{ background: "#fff", opacity: flash, zIndex: 10 }} />}
      {t >= 0 && t < END && <Captions t={t} />}
      {t >= 0 && t < END && <div style={{ position: "absolute", left: 52, top: 140, padding: "4px 12px", background: "#fde047", color: "#111", fontWeight: 900, fontSize: 22, letterSpacing: 2, zIndex: 8 }}>ZAM · HOCKEY LIFE · SPECIAL</div>}
      <Sequence from={0} durationInFrames={F(INTRO) + 2}><IntroHL title="SPECIAL · TEAM PHOTO DAY" /></Sequence>
      <Sequence from={F(INTRO + END)}><OutroP /></Sequence>
    </AbsoluteFill>
  );
};
