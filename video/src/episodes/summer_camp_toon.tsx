/** ZAM Special Edition – "ZAM Summer Camp" (cartoon, silly, for younger viewers). Fact: Dylan Larkin's 13.172 s
 *  All-Star Fastest Skater record (2016, beat Mike Gartner's 13.386 s from 1996). */
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, random, staticFile, useCurrentFrame, Easing } from "remotion";
import words from "../data/summer_camp_words.json";
import { P, HAND, clamp, onTwos } from "../presenter/kit";
import { FONT } from "../theme";
import { Mascot, type Mood, type Who } from "../mascots/Gang";
import { Confetti, type W } from "../zam/common";
import { timing } from "../zam/Episode";
import { BgBurst, Big, Flash, Grain, Pow, Sparkles, SpeedLines, StickerCard, makeToon, type ToonShot } from "../zam/toon";

const WORDS = words as W[];
const { S, at } = timing(WORDS);

const Sun: React.FC<{ x?: number; y?: number }> = ({ x = 760, y = 120 }) => {
  const f = onTwos(useCurrentFrame());
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 220, height: 220 }}>
      <svg width={220} height={220} viewBox="-110 -110 220 220" style={{ transform: `rotate(${f}deg)` }}>{[...Array(12)].map((_, i) => <path key={i} d="M0 -105 L12 -75 L-12 -75 Z" fill="#fbbf24" transform={`rotate(${i * 30})`} />)}</svg>
      <div style={{ position: "absolute", left: 35, top: 35, width: 150, height: 150, borderRadius: 75, background: "#fde047", border: `6px solid ${P.ink}` }}>
        <div style={{ position: "absolute", left: 18, top: 44, width: 114, height: 30, background: "#111", borderRadius: 14 }} />
        <div style={{ position: "absolute", left: 45, top: 90, width: 60, height: 26, borderRadius: "0 0 30px 30px", background: "#7f1d1d", border: `4px solid ${P.ink}` }} />
      </div>
    </div>
  );
};
const Hills: React.FC<{ top?: number }> = ({ top = 760 }) => (
  <>
    <div style={{ position: "absolute", left: -200, top, width: 900, height: 500, borderRadius: "50%", background: "#86efac", border: `6px solid ${P.ink}` }} />
    <div style={{ position: "absolute", left: 420, top: top + 40, width: 900, height: 500, borderRadius: "50%", background: "#4ade80", border: `6px solid ${P.ink}` }} />
    {[...Array(5)].map((_, i) => <div key={i} style={{ position: "absolute", left: 60 + i * 220, top: top - 120 + (i % 2) * 40, width: 0, height: 0, borderLeft: "60px solid transparent", borderRight: "60px solid transparent", borderBottom: "190px solid #15803d" }} />)}
  </>
);
const BgCamp: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg,#7dd3fc 0%,#bae6fd 55%,#4ade80 56%,#22c55e 100%)" }}>
    <Sun /><Hills />
    <div style={{ position: "absolute", left: 120, top: 330, width: 840, height: 150, background: "#fef3c7", border: `8px solid ${P.ink}`, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 84, color: "#b45309", transform: "rotate(-2deg)", zIndex: 1 }}>ZAM SUMMER CAMP ☀</div>
    <Grain />
  </AbsoluteFill>
);
const BgTrack: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg,#7dd3fc 0%,#bae6fd 38%,#4ade80 39%)" }}>
    <Sun x={820} y={170} />
    <div style={{ position: "absolute", left: -100, right: -100, top: 900, height: 560, background: "#dc2626", borderTop: `8px solid ${P.ink}`, borderBottom: `8px solid ${P.ink}`, transform: "skewY(-4deg)" }}>
      {[1, 2, 3, 4].map((i) => <div key={i} style={{ position: "absolute", left: 0, right: 0, top: i * 112, height: 8, background: "#fff" }} />)}
    </div>
    <Grain />
  </AbsoluteFill>
);
const BgGym: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg,#fde68a 0%,#fcd34d 58%,#b45309 58.5%,#92400e 100%)" }}>
    <div style={{ position: "absolute", left: 60, top: 300, width: 960, height: 520, background: "linear-gradient(135deg,#e0f2fe,#fff,#e0f2fe)", border: `10px solid ${P.ink}`, borderRadius: 10, opacity: 0.85 }} />
    {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 120 + i * 220, top: 1020, width: 150, height: 30, background: "#334155", border: `5px solid ${P.ink}`, borderRadius: 10 }}><div style={{ position: "absolute", left: -20, top: -20, width: 40, height: 70, background: "#111", borderRadius: 10 }} /><div style={{ position: "absolute", right: -20, top: -20, width: 40, height: 70, background: "#111", borderRadius: 10 }} /></div>)}
    <div style={{ position: "absolute", left: 720, top: 200, padding: "6px 24px", background: "#111", color: "#facc15", fontFamily: FONT, fontWeight: 900, fontSize: 50, borderRadius: 10 }}>GYM 💪</div>
    <Grain />
  </AbsoluteFill>
);
const BgLake: React.FC<{ frozen?: boolean }> = ({ frozen }) => {
  const f = onTwos(useCurrentFrame());
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#7dd3fc 0%,#bae6fd 40%)" }}>
      <Sun />
      <Hills top={560} />
      <div style={{ position: "absolute", left: -100, right: -100, top: 860, bottom: 0, background: frozen ? "linear-gradient(180deg,#e0f2fe,#bae6fd)" : "linear-gradient(180deg,#38bdf8,#0284c7)", borderTop: `8px solid ${P.ink}` }}>
        {!frozen && [...Array(10)].map((_, i) => <div key={i} style={{ position: "absolute", left: ((i * 137 + f * 2) % 1300), top: 60 + (i % 5) * 160, width: 120, height: 10, borderRadius: 5, background: "#e0f2fe", opacity: 0.7 }} />)}
        {frozen && [...Array(12)].map((_, i) => <div key={i} style={{ position: "absolute", left: random(`fz${i}`) * 1200, top: random(`fy${i}`) * 900, fontSize: 60, color: "#fff", opacity: (f / 8 + i) % 3 < 1.5 ? 1 : 0.3 }}>✦</div>)}
      </div>
      <div style={{ position: "absolute", left: 40, top: 820, width: 420, height: 60, background: "#a16207", border: `6px solid ${P.ink}` }} />
      <Grain />
    </AbsoluteFill>
  );
};
const Barbell: React.FC<{ w: number; plate: number; bend?: number }> = ({ w, plate, bend = 0 }) => (
  <svg width={w + plate} height={plate * 2.2 + Math.abs(bend)} viewBox={`${-plate / 2} ${-plate * 1.1} ${w + plate} ${plate * 2.2 + Math.abs(bend)}`} style={{ overflow: "visible" }}>
    <path d={`M0 0 Q${w / 2} ${bend} ${w} 0`} stroke="#94a3b8" strokeWidth={plate * 0.12} fill="none" strokeLinecap="round" />
    <path d={`M0 0 Q${w / 2} ${bend} ${w} 0`} stroke={P.ink} strokeWidth={3} fill="none" />
    {[0, w].map((x, i) => <rect key={i} x={x - plate * 0.25} y={-plate} width={plate * 0.5} height={plate * 2} rx={plate * 0.12} fill="#111" stroke={P.ink} strokeWidth={5} />)}
  </svg>
);

const RUNNERS: { who: Who; size: number; y: number; delay: number; mood: Mood }[] = [
  { who: "pucky", size: 300, y: 860, delay: 0, mood: "laugh" },
  { who: "clubby", size: 300, y: 980, delay: 0.25, mood: "determined" },
  { who: "helmy", size: 280, y: 1100, delay: 0.4, mood: "wow" },
  { who: "agenty", size: 290, y: 940, delay: 0.55, mood: "smug" },
  { who: "zam", size: 320, y: 1060, delay: 0.7, mood: "laugh" },
  { who: "biscuit", size: 300, y: 1170, delay: 1.9, mood: "sweat" },
];

const shots: ToonShot[] = [
  { from: 0, chapter: ["DAY 1", "SUMMER CAMP"], Comp: ({ t, lf }) => (<><BgCamp />
      {(["pucky", "clubby", "helmy", "agenty", "biscuit"] as Who[]).map((w, i) => {
        const p = interpolate(onTwos(lf) - i * 4, [0, 14], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
        return <div key={w} style={{ position: "absolute", left: [-40, 180, 400, 620, 820][i], top: 560 + (1 - p) * 900 + (i % 2) * 90 - Math.max(0, Math.sin(lf / 8 + i)) * 30, zIndex: 2 }}><Mascot who={w} size={300} mood="laugh" noSticker seed={`c${w}`} /></div>;
      })}
      <Big who="zam" t={t} size={620} x={230} y={900} mood="laugh" z={3} />
      <div style={{ position: "absolute", left: 640, top: 1080, fontSize: 90, zIndex: 4 }}>📣</div></>) },
  { from: S("p_race").start - 0.15, chapter: ["8:00 AM", "THE TRACK"], Comp: ({ t, lf }) => (<><BgTrack /><Big who="pucky" t={t} size={1250} x={-85} y={480} mood="determined" rot={Math.sin(lf / 4) * 2} />
      <Pow text="RACE!" x={300} y={320} size={190} rot={-8} color={P.red} /></>) },
  { from: at("p_race", "last") - 0.15, Comp: ({ lf }) => (<><BgTrack /><SpeedLines />
      {RUNNERS.map((r, i) => {
        const x = interpolate(lf / 60, [r.delay, r.delay + (r.who === "biscuit" ? 5 : 1.6)], [-400, 1150], clamp);
        const bob = Math.abs(Math.sin(lf / (r.who === "biscuit" ? 9 : 4) + i)) * 40;
        return <div key={r.who} style={{ position: "absolute", left: x, top: r.y - bob, zIndex: 2 + i, transform: r.who === "pucky" ? `rotate(${lf * 14}deg)` : `rotate(${Math.sin(lf / 4 + i) * 8}deg)` }}><Mascot who={r.who} size={r.size} mood={r.mood} noSticker talking open={0.4} seed={`run${r.who}`} /></div>;
      })}
      <div style={{ position: "absolute", left: 120, top: 360, fontFamily: HAND, fontWeight: 700, fontSize: 90, color: P.ink, transform: "rotate(-6deg)", zIndex: 8 }}>last one = Biscuit!</div></>) },
  { from: S("b_behind").start - 0.15, Comp: ({ t, lf }) => (<><BgTrack /><Big who="biscuit" t={t} size={1250} x={-85} y={430} mood="sweat" sy={1 + Math.sin(lf / 5) * 0.04} />
      {[...Array(5)].map((_, i) => <div key={i} style={{ position: "absolute", left: 120 + i * 190, top: 380 + ((lf * 5 + i * 80) % 300), fontSize: 70, zIndex: 5 }}>💧</div>)}
      <div style={{ position: "absolute", left: 600, top: 300, fontFamily: HAND, fontWeight: 700, fontSize: 80, color: P.ink, zIndex: 5 }}>huff… puff…</div></>) },
  { from: S("h_larkin").start - 0.15, Comp: ({ t, lf }) => {
      const s = interpolate(t, [at("h_larkin", "thirteen") - 0.1, at("h_larkin", "seconds")], [0, 13.172], clamp);
      return (<><BgTrack /><Big who="helmy" t={t} size={800} x={-150} y={940} mood="wow" />
        <div style={{ position: "absolute", left: 420, top: 330, width: 560, height: 560, borderRadius: "50%", background: "#fff", border: `16px solid ${P.ink}`, zIndex: 3 }}>
          <div style={{ position: "absolute", left: 240, top: -80, width: 80, height: 80, background: P.ink, borderRadius: 12 }} />
          <div style={{ position: "absolute", left: 272, top: 60, width: 16, height: 220, background: P.red, transformOrigin: "8px 220px", transform: `rotate(${s * 27}deg)`, borderRadius: 8 }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", fontFamily: "'DejaVu Sans Mono', monospace", fontWeight: 900, fontSize: 92 }}>{s.toFixed(3)}s</div>
        </div>
        {t >= at("h_larkin", "dylan") - 0.1 && <StickerCard x={430} y={910} rot={-4} w={580} h={200}><div style={{ fontSize: 46, fontWeight: 900 }}>DYLAN LARKIN · 2016</div><div style={{ fontFamily: HAND, fontSize: 40, color: P.red }}>fastest All-Star lap ever</div></StickerCard>}
        {lf % 40 < 20 && <div style={{ position: "absolute", left: 830, top: 1000, fontSize: 80, zIndex: 4 }}>⚡</div>}</>);
    } },
  { from: S("a_2030").start - 0.15, Comp: ({ t, lf }) => (<><BgTrack /><Big who="agenty" t={t} size={1150} x={-35} y={500} mood="smug" rot={Math.sin(lf / 8) * 3} />
      {t >= at("a_2030", "2030") - 0.2 && <div style={{ position: "absolute", left: 560, top: 300, width: 400, height: 380, background: "#fff", border: `10px solid ${P.ink}`, borderRadius: 18, transform: "rotate(6deg)", zIndex: 5, overflow: "hidden" }}><div style={{ height: 100, background: P.red, color: "#fff", fontWeight: 900, fontSize: 56, display: "flex", alignItems: "center", justifyContent: "center" }}>FINISH</div><div style={{ fontSize: 160, fontWeight: 900, textAlign: "center", lineHeight: 1.6 }}>2030</div></div>}</>) },
  { from: S("z_gym").start - 0.15, chapter: ["11:00 AM", "WEIGHT ROOM"], Comp: ({ t }) => (<><BgGym /><Big who="zam" t={t} size={1050} x={15} y={560} mood="wow" />
      <div style={{ position: "absolute", left: 300, top: 720, width: 480, height: 50, background: "#f43f5e", border: `6px solid ${P.ink}`, borderRadius: 20, zIndex: 3 }} />
      <Pow text="WEIGHT ROOM!" x={80} y={330} size={130} rot={-6} color="#b45309" /></>) },
  { from: S("c_back").start - 0.15, Comp: ({ t }) => {
      const strain = t >= at("c_back", "hnnngh") - 0.1, crack = t >= at("c_back", "back") - 0.1;
      return (<><BgGym />
        <Big who="clubby" t={t} size={1100} x={-10} y={480} mood={crack ? "dizzy" : strain ? "determined" : "smug"} rot={crack ? 22 : strain ? 8 : 0} sx={strain && !crack ? 1.05 : 1} />
        <div style={{ position: "absolute", left: 60, top: crack ? 820 : 600, transform: `rotate(${crack ? 16 : 0}deg)`, zIndex: 4 }}><Barbell w={860} plate={110} bend={strain ? 70 : 10} /></div>
        {crack && <Pow text="CRACK!" x={360} y={300} size={170} rot={-8} color={P.green} />}
        {crack && <div style={{ position: "absolute", left: 470, top: 1050, width: 200, height: 70, background: "#fde7c9", border: `6px solid ${P.ink}`, borderRadius: 14, transform: "rotate(-20deg)", zIndex: 5 }} />}</>);
    } },
  { from: S("p_feather").start - 0.15, Comp: ({ t, lf }) => (<><BgGym /><Big who="pucky" t={t} size={1250} x={-85} y={520} mood="determined" sx={1 + Math.sin(lf / 3) * 0.03} />
      <div style={{ position: "absolute", left: 650, top: 330 + Math.sin(lf / 6) * 30, fontSize: 200, transform: `rotate(${Math.sin(lf / 9) * 25}deg)`, zIndex: 4 }}>🪶</div>
      {t >= at("p_feather", "feather") - 0.1 && <Pow text="💪 STRONG!" x={60} y={330} size={110} rot={-6} color={P.red} />}</>) },
  { from: S("b_power").start - 0.15, Comp: ({ t, lf }) => {
      const up = t >= at("b_power", "walrus") - 0.1;
      return (<><BgGym />{up && <Sparkles n={10} color="#f59e0b" />}
        <Big who="biscuit" t={t} size={1050} x={15} y={620} mood={up ? "laugh" : "determined"} hop={up ? 60 : 0} />
        <div style={{ position: "absolute", left: -40, top: up ? 560 : 1060, zIndex: 4 }}><Barbell w={1060} plate={170} /></div>
        {up && <Pow text="WALRUS POWER!" x={60} y={230} size={100} rot={-4} color="#b45309" z={8} />}
        <Flash at={Math.round((at("b_power", "walrus") - S("b_power").start + 0.05) * 60)} />
        {lf < 0 ? null : null}</>);
    } },
  { from: S("a_sign").start - 0.15, Comp: ({ t, lf }) => (<><BgBurst c1="#ddd6fe" c2="#c4b5fd" /><Sparkles n={10} color="#7c3aed" />
      <Big who="agenty" t={t} size={1200} x={-60} y={480} mood="starry" rot={Math.sin(lf / 5) * 4} />
      <div style={{ position: "absolute", left: 560, top: 300, width: 400, height: 300, background: "#fffdf7", border: `8px solid ${P.ink}`, transform: "rotate(6deg)", zIndex: 5, padding: 26, boxSizing: "border-box", fontFamily: FONT }}><div style={{ fontWeight: 900, fontSize: 44 }}>CONTRACT</div><div style={{ marginTop: 80, fontFamily: HAND, fontSize: 48 }}>✗ BISCUIT</div></div></>) },
  { from: S("h_lake").start - 0.15, chapter: ["3:00 PM", "THE LAKE"], Comp: ({ t, lf }) => (<><BgLake />
      {(["pucky", "clubby", "agenty", "biscuit"] as Who[]).map((w, i) => <div key={w} style={{ position: "absolute", left: interpolate(lf, [0, 120], [-200 - i * 160, 300 - i * 120]), top: 640 - Math.abs(Math.sin(lf / 4 + i)) * 40, zIndex: 2 + i }}><Mascot who={w} size={260} mood="laugh" noSticker talking open={0.5} seed={`lk${w}`} /></div>)}
      <Big who="helmy" t={t} size={700} x={420} y={1000} mood="wow" z={6} /></>) },
  { from: S("z_froze").start - 0.15, Comp: ({ t, lf }) => {
      const frozen = t >= at("z_froze", "froze") - 0.1;
      return (<><BgLake frozen={frozen} />
        <Big who="zam" t={t} size={1050} x={15} y={620} mood={frozen ? "scared" : "wow"} rot={frozen ? Math.sin(lf) * 2 : 0} />
        {frozen && <Pow text="❄ FROZEN ❄" x={170} y={300} size={120} rot={-4} color="#2563eb" />}</>);
    } },
  { from: S("p_bonk").start - 0.12, Comp: ({ lf }) => (<><BgLake frozen />
      {(["pucky", "clubby", "helmy", "agenty", "biscuit"] as Who[]).map((w, i) => {
        const k = interpolate(lf, [i * 3, i * 3 + 14], [0, 1], clamp);
        return <div key={w} style={{ position: "absolute", left: [40, 260, 470, 660, 820][i] - 40, top: interpolate(k, [0, 0.6, 1], [400, 1020, 960]) + (i % 2) * 70, transform: `rotate(${k * (i % 2 ? 80 : -80)}deg) scaleY(${k > 0.55 && k < 0.7 ? 0.7 : 1})`, zIndex: 3 + i }}><Mascot who={w} size={260} mood={k > 0.6 ? "dizzy" : "scared"} noSticker seed={`bk${w}`} /></div>;
      })}
      <Pow text="BONK!" x={260} y={330} size={200} rot={-8} color={P.ink} />
      <Flash at={12} /></>) },
  { from: S("z_oops").start - 0.12, Comp: ({ t }) => (<><BgLake frozen /><Big who="zam" t={t} size={1250} x={-85} y={430} mood="sweat" />
      <Pow text="…OOPS." x={200} y={300} size={150} rot={-6} color="#2563eb" /></>) },
];

const Extras: React.FC<{ N: (s: number) => number }> = ({ N }) => (
  <>
    <Sequence from={N(0.1)} durationInFrames={40}><Audio src={staticFile("brand/ding.wav")} volume={0.5} /></Sequence>
    <Sequence from={N(at("p_race", "race"))} durationInFrames={40}><Audio src={staticFile("whoosh.wav")} volume={0.6} /></Sequence>
    <Sequence from={N(at("b_behind", "you"))} durationInFrames={40}><Audio src={staticFile("brand/boing.wav")} volume={0.5} /></Sequence>
    <Sequence from={N(at("h_larkin", "seconds"))} durationInFrames={50}><Audio src={staticFile("brand/ding.wav")} volume={0.55} /></Sequence>
    <Sequence from={N(at("a_2030", "2030"))} durationInFrames={40}><Audio src={staticFile("brand/rimshot.wav")} volume={0.6} /></Sequence>
    <Sequence from={N(at("c_back", "back"))} durationInFrames={40}><Audio src={staticFile("brand/impact.wav")} volume={0.6} /></Sequence>
    <Sequence from={N(at("p_feather", "feather"))} durationInFrames={40}><Audio src={staticFile("pop.wav")} volume={0.7} /></Sequence>
    <Sequence from={N(at("b_power", "walrus"))} durationInFrames={60}><Audio src={staticFile("brand/riser.wav")} volume={0.4} /></Sequence>
    <Sequence from={N(at("b_power", "power"))} durationInFrames={110}><Audio src={staticFile("sfx/crowd.wav")} volume={0.4} /></Sequence>
    <Sequence from={N(at("b_power", "power"))} durationInFrames={90}><Confetti n={40} x={540} y={950} spread={600} /></Sequence>
    <Sequence from={N(at("z_froze", "froze"))} durationInFrames={50}><Audio src={staticFile("sfx/scrape.wav")} volume={0.7} /></Sequence>
    {[0, 1, 2, 3, 4].map((i) => <Sequence key={i} from={N(S("p_bonk").start - 0.12) + i * 3 + 9} durationInFrames={20}><Audio src={staticFile("brand/impact.wav")} volume={0.35} /></Sequence>)}
    <Sequence from={N(at("z_oops", "oops"))} durationInFrames={40}><Audio src={staticFile("brand/rimshot.wav")} volume={0.6} /></Sequence>
  </>
);

export const { Comp: SummerCamp, FRAMES: SUMMERCAMP_FRAMES } = makeToon({ words: WORDS, vo: "ep/summer_camp.mp3", shots, tag: "ZAM · SPECIAL EDITION", tagline: "summer camp!", Extras });
